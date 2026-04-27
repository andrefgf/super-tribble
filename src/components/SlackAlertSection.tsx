'use client';

import { useState, useMemo } from 'react';
import type { DecisionOutput } from '@/lib/types';
import SlackAlertMock from './SlackAlertMock';

interface Props {
  decisions: DecisionOutput[];
}

export default function SlackAlertSection({ decisions }: Props) {
  const [email, setEmail]           = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const mockDecisions = useMemo(() => {
    const top = decisions
      .filter(d => d.decision === 'KILL' || d.decision === 'SCALE' || d.decision === 'FIX')
      .sort((a, b) => {
        const order: Record<string, number> = { KILL: 0, SCALE: 1, FIX: 2, HOLD: 3 };
        return order[a.decision] - order[b.decision];
      })
      .slice(0, 3);

    return top.map(d => ({
      verdict: d.decision as 'KILL' | 'SCALE' | 'FIX',
      adName:  d.ad.name,
      reason:  d.reasons[0],
      actions: d.decision === 'KILL'
        ? [{ label: '✅ Pause now', primary: true }, { label: '❌ Keep running' }, { label: '💤 Snooze' }]
        : d.decision === 'SCALE'
        ? [{ label: '✅ Approve +30%', primary: true }, { label: '❌ Skip' }]
        : [{ label: 'See details', primary: true }],
    }));
  }, [decisions]);

  const totalSavings = useMemo(
    () => decisions.filter(d => d.decision === 'KILL').reduce((s, d) => s + d.ad.performance.spend, 0),
    [decisions],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch('/api/audit/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'slack_waitlist' }),
      });
    } catch { /* non-blocking */ }
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div
      className="rounded-2xl p-6 mb-8"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(26,25,23,0.06)' }}
    >
      {/* Heading */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
            Coming Soon
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(217,119,6,0.10)', color: 'var(--brand)', border: '1px solid rgba(217,119,6,0.20)' }}
          >
            Q2 2026
          </span>
        </div>
        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-1)' }}>
          Get your daily briefing in Slack
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>
          Every morning at 9am, Lumière sends decisions straight to your channel.
          Approve with one click — no dashboard visit needed.
        </p>
      </div>

      {/* Email capture */}
      <div className="mb-5">
        {submitted ? (
          <p className="text-sm" style={{ color: 'var(--scale)' }}>
            ✓ You&apos;re on the list — we&apos;ll notify you when Slack integration launches.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-1)',
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--brand)', color: 'white', boxShadow: '0 2px 12px rgba(217,119,6,0.25)' }}
            >
              {submitting ? '…' : 'Notify me →'}
            </button>
          </form>
        )}
      </div>

      {/* Mock */}
      {mockDecisions.length > 0 && (
        <SlackAlertMock
          decisions={mockDecisions}
          totalSavings={totalSavings}
        />
      )}
    </div>
  );
}
