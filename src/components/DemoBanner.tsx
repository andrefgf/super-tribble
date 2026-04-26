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

  if (source === null) return null;

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
          background: 'var(--scale-bg)',
          borderBottom: '1px solid rgba(5,150,105,0.2)',
          color: '#065F46',
        }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--scale)' }} />
          Showing your CSV upload{date ? ` · uploaded at ${date}` : ''}
        </span>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: '#065F46' }}
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
        background: 'rgba(217,119,6,0.05)',
        borderBottom: '1px solid rgba(217,119,6,0.15)',
        color: 'var(--text-3)',
      }}
    >
      <span>
        You&apos;re viewing <strong style={{ color: 'var(--text-2)' }}>sample data</strong> — connect your own ads to see real insights
      </span>
      <a
        href="/onboarding/connect"
        className="flex items-center gap-1 font-semibold transition-opacity hover:opacity-80"
        style={{ color: 'var(--brand)' }}
      >
        <Upload size={11} />
        Upload CSV
      </a>
    </div>
  );
}
