'use client';

interface SlackAction {
  label: string;
  primary?: boolean;
}

interface SlackDecision {
  verdict: 'KILL' | 'SCALE' | 'FIX';
  adName: string;
  reason: string;
  actions: SlackAction[];
}

interface Props {
  userName?: string;
  spendYesterday?: number;
  activeAds?: number;
  decisions?: SlackDecision[];
  totalSavings?: number;
}

const VERDICT_EMOJI: Record<string, string> = { KILL: '🔴', SCALE: '🟢', FIX: '🟡' };

export default function SlackAlertMock({
  userName = 'there',
  spendYesterday = 1247,
  activeAds = 14,
  decisions = [],
  totalSavings = 0,
}: Props) {
  return (
    <div
      className="rounded-xl overflow-hidden text-sm"
      style={{
        background: '#1A1D21',
        border: '1px solid #2C2D30',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Slack-style channel header */}
      <div className="px-4 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid #2C2D30' }}>
        <span style={{ color: '#5C5C5C', fontSize: 12 }}># lumiere-alerts</span>
      </div>

      {/* Message */}
      <div className="px-4 py-4">
        {/* Author row */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #D97706, #B45309)', color: 'white' }}
          >
            <span className="font-display" style={{ fontStyle: 'italic', fontWeight: 900 }}>L</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold" style={{ color: '#D1D2D3', fontSize: 15 }}>Lumière</span>
            <span
              className="text-xs px-1 py-0.5 rounded font-bold"
              style={{ background: '#383838', color: '#5C5C5C', fontSize: 10 }}
            >
              APP
            </span>
            <span style={{ color: '#5C5C5C', fontSize: 12 }}>9:01 AM</span>
          </div>
        </div>

        {/* Message body */}
        <div className="ml-11">
          <p style={{ color: '#D1D2D3', fontSize: 15, lineHeight: 1.5 }}>
            ☀️ Good morning, <strong>{userName}</strong>. Here&apos;s your daily briefing.
          </p>
          <p className="mt-1" style={{ color: '#D1D2D3', fontSize: 15, lineHeight: 1.5 }}>
            Yesterday you spent <strong>€{spendYesterday.toLocaleString()}</strong> across{' '}
            <strong>{activeAds}</strong> active ads.
            {decisions.length > 0 && (
              <> <strong>{decisions.length} ad{decisions.length !== 1 ? 's' : ''} need a decision today.</strong></>
            )}
          </p>

          {/* Decision blocks */}
          {decisions.map((dec, i) => (
            <div
              key={i}
              className="mt-3 rounded-lg p-3"
              style={{ background: '#222529', border: '1px solid #2C2D30' }}
            >
              <div className="flex items-start gap-2 mb-2">
                <span style={{ fontSize: 14 }}>{VERDICT_EMOJI[dec.verdict]}</span>
                <div>
                  <span
                    className="font-bold"
                    style={{
                      color: dec.verdict === 'KILL' ? '#fca5a5' : dec.verdict === 'SCALE' ? '#86efac' : '#fcd34d',
                      fontSize: 14,
                    }}
                  >
                    {dec.verdict}
                  </span>
                  <span className="font-bold ml-2" style={{ color: '#D1D2D3', fontSize: 14 }}>
                    {dec.adName}
                  </span>
                </div>
              </div>
              <p style={{ color: '#9B9DA1', fontSize: 13, lineHeight: 1.4 }}>{dec.reason}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {dec.actions.map((action, ai) => (
                  <button
                    key={ai}
                    style={{
                      cursor: 'default',
                      padding: '6px 12px',
                      borderRadius: 4,
                      fontSize: 13,
                      fontWeight: 700,
                      background: action.primary ? '#007A5A' : '#222529',
                      color: action.primary ? 'white' : '#D1D2D3',
                      border: action.primary ? 'none' : '1px solid #4C4F55',
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {totalSavings > 0 && (
            <p className="mt-3" style={{ color: '#9B9DA1', fontSize: 13 }}>
              Total potential savings today:{' '}
              <strong style={{ color: '#86efac' }}>€{totalSavings.toLocaleString()}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
