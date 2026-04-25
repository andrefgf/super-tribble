import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

// Step 2: Meta redirects here after user approves
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  // User denied permission
  if (error) {
    return NextResponse.redirect(`${baseUrl}/onboarding/connect?error=denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/onboarding/connect?error=invalid`);
  }

  // Decode state to get account_id
  let accountId: string;
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
    accountId = decoded.accountId;
  } catch {
    return NextResponse.redirect(`${baseUrl}/onboarding/connect?error=invalid_state`);
  }

  // Exchange code for access token
  const appId     = process.env.META_APP_ID!;
  const appSecret = process.env.META_APP_SECRET!;
  const redirectUri = `${baseUrl}/api/auth/meta/callback`;

  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&client_secret=${appSecret}&code=${code}`
  );

  if (!tokenRes.ok) {
    console.error('Meta token exchange failed:', await tokenRes.text());
    return NextResponse.redirect(`${baseUrl}/onboarding/connect?error=token_failed`);
  }

  const { access_token, expires_in } = await tokenRes.json();

  // Exchange for long-lived token (60 days)
  const longLivedRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&client_id=${appId}` +
    `&client_secret=${appSecret}&fb_exchange_token=${access_token}`
  );
  const { access_token: longToken } = longLivedRes.ok
    ? await longLivedRes.json()
    : { access_token };

  // Get list of ad accounts this user can access
  const adAccountsRes = await fetch(
    `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_status&access_token=${longToken}`
  );

  if (!adAccountsRes.ok) {
    return NextResponse.redirect(`${baseUrl}/onboarding/connect?error=no_accounts`);
  }

  const { data: adAccounts } = await adAccountsRes.json();

  if (!adAccounts || adAccounts.length === 0) {
    return NextResponse.redirect(`${baseUrl}/onboarding/connect?error=no_ad_accounts`);
  }

  // Store each ad account connection in Supabase
  const supabase = createServiceClient();
  const tokenExpiresAt = new Date(Date.now() + (expires_in ?? 5184000) * 1000).toISOString();

  for (const account of adAccounts) {
    await supabase.from('platform_connections').upsert({
      account_id:       accountId,
      platform:         'meta',
      ad_account_id:    account.id,
      ad_account_name:  account.name,
      access_token:     longToken,   // TODO: encrypt before storing in production
      token_expires_at: tokenExpiresAt,
      status:           'active',
    }, { onConflict: 'account_id,platform,ad_account_id' });
  }

  // Redirect to syncing page — trigger ingestion in background
  const primaryAccountId = adAccounts[0].id;
  return NextResponse.redirect(
    `${baseUrl}/onboarding/syncing?account_id=${accountId}&meta_account=${primaryAccountId}`
  );
}
