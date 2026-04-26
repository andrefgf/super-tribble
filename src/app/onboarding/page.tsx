import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, Wrench, Minus, CheckCircle } from 'lucide-react';

const L = {
  bg:            '#FAFAF8',
  surface:       '#FFFFFF',
  surfaceSubtle: '#F5F4F1',
  border:        '#E5E3DF',
  text1:         '#1A1917',
  text2:         '#57534E',
  text3:         '#A8A29E',
  amber:         '#D97706',
  amberLight:    '#FEF3C7',
  amberMid:      '#FDE68A',
  amberDark:     '#92400E',
  scale:         '#059669',
  scaleBg:       '#ECFDF5',
  kill:          '#DC2626',
  killBg:        '#FEF2F2',
  fix:           '#D97706',
  fixBg:         '#FFFBEB',
  hold:          '#4F46E5',
  holdBg:        '#EEF2FF',
  dark:          '#1A1917',
};

const MOCK_DECISIONS = [
  { decision: 'SCALE', name: 'Summer UGC v3',          roas: '4.8x', action: '+30% budget',        color: L.scale, bg: L.scaleBg },
  { decision: 'KILL',  name: 'Retargeting — Static',    roas: '0.7x', action: 'Pause immediately',  color: L.kill,  bg: L.killBg  },
  { decision: 'FIX',   name: 'Prospecting — Video',     roas: '2.1x', action: 'Fix landing page',   color: L.fix,   bg: L.fixBg   },
  { decision: 'HOLD',  name: 'AOV Test — Carousel',     roas: '2.8x', action: 'Needs more data',    color: L.hold,  bg: L.holdBg  },
];

const STEPS = [
  {
    n: '01',
    title: 'Connect Meta',
    desc: 'Read-only OAuth in 60 seconds. We never touch your campaigns, budgets, or creative settings.',
  },
  {
    n: '02',
    title: 'Engine analyses every ad',
    desc: 'Each ad is scored against your portfolio benchmarks and DTC industry data across 4 key signals.',
  },
  {
    n: '03',
    title: 'Get your action plan',
    desc: 'Scale, kill, fix, or hold — a clear decision for every ad, with the data-backed reason behind it.',
  },
];

const DECISIONS_EXPLAINED = [
  {
    label: 'SCALE',
    title: 'Scale it',
    desc:  'ROAS above your account median with a positive trend. Increase budget 20–50% and let it run.',
    color: L.scale,
    bg:    L.scaleBg,
    icon:  <TrendingUp size={18} />,
  },
  {
    label: 'KILL',
    title: 'Kill it',
    desc:  'ROAS below 50% of your median and enough spend to be certain. Stop the bleeding — pause immediately.',
    color: L.kill,
    bg:    L.killBg,
    icon:  <TrendingDown size={18} />,
  },
  {
    label: 'FIX',
    title: 'Fix it',
    desc:  'A diagnosable issue: creative fatigue, landing page mismatch, or a weak hook killing your CTR.',
    color: L.fix,
    bg:    L.fixBg,
    icon:  <Wrench size={18} />,
  },
  {
    label: 'HOLD',
    title: 'Hold it',
    desc:  'Not enough data to act with confidence. Give it more runway before making a call.',
    color: L.hold,
    bg:    L.holdBg,
    icon:  <Minus size={18} />,
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: L.bg, color: L.text1, minHeight: '100vh' }}>

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav style={{
        background: L.bg,
        borderBottom: `1px solid ${L.border}`,
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1120, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60,
        }}>
          <span
            className="font-display"
            style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 700, color: L.text1, letterSpacing: '-0.02em' }}
          >
            Lumière
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link
              href="/"
              style={{ fontSize: 13, color: L.text2, textDecoration: 'none' }}
            >
              View dashboard →
            </Link>
            <Link
              href="/onboarding/connect"
              style={{
                fontSize: 13, fontWeight: 600, color: 'white',
                background: L.amber, borderRadius: 8, padding: '8px 18px',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              Analyze My Ads <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 24px 80px' }}>
        <div className="landing-hero-grid">

          {/* Left: copy */}
          <div>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32,
              background: L.amberLight, borderRadius: 100, padding: '6px 14px',
              fontSize: 11, fontWeight: 700, color: L.amberDark, letterSpacing: '0.05em',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: L.amber, display: 'block', flexShrink: 0 }} />
              FOR DTC BRANDS ON META ADS
            </div>

            {/* Headline */}
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(42px, 4.5vw, 62px)',
                lineHeight: 1.06,
                letterSpacing: '-0.03em',
                marginBottom: 24,
                fontWeight: 300,
              }}
            >
              You&apos;re burning money
              <br />
              <strong style={{ fontWeight: 900 }}>on ads that</strong>
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>don&apos;t work.</em>
            </h1>

            {/* Subline */}
            <p style={{ fontSize: 17, color: L.text2, lineHeight: 1.7, marginBottom: 40, maxWidth: 460 }}>
              Lumière analyzes your Meta performance in 60 seconds and gives you a clear action plan
              for every ad — scale, kill, fix, or hold.
            </p>

            {/* CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
              <Link
                href="/onboarding/connect"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: L.amber, color: 'white', fontWeight: 700, fontSize: 15,
                  padding: '14px 28px', borderRadius: 10, textDecoration: 'none',
                  boxShadow: '0 4px 24px rgba(217,119,6,0.3)',
                }}
              >
                Analyze My Ads Now
                <ArrowRight size={16} />
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                {['Read-only access', 'No credit card', '60-second setup'].map(t => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: L.text3 }}>
                    <CheckCircle size={12} style={{ color: L.scale, flexShrink: 0 }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: app mockup */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -16,
              background: 'linear-gradient(135deg, rgba(217,119,6,0.06), rgba(5,150,105,0.04))',
              borderRadius: 28, zIndex: 0,
            }} />

            <div style={{
              position: 'relative', zIndex: 1,
              background: 'white', borderRadius: 16,
              boxShadow: '0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
              border: `1px solid ${L.border}`,
              overflow: 'hidden',
            }}>
              {/* Browser chrome */}
              <div style={{ padding: '12px 14px', borderBottom: `1px solid ${L.border}`, display: 'flex', alignItems: 'center', gap: 10, background: '#FAFAF8' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#FCA5A5', '#FDE68A', '#86EFAC'].map(c => (
                    <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, display: 'block' }} />
                  ))}
                </div>
                <div style={{ flex: 1, height: 24, background: L.border, borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                  <span style={{ fontSize: 10, color: L.text3, fontFamily: 'monospace' }}>app.lumiere.ai/dashboard</span>
                </div>
              </div>

              {/* Daily brief header */}
              <div style={{ padding: '10px 16px', borderBottom: `1px solid ${L.border}`, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.03)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', display: 'block', animation: 'glow-pulse 2s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#7c3aed' }}>Daily Brief · 15 ads analysed · Meta</span>
              </div>

              {/* Decision rows */}
              {MOCK_DECISIONS.map((d, i) => (
                <div
                  key={d.decision}
                  style={{
                    padding: '11px 16px',
                    borderBottom: i < MOCK_DECISIONS.length - 1 ? `1px solid ${L.border}` : 'none',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
                    color: d.color, background: d.bg,
                    padding: '3px 8px', borderRadius: 4,
                    minWidth: 44, textAlign: 'center', flexShrink: 0,
                  }}>
                    {d.decision}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: L.text1, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</p>
                    <p style={{ fontSize: 11, color: L.text3, margin: 0 }}>{d.action}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: d.color, flexShrink: 0 }}>{d.roas}</span>
                </div>
              ))}

              {/* Share row */}
              <div style={{ padding: '10px 16px', background: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                <span style={{ fontSize: 11, color: L.amber, fontWeight: 600, cursor: 'pointer' }}>Share report →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT STRIP ───────────────────────────────────────────── */}
      <section style={{ background: L.dark, padding: '56px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }} className="landing-stats-grid">
          {[
            { number: '34%',    label: 'of ad spend wasted',        sub: 'on average by DTC brands' },
            { number: '60s',    label: 'to get your full analysis',  sub: 'after connecting Meta' },
            { number: '€8,400', label: 'average savings found',      sub: 'per month per account' },
          ].map(s => (
            <div key={s.number}>
              <div className="font-display" style={{ fontSize: 52, fontWeight: 900, color: L.amberMid, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {s.number}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10, color: 'white' }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', borderBottom: `1px solid ${L.border}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ marginBottom: 60 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: L.amber, marginBottom: 14, textTransform: 'uppercase' }}>
              HOW IT WORKS
            </p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              From connected to confident
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>in three steps.</em>
            </h2>
          </div>

          <div className="landing-steps-grid">
            {STEPS.map(s => (
              <div key={s.n} style={{ padding: '32px', background: L.surface, border: `1px solid ${L.border}`, borderRadius: 16 }}>
                <div className="font-display" style={{ fontSize: 52, fontWeight: 900, color: L.amberMid, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 20 }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: L.text1 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: L.text2, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DECISION SYSTEM ──────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: L.surfaceSubtle }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ marginBottom: 60 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: L.amber, marginBottom: 14, textTransform: 'uppercase' }}>
              THE DECISION ENGINE
            </p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Four decisions.
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>No ambiguity.</em>
            </h2>
          </div>

          <div className="landing-decisions-grid">
            {DECISIONS_EXPLAINED.map(d => (
              <div
                key={d.label}
                style={{
                  background: L.surface,
                  border: `1px solid ${L.border}`,
                  borderTop: `3px solid ${d.color}`,
                  borderRadius: 12,
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: d.bg, color: d.color, flexShrink: 0,
                  }}>
                    {d.icon}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: d.color }}>{d.label}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: L.text1 }}>{d.title}</h3>
                <p style={{ fontSize: 13, color: L.text2, lineHeight: 1.65, margin: 0 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', textAlign: 'center', borderTop: `1px solid ${L.border}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(36px, 4vw, 54px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 20 }}
          >
            Stop guessing.
            <br />
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Start winning.</em>
          </h2>
          <p style={{ fontSize: 16, color: L.text2, marginBottom: 40, lineHeight: 1.6 }}>
            Connect your Meta account. Get your first analysis in 60 seconds.
            <br />No credit card. No commitment.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Link
              href="/onboarding/connect"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: L.amber, color: 'white', fontWeight: 700, fontSize: 16,
                padding: '16px 36px', borderRadius: 12, textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(217,119,6,0.25)',
              }}
            >
              Analyze My Ads Now
              <ArrowRight size={18} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Read-only Meta access', 'No credit card', '60-second setup'].map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: L.text3 }}>
                  <CheckCircle size={13} style={{ color: L.scale, flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ padding: '24px', borderTop: `1px solid ${L.border}`, background: L.dark }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span className="font-display" style={{ fontSize: 16, fontStyle: 'italic', fontWeight: 700, color: 'white' }}>Lumière</span>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>© 2026 Lumière · Ad Intelligence for DTC Brands</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}