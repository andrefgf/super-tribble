'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Upload, Link2, ArrowRight, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import DecisionBadge from '@/components/ui/DecisionBadge';
import { Decision } from '@/lib/types';

// Placeholder account ID — in production this comes from auth
const DEMO_ACCOUNT_ID = 'demo-account-123';

const ERROR_MESSAGES: Record<string, string> = {
  denied:          'You declined the Meta permissions. We need read-only access to analyse your ads.',
  invalid:         'Something went wrong with the connection. Please try again.',
  invalid_state:   'Session expired. Please try connecting again.',
  token_failed:    'Could not retrieve your access token from Meta. Check your App credentials.',
  no_accounts:     'No ad accounts found. Make sure you have access to at least one Meta Ads account.',
  no_ad_accounts:  'No active ad accounts found on your Meta Business account.',
};

function ConnectPageInner() {
  const searchParams = useSearchParams();
  const oauthError   = searchParams.get('error');

  const [tab, setTab]             = useState<'meta' | 'csv'>('meta');
  const [csvResults, setCsvResults] = useState<null | { decisions: unknown[]; portfolio: unknown; adsFound: number }>(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvLoading(true);
    setCsvError(null);

    const form = new FormData();
    form.append('file', file);

    try {
      const res  = await fetch('/api/import/csv', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) {
        setCsvError(data.error ?? 'Upload failed');
      } else {
        setCsvResults(data);
      }
    } catch {
      setCsvError('Upload failed — check your internet connection');
    } finally {
      setCsvLoading(false);
    }
  }

  const metaOauthUrl = `/api/auth/meta?account_id=${DEMO_ACCOUNT_ID}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg)' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px]"
          style={{ background: 'rgba(124,58,237,0.07)' }} />
      </div>

      <div className="relative w-full max-w-lg">

        {/* Back + logo */}
        <div className="flex items-center justify-between mb-10">
          <a href="/onboarding" className="text-xs flex items-center gap-1 transition-colors hover:text-white"
            style={{ color: 'var(--text-3)' }}>
            ← Back
          </a>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>L</div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Lumière</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
          Connect your ad data
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
          Choose how you'd like to get started.
        </p>

        {/* OAuth error banner */}
        {oauthError && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            {ERROR_MESSAGES[oauthError] ?? 'Something went wrong. Please try again.'}
          </div>
        )}

        {/* Tab selector */}
        <div className="flex rounded-xl p-1 mb-6" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          {[
            { key: 'meta', label: 'Connect Meta Ads', icon: <Link2 size={13}/> },
            { key: 'csv',  label: 'Import CSV',        icon: <FileText size={13}/> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as 'meta' | 'csv')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: tab === t.key ? 'var(--surface-3)' : 'transparent',
                color: tab === t.key ? 'var(--text-1)' : 'var(--text-3)',
                border: tab === t.key ? '1px solid var(--border)' : '1px solid transparent',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* META TAB */}
        {tab === 'meta' && (
          <div className="rounded-2xl p-6"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}>
                <span className="text-lg">f</span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Meta Ads</p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>Read-only access · No changes made</p>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {[
                'We request read-only access to your ad performance data',
                'We never modify your campaigns, budgets, or settings',
                'Your token is encrypted and stored securely',
                'You can revoke access at any time from Meta Business Settings',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-2)' }}>
                  <CheckCircle size={12} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>

            <a href={metaOauthUrl}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: '#1877f2',
                color: 'white',
                boxShadow: '0 4px 16px rgba(24,119,242,0.3)',
              }}>
              Continue with Meta
              <ArrowRight size={14} />
            </a>

            <p className="text-center text-xs mt-4" style={{ color: 'var(--text-3)' }}>
              Requires a Meta Business account with at least one active ad account.
              <br />API approval can take 1–2 weeks — use CSV import in the meantime.
            </p>
          </div>
        )}

        {/* CSV TAB */}
        {tab === 'csv' && (
          <div className="rounded-2xl p-6" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>

            {!csvResults ? (
              <>
                <p className="text-sm mb-2" style={{ color: 'var(--text-1)' }}>
                  Export your data from Meta Ads Manager and upload it here.
                </p>
                <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--text-3)' }}>
                  In Meta Ads Manager → Ads view → Columns: Performance & Clicks →
                  Export → CSV. We'll run your ads through the decision engine instantly.
                </p>

                <input ref={fileRef} type="file" accept=".csv" className="hidden"
                  onChange={handleCsvUpload} />

                <button onClick={() => fileRef.current?.click()} disabled={csvLoading}
                  className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed transition-all hover:border-violet-500/50 hover:bg-violet-500/5"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}>
                  <Upload size={24} />
                  <span className="text-sm font-medium">
                    {csvLoading ? 'Analysing your ads...' : 'Click to upload CSV'}
                  </span>
                  <span className="text-xs">Meta Ads Manager export · max 10MB</span>
                </button>

                {csvError && (
                  <p className="mt-3 text-xs text-center" style={{ color: '#f87171' }}>
                    {csvError}
                  </p>
                )}
              </>
            ) : (
              <CsvResults data={csvResults} onReset={() => setCsvResults(null)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CsvResults({ data, onReset }: {
  data: { decisions: unknown[]; portfolio: unknown; adsFound: number };
  onReset: () => void;
}) {
  const decisions = data.decisions as Array<{
    decision: Decision;
    ad: { name: string; performance: { spend: number; roas: number } };
    budgetSuggestion: string;
    reasons: string[];
  }>;

  const portfolio = data.portfolio as {
    totalSpend: number;
    overallRoas: number;
    spendOnLosers: number;
    reallocationAmount: number;
    decisions: Record<string, number>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>
            Analysis complete — {data.adsFound} ads found
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
            ROAS {portfolio.overallRoas.toFixed(2)}x · €{portfolio.spendOnLosers.toLocaleString()} wasted spend detected
          </p>
        </div>
        <button onClick={onReset} className="text-xs" style={{ color: 'var(--text-3)' }}>
          ← New import
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {(['SCALE','HOLD','KILL','FIX'] as Decision[]).map(d => (
          <div key={d} className="rounded-lg p-3 text-center"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <DecisionBadge decision={d} size="sm" />
            <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-1)' }}>
              {portfolio.decisions[d] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {decisions.map((d, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <DecisionBadge decision={d.decision} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-1)' }}>{d.ad.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{d.reasons[0]}</p>
            </div>
            <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--text-3)' }}>
              €{d.ad.performance.spend.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <a href="/" className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white' }}>
        View full dashboard <ArrowRight size={14} />
      </a>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense>
      <ConnectPageInner />
    </Suspense>
  );
}
