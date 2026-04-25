import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(
  _request: Request,
  { params }: { params: { hash: string } },
) {
  const { hash } = params;

  if (!hash) {
    return NextResponse.json({ error: 'Missing hash' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('shared_reports')
    .select('data, created_at, expires_at, view_count')
    .eq('hash', hash)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Report not found or expired' }, { status: 404 });
  }

  // Increment view count (fire-and-forget)
  supabase
    .from('shared_reports')
    .update({ view_count: data.view_count + 1 })
    .eq('hash', hash)
    .then(() => {});

  return NextResponse.json({
    ads:        data.data.ads,
    benchmarks: data.data.benchmarks,
    createdAt:  data.created_at,
    expiresAt:  data.expires_at,
    viewCount:  data.view_count,
  });
}
