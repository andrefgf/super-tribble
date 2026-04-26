'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Zap, Palette } from 'lucide-react';
import { BRAND_NAME } from '@/lib/seed';

const nav = [
  { href: '/',          label: 'Dashboard', icon: LayoutDashboard, desc: 'Portfolio overview' },
  { href: '/decisions', label: 'Decisions', icon: Zap,             desc: 'Scale · Kill · Hold · Fix' },
  { href: '/creatives', label: 'Creatives', icon: Palette,         desc: 'Creative intelligence' },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside
      className="fixed left-0 top-0 h-screen w-56 flex flex-col z-20"
      style={{
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* ── Logo ─────────────────────────── */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          {/* Icon mark */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
              boxShadow: '0 0 10px rgba(217,119,6,0.30)',
            }}
          >
            <span className="font-display text-white" style={{ fontStyle: 'italic', fontWeight: 900 }}>L</span>
          </div>
          <div className="leading-none">
            <span
              className="font-display text-sm font-bold tracking-tight"
              style={{ color: 'var(--text-1)', fontStyle: 'italic', letterSpacing: '-0.01em' }}
            >
              {BRAND_NAME}
            </span>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>Ad Intelligence</p>
          </div>
        </div>

        {/* Live badge */}
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--scale)', animation: 'glow-pulse 2s infinite' }}
          />
          <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>
            Live · 15 ads synced
          </span>
        </div>
      </div>

      {/* ── Nav ──────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: active ? 'rgba(217,119,6,0.08)' : 'transparent',
                color: active ? 'var(--brand)' : 'var(--text-3)',
                borderLeft: active ? '2px solid var(--brand)' : '2px solid transparent',
              }}
            >
              <Icon
                size={15}
                strokeWidth={active ? 2.5 : 2}
                style={{ color: active ? 'var(--brand)' : 'var(--text-3)', flexShrink: 0 }}
              />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Platform status ──────────────── */}
      <div className="px-4 py-3 mx-3 mb-3 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-3)' }}>Connected Platforms</p>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#3b82f6' }} />
          <span className="text-xs" style={{ color: '#2563EB' }}>Meta Ads</span>
        </div>
      </div>

      {/* ── Account ──────────────────────── */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)', color: 'white' }}
          >
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-1)' }}>André F.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
