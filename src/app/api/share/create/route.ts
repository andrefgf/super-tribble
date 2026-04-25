import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { generateHash, SHARE_TTL_DAYS } from '@/lib/share';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ads, benchmarks } = body;

    if (!ads || !Array.isArray(ads) || ads.length === 0) {
      return NextResponse.json({ error: 'No ads provided' }, { status: 400 });
    }

    const hash      = generateHash();
    const expiresAt = new Date(Date.now() + SHARE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const origin    = request.headers.get('origin') ?? '';

    const supabase = createServiceClient();
    const { error } = await supabase
      .from('shared_reports')
      .insert({
        hash,
        data: { ads, benchmarks },
        expires_at: expiresAt,
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }

    const url = `${origin}/r/${hash}`;
    return NextResponse.json({ hash, url, expiresAt });
  } catch (e) {
    console.error('Share create error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
