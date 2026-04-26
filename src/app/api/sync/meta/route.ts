import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { ingestMetaAccount } from '@/lib/meta-ingestion';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { account_id, meta_account_id } = await request.json();

  if (!account_id || !meta_account_id) {
    return NextResponse.json({ error: 'account_id and meta_account_id required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Fetch the stored access token for this connection
  const { data: connection, error } = await supabase
    .from('platform_connections')
    .select('access_token, status')
    .eq('account_id', account_id)
    .eq('platform', 'meta')
    .eq('ad_account_id', meta_account_id)
    .single();

  if (error || !connection) {
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
  }

  if (connection.status !== 'active') {
    return NextResponse.json({ error: 'Connection is not active — re-connect Meta Ads' }, { status: 403 });
  }

  const result = await ingestMetaAccount(
    account_id,
    meta_account_id,
    connection.access_token,
    14  // pull last 14 days
  );

  return NextResponse.json(result);
}
