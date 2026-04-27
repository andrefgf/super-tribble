import { Composition, staticFile } from 'remotion';
import { WasteReveal } from './compositions/WasteReveal';
import { FPS } from './theme';

const TOTAL_FRAMES = 18 * FPS; // 18 seconds

export const Root: React.FC = () => {
  return (
    <>
      {/* Vertical 9:16 — Reels / TikTok / Shorts */}
      <Composition
        id="waste-reveal-vertical"
        component={WasteReveal as React.FC}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          orientation: 'vertical' as const,
          wastedAmount: 18400,
          totalSpend: 43000,
          dashboardSrc: staticFile('marketing/screenshots/dashboard-vertical.png'),
          decisionsSrc: staticFile('marketing/screenshots/decisions-vertical.png'),
          landingSrc:   staticFile('marketing/screenshots/landing-vertical.png'),
        }}
      />

      {/* Horizontal 16:9 — Hero / YouTube / LinkedIn */}
      <Composition
        id="waste-reveal-horizontal"
        component={WasteReveal as React.FC}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          orientation: 'horizontal' as const,
          wastedAmount: 18400,
          totalSpend: 43000,
          dashboardSrc: staticFile('marketing/screenshots/dashboard-h.png'),
          decisionsSrc: staticFile('marketing/screenshots/decisions-h.png'),
          landingSrc:   staticFile('marketing/screenshots/landing-h.png'),
        }}
      />
    </>
  );
};
