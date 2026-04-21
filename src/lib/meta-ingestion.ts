/**
 * Meta Ads ingestion service.
 * Pulls the last 14 days of ad performance data from the Marketing API
 * and normalises it into our ad_performance_records schema.
 */

import { createServiceClient } from './supabase';

const META_API = 'https://graph.facebook.com/v19.0';

// ─── Types ──────────────────────────────────────────────────────────

interface MetaInsight {
  ad_id:        string;
  ad_name:      string;
  adset_id:     string;
  adset_name:   string;
  campaign_id:  string;
  campaign_name: string;
  date_start:   string;
  spend:        string;
  impressions:  string;
  clicks:       string;
  reach:        string;
  frequency:    string;
  actions?:     { action_type: string; value: string }[];
  action_values?: { action_type: string; value: string }[];
}

interface MetaAd {
  id:           string;
  name:         string;
  creative?:    { id: string; thumbnail_url?: string; title?: string };
}

// ─── Helpers ────────────────────────────────────────────────────────

function extractConversions(actions?: { action_type: string; value: string }[]): number {
  if (!actions) return 0;
  const purchaseAction = actions.find(a =>
    a.action_type === 'purchase' ||
    a.action_type === 'offsite_conversion.fb_pixel_purchase'
  );
  return purchaseAction ? parseFloat(purchaseAction.value) : 0;
}

function extractRevenue(actionValues?: { action_type: string; value: string }[]): number {
  if (!actionValues) return 0;
  const purchaseValue = actionValues.find(a =>
    a.action_type === 'purchase' ||
    a.action_type === 'offsite_conversion.fb_pixel_purchase'
  );
  return purchaseValue ? parseFloat(purchaseValue.value) : 0;
}

function safeDiv(a: number, b: number): number | null {
  return b > 0 ? a / b : null;
}

// ─── Main ingestion function ─────────────────────────────────────────

export async function ingestMetaAccount(
  accountId: string,         // our DB account ID
  metaAdAccountId: string,   // e.g. "act_123456789"
  accessToken: string,
  daysBack = 14
): Promise<{ adsProcessed: number; error?: string }> {
  const supabase = createServiceClient();
  const since = new Date(Date.now() - daysBack * 86400000).toISOString().split('T')[0];
  const until = new Date().toISOString().split('T')[0];

  // Log sync job start
  const { data: job } = await supabase
    .from('sync_jobs')
    .insert({ account_id: accountId, platform: 'meta', status: 'running', started_at: new Date().toISOString() })
    .select('id')
    .single();

  try {
    // 1. Pull insights at ad level
    const fields = [
      'ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name',
      'spend', 'impressions', 'clicks', 'reach', 'frequency',
      'actions', 'action_values',
    ].join(',');

    const insightsUrl =
      `${META_API}/${metaAdAccountId}/insights` +
      `?fields=${fields}&time_increment=1` +
      `&time_range={"since":"${since}","until":"${until}"}` +
      `&level=ad&limit=500&access_token=${accessToken}`;

    const insightsRes = await fetch(insightsUrl);
    if (!insightsRes.ok) {
      throw new Error(`Meta Insights API error: ${await insightsRes.text()}`);
    }

    const insightsData = await insightsRes.json();
    const insights: MetaInsight[] = insightsData.data ?? [];

    if (insights.length === 0) {
      await supabase.from('sync_jobs').update({
        status: 'completed', completed_at: new Date().toISOString(), ads_synced: 0,
      }).eq('id', job?.id);
      return { adsProcessed: 0 };
    }

    // 2. Get ad creative details (for thumbnail + type)
    const adIds = [...new Set(insights.map(i => i.ad_id))];
    const adsUrl =
      `${META_API}?ids=${adIds.slice(0, 50).join(',')}` +
      `&fields=id,name,creative{id,thumbnail_url,title,object_type}` +
      `&access_token=${accessToken}`;
    const adsRes = await fetch(adsUrl);
    const adsData: Record<string, MetaAd> = adsRes.ok ? await adsRes.json() : {};

    let adsProcessed = 0;

    for (const insight of insights) {
      const spend       = parseFloat(insight.spend)       || 0;
      const impressions = parseInt(insight.impressions)    || 0;
      const clicks      = parseInt(insight.clicks)         || 0;
      const conversions = extractConversions(insight.actions);
      const revenue     = extractRevenue(insight.action_values);
      const frequency   = parseFloat(insight.frequency)   || 1;

      // Upsert campaign
      const { data: campaign } = await supabase
        .from('campaigns')
        .upsert({
          account_id:  accountId,
          platform:    'meta',
          platform_id: insight.campaign_id,
          name:        insight.campaign_name,
        }, { onConflict: 'account_id,platform,platform_id' })
        .select('id').single();

      // Upsert ad group
      const { data: adGroup } = await supabase
        .from('ad_groups')
        .upsert({
          account_id:  accountId,
          campaign_id: campaign?.id,
          platform_id: insight.adset_id,
          name:        insight.adset_name,
        }, { onConflict: 'campaign_id,platform_id' })
        .select('id').single();

      // Upsert creative
      const metaAd = adsData[insight.ad_id];
      const { data: creative } = await supabase
        .from('creatives')
        .upsert({
          account_id:    accountId,
          platform:      'meta',
          platform_id:   metaAd?.creative?.id ?? insight.ad_id,
          name:          insight.ad_name,
          type:          'unknown',
          thumbnail_url: metaAd?.creative?.thumbnail_url ?? null,
        }, { onConflict: 'account_id,platform,platform_id' })
        .select('id').single();

      // Upsert ad
      const { data: ad } = await supabase
        .from('ads')
        .upsert({
          account_id:  accountId,
          ad_group_id: adGroup?.id,
          creative_id: creative?.id,
          platform_id: insight.ad_id,
          name:        insight.ad_name,
          status:      'ACTIVE',
        }, { onConflict: 'account_id,platform_id' })
        .select('id').single();

      if (!ad?.id) continue;

      // Upsert daily performance record
      await supabase
        .from('ad_performance_records')
        .upsert({
          account_id:  accountId,
          ad_id:       ad.id,
          date:        insight.date_start,
          spend, revenue, impressions, clicks, conversions, frequency,
          roas:        safeDiv(revenue, spend),
          ctr:         safeDiv(clicks, impressions),
          cvr:         safeDiv(conversions, clicks),
          cpc:         safeDiv(spend, clicks),
          cpa:         safeDiv(spend, conversions),
          raw_data:    insight,
          ingested_at: new Date().toISOString(),
        }, { onConflict: 'ad_id,date' });

      adsProcessed++;
    }

    // Update connection last_synced_at
    await supabase
      .from('platform_connections')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('account_id', accountId)
      .eq('platform', 'meta');

    await supabase.from('sync_jobs').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      ads_synced: adsProcessed,
    }).eq('id', job?.id);

    return { adsProcessed };

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await supabase.from('sync_jobs').update({
      status: 'failed',
      completed_at: new Date().toISOString(),
      error_message: message,
    }).eq('id', job?.id);
    return { adsProcessed: 0, error: message };
  }
}
