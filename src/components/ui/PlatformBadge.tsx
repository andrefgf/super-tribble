import { Platform } from '@/lib/types';

const config: Record<Platform, { label: string; color: string; bg: string; border: string }> = {
  meta:   { label: 'Meta',   color: '#1D4ED8', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.20)'  },
  google: { label: 'Google', color: '#15803D', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.20)'   },
  tiktok: { label: 'TikTok', color: '#BE185D', bg: 'rgba(236,72,153,0.08)',  border: 'rgba(236,72,153,0.20)'  },
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
