'use client';

import { useMemo, useState } from 'react';
import { useDataSource } from '@/lib/data-source';
import { runDecisionEngine } from '@/lib/engine';
import { Decision } from '@/lib/types';
import DecisionBadge from '@/components/ui/DecisionBadge';
import PlatformBadge from '@/components/ui/PlatformBadge';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

type SortKey = 'score' | 'spend' | 'roas' | 'decision';

export default function DecisionsPage() {
  const { ads, benchmarks } = useDataSource();
  const decisions = useMemo(() => ads.map(ad => runDecisionEngine(ad, benchmarks)), [ads, benchmarks]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter]     = useState<Decision | 'ALL'>('ALL');
  const [sortKey, setSortKey]   = useState<SortKey>('score');
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('desc');

  const decisionCounts = useMemo(() => {
    const c: Record<string, number> = { ALL: decisions.length };
    decisions.forEach(d => { c[d.decision] = (c[d.decision] || 0) + 1; });
    return c;
  }, [decisions]);

  const filtered = useMemo(() => {
    const list = filter === 'ALL' ? decisions : decisions.filter(d => d.decision === filter);
    return [...list].sort((a, b) => {
      let av = 0, bv = 0;
      if (sortKey === 'score')    { av = a.score; bv = b.score; }
      if (sortKey === 'spend')    { av = a.ad.performance.spend; bv = b.ad.performance.spend; }
      if (sortKey === 'roas')     { av = a.ad.performance.roas;  bv = b.ad.performance.roas;  }
      if (sortKey === 'decision') { av = ['SCALE','FIX','HOLD','KILL'].indexOf(a.decision); bv = ['SCALE','FIX','HOLD','KILL'].indexOf(b.decision); }
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }, [decisions, filter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? <span className="ml-0.5 opacity-70">{sortDir === 'desc' ? '↓' : '↑'}</span>
      : null;

  const FILTERS: (Decision | 'ALL')[] = ['ALL', 'SCALE', 'HOLD', 'KILL', 'FIX'];
  const FILTER_COLORS: Record<string, string> = {
    SCALE: '#34d399', HOLD: '#a5b4fc', KILL: '#fca5a5', FIX: '#fcd34d', ALL: 'var(--text-2)',
  };

  return (
    <div className="p-8 max-w-7xl animate-fade-up">

      {/* ── Filter pills ────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal size={13} style={{ color: 'var(--text-3)' }} />
        {FILTERS.map(f => {
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: active ? 'rgba(124,58,237,0.15)' : 'var(--surface-1)',
                color: active ? 'var(--brand-light)' : 'var(--text-3)',
                border: `1px solid ${active ? 'rgba(124,58,237,0.35)' : 'var(--border)'}`,
              }}>
              {f !== 'ALL' && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: FILTER_COLORS[f] }} />
              )}
              {f}
              <span className="opacity-50 font-normal">{decisionCounts[f] ?? 0}</span>
            </button>
          );
        })}
        <span className="ml-auto text-xs" style={{ color: 'var(--text-3)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Table ──────────────────────── */}
      <div className="card-glow rounded-xl overflow-hidden"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-widest"
          style={{
            color: 'var(--text-3)', letterSpacing: '0.07em',
            background: 'var(--surface-2)', borderBottom: '1px solid var(--border)',
          }}>
          <div className="col-span-4">Ad</div>
          <div className="col-span-1">Platform</div>
          <div className="col-span-1 cursor-pointer hover:text-white transition-colors"
            onClick={() => toggleSort('decision')}>
            Decision <SortIcon k="decision" />
          </div>
          <div className="col-span-1 cursor-pointer hover:text-white transition-colors text-right"
            onClick={() => toggleSort('score')}>
            Score <SortIcon k="score" />
          </div>
          <div className="col-span-1 cursor-pointer hover:text-white transition-colors text-right"
            onClick={() => toggleSort('roas')}>
            ROAS <SortIcon k="roas" />
          </div>
          <div className="col-span-1 text-right">CTR</div>
          <div className="col-span-1 cursor-pointer hover:text-white transition-colors text-right"
            onClick={() => toggleSort('spend')}>
            Spend <SortIcon k="spend" />
          </div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Rows */}
        {filtered.map((d, i) => (
          <div key={d.ad.id}>
            <div
              className="grid grid-cols-12 gap-4 px-5 py-3.5 cursor-pointer transition-colors hover:bg-white/[0.018]"
              style={{ borderBottom: '1px solid var(--border)' }}
              onClick={() => setExpanded(expanded === d.ad.id ? null : d.ad.id)}
            >
              {/* Ad name */}
              <div className="col-span-4 min-w-0 flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full flex-shrink-0"
                  style={{
                    background: d.decision === 'SCALE' ? '#10b981'
                              : d.decision === 'KILL'  ? '#ef4444'
                              : d.decision === 'FIX'   ? '#f59e0b'
                              : '#6366f1',
                    opacity: 0.6,
                  }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>
                    {d.ad.name}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-3)' }}>
                    {d.ad.campaign}
                  </p>
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <PlatformBadge platform={d.ad.platform} />
              </div>

              <div className="col-span-1 flex items-center">
                <DecisionBadge decision={d.decision} />
              </div>

              {/* Score bar */}
              <div className="col-span-1 flex items-center justify-end gap-2">
                <div className="w-10 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(d.score, 100)}%`,
                      background: d.score > 65 ? '#10b981' : d.score > 40 ? '#6366f1' : '#ef4444',
                    }} />
                </div>
                <span className="text-xs font-mono" style={{ color: 'var(--text-1)' }}>{d.score}</span>
              </div>

              {/* ROAS */}
              <div className="col-span-1 flex items-center justify-end">
                <span className={`text-sm font-semibold tabular-nums ${d.ad.performance.roas >= benchmarks.medianRoas ? 'text-emerald-400' : 'text-red-400'}`}>
                  {d.ad.performance.roas.toFixed(1)}x
                </span>
              </div>

              {/* CTR */}
              <div className="col-span-1 flex items-center justify-end">
                <span className="text-sm tabular-nums" style={{ color: 'var(--text-1)' }}>
                  {(d.ad.performance.ctr * 100).toFixed(2)}%
                </span>
              </div>

              {/* Spend */}
              <div className="col-span-1 flex items-center justify-end">
                <span className="text-sm tabular-nums" style={{ color: 'var(--text-1)' }}>
                  €{d.ad.performance.spend.toLocaleString()}
                </span>
              </div>

              {/* Budget action */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <span className="text-sm font-bold tabular-nums"
                  style={{
                    color: d.decision === 'SCALE' ? '#34d399'
                         : d.decision === 'KILL'  ? '#f87171'
                         : d.decision === 'FIX'   ? '#fbbf24'
                         : '#a5b4fc',
                  }}>
                  {d.budgetSuggestion}
                </span>
                {expanded === d.ad.id
                  ? <ChevronUp size={13} style={{ color: 'var(--text-3)' }} />
                  : <ChevronDown size={13} style={{ color: 'var(--text-3)' }} />
                }
              </div>
            </div>

            {/* Expanded reason panel */}
            {expanded === d.ad.id && (
              <div className="px-5 py-5" style={{ background: 'rgba(255,255,255,0.015)', borderBottom: '1px solid var(--border)' }}>
                <div className="grid grid-cols-2 gap-8">

                  {/* Reasons */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                      style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                      Why this decision
                    </p>
                    <ul className="space-y-2">
                      {d.reasons.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-2)' }}>
                          <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--brand)' }} />
                          {r}
                        </li>
                      ))}
                    </ul>
                    {d.fixDiagnosis && (
                      <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(245,158,11,0.08)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.15)' }}>
                        Diagnosis: {d.fixDiagnosis}
                      </div>
                    )}
                  </div>

                  {/* Metrics vs benchmark */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                      style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                      Performance vs benchmark
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'ROAS',      value: d.ad.performance.roas.toFixed(2)+'x',               bench: benchmarks.medianRoas.toFixed(2)+'x', good: d.ad.performance.roas >= benchmarks.medianRoas },
                        { label: 'CTR',       value: (d.ad.performance.ctr*100).toFixed(2)+'%',           bench: (benchmarks.medianCtr*100).toFixed(2)+'%', good: d.ad.performance.ctr >= benchmarks.medianCtr },
                        { label: 'CVR',       value: (d.ad.performance.cvr*100).toFixed(2)+'%',           bench: (benchmarks.medianCvr*100).toFixed(2)+'%', good: d.ad.performance.cvr >= benchmarks.medianCvr },
                        { label: 'CPA',       value: '€'+d.ad.performance.cpa.toFixed(0),                 bench: '€'+benchmarks.medianCpa, good: d.ad.performance.cpa <= benchmarks.medianCpa },
                        { label: 'Frequency', value: d.ad.performance.frequency.toFixed(1),               bench: '< 3.0', good: d.ad.performance.frequency < 3 },
                        { label: 'Confidence',value: d.confidence,                                        bench: '', good: d.confidence === 'HIGH' },
                      ].map(m => (
                        <div key={m.label} className="rounded-lg p-2.5"
                          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>{m.label}</p>
                          <p className="text-sm font-bold" style={{ color: m.good ? '#34d399' : '#f87171' }}>
                            {m.value}
                          </p>
                          {m.bench && (
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>↔ {m.bench}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
