import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { brand, fonts, FPS } from '../theme';

type Orientation = 'vertical' | 'horizontal';

interface Props {
  orientation:   Orientation;
  wastedAmount:  number;
  totalSpend:    number;
  dashboardSrc:  string;
  decisionsSrc:  string;
  landingSrc:    string;
}

/* ─── Scene timings (frames @ 30fps) ─────────────────────────────────
 *  Hook        0  – 60   (2.0s)  "You're spending €43k/mo on Meta"
 *  Reveal     60  – 240  (6.0s)  "€18,400 of it is wasted"
 *  Proof     240  – 360  (4.0s)  Real dashboard footage + KILL badges
 *  HowItWorks 360 – 450  (3.0s)  3-step framework
 *  CTA       450  – 540  (3.0s)  Logo + tagline + URL
 *  TOTAL: 540 frames = 18 seconds
 * ──────────────────────────────────────────────────────────────────── */

const TIMINGS = {
  hook:    { from: 0,   duration: 60 },
  reveal:  { from: 60,  duration: 180 },
  proof:   { from: 240, duration: 120 },
  how:     { from: 360, duration: 90  },
  cta:     { from: 450, duration: 90  },
};

export const WasteReveal: React.FC<Props> = (props) => {
  const isV = props.orientation === 'vertical';

  return (
    <AbsoluteFill style={{
      background:  brand.bg,
      fontFamily:  fonts.body,
      color:       brand.text1,
      overflow:    'hidden',
    }}>
      {/* Subtle warm noise/grain via radial gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, transparent 0%, rgba(217,119,6,0.04) 100%)`,
        pointerEvents: 'none',
      }} />

      <Sequence from={TIMINGS.hook.from}    durationInFrames={TIMINGS.hook.duration}>
        <Hook total={props.totalSpend} isV={isV} />
      </Sequence>

      <Sequence from={TIMINGS.reveal.from}  durationInFrames={TIMINGS.reveal.duration}>
        <Reveal wasted={props.wastedAmount} isV={isV} />
      </Sequence>

      <Sequence from={TIMINGS.proof.from}   durationInFrames={TIMINGS.proof.duration}>
        <Proof
          dashboardSrc={props.dashboardSrc}
          decisionsSrc={props.decisionsSrc}
          isV={isV}
        />
      </Sequence>

      <Sequence from={TIMINGS.how.from}     durationInFrames={TIMINGS.how.duration}>
        <HowItWorks isV={isV} />
      </Sequence>

      <Sequence from={TIMINGS.cta.from}     durationInFrames={TIMINGS.cta.duration}>
        <CTA isV={isV} />
      </Sequence>

      {/* Persistent footer logo for last 60% of video */}
      <Sequence from={TIMINGS.reveal.from}>
        <FooterLogo isV={isV} />
      </Sequence>
    </AbsoluteFill>
  );
};

/* ─── Scene 1: Hook ──────────────────────────────────────────────── */
const Hook: React.FC<{ total: number; isV: boolean }> = ({ total, isV }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [50, 60], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  const eyebrowSpring = spring({ frame, fps, config: { damping: 14 } });
  const numberSpring  = spring({ frame: frame - 6, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{
      alignItems:     'center',
      justifyContent: 'center',
      padding:        isV ? 80 : 120,
      opacity,
      textAlign:      'center',
    }}>
      <div style={{
        fontSize:      isV ? 24 : 22,
        color:         brand.amber,
        fontWeight:    700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom:  isV ? 36 : 28,
        opacity:       eyebrowSpring,
      }}>
        For DTC brands on Meta
      </div>

      <div style={{
        fontSize:      isV ? 64 : 72,
        fontFamily:    fonts.display,
        fontWeight:    300,
        color:         brand.text1,
        lineHeight:    1.05,
        letterSpacing: '-0.03em',
        maxWidth:      isV ? 900 : 1400,
        transform:     `translateY(${(1 - numberSpring) * 24}px)`,
        opacity:       numberSpring,
      }}>
        You&apos;re spending{' '}
        <strong style={{ fontWeight: 900 }}>€{total.toLocaleString()}</strong>
        <br />
        <em style={{ fontStyle: 'italic', fontWeight: 300 }}>a month</em> on Meta ads.
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Reveal ────────────────────────────────────────────── */
const Reveal: React.FC<{ wasted: number; isV: boolean }> = ({ wasted, isV }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Question fades up first (frames 0-30)
  const qOpacity   = interpolate(frame, [0, 12, 90, 110], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  // Number counts up over frames 30-90
  const countProgress = interpolate(frame, [30, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const easedProgress = 1 - Math.pow(1 - countProgress, 3); // ease-out cubic
  const displayValue  = Math.round(easedProgress * wasted);

  // Number scale-pop on entry
  const numberScale   = spring({ frame: frame - 30, fps, config: { damping: 9, mass: 0.6 } });
  // Hold at full scale; gentle settle
  const numberOpacity = interpolate(frame, [30, 50, 165, 180], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  // Tagline below
  const taglineOpacity = interpolate(frame, [95, 115, 165, 180], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  // Pulse glow on the kill color
  const pulse = (Math.sin(frame * 0.18) + 1) * 0.5;

  return (
    <AbsoluteFill style={{
      alignItems:     'center',
      justifyContent: 'center',
      padding:        isV ? 60 : 100,
      textAlign:      'center',
    }}>
      <div style={{
        fontSize:      isV ? 40 : 44,
        fontFamily:    fonts.display,
        fontStyle:     'italic',
        fontWeight:    300,
        color:         brand.text2,
        marginBottom:  isV ? 40 : 32,
        opacity:       qOpacity,
        letterSpacing: '-0.02em',
      }}>
        How much of it is <span style={{ color: brand.text1, fontWeight: 700, fontStyle: 'normal' }}>wasted</span>?
      </div>

      <div style={{
        fontSize:      isV ? 220 : 280,
        fontFamily:    fonts.display,
        fontWeight:    900,
        color:         brand.kill,
        lineHeight:    0.95,
        letterSpacing: '-0.04em',
        fontVariantNumeric: 'tabular-nums',
        textShadow:    `0 0 ${40 + pulse * 40}px rgba(220,38,38,${0.10 + pulse * 0.10})`,
        transform:     `scale(${0.6 + numberScale * 0.4})`,
        opacity:       numberOpacity,
      }}>
        €{displayValue.toLocaleString()}
      </div>

      <div style={{
        fontSize:      isV ? 32 : 28,
        fontWeight:    600,
        color:         brand.text1,
        marginTop:     isV ? 32 : 28,
        opacity:       taglineOpacity,
        letterSpacing: '-0.01em',
      }}>
        wasted on dead ads —{' '}
        <span style={{ color: brand.text3, fontWeight: 400 }}>every month.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Proof ─────────────────────────────────────────────── */
const Proof: React.FC<{
  dashboardSrc: string;
  decisionsSrc: string;
  isV: boolean;
}> = ({ dashboardSrc, decisionsSrc, isV }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpring = spring({ frame, fps, config: { damping: 12 } });
  const headlineOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headlineOpacity = Math.min(headlineSpring, headlineOut);

  // Screenshot 1 enters frame 10, exits frame 60
  const shot1In  = spring({ frame: frame - 10, fps, config: { damping: 14, mass: 0.8 } });
  const shot1Out = interpolate(frame, [55, 70], [0, 1], { extrapolateRight: 'clamp' });
  const shot1Off = interpolate(frame, [55, 70], [1, 0], { extrapolateRight: 'clamp' });

  // Screenshot 2 enters frame 60
  const shot2In  = spring({ frame: frame - 60, fps, config: { damping: 14, mass: 0.8 } });
  const shot2Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      alignItems:     'center',
      justifyContent: 'center',
      padding:        isV ? 60 : 80,
    }}>
      <div style={{
        fontSize:      isV ? 36 : 32,
        fontFamily:    fonts.display,
        fontWeight:    700,
        color:         brand.text1,
        marginBottom:  isV ? 32 : 28,
        textAlign:     'center',
        letterSpacing: '-0.02em',
        opacity:       headlineOpacity,
        transform:     `translateY(${(1 - headlineSpring) * 12}px)`,
        maxWidth:      isV ? 900 : 1200,
      }}>
        Lumière finds the dead ads in <span style={{ color: brand.amber }}>60 seconds.</span>
      </div>

      <div style={{
        position:  'relative',
        width:     isV ? 940 : 1500,
        height:    isV ? 1100 : 700,
      }}>
        {/* Screenshot 1: dashboard with KILL/SCALE list */}
        <div style={{
          position:  'absolute',
          inset:     0,
          opacity:   shot1In * shot1Off,
          transform: `translateY(${(1 - shot1In) * 32}px) scale(${0.96 + shot1In * 0.04})`,
        }}>
          <Frame src={dashboardSrc} isV={isV} />
        </div>

        {/* Screenshot 2: decisions list */}
        <div style={{
          position:  'absolute',
          inset:     0,
          opacity:   shot2In * shot2Out,
          transform: `translateY(${(1 - shot2In) * 32}px) scale(${0.96 + shot2In * 0.04})`,
        }}>
          <Frame src={decisionsSrc} isV={isV} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Frame: React.FC<{ src: string; isV: boolean }> = ({ src, isV }) => (
  <div style={{
    width:        '100%',
    height:       '100%',
    borderRadius: isV ? 28 : 18,
    overflow:     'hidden',
    border:       `1px solid ${brand.border}`,
    boxShadow:    '0 30px 80px rgba(26,25,23,0.18), 0 8px 24px rgba(26,25,23,0.10)',
    background:   brand.surface,
  }}>
    <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  </div>
);

/* ─── Scene 4: How It Works ──────────────────────────────────────── */
const HowItWorks: React.FC<{ isV: boolean }> = ({ isV }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { n: '01', title: 'Connect Meta',           desc: 'Read-only OAuth in 60 seconds.' },
    { n: '02', title: 'We analyse every ad',    desc: 'Scored vs. your benchmarks + DTC industry data.' },
    { n: '03', title: 'Get your action plan',   desc: 'Scale · Kill · Fix · Hold — every ad, every day.' },
  ];

  const headerSpring = spring({ frame, fps, config: { damping: 12 } });
  const fadeOut = interpolate(frame, [78, 90], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      alignItems:     'center',
      justifyContent: 'center',
      padding:        isV ? 80 : 100,
      opacity:        fadeOut,
    }}>
      <div style={{
        fontSize:      isV ? 26 : 22,
        color:         brand.amber,
        fontWeight:    700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        marginBottom:  isV ? 24 : 18,
        opacity:       headerSpring,
      }}>
        How it works
      </div>

      <div style={{
        fontSize:      isV ? 48 : 56,
        fontFamily:    fonts.display,
        fontWeight:    500,
        color:         brand.text1,
        marginBottom:  isV ? 60 : 48,
        textAlign:     'center',
        letterSpacing: '-0.02em',
        opacity:       headerSpring,
        transform:     `translateY(${(1 - headerSpring) * 16}px)`,
      }}>
        Three steps to clarity
      </div>

      <div style={{
        display:       'flex',
        flexDirection: isV ? 'column' : 'row',
        gap:           isV ? 32 : 40,
        width:         isV ? 800 : 1500,
      }}>
        {steps.map((step, i) => {
          const stepSpring = spring({ frame: frame - 12 - i * 8, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{
              flex:           1,
              padding:        isV ? '24px 28px' : 32,
              borderRadius:   16,
              background:     brand.surface,
              border:         `1px solid ${brand.border}`,
              opacity:        stepSpring,
              transform:      `translateY(${(1 - stepSpring) * 20}px)`,
              boxShadow:      '0 4px 16px rgba(26,25,23,0.04)',
            }}>
              <div style={{
                fontSize:      isV ? 56 : 64,
                fontWeight:    300,
                fontFamily:    fonts.display,
                color:         brand.amber,
                lineHeight:    0.9,
                letterSpacing: '-0.03em',
                marginBottom:  isV ? 12 : 16,
              }}>
                {step.n}
              </div>
              <div style={{ fontSize: isV ? 24 : 26, fontWeight: 700, color: brand.text1, marginBottom: 6 }}>
                {step.title}
              </div>
              <div style={{ fontSize: isV ? 18 : 19, color: brand.text2, lineHeight: 1.4 }}>
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 5: CTA ───────────────────────────────────────────────── */
const CTA: React.FC<{ isV: boolean }> = ({ isV }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring  = spring({ frame, fps, config: { damping: 12 } });
  const lineSpring = spring({ frame: frame - 12, fps, config: { damping: 12 } });
  const ctaSpring  = spring({ frame: frame - 28, fps, config: { damping: 10, mass: 0.8 } });

  return (
    <AbsoluteFill style={{
      alignItems:     'center',
      justifyContent: 'center',
      padding:        isV ? 60 : 100,
      textAlign:      'center',
    }}>
      <div style={{
        fontSize:      isV ? 64 : 88,
        fontFamily:    fonts.display,
        fontWeight:    300,
        color:         brand.text1,
        lineHeight:    1.05,
        letterSpacing: '-0.03em',
        marginBottom:  isV ? 40 : 32,
        opacity:       tagSpring,
        transform:     `translateY(${(1 - tagSpring) * 16}px)`,
      }}>
        Stop guessing.
        <br />
        <em style={{ fontStyle: 'italic', fontWeight: 700 }}>Start deciding.</em>
      </div>

      <div style={{
        fontSize:      isV ? 24 : 22,
        color:         brand.text2,
        marginBottom:  isV ? 48 : 40,
        maxWidth:      isV ? 700 : 800,
        opacity:       lineSpring,
      }}>
        Read-only · No credit card · 60-second setup
      </div>

      <div style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           14,
        padding:       isV ? '22px 44px' : '20px 40px',
        borderRadius:  16,
        background:    `linear-gradient(135deg, ${brand.amber}, ${brand.amberDeep})`,
        color:         'white',
        fontWeight:    700,
        fontSize:      isV ? 30 : 26,
        boxShadow:     `0 12px 40px rgba(217,119,6,0.40)`,
        opacity:       ctaSpring,
        transform:     `scale(${0.85 + ctaSpring * 0.15})`,
      }}>
        lumiere.app  →
      </div>
    </AbsoluteFill>
  );
};

/* ─── Persistent footer with brand logo ─────────────────────────── */
const FooterLogo: React.FC<{ isV: boolean }> = ({ isV }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      alignItems:     'center',
      justifyContent: 'flex-end',
      paddingBottom:  isV ? 60 : 40,
      pointerEvents:  'none',
      opacity,
    }}>
      <div style={{
        display:     'flex',
        alignItems:  'center',
        gap:         12,
      }}>
        <div style={{
          width:        isV ? 36 : 30,
          height:       isV ? 36 : 30,
          borderRadius: 8,
          background:   `linear-gradient(135deg, ${brand.amber}, ${brand.amberDeep})`,
          display:      'flex',
          alignItems:   'center',
          justifyContent:'center',
          color:        'white',
          fontFamily:   fonts.display,
          fontStyle:    'italic',
          fontWeight:   900,
          fontSize:     isV ? 22 : 18,
        }}>L</div>
        <div style={{
          fontFamily:    fonts.display,
          fontStyle:     'italic',
          fontWeight:    700,
          fontSize:      isV ? 26 : 22,
          color:         brand.text1,
          letterSpacing: '-0.01em',
        }}>
          Lumière
        </div>
      </div>
    </AbsoluteFill>
  );
};
