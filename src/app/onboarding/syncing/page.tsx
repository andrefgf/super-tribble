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
    // Animate steps completing regardless of API state
    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
      }, step.delay);
    });

    // Kick off real sync if we have a connection
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

    // Redirect to dashboard after animation completes
    const timeout = setTimeout(() => {
      router.push('/');
    }, STEPS[STEPS.length - 1].delay + 1200);

    return () => clearTimeout(timeout);
  }, [accountId, metaAccount, router]);

  const currentStep = completedSteps.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'rgba(124,58,237,0.1)' }} />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>L</div>
          <span className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>Lumière</span>
        </div>

        <h1 className="text-xl font-bold text-center mb-2" style={{ color: 'var(--text-1)' }}>
          Analysing your ads
        </h1>
        <p className="text-sm text-center mb-10" style={{ color: 'var(--text-2)' }}>
          We're running your account through the decision engine.
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
                    <CheckCircle size={18} style={{ color: '#10b981' }} />
                  ) : active ? (
                    <Loader2 size={16} className="animate-spin" style={{ color: '#a78bfa' }} />
                  ) : (
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--surface-3)' }} />
                  )}
                </div>
                <span className="text-sm" style={{ color: done ? 'var(--text-1)' : active ? '#a78bfa' : 'var(--text-3)' }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width:      `${(completedSteps.length / STEPS.length) * 100}%`,
              background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
            }} />
        </div>

        {syncError && (
          <p className="mt-6 text-xs text-center" style={{ color: '#f87171' }}>
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
