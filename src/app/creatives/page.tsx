'use client';

import { useMemo } from 'react';
import { ads, benchmarks } from '@/lib/seed';
import { runDecisionEngine } from '@/lib/engine';
import PlatformBadge from '@/components/ui/PlatformBadge';
import DecisionBadge from '@/components/ui/DecisionBadge';
import { AlertTriangle, Clock, CheckCircle, Video, Image, LayoutGrid } from 'lucide-react';

export default function CreativesPage() {
  const decisions = useMemo(() => ads.map(ad => runDecisionEngine(ad, benchmarks)), []);

  const creatives = useMemo(() => {
    const map = new Map<string, typeof decisions>();
    decisions.forEach(d => {
      const key = d.ad.creative.id;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    });

    return Array.from(map.entries()).map(([, decs]) => {
      const avgRoas  = decs.reduce((s, d) => s + d.ad.performance.roas, 0) / decs.length;
      const totalSpend = decs.reduce((s, d) => s + d.ad.performance.spend, 0);
      const totalImpr  = decs.reduce((s, d) => s + d.ad.performance.impressions, 0);
      const avgFreq  = decs.reduce((s, d) => s + d.ad.performance.frequency, 0) / decs.length;
      const avgCtr   = decs.reduce((s, d) => s + d.ad.performance.ctr, 0) / decs.length;
      const sorted   = [...decs].sort((a, b) => ['SCALE','KILL','FIX','HOLD'].indexOf(a.decision) - ['SCALE','KILL','FIX','HOLD'].indexOf(b.decision));
      const topDecision = sorted[0].decision;
      const winRate  = decs.filter(d => d.decision === 'SCALE').length / decs.length;
      const fatigueScore = avgFreq > 5 ? 'HIGH' : avgFreq > 3 ? 'MEDIUM' : 'LOW';
      const ctrTrend = decs[0].ad.performance.ctr / decs[0].ad.performance.prev_ctr - 1;
      return {
        id: decs[0].ad.creative.id,
        name: decs[0].ad.creative.name,
        type: decs[0].ad.creative.type,
        platform: decs[0].ad.platform,
        avgRoas, totalSpend, totalImpr, avgFreq, avgCtr, ctrTrend,
        topDecision, winRate, fatigueScore,
        daysRunning: decs[0].ad.daysRunning,
      };
    }).sort((a, b) => b.avgRoas - a.avgRoas);
  }, [decisions]);

  const TypeIcon = ({ type }: { type: string }) =>
    type === 'video' ? <Video size={14} /> : type === 'carousel' ? <LayoutGrid size={14} /> : <Image size={14} />;

  const FATIGUE_CONFIG = {
    HIGH:   { icon: <AlertTriangle size={11}/>, color: '#fca5a5', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.15)',  label: 'Fatigued' },
    MEDIUM: { icon: <Clock size={11}/>,          color: '#fcd34d', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', label: 'Watch' },
    LOW:    { icon: <CheckCircle size={11}/>,    color: '#86efac', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)', label: 'Fresh' },
  } as const;

  const highCount   = creatives.filter(c => c.fatigueScore === 'HIGH').length;
  const mediumCount = creatives.filter(c => c.fatigueScore === 'MEDIUM').length;

  return (
    <div className="p-8 max-w-7xl animate-fade-up">

      {/* ── Summary strip ──────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Creatives',  value: String(creatives.length),      sub: 'across all platforms',          accent: '#7c3aed' },
          { label: 'Fatigued',         value: String(highCount),              sub: 'need immediate refresh',        accent: '#ef4444' },
          { label: 'Watch list',       value: String(mediumCount),            sub: 'approaching fatigue threshold', accent: '#f59e0b' },
          { label: 'Avg Win Rate',     value: (creatives.reduce((s,c) => s + c.winRate, 0) / creatives.length * 100).toFixed(0) + '%',
            sub: 'creatives driving SCALE decisions', accent: '#10b981' },
        ].map(m => (
          <div key={m.label} className="card-glow rounded-xl p-4 relative overflow-hidden"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full blur-xl pointer-events-none"
              style={{ background: m.accent + '20' }} />
            <p className="text-xs uppercase tracking-widest mb-2 relative" style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
              {m.label}
            </p>
            <p className="text-2xl font-bold relative" style={{ color: m.accent }}>{m.value}</p>
            <p className="text-xs mt-1 relative" style={{ color: 'var(--text-3)' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Creative rows ──────────────────────────── */}
      <div className="space-y-3">
        {creatives.map(c => {
          const fat = FATIGUE_CONFIG[c.fatigueScore as keyof typeof FATIGUE_CONFIG];
          return (
            <div key={c.id} className="card-glow rounded-xl p-4"
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-4">

                {/* Type icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--surface-2)', color: 'var(--brand-light)', border: '1px solid var(--border)' }}>
                  <TypeIcon type={c.type} />
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{c.name}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded capitalize"
                      style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                      {c.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlatformBadge platform={c.platform} />
                    <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                      {c.daysRunning}d · {c.totalImpr.toLocaleString()} impressions
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Avg ROAS</p>
                    <p className="text-sm font-bold tabular-nums"
                      style={{ color: c.avgRoas >= benchmarks.medianRoas ? '#34d399' : '#f87171' }}>
                      {c.avgRoas.toFixed(2)}x
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-3)' }}>CTR</p>
                    <p className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-1)' }}>
                      {(c.avgCtr * 100).toFixed(2)}%
                    </p>
                    <p className="text-xs tabular-nums"
                      style={{ color: c.ctrTrend >= 0 ? '#34d399' : '#f87171' }}>
                      {c.ctrTrend >= 0 ? '▲' : '▼'} {Math.abs(c.ctrTrend * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Spend</p>
                    <p className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-1)' }}>
                      €{c.totalSpend.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Frequency</p>
                    <p className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-1)' }}>
                      {c.avgFreq.toFixed(1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Fatigue</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
                      style={{ background: fat.bg, color: fat.color, border: `1px solid ${fat.border}` }}>
                      {fat.icon} {fat.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Win Rate</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${c.winRate * 100}%`, background: '#10b981' }} />
                      </div>
                      <span className="text-xs tabular-nums" style={{ color: 'var(--text-1)' }}>
                        {(c.winRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Decision</p>
                    <DecisionBadge decision={c.topDecision} />
                  </div>
                </div>
              </div>

              {/* Fatigue / watch alert */}
              {c.fatigueScore !== 'LOW' && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                  style={{ background: fat.bg, color: fat.color, border: `1px solid ${fat.border}` }}>
                  {fat.icon}
                  {c.fatigueScore === 'HIGH'
                    ? `Creative fatigue detected — frequency ${c.avgFreq.toFixed(1)} and CTR ${c.ctrTrend < 0 ? 'declining' : 'flat'}. Rotate or refresh creative immediately.`
                    : `Watch: frequency reaching ${c.avgFreq.toFixed(1)} — monitor CTR over the next 48 hours.`
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
