'use client';

import { useMemo } from 'react';
import { useDataSource } from '@/lib/data-source';
import { runDecisionEngine } from '@/lib/engine';
import DecisionBadge from '@/components/ui/DecisionBadge';
import { AlertTriangle, Clock, CheckCircle, Video, Image, LayoutGrid } from 'lucide-react';

export default function CreativesPage() {
  const { ads, benchmarks } = useDataSource();
  const decisions = useMemo(() => ads.map(ad => runDecisionEngine(ad, benchmarks)), [ads, benchmarks]);

  const creatives = useMemo(() => {
    const map = new Map<string, typeof decisions>();
    decisions.forEach(d => {
      const key = d.ad.creative.id;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    });

    return Array.from(map.entries()).map(([, decs]) => {
      const avgRoas    = decs.reduce((s, d) => s + d.ad.performance.roas, 0) / decs.length;
      const totalSpend = decs.reduce((s, d) => s + d.ad.performance.spend, 0);
      const totalImpr  = decs.reduce((s, d) => s + d.ad.performance.impressions, 0);
      const avgFreq    = decs.reduce((s, d) => s + d.ad.performance.frequency, 0) / decs.length;
      const avgCtr     = decs.reduce((s, d) => s + d.ad.performance.ctr, 0) / decs.length;
      const sorted     = [...decs].sort((a, b) => ['SCALE','KILL','FIX','HOLD'].indexOf(a.decision) - ['SCALE','KILL','FIX','HOLD'].indexOf(b.decision));
      const topDecision = sorted[0].decision;
      const fatigueScore = avgFreq > 5 ? 'HIGH' : avgFreq > 3 ? 'MEDIUM' : 'LOW';
      const ctrTrend   = decs[0].ad.performance.ctr / decs[0].ad.performance.prev_ctr - 1;
      return {
        id: decs[0].ad.creative.id,
        name: decs[0].ad.creative.name,
        type: decs[0].ad.creative.type,
        avgRoas, totalSpend, totalImpr, avgFreq, avgCtr, ctrTrend,
        topDecision, fatigueScore,
        daysRunning: decs[0].ad.daysRunning,
      };
    }).sort((a, b) => b.avgRoas - a.avgRoas);
  }, [decisions]);

  const TypeIcon = ({ type }: { type: string }) =>
    type === 'video' ? <Video size={15} /> : type === 'carousel' ? <LayoutGrid size={15} /> : <Image size={15} />;

  const FATIGUE_CONFIG = {
    HIGH:   { icon: <AlertTriangle size={11}/>, color: '#fca5a5', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.15)',  label: 'Fatigued' },
    MEDIUM: { icon: <Clock size={11}/>,          color: '#fcd34d', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', label: 'Watch' },
    LOW:    { icon: <CheckCircle size={11}/>,    color: '#86efac', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)', label: 'Fresh' },
  } as const;

  return (
    <div className="p-8 max-w-5xl animate-fade-up">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-1)' }}>Creatives</h1>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          Creative-level intelligence — fatigue signals, ROAS, and what to retire or scale.
        </p>
      </div>

      {/* ── Creative cards ──────────────────────────────────── */}
      <div className="space-y-3">
        {creatives.map(c => {
          const fat = FATIGUE_CONFIG[c.fatigueScore as keyof typeof FATIGUE_CONFIG];
          return (
            <div key={c.id} className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>

              <div className="flex items-center gap-5 px-6 py-5">

                {/* Type icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--surface-2)', color: 'var(--brand-light)', border: '1px solid var(--border)' }}>
                  <TypeIcon type={c.type} />
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{c.name}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded capitalize flex-shrink-0"
                      style={{ background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                      {c.type}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                    {c.daysRunning}d running · {(c.totalImpr / 1000).toFixed(0)}k impressions
                  </p>
                </div>

                {/* ROAS */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Avg ROAS</p>
                  <p className="text-base font-bold tabular-nums"
                    style={{ color: c.avgRoas >= benchmarks.medianRoas ? '#34d399' : '#f87171' }}>
                    {c.avgRoas.toFixed(2)}x
                  </p>
                </div>

                {/* CTR + trend */}
                <div className="text-right flex-shrink-0 w-20">
                  <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>CTR</p>
                  <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-1)' }}>
                    {(c.avgCtr * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs tabular-nums"
                    style={{ color: c.ctrTrend >= 0 ? '#34d399' : '#f87171' }}>
                    {c.ctrTrend >= 0 ? '▲' : '▼'} {Math.abs(c.ctrTrend * 100).toFixed(1)}%
                  </p>
                </div>

                {/* Spend */}
                <div className="text-right flex-shrink-0 w-20">
                  <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Spend</p>
                  <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-1)' }}>
                    €{c.totalSpend.toLocaleString()}
                  </p>
                </div>

                {/* Fatigue */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Fatigue</p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: fat.bg, color: fat.color, border: `1px solid ${fat.border}` }}>
                    {fat.icon} {fat.label}
                  </span>
                </div>

                {/* Decision */}
                <div className="flex-shrink-0">
                  <p className="text-xs mb-1 text-right" style={{ color: 'var(--text-3)' }}>Decision</p>
                  <DecisionBadge decision={c.topDecision} />
                </div>
              </div>

              {/* Fatigue alert bar */}
              {c.fatigueScore !== 'LOW' && (
                <div className="flex items-center gap-2 px-6 py-3 text-xs"
                  style={{ background: fat.bg, color: fat.color, borderTop: `1px solid ${fat.border}` }}>
                  {fat.icon}
                  {c.fatigueScore === 'HIGH'
                    ? `Creative fatigue detected — frequency ${c.avgFreq.toFixed(1)} and CTR ${c.ctrTrend < 0 ? 'declining' : 'flat'}. Rotate or refresh immediately.`
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