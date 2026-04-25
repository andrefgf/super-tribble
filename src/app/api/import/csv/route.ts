import { NextResponse } from 'next/server';
import { runDecisionEngine, runPortfolio } from '@/lib/engine';
import { Ad, AdPerformance, Platform, AccountBenchmarks } from '@/lib/types';

/** Derive account-level benchmarks (medians) from the uploaded ad set */
function computeBenchmarks(ads: Ad[]): AccountBenchmarks {
  if (ads.length === 0) {
    return { medianRoas: 2.4, medianCtr: 0.022, medianCvr: 0.031, medianCpa: 38 };
  }
  const median = (vals: number[]) => {
    const sorted = [...vals].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };
  return {
    medianRoas: median(ads.map(a => a.performance.roas)),
    medianCtr:  median(ads.map(a => a.performance.ctr)),
    medianCvr:  median(ads.map(a => a.performance.cvr)),
    medianCpa:  median(ads.filter(a => a.performance.cpa > 0).map(a => a.performance.cpa)),
  };
}

/**
 * Accepts a Meta Ads Manager CSV export and returns decisions.
 * No database required — pure in-memory analysis.
 *
 * Expected CSV columns (Meta Ads Manager default export):
 *   Ad name, Campaign name, Ad set name, Platform,
 *   Amount spent, Impressions, Link clicks, Purchases,
 *   Purchase ROAS, CTR (link click-through rate), Frequency,
 *   Cost per purchase, Reach
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const file     = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length < 2) {
    return NextResponse.json({ error: 'CSV appears empty' }, { status: 400 });
  }

  // Parse header row — be flexible with column names
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());

  const col = (names: string[]): number => {
    for (const name of names) {
      const idx = headers.findIndex(h => h.includes(name));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const colMap = {
    adName:      col(['ad name']),
    campaign:    col(['campaign name', 'campaign']),
    adSet:       col(['ad set name', 'adset name', 'ad set']),
    spend:       col(['amount spent', 'spend']),
    impressions: col(['impressions']),
    clicks:      col(['link clicks', 'clicks']),
    conversions: col(['purchases', 'conversions', 'results']),
    roas:        col(['purchase roas', 'roas']),
    ctr:         col(['ctr']),
    frequency:   col(['frequency']),
    cpa:         col(['cost per purchase', 'cost per result', 'cpa']),
    reach:       col(['reach']),
  };

  const ads: Ad[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
    if (row.length < 3) continue;

    const get = (colIdx: number, fallback = '0') =>
      colIdx >= 0 && row[colIdx] ? row[colIdx] : fallback;

    const spend       = parseFloat(get(colMap.spend))       || 0;
    const impressions = parseInt(get(colMap.impressions))    || 0;
    const clicks      = parseInt(get(colMap.clicks))         || 0;
    const conversions = parseInt(get(colMap.conversions))    || 0;
    const roas        = parseFloat(get(colMap.roas))         || (spend > 0 ? 0 : 0);
    const revenue     = roas * spend;
    const ctr         = clicks > 0 && impressions > 0 ? clicks / impressions : parseFloat(get(colMap.ctr)) / 100 || 0;
    const cvr         = clicks > 0 ? conversions / clicks : 0;
    const cpc         = clicks > 0 ? spend / clicks : 0;
    const cpa         = conversions > 0 ? spend / conversions : parseFloat(get(colMap.cpa)) || 0;
    const frequency   = parseFloat(get(colMap.frequency)) || 1;

    const adName = get(colMap.adName, `Ad ${i}`);
    if (!adName || adName === '0') continue;

    const perf: AdPerformance = {
      spend, revenue, impressions, clicks, conversions,
      roas, ctr, cvr, cpc, cpa, frequency,
      // Estimate prev period as 10% worse (conservative trend)
      prev_roas: roas * 0.9,
      prev_ctr:  ctr  * 0.9,
      prev_cpc:  cpc  * 1.1,
    };

    const ad: Ad = {
      id:       `csv_${i}`,
      name:     adName,
      platform: 'meta' as Platform,
      campaign: get(colMap.campaign, 'Imported Campaign'),
      adGroup:  get(colMap.adSet,    'Imported Ad Set'),
      creative: { id: `cr_${i}`, name: adName, type: 'unknown' as 'image', thumbnail: '' },
      performance: perf,
      daysRunning: 7,  // assume at least a week
    };

    ads.push(ad);
  }

  if (ads.length === 0) {
    return NextResponse.json({ error: 'No valid ad rows found. Check your CSV format.' }, { status: 400 });
  }

  // Compute dynamic benchmarks from the uploaded ads
  const computedBenchmarks = computeBenchmarks(ads);

  // Run the decision engine using the computed benchmarks
  const decisions = ads.map(ad => runDecisionEngine(ad, computedBenchmarks));
  const portfolio  = runPortfolio(decisions);

  return NextResponse.json({
    source:    'csv_import',
    adsFound:  ads.length,
    ads,
    benchmarks: computedBenchmarks,
    decisions,
    portfolio,
  });
}
