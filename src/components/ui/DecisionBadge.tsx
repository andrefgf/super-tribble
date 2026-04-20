import { Decision } from '@/lib/types';

const config: Record<Decision, { bg: string; text: string; border: string; dot: string }> = {
  SCALE: { bg: 'rgba(16,185,129,0.1)',  text: '#34d399', border: 'rgba(16,185,129,0.25)',  dot: '#10b981' },
  HOLD:  { bg: 'rgba(99,102,241,0.1)',  text: '#a5b4fc', border: 'rgba(99,102,241,0.25)',  dot: '#6366f1' },
  KILL:  { bg: 'rgba(239,68,68,0.1)',   text: '#fca5a5', border: 'rgba(239,68,68,0.25)',   dot: '#ef4444' },
  FIX:   { bg: 'rgba(245,158,11,0.1)',  text: '#fcd34d', border: 'rgba(245,158,11,0.25)',  dot: '#f59e0b' },
};

export default function DecisionBadge({ decision, size = 'sm' }: { decision: Decision; size?: 'sm' | 'md' }) {
  const c = config[decision];
  const cls = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-semibold tracking-wide ${cls}`}
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {decision}
    </span>
  );
}
