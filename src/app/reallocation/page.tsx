'use client';

import { useMemo } from 'react';
import { ads, benchmarks } from '@/lib/seed';
import { runDecisionEngine, runPortfolio } from '@/lib/engine';
import DecisionBadge from '@/components/ui/DecisionBadge';
import PlatformBadge from '@/components/ui/PlatformBadge';
import { ArrowRight, TrendingUp, TrendingDown, Shuffle } from 'lucide-react';

export default function ReallocationPage() {
  const decisions = useMemo(() => ads.map(ad => runDecisionEngine(ad, benchmarks)), []);
  const portfolio  = useMemo(() => runPortfolio(decisions), [decisions]);

  const winners = decisions.filter(d => d.decision === 'SCALE').sort((a,b) => b.ad.performance.roas - a.ad.performance.roas);
  const losers  = decisions.filter(d => d.decision === 'KILL').sort((a,b) => b.ad.performance.spend - a.ad.performance.spend);

  const totalLoserSpend = losers.reduce((s, d) => s + d.ad.performance.spend, 0);
  const reallocAmount   = portfolio.reallocationAmount;

  const projectedWinnerRevenue = winners.reduce((s, d) => {
    const addedSpend = (d.ad.performance.spend / portfolio.spendOnWinners) * reallocAmount;
    return s + addedSpend * d.ad.performance.roas;
  }, 0);

  const projectedRoas = (portfolio.totalRevenue + projectedWinnerRevenue) /
    (portfolio.totalSpend - totalLoserSpend + reallocAmount);

  return (
    <div className="p-8 max-w-6xl animate-fade-up">

      {/* ── Hero banner ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-8"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(99,102,241,0.06) 100%)',
          border: '1px solid rgba(16,185,129,0.15)',
        }}>
        {/* Glow */}
        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl"
          style={{ background: 'rgba(16,185,129,0.1)' }} />

        <div className="relative flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Shuffle size={22} style={{ color: '#34d399' }} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold mb-0.5" style={{ color: 'var(--text-1)' }}>
              Recommended Portfolio Rebalance
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Reallocate <strong style={{ color: '#34d399' }}>€{reallocAmount.toLocaleString()}</strong> from {losers.length} underperforming ads into {winners.length} proven winners.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="text-xl font-bold tabular-nums text-red-400">–€{reallocAmount.toLocaleString()}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>from losers</p>
            </div>
            <ArrowRight size={18} style={{ color: 'var(--text-3)' }} />
            <div className="text-center">
              <p className="text-xl font-bold tabular-nums text-emerald-400">+€{reallocAmount.toLocaleString()}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>to winners</p>
            </div>
            <ArrowRight size={18} style={{ color: 'var(--text-3)' }} />
            <div className="text-center">
              <p className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-1)' }}>
                ~€{Math.round(projectedWinnerRevenue).toLocaleString()}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>projected return</p>
            </div>
            <div className="w-px h-10" style={{ background: 'var(--border)' }} />
            <div className="text-center">
              <p className="text-xl font-bold tabular-nums text-emerald-400">{projectedRoas.toFixed(2)}x</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>projected ROAS</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two column: losers → winners ────────────── */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        {/* Losers */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={15} style={{ color: '#f87171' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Kill & Reallocate From</h2>
            <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.15)' }}>
              {losers.length} ads · €{totalLoserSpend.toLocaleString()}
            </span>
          </div>
          <div className="space-y-3">
            {losers.map(d => {
              const share = (d.ad.performance.spend / totalLoserSpend) * reallocAmount;
              return (
                <div key={d.ad.id} className="card-glow rounded-xl p-4"
                  style={{ background: 'var(--surface-1)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{d.ad.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <PlatformBadge platform={d.ad.platform} />
                        <span className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{d.ad.campaign}</span>
                      </div>
                    </div>
                    <DecisionBadge decision="KILL" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'ROAS',     value: d.ad.performance.roas.toFixed(1)+'x', accent: '#f87171' },
                      { label: 'Spend',    value: '€'+d.ad.performance.spend.toLocaleString(), accent: 'var(--text-1)' },
                      { label: 'Free up',  value: '€'+Math.round(share).toLocaleString(), accent: '#f87171', highlight: true },
                    ].map(m => (
                      <div key={m.label} className="rounded-lg p-2.5"
                        style={{ background: m.highlight ? 'rgba(239,68,68,0.06)' : 'var(--surface-2)', border: '1px solid var(--border)' }}>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>{m.label}</p>
                        <p className="text-sm font-bold tabular-nums" style={{ color: m.accent }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs flex items-start gap-1.5" style={{ color: 'var(--text-3)' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5 bg-red-500" />
                    {d.reasons[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Winners */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} style={{ color: '#34d399' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Scale Into</h2>
            <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#86efac', border: '1px solid rgba(16,185,129,0.15)' }}>
              {winners.length} ads
            </span>
          </div>
          <div className="space-y-3">
            {winners.map(d => {
              const share       = d.ad.performance.spend / portfolio.spendOnWinners;
              const addedSpend  = share * reallocAmount;
              const projRevenue = addedSpend * d.ad.performance.roas;
              return (
                <div key={d.ad.id} className="card-glow rounded-xl p-4"
                  style={{ background: 'var(--surface-1)', border: '1px solid rgba(16,185,129,0.12)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{d.ad.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <PlatformBadge platform={d.ad.platform} />
                        <span className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{d.ad.campaign}</span>
                      </div>
                    </div>
                    <DecisionBadge decision="SCALE" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'ROAS',         value: d.ad.performance.roas.toFixed(1)+'x',  accent: '#34d399' },
                      { label: 'Add budget',   value: '+€'+Math.round(addedSpend).toLocaleString(), accent: '#34d399' },
                      { label: 'Proj. revenue', value: '+€'+Math.round(projRevenue).toLocaleString(), accent: '#34d399', highlight: true },
                    ].map(m => (
                      <div key={m.label} className="rounded-lg p-2.5"
                        style={{ background: m.highlight ? 'rgba(16,185,129,0.06)' : 'var(--surface-2)', border: '1px solid var(--border)' }}>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>{m.label}</p>
                        <p className="text-sm font-bold tabular-nums" style={{ color: m.accent }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs flex items-start gap-1.5" style={{ color: 'var(--text-3)' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5 bg-emerald-500" />
                    {d.reasons[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Spend health bar ────────────────────────── */}
      <div className="card-glow rounded-xl p-5"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Current Spend Allocation</h3>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>
            Total: €{portfolio.totalSpend.toLocaleString()}
          </span>
        </div>
        <div className="flex rounded-full overflow-hidden h-2.5 mb-4" style={{ gap: 2 }}>
          <div style={{ flex: portfolio.spendOnWinners, background: '#10b981' }} className="rounded-l-full" />
          <div style={{ flex: portfolio.spendOnLosers,  background: '#ef4444' }} />
          <div style={{ flex: portfolio.spendOnHold,    background: '#6366f1' }} className="rounded-r-full" />
        </div>
        <div className="flex gap-8 text-xs">
          {[
            { label: 'Winners (SCALE)', value: portfolio.spendOnWinners, color: '#34d399', dot: '#10b981' },
            { label: 'Losers (KILL)',   value: portfolio.spendOnLosers,  color: '#fca5a5', dot: '#ef4444' },
            { label: 'Hold / Fix',      value: portfolio.spendOnHold,    color: '#a5b4fc', dot: '#6366f1' },
          ].map(s => (
            <span key={s.label} className="flex items-center gap-1.5" style={{ color: 'var(--text-3)' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot }} />
              <strong style={{ color: s.color }}>€{s.value.toLocaleString()}</strong>
              &nbsp;{s.label}&nbsp;
              <span>({((s.value / portfolio.totalSpend) * 100).toFixed(0)}%)</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
