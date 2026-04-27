'use client';

import { useMemo } from 'react';
import type { DecisionOutput, AccountBenchmarks } from '@/lib/types';
import { computeForecast } from '@/lib/forecast';
import { TrendingUp } from 'lucide-react';

const CONFIDENCE_CONFIG = {
  HIGH:   { color: '#059669', label: 'Confidence: HIGH',          opacity: 1   },
  MEDIUM: { color: '#D97706', label: 'Confidence: MEDIUM',        opacity: 1   },
  LOW:    { color: '#4F46E5', label: 'Estimate — needs more data', opacity: 0.7 },
};

interface Props {
  decisions: DecisionOutput[];
  benchmarks: AccountBenchmarks;
  daysOfData?: number;
}

export default function ForecastCard({ decisions, benchmarks, daysOfData = 14 }: Props) {
  const forecast = useMemo(
    () => computeForecast(decisions, daysOfData, benchmarks),
    [decisions, benchmarks, daysOfData],
  );

  const conf = CONFIDENCE_CONFIG[forecast.confidence];
  const fmt  = (n: number) => `€${n.toLocaleString('en-EU')}`;

  if (forecast.isHealthy && forecast.upliftEur === 0) {
    return (
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(26,25,23,0.06)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={15} style={{ color: 'var(--scale)' }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
            Projected 30-Day Uplift
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--scale)' }}>
          No major optimisation opportunities detected. Your account is performing above benchmark — keep running.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 mb-8 relative overflow-hidden"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(26,25,23,0.06)' }}
    >
      {/* Subtle tint */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl"
        style={{ background: 'rgba(5,150,105,0.04)' }}
      />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} style={{ color: 'var(--scale)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
              Projected 30-Day Uplift
            </span>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: conf.color + '18',
              color: conf.color,
              border: `1px solid ${conf.color}30`,
            }}
          >
            {conf.label}
          </span>
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-3 mb-2">
          <span
            className="text-5xl font-black tabular-nums"
            style={{
              color: 'var(--scale)',
              opacity: conf.opacity,
            }}
          >
            +{fmt(forecast.upliftEur)}
          </span>
        </div>
        <p className="text-sm mb-5" style={{ color: 'var(--text-2)' }}>
          if you act on{' '}
          {forecast.hasKills ? 'killing the losers' : ''}
          {forecast.hasKills && forecast.hasScales ? ' and ' : ''}
          {forecast.hasScales ? 'scaling the winners' : ''} this week — at the same total budget.
        </p>

        {/* Breakdown */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-3)' }}>Where it comes from</p>
          <div className="space-y-2">
            {forecast.hasKills && (
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-2)' }}>
                  Recovered waste (kill {decisions.filter(d => d.decision === 'KILL').length} loser{decisions.filter(d => d.decision === 'KILL').length !== 1 ? 's' : ''})
                </span>
                <span className="font-semibold tabular-nums" style={{ color: 'var(--kill)' }}>
                  {fmt(forecast.breakdown.wasteRecovered)} freed
                </span>
              </div>
            )}
            {forecast.hasKills && (
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-2)' }}>Reallocate to winners (at their ROAS)</span>
                <span className="font-semibold tabular-nums" style={{ color: 'var(--scale)' }}>
                  +{fmt(forecast.breakdown.reallocationRevenue)}
                </span>
              </div>
            )}
            {forecast.hasScales && (
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-2)' }}>
                  Scale {decisions.filter(d => d.decision === 'SCALE').length} top performer{decisions.filter(d => d.decision === 'SCALE').length !== 1 ? 's' : ''} +30%
                </span>
                <span className="font-semibold tabular-nums" style={{ color: 'var(--scale)' }}>
                  +{fmt(forecast.breakdown.scaleBoost)}
                </span>
              </div>
            )}
          </div>
        </div>

        {forecast.confidence === 'LOW' && (
          <p className="mt-3 text-xs" style={{ color: 'var(--text-3)' }}>
            More than 14 days of data and 20+ conversions recommended for a reliable forecast.
          </p>
        )}
      </div>
    </div>
  );
}
