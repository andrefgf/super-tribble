import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const BASE  = process.env.BASE_URL ?? 'http://localhost:3000';
const OUT   = resolve(process.cwd(), 'public/marketing/screenshots');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const SHOTS = [
  // Vertical (9:16) — for Reels / TikTok / Shorts
  { url: '/onboarding',         file: 'landing-vertical.png',   width: 540, height: 960, scale: 2 },
  { url: '/reveal',             file: 'reveal-vertical.png',    width: 540, height: 960, scale: 2 },
  { url: '/',                   file: 'dashboard-vertical.png', width: 540, height: 960, scale: 2 },
  { url: '/decisions',          file: 'decisions-vertical.png', width: 540, height: 960, scale: 2 },

  // Horizontal (16:9) — for hero / YouTube / LinkedIn
  { url: '/onboarding',         file: 'landing-h.png',    width: 1280, height: 720, scale: 2 },
  { url: '/reveal',             file: 'reveal-h.png',     width: 1280, height: 720, scale: 2 },
  { url: '/',                   file: 'dashboard-h.png',  width: 1280, height: 720, scale: 2 },
  { url: '/decisions',          file: 'decisions-h.png',  width: 1280, height: 720, scale: 2 },
  { url: '/creatives',          file: 'creatives-h.png',  width: 1280, height: 720, scale: 2 },
  { url: '/onboarding/connect', file: 'connect-h.png',    width: 1280, height: 720, scale: 2 },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
});

for (const shot of SHOTS) {
  const ctx = await browser.newContext({
    viewport:           { width: shot.width, height: shot.height },
    deviceScaleFactor:  shot.scale,
  });
  const page = await ctx.newPage();
  console.log(`→ ${shot.url}  →  ${shot.file}`);
  await page.goto(BASE + shot.url, { waitUntil: 'networkidle', timeout: 30000 });
  // Wait for fonts and any animations to settle
  await page.waitForTimeout(1500);
  await page.screenshot({
    path:     resolve(OUT, shot.file),
    fullPage: false,
  });
  await ctx.close();
}

await browser.close();
console.log(`✓ Captured ${SHOTS.length} screenshots to ${OUT}`);
