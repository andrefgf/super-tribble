'use client';

import { useMemo, useEffect, useState } from 'react';
import { useDataSource } from '@/lib/data-source';
import { runDecisionEngine, runPortfolio } from '@/lib/engine';
import DecisionBadge from '@/components/ui/DecisionBadge';
import ForecastCard from '@/components/ForecastCard';
import IndustryBenchmarkCard from '@/components/IndustryBenchmarkCard';
import ShareButton from '@/components/ShareButton';
import { ArrowRight, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const DECISION_COLORS: Record<string, string> = {
  SCALE: '#059669', HOLD: '#4F46E5', KILL: '#DC2626', FIX: '#D97706',
};
const DECISION_BG: Record<string, string> = {
  SCALE: 'rgba(5,150,105,0.06)', HOLD: 'rgba(79,70,229,0.06)', KILL: 'rgba(220,38,38,0.06)', FIX: 'rgba(217,119,6,0.06)',
};

export default function DashboardPage() {
  const { ads, benchmarks, source } = useDataSource();
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  const decisions = useMemo(() => ads.map(ad => runDecisionEngine(ad, benchmarks)), [ads, benchmarks]);
  const portfolio  = useMemo(() => runPortfolio(decisions), [decisions]);

  const priorityActions = decisions
    .filter(d => d.priority === 'HIGH')
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

  const wastedPct = ((portfolio.spendOnLosers / portfolio.totalSpend) * 100).toFixed(0);
  const brandName = source === 'csv_upload' ? 'Your account' : 'Lumière';

  const roasLift = ((portfolio.spendOnWinners + portfolio.reallocationAmount) / portfolio.spendOnWinners * portfolio.overallRoas - portfolio.overallRoas).toFixed(1);

  return (
    <div className="p-8 max-w-5xl animate-fade-up">

      {/* ── Daily Brief header ─────────────────────────────── */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-3)', letterSpacing: '0.1em' }}>
            {dateStr ? `Daily Brief · ${dateStr}` : 'Daily Brief'}
          </p>
          <h1 className="text-3xl font-bold leading-tight mb-3" style={{ color: 'var(--text-1)' }}>
            {brandName} spent{' '}
            <span style={{ color: 'var(--text-1)' }}>€{(portfolio.totalSpend / 1000).toFixed(1)}k</span> this week.
          </h1>
          <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-2)' }}>
            <span style={{ color: 'var(--kill)', fontWeight: 600 }}>{wastedPct}% is going to underperformers.</span>{' '}
            Shift that budget to your {portfolio.decisions.SCALE} winners and ROAS could jump by{' '}
            <span style={{ color: 'var(--scale)', fontWeight: 600 }}>~{roasLift}x</span>.
          </p>
        </div>
        <ShareButton ads={ads} benchmarks={benchmarks} />
      </div>

      {/* ── Priority Actions — full width hero ────────────── */}
      <div className="mb-8 rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(26,25,23,0.06)' }}>

        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text-1)' }}>Priority Actions</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>
              {priorityActions.length} high-confidence decisions need your attention today
            </p>
          </div>
          <Link href="/decisions"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-amber-500/10"
            style={{ color: 'var(--brand)', border: '1px solid rgba(217,119,6,0.25)' }}>
            All {decisions.length} ads <ArrowRight size={12} />
          </Link>
        </div>

        {priorityActions.map((d, i) => (
          <div key={d.ad.id}
            className="group flex items-center gap-5 px-6 py-5 transition-colors hover:bg-black/[0.02] cursor-pointer"
            style={{ borderBottom: i < priorityActions.length - 1 ? '1px solid var(--border)' : 'none' }}>

            {/* Decision pill */}
            <div className="flex-shrink-0">
              <DecisionBadge decision={d.decision} />
            </div>

            {/* Ad info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1 truncate" style={{ color: 'var(--text-1)' }}>
                {d.ad.name}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>
                {d.reasons[0]}
              </p>
            </div>

            {/* ROAS */}
            <div className="text-right flex-shrink-0 w-20">
              <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>ROAS</p>
              <p className="text-sm font-bold tabular-nums"
                style={{ color: d.ad.performance.roas >= benchmarks.medianRoas ? 'var(--scale)' : 'var(--kill)' }}>
                {d.ad.performance.roas.toFixed(1)}x
              </p>
            </div>

            {/* Spend */}
            <div className="text-right flex-shrink-0 w-20">
              <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Spend</p>
              <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-1)' }}>
                €{d.ad.performance.spend.toLocaleString()}
              </p>
            </div>

            {/* Action */}
            <div className="text-right flex-shrink-0 w-28">
              <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Action</p>
              <p className="text-sm font-bold tabular-nums"
                style={{ color: DECISION_COLORS[d.decision] }}>
                {d.budgetSuggestion}
              </p>
            </div>
          </div>
        ))}

        {priorityActions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>No high-priority actions — portfolio looks healthy.</p>
          </div>
        )}
      </div>

      {/* ── Wasted spend callout ───────────────────────────── */}
      {portfolio.spendOnLosers > 0 && (
        <div className="flex items-start gap-4 px-6 py-5 rounded-2xl mb-8"
          style={{ background: 'var(--kill-bg)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
            <TrendingDown size={16} style={{ color: 'var(--kill)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#991B1B' }}>
              €{portfolio.spendOnLosers.toLocaleString()} in wasted spend identified
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#7F1D1D' }}>
              {portfolio.decisions.KILL} ads are burning budget below break-even. Reallocating this to your top performers
              could generate an additional €{portfolio.reallocationAmount.toLocaleString()} in revenue this week.
            </p>
          </div>
        </div>
      )}

      {/* ── Forecast + Benchmarks ─────────────────────────── */}
      <div className="space-y-4">
        <ForecastCard decisions={decisions} benchmarks={benchmarks} daysOfData={7} />
        <IndustryBenchmarkCard accountBenchmarks={benchmarks} />
      </div>

    </div>
  );
}
