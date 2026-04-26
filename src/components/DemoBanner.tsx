'use client';

import { useEffect, useState } from 'react';
import { clearUpload } from '@/lib/data-source';
import { X, Upload } from 'lucide-react';

export default function DemoBanner() {
  const [source, setSource] = useState<'csv_upload' | 'seed' | null>(null);
  const [uploadedAt, setUploadedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('lumiere_demo_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.ads?.length) {
          setSource('csv_upload');
          setUploadedAt(parsed.uploadedAt ?? null);
        } else {
          setSource('seed');
        }
      } else {
        setSource('seed');
      }
    } catch {
      setSource('seed');
    }
  }, []);

  if (source === null) return null; // wait for hydration

  function handleReset() {
    clearUpload();
    window.location.reload();
  }

  if (source === 'csv_upload') {
    const date = uploadedAt
      ? new Date(uploadedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : null;

    return (
      <div
        className="flex items-center justify-between px-4 py-2 text-xs"
        style={{
          background: 'rgba(16,185,129,0.08)',
          borderBottom: '1px solid rgba(16,185,129,0.15)',
          color: '#34d399',
        }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Showing your CSV upload{date ? ` · uploaded at ${date}` : ''}
        </span>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: '#34d399' }}
        >
          <X size={11} />
          Reset to demo
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between px-4 py-2 text-xs"
      style={{
        background: 'rgba(124,58,237,0.06)',
        borderBottom: '1px solid rgba(124,58,237,0.12)',
        color: 'var(--text-3)',
      }}
    >
      <span>
        You&apos;re viewing <strong style={{ color: 'var(--text-2)' }}>sample data</strong> — connect your own ads to see real insights
      </span>
      <a
        href="/onboarding/connect"
        className="flex items-center gap-1 font-semibold transition-opacity hover:opacity-80"
        style={{ color: 'var(--brand-light)' }}
      >
        <Upload size={11} />
        Upload CSV
      </a>
    </div>
  );
}
