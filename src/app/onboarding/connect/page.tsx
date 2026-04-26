'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Upload, Link2, ArrowRight, AlertCircle, CheckCircle, FileText, Play } from 'lucide-react';
import Link from 'next/link';
import { persistUpload } from '@/lib/data-source';
import type { Ad, AccountBenchmarks } from '@/lib/types';

const DEMO_ACCOUNT_ID = 'demo-account-123';

const ERROR_MESSAGES: Record<string, string> = {
  denied:         'You declined the Meta permissions. We need read-only access to analyse your ads.',
  invalid:        'Something went wrong with the connection. Please try again.',
  invalid_state:  'Session expired. Please try connecting again.',
  token_failed:   'Could not retrieve your access token from Meta. Check your App credentials.',
  no_accounts:    'No ad accounts found. Make sure you have access to at least one Meta Ads account.',
  no_ad_accounts: 'No active ad accounts found on your Meta Business account.',
};

function ConnectPageInner() {
  const searchParams = useSearchParams();
  const oauthError   = searchParams.get('error');

  const router = useRouter();
  const [tab, setTab]           = useState<'meta' | 'csv'>('meta');
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError]     = useState<string | null>(null);
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
      if (!res.ok) { setCsvError(data.error ?? 'Upload failed'); }
      else { persistUpload(data.ads as Ad[], data.benchmarks as AccountBenchmarks); router.push('/reveal'); }
    } catch { setCsvError('Upload failed — check your internet connection'); }
    finally { setCsvLoading(false); }
  }

  const metaOauthUrl = `/api/auth/meta?account_id=${DEMO_ACCOUNT_ID}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg)' }}>

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
          Get started
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
          Explore the demo, import your data, or connect Meta directly.
        </p>

        {oauthError && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            {ERROR_MESSAGES[oauthError] ?? 'Something went wrong. Please try again.'}
          </div>
        )}

        {/* Try Demo — primary option */}
        <Link href="/"
          className="w-full flex items-center gap-4 p-4 rounded-2xl mb-3 transition-all hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(99,102,241,0.08))', border: '1px solid rgba(124,58,237,0.25)', textDecoration: 'none' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Play size={16} style={{ color: '#a78bfa' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Explore demo data</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>See exactly how Lumière works — no account needed</p>
          </div>
          <ArrowRight size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>or connect your real data</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

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
                <span className="text-lg font-bold" style={{ color: '#60a5fa' }}>f</span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Meta Ads Manager</p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>Read-only · No changes made to your account</p>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {[
                'Read-only access to your ad performance data',
                'We never modify campaigns, budgets, or settings',
                'Revoke access at any time from Meta Business Settings',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-2)' }}>
                  <CheckCircle size={12} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>

            <a href={metaOauthUrl}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ background: '#1877f2', color: 'white', boxShadow: '0 4px 16px rgba(24,119,242,0.3)' }}>
              Continue with Meta
              <ArrowRight size={14} />
            </a>

            <div className="mt-4 px-3 py-2.5 rounded-lg text-xs leading-relaxed"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', color: '#fcd34d' }}>
              <strong>For this demo:</strong> Meta OAuth works for accounts you&apos;ve added as test users in your Meta App dashboard.
              Full production access requires Meta app review (~1–2 weeks).
              Use <button onClick={() => setTab('csv')} className="underline font-semibold">CSV import</button> to analyse any account today without waiting.
            </div>
          </div>
        )}

        {/* CSV TAB */}
        {tab === 'csv' && (
          <div className="rounded-2xl p-6" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-1)' }}>
              Export from Meta Ads Manager and upload here.
            </p>
            <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--text-3)' }}>
              Ads Manager → Ads view → Columns: Performance &amp; Clicks → Export → CSV.
              Works instantly, no API approval needed.
            </p>

            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />

            <button onClick={() => fileRef.current?.click()} disabled={csvLoading}
              className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed transition-all hover:border-violet-500/50 hover:bg-violet-500/5"
              style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}>
              <Upload size={24} />
              <span className="text-sm font-medium">
                {csvLoading ? 'Analysing your ads…' : 'Click to upload CSV'}
              </span>
              <span className="text-xs">Meta Ads Manager export · max 10MB</span>
            </button>

            {csvError && (
              <p className="mt-3 text-xs text-center" style={{ color: '#f87171' }}>{csvError}</p>
            )}
          </div>
        )}
      </div>
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