import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  icon?: ReactNode;
  accent?: string;
  highlight?: boolean;
}

export default function MetricCard({
  label, value, sub, trend, icon,
  accent = '#7c3aed',
  highlight = false,
}: MetricCardProps) {
  return (
    <div
      className="card-glow rounded-xl p-5 relative overflow-hidden"
      style={{
        background: 'var(--surface-1)',
        border: `1px solid ${highlight ? accent + '30' : 'var(--border)'}`,
      }}
    >
      {/* Subtle top accent line */}
      {highlight && (
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      )}

      {/* Faint radial glow behind icon */}
      <div
        className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ background: accent + '18' }}
      />

      <div className="relative flex items-start justify-between mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}
        >
          {label}
        </span>
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: accent + '18', color: accent }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="relative">
        <p
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}
        >
          {value}
        </p>

        {(sub || trend !== undefined) && (
          <div className="flex items-center gap-2 mt-1.5">
            {trend !== undefined && (
              <span
                className="inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{
                  background: trend >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                  color: trend >= 0 ? '#34d399' : '#f87171',
                }}
              >
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
            {sub && (
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{sub}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
