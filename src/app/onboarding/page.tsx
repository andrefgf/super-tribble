'use client';

import Link from 'next/link';
import { ArrowRight, Zap, TrendingUp, TrendingDown, Wrench } from 'lucide-react';

const DECISIONS = [
  { label: 'SCALE', color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)', icon: <TrendingUp  size={14}/>, desc: 'Increase budget on proven winners' },
  { label: 'KILL',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',  icon: <TrendingDown size={14}/>, desc: 'Stop wasting money on losers' },
  { label: 'FIX',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)', icon: <Wrench size={14}/>,       desc: 'Diagnose what\'s broken and why' },
  { label: 'HOLD',  color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.2)', icon: <Zap size={14}/>,          desc: 'Watch and wait for more signal' },
];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg)' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'rgba(124,58,237,0.08)' }} />
      </div>

      <div className="relative w-full max-w-2xl">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
            L
          </div>
          <span className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>Lumière</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-1)' }}>
            Stop reporting.<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Start deciding.
            </span>
          </h1>
          <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-2)' }}>
            Connect your Meta Ads account and in 60 seconds we'll tell you exactly
            which ads to scale, which to kill, and where you're wasting budget.
          </p>
        </div>

        {/* Decision cards */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {DECISIONS.map(d => (
            <div key={d.label} className="rounded-xl p-4 text-center"
              style={{ background: d.bg, border: `1px solid ${d.border}` }}>
              <div className="flex justify-center mb-2" style={{ color: d.color }}>{d.icon}</div>
              <p className="text-xs font-bold mb-1" style={{ color: d.color }}>{d.label}</p>
              <p className="text-xs leading-tight" style={{ color: 'var(--text-3)' }}>{d.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/onboarding/connect"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white',
              boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
            }}>
            Get started — it's free
            <ArrowRight size={15} />
          </Link>
          <Link href="/" className="text-xs transition-colors hover:text-white"
            style={{ color: 'var(--text-3)' }}>
            Already have an account? View dashboard →
          </Link>
        </div>

        {/* Social proof */}
        <p className="text-center text-xs mt-10" style={{ color: 'var(--text-3)' }}>
          No credit card required · Free plan includes KILL recommendations · Setup in 60 seconds
        </p>
      </div>
    </div>
  );
}
