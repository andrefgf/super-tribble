import { Decision } from '@/lib/types';

const config: Record<Decision, { bg: string; text: string; border: string; dot: string }> = {
  SCALE: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', dot: '#059669' },
  HOLD:  { bg: '#EEF2FF', text: '#3730A3', border: '#C7D2FE', dot: '#4F46E5' },
  KILL:  { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', dot: '#DC2626' },
  FIX:   { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', dot: '#D97706' },
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
