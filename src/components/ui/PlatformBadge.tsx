import { Platform } from '@/lib/types';

const config: Record<Platform, { label: string; color: string; bg: string; border: string }> = {
  meta:   { label: 'Meta',   color: '#93c5fd', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)'  },
  google: { label: 'Google', color: '#86efac', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)'  },
  tiktok: { label: 'TikTok', color: '#f9a8d4', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
};

export default function PlatformBadge({ platform }: { platform: Platform }) {
  const c = config[platform];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
    >
      {c.label}
    </span>
  );
}
