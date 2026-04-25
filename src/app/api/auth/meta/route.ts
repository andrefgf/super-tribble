import { NextResponse } from 'next/server';

// Step 1: Redirect user to Meta's OAuth dialog
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('account_id');

  if (!accountId) {
    return NextResponse.json({ error: 'account_id required' }, { status: 400 });
  }

  const appId    = process.env.META_APP_ID;
  const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL;

  if (!appId) {
    return NextResponse.json(
      { error: 'META_APP_ID not configured. See .env.local setup instructions.' },
      { status: 500 }
    );
  }

  const redirectUri = `${baseUrl}/api/auth/meta/callback`;
  const state       = Buffer.from(JSON.stringify({ accountId })).toString('base64');

  const scopes = [
    'ads_read',
    'ads_management',   // needed to read ad creative details
    'business_management',
  ].join(',');

  const oauthUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
  oauthUrl.searchParams.set('client_id',     appId);
  oauthUrl.searchParams.set('redirect_uri',  redirectUri);
  oauthUrl.searchParams.set('scope',         scopes);
  oauthUrl.searchParams.set('state',         state);
  oauthUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(oauthUrl.toString());
}
