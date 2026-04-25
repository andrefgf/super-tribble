# Feature 01 — Money Wasted Reveal Screen

**Sprint:** 1 **Effort:** 1 day **Demo impact:** 🔥🔥🔥 (highest)
**Depends on:** none **Blocks:** Feature 02

---

## Context

Lumière is a Meta Ads decisioning platform ($499/mo, targets small DTC teams + boutique agencies). Its decision engine classifies each ad as SCALE / KILL / FIX / HOLD with confidence ratings.

Today, the most powerful insight in the product — *"You are wasting €X on N ads that should have been killed"* — is buried as a small KPI card on the dashboard. Prospects scroll past it.

This feature creates a **dramatic full-screen reveal moment** that fires immediately after a CSV upload (or a mock-data demo trigger). It's the single most important demo moment in the product.

---

## Goal

After a prospect uploads their CSV (or clicks "Run demo" with mock data), they see a full-screen reveal:

- ONE big number: total € wasted in the last 30 days
- Subtitle: "across N ads that should have been killed"
- A short list of the top 3–5 worst offenders (ad name, € spent, ROAS)
- A single CTA button: "Show me the full breakdown" → navigates to the dashboard

The number must be **shocking but real** — calculated from the uploaded data using the existing decision engine.

---

## Files to create / modify

### CREATE
- `src/app/reveal/page.tsx` — the reveal screen route

### MODIFY
- `src/app/api/import/csv/route.ts` — return enough data to power the reveal (already returns `decisions` + `portfolioSummary`; verify shape)
- `src/app/onboarding/connect/page.tsx` — after CSV upload success, navigate to `/reveal` instead of showing inline results

### REFERENCE (do not modify)
- `src/lib/engine.ts` — `runDecisionEngine()` produces the verdicts
- `src/lib/types.ts` — `DecisionOutput`, `PortfolioSummary` shape
- `src/lib/seed.ts` — for fallback mock-data demo button

---

## Calculation: "money wasted"

Sum of `spend` across all ads where `decision === 'KILL'`, over the last 30 days of data.

```ts
const wasted = decisions
  .filter(d => d.decision === 'KILL')
  .reduce((sum, d) => sum + d.ad.spend, 0);
```

If the CSV has fewer than 30 days, label it accurately ("over the last X days") — never lie about the time window.

---

## UI spec

A single screen, vertically centered. Dark theme, ambient glow background (match `/onboarding` style).

```
┌──────────────────────────────────────────────┐
│                                              │
│           [Lumière logo, small]              │
│                                              │
│           You wasted                         │
│         ┌─────────────┐                      │
│         │  € 4,237    │  ← 96px, gradient    │
│         └─────────────┘     red→orange       │
│                                              │
│   on 6 ads that should have been killed      │
│         in the last 30 days                  │
│                                              │
│   ┌─────────────────────────────────────┐    │
│   │ Worst offenders:                    │    │
│   │ • Founder Story 30s    €1,240  0.4x │    │
│   │ • Retarget Cart Abdn   €  890  0.6x │    │
│   │ • UGC Test v7          €  720  0.5x │    │
│   │ • Lookalike 2% v3      €  690  0.7x │    │
│   │ • Brand Awareness Q1   €  697  0.5x │    │
│   └─────────────────────────────────────┘    │
│                                              │
│       [ Show me the full breakdown → ]       │
│                                              │
└──────────────────────────────────────────────┘
```

### Styling notes

- Big number: 96px, font-weight 800, gradient `linear-gradient(135deg, #ef4444, #f59e0b)` with `WebkitBackgroundClip: 'text'` and `WebkitTextFillColor: 'transparent'`
- Subtitle text: `var(--text-2)`, 18px
- Worst offenders card: `var(--surface-1)` background, `var(--border)` 1px border, rounded-2xl, padding 6
- Each row: ad name left-aligned, € spend + ROAS right-aligned in one line, monospace for numbers
- CTA: gradient button matching existing onboarding CTA style (`#7c3aed → #4f46e5`)

### Animation

- The big number animates from 0 to final value over 1.2 seconds (ease-out)
- Worst offenders list fades in row-by-row with 100ms stagger after the number lands
- CTA fades in last

Use simple `setInterval` + `useState` for the count-up; no animation library needed.

---

## Data flow

```
/onboarding/connect [CSV upload]
    │
    ▼
POST /api/import/csv  (returns { decisions, portfolioSummary, rawAds })
    │
    ▼
Persist to sessionStorage:  lumiere_demo_data = JSON.stringify(...)
    │
    ▼
router.push('/reveal')
    │
    ▼
/reveal reads sessionStorage, renders, CTA → router.push('/')
```

**Note:** Full persistence to dashboard is Feature 02. For this feature, sessionStorage is fine — Feature 02 will replace it.

---

## Acceptance criteria

- [ ] Route `/reveal` exists and renders correctly
- [ ] Page reads decision data from sessionStorage key `lumiere_demo_data`
- [ ] If sessionStorage is empty, redirect to `/onboarding`
- [ ] The big number animates from 0 to the final wasted-€ value over ~1.2s
- [ ] The number is correctly calculated (sum of KILL ads' spend)
- [ ] Worst offenders list shows top 5 KILL ads sorted by spend descending
- [ ] If fewer than 5 KILL ads exist, show only what's available (don't pad)
- [ ] If zero KILL ads exist, show a different message: *"No wasted spend detected — your account is performing above benchmark."* with a different CTA
- [ ] CTA "Show me the full breakdown" navigates to `/`
- [ ] Visual style matches the rest of the onboarding flow (dark, glassy, ambient glow)
- [ ] Works on mobile (320px+) — number scales down, list stacks correctly
- [ ] `npx tsc --noEmit` passes

---

## Code hints

### Animated count-up (reuse this pattern)

```tsx
function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}
```

### Currency formatter

Use `Intl.NumberFormat`:
```ts
const fmt = new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
fmt.format(4237); // "€4,237"
```

---

## Out of scope (do not build)

- ❌ Persistence to Supabase (Feature 02 handles this)
- ❌ Multi-currency support (EUR only for now — hardcode it)
- ❌ Date range picker
- ❌ Comparison to previous period

---

## Test plan

1. Manual: open `/onboarding/connect`, upload a sample Meta CSV (use `public/sample-meta-export.csv` if it exists, else any CSV with `Ad name`, `Amount spent`, `ROAS`, `Impressions`, `Clicks` columns)
2. Confirm redirect to `/reveal`
3. Confirm number animates from 0 to a real € value
4. Confirm top offenders list is correct (cross-check by sorting KILL decisions by spend in your head)
5. Open `/reveal` directly in a new tab → confirm redirect to `/onboarding`
6. Click CTA → confirm navigation to `/`
7. Resize browser to 320px wide → confirm layout doesn't break
