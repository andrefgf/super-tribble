'use client';

import { useState } from 'react';
import type { Ad, AccountBenchmarks } from '@/lib/types';
import { Share2, Copy, Check, X } from 'lucide-react';

interface Props {
  ads: Ad[];
  benchmarks: AccountBenchmarks;
}

export default function ShareButton({ ads, benchmarks }: Props) {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl]         = useState<string | null>(null);
  const [copied, setCopied]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleOpen() {
    setOpen(true);
    if (url) return;

    setLoading(true);
    setError(null);
    try {
      const res  = await fetch('/api/share/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ads, benchmarks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not generate link');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const emailBody = url
    ? `Take a look at this ad performance report:%0A%0A${url}`
    : '';

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:bg-amber-500/10"
        style={{ color: 'var(--brand)', border: '1px solid rgba(217,119,6,0.25)' }}
      >
        <Share2 size={12} />
        Share report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(26,25,23,0.4)' }}
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-md rounded-2xl p-6"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(26,25,23,0.12)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>
                Share this report
              </h3>
              <button onClick={() => setOpen(false)} style={{ color: 'var(--text-3)' }}>
                <X size={16} />
              </button>
            </div>

            <p className="text-xs mb-4" style={{ color: 'var(--text-2)' }}>
              Send a live snapshot to your team or CFO. They don&apos;t need an account to view it.
            </p>

            {loading && (
              <div className="py-6 text-center text-xs" style={{ color: 'var(--text-3)' }}>
                Generating your report link…
              </div>
            )}

            {error && (
              <div className="py-4 text-center text-xs" style={{ color: 'var(--kill)' }}>
                {error}
              </div>
            )}

            {url && !loading && (
              <>
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span className="flex-1 text-xs truncate" style={{ color: 'var(--text-2)' }}>
                    {url}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                    style={{
                      background: copied ? 'rgba(5,150,105,0.12)' : 'rgba(217,119,6,0.10)',
                      color: copied ? 'var(--scale)' : 'var(--brand)',
                    }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>
                  Expires in 30 days · Read-only · No login required
                </p>

                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-3)' }}>Or send by email:</p>
                  <a
                    href={`mailto:?subject=Ad performance report from Lumière&body=${emailBody}`}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                  >
                    Open email client →
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
