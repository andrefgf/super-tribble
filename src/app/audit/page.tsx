'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, TrendingUp } from 'lucide-react';
import { persistUpload } from '@/lib/data-source';
import type { Ad, AccountBenchmarks } from '@/lib/types';

export default function AuditPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    const form = new FormData();
    form.append('file', file);

    try {
      const res  = await fetch('/api/import/csv', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Upload failed'); return; }

      persistUpload(data.ads as Ad[], data.benchmarks as AccountBenchmarks);
      router.push('/reveal');
    } catch {
      setError('Upload failed — check your internet connection');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[120px]"
          style={{ background: 'rgba(124,58,237,0.07)' }} />
      </div>

      {/* Nav */}
      <nav className="relative flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white' }}>
            L
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>Lumière</span>
        </div>
        <a href="/onboarding"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ color: 'var(--text-3)' }}>
          Full account setup →
        </a>
      </nav>

      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
          <TrendingUp size={11} />
          Free · No signup · Results in 60 seconds
        </div>

        <h1 className="text-4xl font-black mb-4 max-w-xl leading-tight"
          style={{ color: 'var(--text-1)' }}>
          Find out how much you&apos;re wasting on Meta Ads
        </h1>

        <p className="text-base mb-10 max-w-md" style={{ color: 'var(--text-2)' }}>
          Upload your Meta Ads Manager CSV and Lumière will tell you exactly
          which ads to kill, which to scale, and how much you could save — instantly.
        </p>

        {/* Upload zone */}
        <div className="w-full max-w-md">
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />

          <button
            onClick={() => !loading && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            disabled={loading}
            className="w-full flex flex-col items-center gap-4 py-12 rounded-2xl border-2 border-dashed transition-all"
            style={{
              borderColor: dragOver ? 'rgba(124,58,237,0.6)' : 'rgba(124,58,237,0.25)',
              background: dragOver ? 'rgba(124,58,237,0.05)' : 'var(--surface-1)',
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? (
              <>
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--brand)', animation: `glow-pulse 1.2s ${i*0.2}s infinite` }} />
                  ))}
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
                  Analysing your ads…
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <Upload size={22} style={{ color: '#a78bfa' }} />
                </div>
                <div>
                  <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-1)' }}>
                    Drop your CSV here, or click to browse
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                    Meta Ads Manager export · CSV · max 10MB
                  </p>
                </div>
              </>
            )}
          </button>

          {error && (
            <p className="mt-3 text-xs text-center" style={{ color: '#f87171' }}>{error}</p>
          )}

          <p className="mt-4 text-xs text-center" style={{ color: 'var(--text-3)' }}>
            Your data is analysed in-browser and never stored without your consent.
          </p>
        </div>

        {/* How-to steps */}
        <div className="w-full max-w-lg mt-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-5 text-center"
            style={{ color: 'var(--text-3)', letterSpacing: '0.1em' }}>
            How to export from Meta
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: '1', text: 'Open Meta Ads Manager → switch to Ads view' },
              { step: '2', text: 'Columns → Performance & Clicks → Apply' },
              { step: '3', text: 'Export → CSV → upload here' },
            ].map(s => (
              <div key={s.step} className="rounded-xl p-4 text-left"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-2 flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
                  {s.step}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-8 mt-12">
          {[
            { icon: <CheckCircle size={14}/>, text: 'No account required' },
            { icon: <CheckCircle size={14}/>, text: 'Results in 60 seconds' },
            { icon: <CheckCircle size={14}/>, text: 'Free, always' },
          ].map(p => (
            <div key={p.text} className="flex items-center gap-1.5 text-xs"
              style={{ color: '#10b981' }}>
              {p.icon}
              <span>{p.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
