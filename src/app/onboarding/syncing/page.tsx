'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

const STEPS = [
  { label: 'Connected to Meta Ads',           delay: 0 },
  { label: 'Fetching campaigns & ad sets',     delay: 1200 },
  { label: 'Pulling 14 days of ad performance', delay: 2800 },
  { label: 'Normalising data',                 delay: 4500 },
  { label: 'Running decision engine',          delay: 6000 },
  { label: 'Generating recommendations',       delay: 7200 },
];

function SyncingPageInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const accountId    = searchParams.get('account_id');
  const metaAccount  = searchParams.get('meta_account');

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
      }, step.delay);
    });

    if (accountId && metaAccount) {
      fetch('/api/sync/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId, meta_account_id: metaAccount }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.error) setSyncError(data.error);
        })
        .catch(() => {
          // Non-blocking — still redirect to dashboard
        });
    }

    const timeout = setTimeout(() => {
      router.push('/');
    }, STEPS[STEPS.length - 1].delay + 1200);

    return () => clearTimeout(timeout);
  }, [accountId, metaAccount, router]);

  const currentStep = completedSteps.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}>

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)', boxShadow: '0 0 16px rgba(217,119,6,0.30)' }}>
            <span className="text-white font-black">L</span>
          </div>
          <span className="font-display text-base font-bold" style={{ color: 'var(--text-1)', fontStyle: 'italic' }}>Lumière</span>
        </div>

        <h1 className="text-xl font-bold text-center mb-2" style={{ color: 'var(--text-1)' }}>
          Analysing your ads
        </h1>
        <p className="text-sm text-center mb-10" style={{ color: 'var(--text-2)' }}>
          We&apos;re running your account through the decision engine.
          <br />This takes about 30 seconds.
        </p>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {STEPS.map((step, i) => {
            const done    = completedSteps.includes(i);
            const active  = i === currentStep;
            return (
              <div key={i} className="flex items-center gap-3 transition-all"
                style={{ opacity: i <= currentStep ? 1 : 0.3 }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  {done ? (
                    <CheckCircle size={18} style={{ color: 'var(--scale)' }} />
                  ) : active ? (
                    <Loader2 size={16} className="animate-spin" style={{ color: 'var(--brand)' }} />
                  ) : (
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--surface-3)' }} />
                  )}
                </div>
                <span className="text-sm" style={{ color: done ? 'var(--text-1)' : active ? 'var(--brand)' : 'var(--text-3)' }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width:      `${(completedSteps.length / STEPS.length) * 100}%`,
              background: 'linear-gradient(90deg, #D97706, #B45309)',
            }} />
        </div>

        {syncError && (
          <p className="mt-6 text-xs text-center" style={{ color: 'var(--kill)' }}>
            {syncError}
            <br />
            <span style={{ color: 'var(--text-3)' }}>Redirecting to demo data in a moment...</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function SyncingPage() {
  return (
    <Suspense>
      <SyncingPageInner />
    </Suspense>
  );
}
