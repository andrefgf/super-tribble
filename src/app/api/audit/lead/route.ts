import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source, wastedAmount, killAdsCount, vertical } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const supabase = createServiceClient();
    await supabase.from('audit_leads').insert({
      email:          email.trim().toLowerCase(),
      source:         source ?? null,
      wasted_amount:  wastedAmount ?? null,
      kill_ads_count: killAdsCount ?? null,
      vertical:       vertical ?? null,
    });

    // Always return 200 — we don't want to expose DB errors to the client
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // non-blocking
  }
}
