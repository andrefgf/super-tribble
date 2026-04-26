'use client';

import Link from 'next/link';
import { ArrowLeft, Layers } from 'lucide-react';

export default function ReallocationPage() {
  return (
    <div className="p-8 max-w-6xl animate-fade-up">
      <div
        style={{
          minHeight: '60vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Layers size={22} style={{ color: '#818cf8' }} />
        </div>

        <div
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--text-3)', letterSpacing: '0.1em' }}
        >
          Coming Soon
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: 'var(--text-1)' }}
        >
          Budget Reallocation
        </h1>

        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: 'var(--text-2)', maxWidth: 380 }}
        >
          AI-powered budget reallocation recommendations are in development.
          In the meantime, use the Decisions page to identify exactly what to
          scale and what to kill.
        </p>

        <Link
          href="/decisions"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 13, fontWeight: 600,
            color: 'var(--brand-light)', textDecoration: 'none',
            padding: '8px 16px', borderRadius: 8,
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <ArrowLeft size={13} />
          Go to Decisions
        </Link>
      </div>
    </div>
  );
}