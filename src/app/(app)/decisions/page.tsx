'use client';

import { useMemo, useState } from 'react';
import { useDataSource } from '@/lib/data-source';
import { runDecisionEngine } from '@/lib/engine';
import { Decision } from '@/lib/types';
import DecisionBadge from '@/components/ui/DecisionBadge';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

type SortKey = 'spend' | 'roas' | 'decision';

export default function DecisionsPage() {
  const { ads, benchmarks } = useDataSource();
  const decisions = useMemo(() => ads.map(ad => runDecisionEngine(ad, benchmarks)), [ads, benchmarks]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter]     = useState<Decision | 'ALL'>('ALL');
  const [sortKey, setSortKey]   = useState<SortKey>('decision');
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('asc');

  const decisionCounts = useMemo(() => {
    const c: Record<string, number> = { ALL: decisions.length };
    decisions.forEach(d => { c[d.decision] = (c[d.decision] || 0) + 1; });
    return c;
  }, [decisions]);

  const filtered = useMemo(() => {
    const list = filter === 'ALL' ? decisions : decisions.filter(d => d.decision === filter);
    return [...list].sort((a, b) => {
      let av = 0, bv = 0;
      if (sortKey === 'spend')    { av = a.ad.performance.spend; bv = b.ad.performance.spend; }
      if (sortKey === 'roas')     { av = a.ad.performance.roas;  bv = b.ad.performance.roas;  }
      if (sortKey === 'decision') { av = ['SCALE','FIX','HOLD','KILL'].indexOf(a.decision); bv = ['SCALE','FIX','HOLD','KILL'].indexOf(b.decision); }
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }, [decisions, filter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? <span className="ml-0.5 opacity-60">{sortDir === 'desc' ? '↓' : '↑'}</span>
      : null;

  const FILTERS: (Decision | 'ALL')[] = ['ALL', 'SCALE', 'HOLD', 'KILL', 'FIX'];
  const FILTER_COLORS: Record<string, string> = {
    SCALE: '#059669', HOLD: '#4F46E5', KILL: '#DC2626', FIX: '#D97706', ALL: 'var(--text-2)',
  };

  const DECISION_BORDER: Record<string, string> = {
    SCALE: '#059669', HOLD: '#4F46E5', KILL: '#DC2626', FIX: '#D97706',
  };

  return (
    <div className="p-8 max-w-5xl animate-fade-up">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-1)' }}>Decisions</h1>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          Every ad scored, ranked, and given a clear action — scale, hold, kill, or fix.
        </p>
      </div>

      {/* ── Filter pills ──────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <SlidersHorizontal size={13} style={{ color: 'var(--text-3)' }} />
        {FILTERS.map(f => {
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: active ? 'rgba(217,119,6,0.10)' : 'var(--surface-1)',
                color: active ? 'var(--brand)' : 'var(--text-3)',
                border: `1px solid ${active ? 'rgba(217,119,6,0.30)' : 'var(--border)'}`,
              }}>
              {f !== 'ALL' && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: FILTER_COLORS[f] }} />
              )}
              {f}
              <span className="opacity-50 font-normal ml-0.5">{decisionCounts[f] ?? 0}</span>
            </button>
          );
        })}
        <span className="ml-auto text-xs" style={{ color: 'var(--text-3)' }}>
          {filtered.length} ad{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Ad list ───────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(26,25,23,0.06)' }}>

        {/* Column headers */}
        <div className="flex items-center gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-3)', letterSpacing: '0.07em', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex-1">Ad</div>
          <div className="w-20 text-center cursor-pointer hover:text-stone-900 transition-colors"
            onClick={() => toggleSort('decision')}>
            Decision <SortIcon k="decision" />
          </div>
          <div className="w-20 text-right cursor-pointer hover:text-stone-900 transition-colors"
            onClick={() => toggleSort('roas')}>
            ROAS <SortIcon k="roas" />
          </div>
          <div className="w-20 text-right cursor-pointer hover:text-stone-900 transition-colors"
            onClick={() => toggleSort('spend')}>
            Spend <SortIcon k="spend" />
          </div>
          <div className="w-32 text-right">Action</div>
          <div className="w-4" />
        </div>

        {filtered.map((d, i) => (
          <div key={d.ad.id}>
            <div
              className="flex items-center gap-4 px-6 py-5 cursor-pointer transition-colors hover:bg-black/[0.02]"
              style={{ borderBottom: '1px solid var(--border)' }}
              onClick={() => setExpanded(expanded === d.ad.id ? null : d.ad.id)}
            >
              {/* Color bar */}
              <div className="w-0.5 h-10 rounded-full flex-shrink-0"
                style={{ background: DECISION_BORDER[d.decision], opacity: 0.6 }} />

              {/* Ad name + campaign */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-1 truncate" style={{ color: 'var(--text-1)' }}>
                  {d.ad.name}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>
                  {d.ad.campaign}
                </p>
              </div>

              {/* Decision */}
              <div className="w-20 flex justify-center">
                <DecisionBadge decision={d.decision} />
              </div>

              {/* ROAS */}
              <div className="w-20 text-right">
                <span className="text-sm font-bold tabular-nums"
                  style={{ color: d.ad.performance.roas >= benchmarks.medianRoas ? 'var(--scale)' : 'var(--kill)' }}>
                  {d.ad.performance.roas.toFixed(1)}x
                </span>
              </div>

              {/* Spend */}
              <div className="w-20 text-right">
                <span className="text-sm tabular-nums" style={{ color: 'var(--text-1)' }}>
                  €{d.ad.performance.spend.toLocaleString()}
                </span>
              </div>

              {/* Budget action */}
              <div className="w-32 text-right">
                <span className="text-sm font-bold tabular-nums"
                  style={{ color: DECISION_BORDER[d.decision] }}>
                  {d.budgetSuggestion}
                </span>
              </div>

              {/* Chevron */}
              <div className="w-4 flex justify-end">
                {expanded === d.ad.id
                  ? <ChevronUp size={13} style={{ color: 'var(--text-3)' }} />
                  : <ChevronDown size={13} style={{ color: 'var(--text-3)' }} />
                }
              </div>
            </div>

            {/* Expanded panel */}
            {expanded === d.ad.id && (
              <div className="px-6 py-6" style={{ background: 'rgba(0,0,0,0.015)', borderBottom: '1px solid var(--border)' }}>
                <div className="grid grid-cols-2 gap-10">

                  {/* Reasons */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                      style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                      Why this decision
                    </p>
                    <ul className="space-y-3">
                      {d.reasons.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-2)' }}>
                          <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: DECISION_BORDER[d.decision] }} />
                          {r}
                        </li>
                      ))}
                    </ul>
                    {d.fixDiagnosis && (
                      <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold"
                        style={{ background: 'var(--fix-bg)', color: '#92400E', border: '1px solid rgba(217,119,6,0.25)' }}>
                        Diagnosis: {d.fixDiagnosis}
                      </div>
                    )}
                  </div>

                  {/* Metrics vs benchmark */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                      style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                      vs. benchmark
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'ROAS',      value: d.ad.performance.roas.toFixed(2)+'x',      bench: benchmarks.medianRoas.toFixed(2)+'x',       good: d.ad.performance.roas >= benchmarks.medianRoas },
                        { label: 'CTR',       value: (d.ad.performance.ctr*100).toFixed(2)+'%',  bench: (benchmarks.medianCtr*100).toFixed(2)+'%',   good: d.ad.performance.ctr >= benchmarks.medianCtr },
                        { label: 'CVR',       value: (d.ad.performance.cvr*100).toFixed(2)+'%',  bench: (benchmarks.medianCvr*100).toFixed(2)+'%',   good: d.ad.performance.cvr >= benchmarks.medianCvr },
                        { label: 'CPA',       value: '€'+d.ad.performance.cpa.toFixed(0),        bench: '€'+benchmarks.medianCpa,                   good: d.ad.performance.cpa <= benchmarks.medianCpa },
                        { label: 'Frequency', value: d.ad.performance.frequency.toFixed(1),      bench: '< 3.0',                                    good: d.ad.performance.frequency < 3 },
                        { label: 'Confidence',value: d.confidence,                               bench: '',                                          good: d.confidence === 'HIGH' },
                      ].map(m => (
                        <div key={m.label} className="rounded-xl p-3"
                          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                          <p className="text-xs mb-1.5" style={{ color: 'var(--text-3)' }}>{m.label}</p>
                          <p className="text-sm font-bold" style={{ color: m.good ? 'var(--scale)' : 'var(--kill)' }}>
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
