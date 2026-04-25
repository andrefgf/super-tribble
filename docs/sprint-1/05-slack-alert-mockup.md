# Feature 05 — Slack-Style Alert Mockup

**Sprint:** 1 **Effort:** 1 day **Demo impact:** 🔥🔥
**Depends on:** none **Blocks:** none

---

## Context

The Lumière sales pitch leans heavily on *"we come to you — we don't make you log into another dashboard."* The flagship channel for that pitch is Slack: every morning, the customer gets a briefing in Slack with the day's decisions, and they approve KILL/SCALE actions directly from a button in the message.

**The real Slack integration is Sprint 3+ work (uses Bolt SDK, OAuth flow, webhook handling, complex).**

This feature builds a **convincing visual mockup** of the Slack experience — a styled component we render on the dashboard during demos. It's not functional. It's a sales prop. And it's enough to land the pitch.

---

## Goal

A `<SlackAlertMock />` component that visually replicates a Slack message with Lumière's morning briefing. Place it on the dashboard with a heading like *"Coming soon: morning briefings in Slack — every day at 9am."*

The mock must look genuine — same typography, spacing, and button styling as actual Slack message blocks. A prospect glancing at it should think *"oh nice, that's how it'll look."*

---

## Files to create / modify

### CREATE
- `src/components/SlackAlertMock.tsx` — the styled mock component
- `src/components/SlackAlertSection.tsx` — wrapper with heading + opt-in form

### MODIFY
- `src/app/(app)/page.tsx` — render `<SlackAlertSection />` near the bottom of the dashboard, above any footer

---

## Visual reference

A real Slack message looks like this:

```
┌───────────────────────────────────────────────────────────┐
│  [L]  Lumière  APP  9:01 AM                               │
│                                                           │
│  ☀️ Good morning, Andre. Here's your daily briefing.      │
│                                                           │
│  Yesterday you spent €1,247 across 14 active ads.         │
│  3 ads need a decision today.                             │
│                                                           │
│  ▸ 🔴 KILL    Founder Story 30s                           │
│      ROAS 0.4x · €340 wasted this week · HIGH confidence  │
│      [ ✅ Pause now ]  [ ❌ Keep running ]  [ 💤 Snooze ]  │
│                                                           │
│  ▸ 🟢 SCALE   Summer Glow UGC v3                          │
│      ROAS 4.1x · trending up · scale +30%?                │
│      [ ✅ Approve ]  [ ❌ Skip ]                           │
│                                                           │
│  ▸ 🟡 FIX     Retargeting Cart Abandon                    │
│      High CTR (3.2%), CVR collapsed to 0.4%               │
│      [ See details ]                                      │
│                                                           │
│  Total potential savings today: €430 →                    │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Slack visual design notes (replicate accurately)

- Background: `#1A1D21` (Slack dark bg)
- Message container: `#222529`, rounded-lg, padding-4
- App icon: 36x36 rounded square with gradient (Lumière purple) + white "L"
- App name: bold white, "APP" badge in `#5C5C5C` text on `#383838` bg
- Timestamp: 12px gray
- Body text: 15px, `#D1D2D3`, line-height 1.5
- Section dividers: thin `#2C2D30` line
- Buttons: Slack's actual button style:
  - Primary: `#007A5A` (Slack green) for SCALE/Pause
  - Default: `#222529` with `#5C5C5C` border
  - Padding: `8px 14px`, font-weight 700, font-size 14px
  - Rounded-md, hover state lightens 10%

Use system font stack to match Slack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial`

### The wrapper section

Above the mock:

```
┌────────────────────────────────────────────────────────┐
│  💬  COMING SOON                                       │
│                                                        │
│  Get your daily briefing in Slack                      │
│  Every morning at 9am, Lumière sends decisions         │
│  straight to your channel. Approve with one click.     │
│                                                        │
│  [ Notify me when this launches → ]                    │
│                                                        │
│  [Mock Slack message renders here]                     │
└────────────────────────────────────────────────────────┘
```

The "Notify me" button opens a simple modal asking for an email — this captures interest signal. Wire it to a Supabase `waitlist` table or just `console.log` for v1. Don't block on this.

---

## `SlackAlertMock` component API

Make it data-driven so it can be reused on different pages with different content:

```tsx
interface SlackAlertMockProps {
  account?: {
    name: string;          // "Andre"
    spendYesterday: number;
    activeAds: number;
  };
  decisions: Array<{
    verdict: 'KILL' | 'SCALE' | 'FIX';
    adName: string;
    reason: string;        // "ROAS 0.4x · €340 wasted this week · HIGH confidence"
    actions: Array<{ label: string; primary?: boolean }>;
  }>;
  totalSavings?: number;
}
```

For demo mode, populate with the user's real top 3 decisions from `useDataSource()`. Falls back to plausible defaults if no data.

---

## Acceptance criteria

- [ ] `<SlackAlertMock />` renders and visually resembles a Slack message
- [ ] Component accepts props and is data-driven (not hardcoded)
- [ ] When user is in CSV-uploaded mode, the mock pulls real top decisions
- [ ] When user is in seed mode, the mock shows representative seed data
- [ ] Section heading "Coming soon: get your daily briefing in Slack" is clear
- [ ] "Notify me" button opens a modal with email capture
- [ ] Email submission either inserts to a `waitlist` Supabase table OR `console.log`s (acceptable for v1)
- [ ] Mock renders correctly on mobile (scrollable horizontally if needed, OR collapsed to vertical button stack)
- [ ] Buttons inside the mock are NOT functional — they don't navigate or fire anything (they're decoration). Cursor stays as default, NOT pointer, to subtly signal non-interactivity.
- [ ] `npx tsc --noEmit` passes

---

## Out of scope

- ❌ Real Slack OAuth or Bolt SDK integration (Sprint 3+)
- ❌ Actual functional buttons in the mock
- ❌ Telegram or Teams variants (do Slack first, copy pattern later)
- ❌ Animation of message arriving (could be nice but not necessary)

---

## Stretch (only if time permits)

- A toggle above the mock: *"See Telegram version"* → swaps to a Telegram-styled mock. Same data, different visual. Doubles the demo impact for international prospects.

---

## Test plan

1. Open `/` → scroll to Slack section → confirm visually convincing mock
2. Resize to mobile (375px) → confirm graceful layout
3. Upload a CSV → confirm mock content updates with real top decisions
4. Click "Notify me" → confirm modal opens, email capture works (or logs)
5. Click any button inside the mock → confirm nothing happens (it's decoration)
6. Show to a friend who uses Slack daily — they should say "yeah, that looks like Slack"
