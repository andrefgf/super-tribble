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
              <Link
                href="/"
                style={{ fontSize: 13, color: L.text3, textDecoration: 'none', marginTop: 4 }}
              >
                Or explore demo data →
              </Link>
            </div>
          </div>

          {/* Right: app mockup */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                background: L.surface,
                border: `1px solid ${L.border}`,
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 20px 60px rgba(26,25,23,0.1)',
              }}
            >
              <div style={{ background: L.surfaceSubtle, borderRadius: 8, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                  <p style={{ fontSize: 13, color: L.text3 }}>App preview</p>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${L.border}`, display: 'flex', justifyContent: 'space-around', fontSize: 11, color: L.text3 }}>
                <span>Desktop</span>
                <span>Mobile</span>
                <span>Tablet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section style={{ background: L.surface, borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ marginBottom: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: L.amber, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8 }}>
              HOW IT WORKS
            </p>
            <h2 style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.1, color: L.text1, letterSpacing: '-0.02em' }}>
              Three steps to clarity
            </h2>
          </div>

          <div className="landing-steps-grid">
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                  fontSize: 48, fontWeight: 300, color: L.amber,
                  lineHeight: 0.8, letterSpacing: '-0.03em',
                }}>
                  {step.n}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: L.text1, marginBottom: 8 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 15, color: L.text2, lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DECISIONS ENGINE ──────────────────────────────────────── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: 60, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: L.amber, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8 }}>
            THE DECISION ENGINE
          </p>
          <h2 style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.1, color: L.text1, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Every ad gets one of four decisions
          </h2>
          <p style={{ fontSize: 15, color: L.text2, margin: '0 auto', maxWidth: 480, lineHeight: 1.6 }}>
            Your entire portfolio is analyzed against benchmarks and industry data. Clear, actionable, definitive.
          </p>
        </div>

        <div className="landing-decisions-grid">
          {DECISIONS_EXPLAINED.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, background: d.bg, borderRadius: 12, border: `1px solid ${L.border}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: d.color }}>
                  {d.icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: d.color, letterSpacing: '0.08em' }}>{d.label}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: L.text1, marginBottom: 6 }}>
                  {d.title}
                </h3>
                <p style={{ fontSize: 14, color: L.text2, lineHeight: 1.6 }}>
                  {d.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DECISION EXAMPLE ──────────────────────────────────────── */}
      <section style={{ background: L.surface, borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ marginBottom: 60, textAlign: 'center' }}>
            <h2 style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.1, color: L.text1, letterSpacing: '-0.02em' }}>
              Real example: your top decisions today
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_DECISIONS.map((m, i) => (
              <div key={i} style={{ background: m.bg, border: `1px solid ${L.border}`, borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: m.color, letterSpacing: '0.08em' }}>{m.decision}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: L.text1 }}>{m.name}</span>
                  </div>
                  <p style={{ fontSize: 13, color: L.text3 }}>ROAS {m.roas}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: m.color, minWidth: 160, textAlign: 'right' }}>{m.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.1, color: L.text1, letterSpacing: '-0.02em', marginBottom: 24 }}>
            Ready to stop wasting money?
          </h2>
          <p style={{ fontSize: 17, color: L.text2, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Start analysing in 60 seconds. Read-only access, no credit card required.
          </p>
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
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ background: L.dark, color: '#FFF', borderTop: `1px solid rgba(255,255,255,0.1)` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
          <span>© 2024 Lumière. All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#" style={{ color: '#FFF', textDecoration: 'none', opacity: 0.7 }}>Terms</a>
            <a href="#" style={{ color: '#FFF', textDecoration: 'none', opacity: 0.7 }}>Privacy</a>
            <a href="#" style={{ color: '#FFF', textDecoration: 'none', opacity: 0.7 }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}