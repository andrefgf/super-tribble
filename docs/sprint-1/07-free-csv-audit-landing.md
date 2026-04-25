# Feature 07 — Free CSV Audit Landing Page

**Sprint:** 1 **Effort:** 2 days **Demo impact:** 🔥🔥 (top-of-funnel growth)
**Depends on:** Feature 01, 02 **Blocks:** none

---

## Context

Sprint 1 features 01–06 create a great experience for prospects who agreed to a demo. But getting them to that demo is the bottleneck.

This feature builds a **public, no-signup landing page** that anyone can use to audit their Meta Ads account in 60 seconds. They upload a CSV → they see their wasted spend. Then we capture their email and pitch them the paid plan.

This is the **top-of-funnel growth engine**:

- Doubles as content-marketing fuel: *"We audited 50 DTC brands and found they waste 34% of their Meta budget on average"*
- Powers cold outreach: *"I ran your competitor through our audit — they're wasting €4k/mo. Want to see yours?"*
- Lets prospects self-serve before any sales call (saves time, qualifies leads)

---

## Goal

A standalone marketing page at `/audit` (no sidebar, no signup gate) that:

1. Pitches the value: *"How much of your Meta budget is wasted?"*
2. Accepts a CSV upload
3. Shows the Money Wasted reveal (Feature 01) inline
4. Shows the dashboard preview, blurred-or-cropped, with a CTA: *"See the full breakdown — start your 14-day free trial"*
5. Captures email before showing the full dashboard (soft gate, optional)

The page should look like a **landing page**, not an app page. Different layout, marketing-flavored copy, big hero, social proof if available.

---

## Files to create / modify

### CREATE
- `src/app/audit/page.tsx` — the marketing landing page (full-screen, no sidebar)
- `src/app/audit/layout.tsx` — minimal layout, similar to onboarding (no sidebar)
- `src/app/audit/result/page.tsx` — the result page (Money Wasted + preview + email capture)
- `src/components/AuditUploader.tsx` — CSV upload box with drag-drop
- `src/components/EmailCaptureModal.tsx` — soft email capture before reveal

### MODIFY
- None — this is a fresh route group

### REFERENCE
- `src/app/api/import/csv/route.ts` — same CSV processing endpoint
- `src/app/onboarding/connect/page.tsx` — borrow CSV upload UI patterns
- `src/lib/forecast.ts` (Feature 04)

---

## Page layout: `/audit`

### Hero

```
┌────────────────────────────────────────────────────────────┐
│  [Lumière logo]                          [Sign in / Pricing]│
│                                                            │
│                                                            │
│         How much of your Meta Ads budget                   │
│              is going to waste?                            │
│                                                            │
│       Get a free audit in 60 seconds.                      │
│       No login. No credit card. Just the truth.            │
│                                                            │
│                                                            │
│       ┌──────────────────────────────────────────────┐     │
│       │                                              │     │
│       │   📤  Drop your Meta Ads CSV here            │     │
│       │       — or click to upload                   │     │
│       │                                              │     │
│       │   [How to export your CSV ↓]                 │     │
│       └──────────────────────────────────────────────┘     │
│                                                            │
│                                                            │
│  ✓ Free forever — no credit card                           │
│  ✓ Your data never leaves your browser unencrypted         │
│  ✓ Average brand wastes 34% of their Meta budget           │
└────────────────────────────────────────────────────────────┘
```

### Below-the-fold sections (lighter touch)

- "How it works" — 3 steps with icons (Upload → Analyse → See results)
- "What you'll learn" — bullet list of insights (which ads to kill, money wasted, ROI uplift if fixed)
- "How to export your Meta CSV" — collapsible accordion with screenshots/steps
- Social proof if available (logos, quotes — placeholder if none yet)
- Footer: pricing, FAQ link, contact

Don't overbuild. A landing page that's 90% upload box and 10% "trust signals" converts best.

---

## Page layout: `/audit/result`

After CSV upload, redirect to (or transition to) `/audit/result`.

### Top — full Money Wasted reveal (reuse Feature 01)

Same dramatic reveal: big number, worst offenders list.

### Middle — soft email gate

```
┌──────────────────────────────────────────────────────────┐
│  Want the full breakdown?                                │
│                                                          │
│  Get the complete list of decisions, projected uplift,   │
│  and reallocation plan — sent to your email.             │
│                                                          │
│  ┌────────────────────────────────────┐                  │
│  │ you@company.com                    │  [ Send → ]      │
│  └────────────────────────────────────┘                  │
│                                                          │
│  No spam. Unsubscribe anytime. We'll also email you      │
│  weekly audits if you connect your Meta account.         │
└──────────────────────────────────────────────────────────┘
```

On submit:
- POST to `/api/audit/lead` (new endpoint)
- Show full preview (Feature 02 dashboard view in iframe or inline)
- Trigger email send (or queue it — actual email sending is Sprint 2; logging is fine for v1)

**Important:** the email gate is **soft** — there's a "Skip and see now →" link below it. Don't lose users to friction. The lead capture is a bonus, not a requirement.

### Bottom — preview + CTA

```
┌──────────────────────────────────────────────────────────┐
│   [Dashboard preview — slightly blurred, with overlay]   │
│                                                          │
│   ╔══════════════════════════════════════════════════╗   │
│   ║                                                  ║   │
│   ║   This is your full dashboard.                   ║   │
│   ║                                                  ║   │
│   ║   Get fresh decisions every day,                 ║   │
│   ║   in Slack and email.                            ║   │
│   ║                                                  ║   │
│   ║   €499/month. 14-day free trial.                 ║   │
│   ║                                                  ║   │
│   ║   [ Start your free trial → ]                    ║   │
│   ║                                                  ║   │
│   ╚══════════════════════════════════════════════════╝   │
└──────────────────────────────────────────────────────────┘
```

The "Skip and see now" link goes directly to `/` with the data persisted (same flow as the rest of the app). The pitch overlay sits on top of `/` until the user dismisses it.

---

## Lead capture API

### `POST /api/audit/lead`

**Request:**
```ts
{
  email: string;
  wastedAmount: number;   // for personalised follow-up
  killAdsCount: number;
  vertical?: string;
}
```

**Response:**
```ts
{ ok: true }
```

**Implementation:**

1. Validate email (basic regex)
2. Insert into Supabase `audit_leads` table:
   ```sql
   create table audit_leads (
     id uuid primary key default gen_random_uuid(),
     email text not null,
     wasted_amount numeric,
     kill_ads_count integer,
     vertical text,
     created_at timestamptz default now()
   );
   ```
3. (Optional Sprint 2) Trigger email via Resend/SendGrid

For v1, just insert. Email automation is Sprint 2.

---

## Acceptance criteria

- [ ] `/audit` route loads without sidebar (separate layout)
- [ ] Hero is clear, conversion-focused, mobile-friendly
- [ ] CSV uploader works (drag-drop + click-to-browse)
- [ ] Invalid CSVs show friendly error: *"This doesn't look like a Meta Ads export — try [these formats]"*
- [ ] Successful upload → redirect to `/audit/result`
- [ ] Money Wasted reveal renders identically to Feature 01
- [ ] Email capture form works and inserts to Supabase
- [ ] "Skip and see now" link is clearly available — never trap users
- [ ] Dashboard preview/CTA appears at the bottom
- [ ] CTA navigates to `/onboarding` for the trial signup flow
- [ ] Page works in incognito (no auth assumptions)
- [ ] Page is reasonably fast (< 2s First Contentful Paint)
- [ ] `npx tsc --noEmit` passes

---

## Marketing copy guidelines

The voice is **direct and slightly provocative**, not corporate. Examples:

✅ *"How much of your Meta budget is going to waste?"*
✅ *"The average brand wastes 34% of their ad spend. We'll show you yours in 60 seconds."*
✅ *"No login. No credit card. Just the truth."*

❌ *"Discover insights about your advertising performance"*
❌ *"Our AI-powered platform leverages cutting-edge..."*
❌ *"Schedule a demo today"*

The buyer is sceptical and busy. They've seen 50 dashboards. Cut through with directness.

---

## Out of scope

- ❌ Real email sending (just capture for now)
- ❌ A/B testing of headlines (build it; iterate on data)
- ❌ Live chat widget
- ❌ "Connect Meta directly" path (CSV only on this page — Meta OAuth lives in `/onboarding`)
- ❌ Multi-language support

---

## Test plan

1. Open `/audit` in incognito → confirm no auth needed, no sidebar
2. Upload sample Meta CSV → confirm redirect to `/audit/result`
3. Confirm Money Wasted reveal works
4. Submit email → confirm row appears in `audit_leads` table
5. Click "Skip and see now" → confirm dashboard loads with persisted data
6. Click "Start your free trial" → confirm navigation to `/onboarding`
7. Try uploading an invalid file (a .txt or wrong-format CSV) → confirm friendly error
8. Mobile (375px) → confirm hero, uploader, and result page work
9. Check Page Source — confirm SEO basics (meta description, og:image, title)

---

## SEO + meta tags (don't forget)

This page is the homepage of your top-of-funnel growth. Get the meta tags right:

```tsx
export const metadata = {
  title: 'How much Meta Ads spend are you wasting? | Free 60-second audit',
  description: 'Upload your Meta Ads CSV and we will show you which ads to kill, scale, and fix. No login. Free forever.',
  openGraph: {
    title: 'Free Meta Ads Audit — see your wasted spend in 60 seconds',
    description: 'Most brands waste 34% of their Meta budget. We will show you yours.',
    images: ['/og-audit.png'],  // create a 1200x630 image
  },
};
```

OG image creation is a stretch goal — placeholder is fine for v1.
