'use client';

import { useMemo } from 'react';
import { ads, benchmarks, BRAND_NAME } from '@/lib/seed';
import { runDecisionEngine, runPortfolio } from '@/lib/engine';
import MetricCard from '@/components/ui/MetricCard';
import DecisionBadge from '@/components/ui/DecisionBadge';
import PlatformBadge from '@/components/ui/PlatformBadge';
import { TrendingUp, DollarSign, Target, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

const DECISION_COLORS = { SCALE: '#10b981', HOLD: '#6366f1', KILL: '#ef4444', FIX: '#f59e0b' };

export default function DashboardPage() {
  const decisions = useMemo(() => ads.map(ad => runDecisionEngine(ad, benchmarks)), []);
  const portfolio  = useMemo(() => runPortfolio(decisions), [decisions]);

  const pieData = [
    { name: 'SCALE', value: portfolio.decisions.SCALE },
    { name: 'HOLD',  value: portfolio.decisions.HOLD  },
    { name: 'KILL',  value: portfolio.decisions.KILL  },
    { name: 'FIX',   value: portfolio.decisions.FIX   },
  ];

  const platformSpend = useMemo(() => {
    const map: Record<string, { spend: number; revenue: number }> = {};
    ads.forEach(ad => {
      if (!map[ad.platform]) map[ad.platform] = { spend: 0, revenue: 0 };
      map[ad.platform].spend   += ad.performance.spend;
      map[ad.platform].revenue += ad.performance.revenue;
    });
    return Object.entries(map).map(([p, v]) => ({
      platform: p.charAt(0).toUpperCase() + p.slice(1),
      Spend:   Math.round(v.spend),
      Revenue: Math.round(v.revenue),
    }));
  }, []);

  const topDecisions = decisions
    .filter(d => d.priority === 'HIGH')
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    .slice(0, 5);

  const wastedPct = ((portfolio.spendOnLosers / portfolio.totalSpend) * 100).toFixed(0);

  return (
    <div className="p-8 max-w-7xl animate-fade-up">

      {/* ── Hero narrative hook ────────────────────────────── */}
      <div className="mb-8 relative overflow-hidden rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl"
          style={{ background: 'rgba(124,58,237,0.12)' }} />
        <div className="pointer-events-none absolute -bottom-8 right-32 w-32 h-32 rounded-full blur-2xl"
          style={{ background: 'rgba(16,185,129,0.08)' }} />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--brand-light)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"
                style={{ animation: 'glow-pulse 2s infinite' }} />
              Daily Brief · Apr 20, 2026
            </span>
          </div>

          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-1)' }}>
            {BRAND_NAME} spent <span style={{ color: 'var(--text-1)' }}>€{(portfolio.totalSpend / 1000).toFixed(1)}k</span> this week.
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            <span style={{ color: '#f87171', fontWeight: 600 }}>{wastedPct}% is going to underperformers</span> that should be killed or fixed today.
            Shift that budget to your {portfolio.decisions.SCALE} winners and your ROAS could jump by
            <span style={{ color: '#34d399', fontWeight: 600 }}> ~{((portfolio.spendOnWinners + portfolio.reallocationAmount) / portfolio.spendOnWinners * portfolio.overallRoas - portfolio.overallRoas).toFixed(1)}x</span>.
          </p>
        </div>
      </div>

      {/* ── KPIs ──────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Spend (7d)"    value={`€${(portfolio.totalSpend/1000).toFixed(1)}k`}
          sub="across all platforms"   icon={<DollarSign size={14}/>} accent="#6366f1" />
        <MetricCard label="Portfolio ROAS"      value={portfolio.overallRoas.toFixed(2)+'x'}
          trend={12} sub="vs. last 7 days"      icon={<TrendingUp size={14}/>} accent="#10b981" highlight />
        <MetricCard label="Wasted Spend"        value={`€${portfolio.spendOnLosers.toLocaleString()}`}
          sub="on KILL candidates"              icon={<Target size={14}/>}   accent="#ef4444" />
        <MetricCard label="Reallocation Opp."   value={`€${portfolio.reallocationAmount.toLocaleString()}`}
          sub="ready to shift to winners"       icon={<Zap size={14}/>}     accent="#f59e0b" highlight />
      </div>

      {/* ── Charts ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        {/* Decision breakdown donut */}
        <div className="card-glow rounded-xl p-5"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)' }}>Decision Breakdown</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>{decisions.length} ads analysed</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={65}
                paddingAngle={3} dataKey="value" strokeWidth={0}>
                {pieData.map(entry => (
                  <Cell key={entry.name}
                    fill={DECISION_COLORS[entry.name as keyof typeof DECISION_COLORS]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 8, fontSize: 12, color: 'var(--text-1)',
                }}
                formatter={(v: unknown) => [String(v) + ' ads']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: DECISION_COLORS[d.name as keyof typeof DECISION_COLORS] }} />
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                  {d.name} <strong style={{ color: 'var(--text-1)' }}>{d.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform bar chart */}
        <div className="col-span-2 card-glow rounded-xl p-5"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)' }}>Spend vs Revenue by Platform</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>7-day window</p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={platformSpend} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="platform"
                tick={{ fill: 'var(--text-3)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 8, fontSize: 12, color: 'var(--text-1)',
                }}
                formatter={(v: unknown) => [`€${Number(v).toLocaleString()}`]}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-3)' }} />
              <Bar dataKey="Spend"   fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="Revenue" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top Priority Actions ───────────────────────────── */}
      <div className="card-glow rounded-xl overflow-hidden"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Top Priority Actions</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
              High-confidence decisions requiring your attention
            </p>
          </div>
          <Link href="/decisions"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:bg-violet-500/10"
            style={{ color: 'var(--brand-light)', border: '1px solid rgba(124,58,237,0.2)' }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div>
          {topDecisions.map((d, i) => (
            <div key={d.ad.id}
              className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.015]"
              style={{ borderBottom: i < topDecisions.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="text-xs w-4 text-center font-mono" style={{ color: 'var(--text-3)' }}>
                {i + 1}
              </span>
              <DecisionBadge decision={d.decision} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>
                  {d.ad.name}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-3)' }}>
                  {d.reasons[0]}
                </p>
              </div>
              <PlatformBadge platform={d.ad.platform} />
              <div className="text-right w-24">
                <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-1)' }}>
                  €{d.ad.performance.spend.toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>spend</p>
              </div>
              <div className="text-right w-20">
                <p className="text-sm font-bold tabular-nums"
                  style={{
                    color: d.decision === 'SCALE' ? '#34d399'
                         : d.decision === 'KILL'  ? '#f87171'
                         : '#fbbf24',
                  }}>
                  {d.budgetSuggestion}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>action</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
