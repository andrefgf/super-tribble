'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUploadedData } from '@/lib/data-source';
import { runDecisionEngine, runPortfolio } from '@/lib/engine';
import { benchmarks as seedBenchmarks } from '@/lib/seed';
import type { DecisionOutput, AccountBenchmarks } from '@/lib/types';
import DecisionBadge from '@/components/ui/DecisionBadge';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface RevealData {
  wastedAmount: number;
  killAds: DecisionOutput[];
  totalAds: number;
  overallRoas: number;
  benchmarks: AccountBenchmarks;
  decisions: DecisionOutput[];
}

export default function RevealPage() {
  const router = useRouter();
  const [data, setData] = useState<RevealData | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const uploaded = getUploadedData();
      const { ads, benchmarks } =
        uploaded ?? { ads: [], benchmarks: seedBenchmarks };

      if (ads.length === 0) {
        router.push('/');
        return;
      }

      const decisions = ads.map(ad => runDecisionEngine(ad, benchmarks));
      const portfolio  = runPortfolio(decisions);
      const killAds    = decisions.filter(d => d.decision === 'KILL');

      setData({
        wastedAmount: portfolio.spendOnLosers,
        killAds,
        totalAds: ads.length,
        overallRoas: portfolio.overallRoas,
        benchmarks,
        decisions,
      });

      setTimeout(() => setRevealed(true), 100);
    }, 800);

    return () => clearTimeout(timer);
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)', boxShadow: '0 4px 16px rgba(217,119,6,0.25)' }}>
            <span className="text-xl font-black text-white font-display" style={{ fontStyle: 'italic' }}>L</span>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
            Analysing your ad account…
          </p>
          <div className="flex gap-1.5 justify-center mt-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: 'var(--brand)',
                  animation: `glow-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg)' }}>

      <div
        className="relative w-full max-w-2xl"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)', color: 'white' }}>
            <span className="font-display" style={{ fontStyle: 'italic' }}>L</span>
          </div>
          <span className="font-display font-bold text-sm" style={{ color: 'var(--text-1)', fontStyle: 'italic' }}>Lumière</span>
        </div>

        {/* Reveal card */}
        <div
          className="rounded-3xl p-8 mb-6 text-center relative overflow-hidden"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(26,25,23,0.08)' }}
        >
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-3)', letterSpacing: '0.12em' }}>
              Your account has a problem
            </p>

            <div className="mb-4">
              <span className="text-7xl font-black tabular-nums"
                style={{
                  color: 'var(--kill)',
                  lineHeight: 1,
                }}>
                €{data.wastedAmount.toLocaleString()}
              </span>
            </div>

            <p className="text-xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
              wasted this period
            </p>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-2)' }}>
              {data.killAds.length} of your {data.totalAds} ads are bleeding budget.
              All of them should have been paused based on your own data.
            </p>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 mt-6 pt-6"
              style={{ borderTop: '1px solid var(--border)' }}>
              <div>
                <p className="text-2xl font-black tabular-nums" style={{ color: 'var(--kill)' }}>
                  {data.killAds.length}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>ads to kill</p>
              </div>
              <div className="w-px h-8" style={{ background: 'var(--border)' }} />
              <div>
                <p className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-1)' }}>
                  {data.overallRoas.toFixed(2)}x
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>current ROAS</p>
              </div>
              <div className="w-px h-8" style={{ background: 'var(--border)' }} />
              <div>
                <p className="text-2xl font-black tabular-nums" style={{ color: 'var(--scale)' }}>
                  {data.totalAds - data.killAds.length}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>ads to keep or scale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kill ad list */}
        {data.killAds.length > 0 && (
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(26,25,23,0.06)' }}
          >
            <div className="px-5 py-3.5"
              style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                Ads that should be killed
              </p>
            </div>
            {data.killAds.slice(0, 6).map((d, i) => (
              <div key={d.ad.id}
                className="flex items-center gap-4 px-5 py-3.5"
                style={{ borderBottom: i < Math.min(data.killAds.length, 6) - 1 ? '1px solid var(--border)' : 'none' }}>
                <DecisionBadge decision="KILL" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>
                    {d.ad.name}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-3)' }}>
                    {d.reasons[0]}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--kill)' }}>
                    €{d.ad.performance.spend.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                    ROAS {d.ad.performance.roas.toFixed(1)}x
                  </p>
                </div>
              </div>
            ))}
            {data.killAds.length > 6 && (
              <div className="px-5 py-3 text-xs text-center" style={{ color: 'var(--text-3)' }}>
                +{data.killAds.length - 6} more in the full dashboard
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3">
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #D97706, #B45309)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(217,119,6,0.30)',
            }}
          >
            <TrendingUp size={15} />
            View full report
            <ArrowRight size={14} />
          </a>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-3)' }}>
          Analysis based on your CSV export · Read-only · We don&apos;t modify your campaigns
        </p>
      </div>
    </div>
  );
}
