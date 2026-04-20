'use client';

import { usePathname } from 'next/navigation';
import { Bell, RefreshCw } from 'lucide-react';

const TITLES: Record<string, { label: string; sub: string }> = {
  '/':             { label: 'Dashboard',    sub: 'Portfolio overview & priority actions' },
  '/decisions':    { label: 'Decisions',    sub: 'Scale · Hold · Kill · Fix' },
  '/creatives':    { label: 'Creatives',    sub: 'Creative intelligence & fatigue detection' },
  '/reallocation': { label: 'Reallocation', sub: 'Shift budget from losers to winners' },
};

export default function TopBar() {
  const path = usePathname();
  const page = TITLES[path] ?? { label: '', sub: '' };

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-8 py-3"
      style={{
        background: 'rgba(5,5,14,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{page.label}</h2>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>{page.sub}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Last synced */}
        <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-3)' }}>
          <RefreshCw size={11} />
          Synced 4 min ago
        </div>

        {/* Divider */}
        <div className="w-px h-4" style={{ background: 'var(--border)' }} />

        {/* Notifications */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
          aria-label="Notifications"
        >
          <Bell size={14} style={{ color: 'var(--text-2)' }} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#ef4444' }}
          />
        </button>

        {/* Date badge */}
        <div
          className="hidden md:flex items-center px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
        >
          Apr 20, 2026
        </div>
      </div>
    </header>
  );
}
