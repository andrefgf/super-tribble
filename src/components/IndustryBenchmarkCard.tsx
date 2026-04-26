'use client';

import { useEffect, useState } from 'react';
import type { AccountBenchmarks } from '@/lib/types';
import { INDUSTRY_BENCHMARKS, getPercentile, type IndustryVertical, type IndustryBenchmark } from '@/lib/benchmarks-industry';

const VERTICAL_KEY = 'lumiere_vertical';

interface Props {
  accountBenchmarks: AccountBenchmarks;
}

export default function IndustryBenchmarkCard({ accountBenchmarks }: Props) {
  const [vertical, setVertical] = useState<IndustryVertical>('general_ecom');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(VERTICAL_KEY);
      if (stored && INDUSTRY_BENCHMARKS[stored as IndustryVertical]) {
        setVertical(stored as IndustryVertical);
      }
    } catch { /* ignore */ }
  }, []);

  function handleVerticalChange(v: IndustryVertical) {
    setVertical(v);
    try { sessionStorage.setItem(VERTICAL_KEY, v); } catch { /* ignore */ }
  }

  const benchmark = INDUSTRY_BENCHMARKS[vertical];
  const m = benchmark.metrics;

  const metrics = [
    {
      label: 'ROAS',
      value: accountBenchmarks.medianRoas,
      bands: m.roas,
      lowerIsBetter: false,
      format: (v: number) => `${v.toFixed(2)}x`,
      median: `${m.roas.p50.toFixed(1)}x`,
      top:    `${m.roas.p75.toFixed(1)}x`,
    },
    {
      label: 'CTR',
      value: accountBenchmarks.medianCtr,
      bands: m.ctr,
      lowerIsBetter: false,
      format: (v: number) => `${(v * 100).toFixed(2)}%`,
      median: `${(m.ctr.p50 * 100).toFixed(2)}%`,
      top:    `${(m.ctr.p75 * 100).toFixed(2)}%`,
    },
    {
      label: 'CVR',
      value: accountBenchmarks.medianCvr,
      bands: m.cvr,
      lowerIsBetter: false,
      format: (v: number) => `${(v * 100).toFixed(2)}%`,
      median: `${(m.cvr.p50 * 100).toFixed(2)}%`,
      top:    `${(m.cvr.p75 * 100).toFixed(2)}%`,
    },
    {
      label: 'CPA',
      value: accountBenchmarks.medianCpa,
      bands: m.cpa,
      lowerIsBetter: true,
      format: (v: number) => `€${v.toFixed(0)}`,
      median: `€${m.cpa.p50}`,
      top:    `€${m.cpa.p75}`,
    },
  ];

  function pctLabel(pct: number): { text: string; color: string } {
    if (pct >= 75) return { text: `Top ${100 - pct}%`,  color: '#10b981' };
    if (pct >= 50) return { text: 'Above median',       color: '#f59e0b' };
    return         { text: `Bottom ${pct}%`,            color: '#ef4444' };
  }

  return (
    <div
      className="rounded-2xl p-6 mb-8"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
            How You Compare
          </p>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            vs. {benchmark.displayName} · {benchmark.region} · {benchmark.asOf}
          </p>
        </div>
        <select
          value={vertical}
          onChange={e => handleVerticalChange(e.target.value as IndustryVertical)}
          className="text-xs px-2 py-1.5 rounded-lg outline-none cursor-pointer"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text-2)',
            border: '1px solid var(--border)',
          }}
        >
          {(Object.values(INDUSTRY_BENCHMARKS) as IndustryBenchmark[]).map(b => (
            <option key={b.vertical} value={b.vertical}>{b.displayName}</option>
          ))}
        </select>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {metrics.map(metric => {
          const pct   = getPercentile(metric.value, metric.bands, metric.lowerIsBetter);
          const label = pctLabel(pct);
          return (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold w-8" style={{ color: 'var(--text-2)' }}>
                    {metric.label}
                  </span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-1)' }}>
                    {metric.format(metric.value)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-3)' }}>
                  <span>Median: {metric.median}</span>
                  <span>Top 25%: {metric.top}</span>
                  <span
                    className="font-semibold px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: label.color + '18',
                      color: label.color,
                      border: `1px solid ${label.color}30`,
                    }}
                  >
                    {label.text}
                  </span>
                </div>
              </div>

              {/* Position bar */}
              <div className="relative h-2 rounded-full overflow-visible" style={{ background: 'var(--surface-3)' }}>
                {/* Gradient track */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 40%, #10b981 100%)',
                    opacity: 0.25,
                  }}
                />
                {/* Position indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow"
                  style={{
                    left: `clamp(6px, calc(${pct}% - 6px), calc(100% - 6px))`,
                    background: label.color,
                    boxShadow: `0 0 8px ${label.color}80`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--text-3)' }}>
        Source: {benchmark.source}
      </p>
    </div>
  );
}
