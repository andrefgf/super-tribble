'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { runDecisionEngine, runPortfolio } from '@/lib/engine';
import type { Ad, AccountBenchmarks, DecisionOutput } from '@/lib/types';
import DecisionBadge from '@/components/ui/DecisionBadge';
import PlatformBadge from '@/components/ui/PlatformBadge';
import ForecastCard from '@/components/ForecastCard';
import IndustryBenchmarkCard from '@/components/IndustryBenchmarkCard';
import MetricCard from '@/components/ui/MetricCard';
import { TrendingUp, DollarSign, Target, Zap, Clock } from 'lucide-react';

interface ReportData {
  ads: Ad[];
  benchmarks: AccountBenchmarks;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
}

export default function SharedReportPage() {
  const { hash } = useParams<{ hash: string }>();
  const [report, setReport]   = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!hash) return;
    fetch(`/api/share/${hash}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return; }
        setReport(data);
      })
      .catch(() => setError('Could not load report'))
      .finally(() => setLoading(false));
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)', boxShadow: '0 4px 16px rgba(217,119,6,0.25)' }}>
            <span className="font-display text-base font-black text-white" style={{ fontStyle: 'italic' }}>L</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>Loading report…</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="text-center max-w-sm">
          <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)' }}>
            <span className="font-display text-base font-black text-white" style={{ fontStyle: 'italic' }}>L</span>
          </div>
          <h1 className="text-base font-bold mb-2" style={{ color: 'var(--text-1)' }}>
            Report not found
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            This link may have expired (reports last 30 days) or the URL is incorrect.
          </p>
          <a href="/" className="inline-block mt-4 text-xs font-semibold px-4 py-2 rounded-lg"
            style={{ background: 'rgba(217,119,6,0.10)', color: 'var(--brand)', border: '1px solid rgba(217,119,6,0.25)' }}>
            Create your own report →
          </a>
        </div>
      </div>
    );
  }

  const { ads, benchmarks, createdAt, expiresAt, viewCount } = report;
  const decisions: DecisionOutput[] = ads.map(ad => runDecisionEngine(ad, benchmarks));
  const portfolio = runPortfolio(decisions);

  const topDecisions = decisions
    .filter(d => d.priority === 'HIGH')
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    .slice(0, 8);

  const createdDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const expiresDate = new Date(expiresAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Read-only header bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 text-xs"
        style={{
          background: 'rgba(250,250,248,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 1px 0 var(--border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)', color: 'white' }}>
            <span className="font-display" style={{ fontStyle: 'italic' }}>L</span>
          </div>
          <span className="font-display font-bold" style={{ color: 'var(--text-1)', fontStyle: 'italic' }}>Lumière</span>
          <span className="px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(217,119,6,0.10)', color: 'var(--brand)', border: '1px solid rgba(217,119,6,0.20)' }}>
            Shared Report
          </span>
        </div>
        <div className="flex items-center gap-4" style={{ color: 'var(--text-3)' }}>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            Created {createdDate} · expires {expiresDate}
          </span>
          <span>{viewCount} view{viewCount !== 1 ? 's' : ''}</span>
          <a href="/"
            className="font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)', color: 'white', boxShadow: '0 2px 8px rgba(217,119,6,0.25)' }}>
            Try Lumière →
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Hero */}
        <div className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 4px rgba(26,25,23,0.06)',
          }}>
          <div className="relative">
            <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-1)' }}>
              Ad Performance Report
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              {ads.length} ads analysed · {portfolio.decisions.KILL} to kill · {portfolio.decisions.SCALE} to scale
              {' '}· <span style={{ color: 'var(--kill)', fontWeight: 600 }}>
                €{portfolio.spendOnLosers.toLocaleString()} in wasted spend detected
              </span>
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <MetricCard label="Total Spend"         value={`€${(portfolio.totalSpend/1000).toFixed(1)}k`}
            sub="period analysed"     icon={<DollarSign size={14}/>} accent="#4F46E5" />
          <MetricCard label="Portfolio ROAS"       value={portfolio.overallRoas.toFixed(2)+'x'}
            sub="overall"             icon={<TrendingUp size={14}/>} accent="#059669" highlight />
          <MetricCard label="Wasted Spend"         value={`€${portfolio.spendOnLosers.toLocaleString()}`}
            sub="on KILL candidates"  icon={<Target size={14}/>}    accent="#DC2626" />
          <MetricCard label="Reallocation Opp."    value={`€${portfolio.reallocationAmount.toLocaleString()}`}
            sub="ready to shift"      icon={<Zap size={14}/>}       accent="#D97706" highlight />
        </div>

        {/* Forecast */}
        <ForecastCard decisions={decisions} benchmarks={benchmarks} daysOfData={7} />

        {/* Top decisions table */}
        <div className="rounded-xl overflow-hidden mb-8"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(26,25,23,0.06)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Priority Actions</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
              High-confidence decisions — top {topDecisions.length} of {decisions.length} ads
            </p>
          </div>
          {topDecisions.map((d, i) => (
            <div key={d.ad.id}
              className="flex items-center gap-4 px-5 py-3.5"
              style={{ borderBottom: i < topDecisions.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="text-xs w-4 text-center font-mono" style={{ color: 'var(--text-3)' }}>{i + 1}</span>
              <DecisionBadge decision={d.decision} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>{d.ad.name}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-3)' }}>{d.reasons[0]}</p>
              </div>
              <PlatformBadge platform={d.ad.platform} />
              <div className="text-right w-24">
                <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-1)' }}>
                  €{d.ad.performance.spend.toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>spend</p>
              </div>
              <div className="text-right w-16">
                <p className="text-sm font-bold tabular-nums"
                  style={{ color: d.decision === 'SCALE' ? 'var(--scale)' : d.decision === 'KILL' ? 'var(--kill)' : 'var(--fix)' }}>
                  {d.ad.performance.roas.toFixed(1)}x
                </p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>ROAS</p>
              </div>
            </div>
          ))}
        </div>

        {/* Industry benchmark */}
        <IndustryBenchmarkCard accountBenchmarks={benchmarks} />

        {/* Footer CTA */}
        <div className="text-center py-8">
          <p className="text-sm mb-3" style={{ color: 'var(--text-3)' }}>
            Want decisions like this for your own account every morning?
          </p>
          <a href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #D97706, #B45309)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(217,119,6,0.25)',
            }}>
            Try Lumière free →
          </a>
          <p className="text-xs mt-3" style={{ color: 'var(--text-3)' }}>
            Upload your CSV and get your first report in 60 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
