# Feature 04 — Forecast / ROI Anchor Card

**Sprint:** 1 **Effort:** 2 days **Demo impact:** 🔥🔥
**Depends on:** Feature 02 **Blocks:** none

---

## Context

Lumière is $499/month. To make that price feel cheap, we need a number on the dashboard that says: *"If you act on these decisions, you'll make €X more next month at the same budget."*

If €X is meaningfully larger than $499 (it almost always will be — typical accounts have €2k–€20k of monthly upside), the price comparison closes itself. The prospect does the math automatically: *"€499 to make €12,000? Yes."*

This is the **value-anchor** every demo needs. Without it, $499 feels expensive in isolation. With it, $499 feels like a steal.

---

## Goal

A new "Forecast" card prominently placed on the dashboard (`/`) that shows:

- **Headline number:** projected revenue uplift in € for next 30 days
- **Mechanism:** quick breakdown of where the uplift comes from (kill waste + scale winners)
- **Confidence label:** how trustworthy the forecast is, based on data volume
- **Disclaimer:** small print clarifying assumptions

The card should also appear on the public shareable report (`/r/[hash]`) — that's where it does the most sales work.

---

## Files to create / modify

### CREATE
- `src/components/ForecastCard.tsx` — the visual card
- `src/lib/forecast.ts` — pure forecast calculation (testable, no React)

### MODIFY
- `src/app/(app)/page.tsx` — render `<ForecastCard />` near the top
- `src/app/r/[hash]/page.tsx` (Feature 03) — render `<ForecastCard />` in the public report
- `src/lib/types.ts` — add `Forecast` type

### REFERENCE
- `src/lib/engine.ts` — `runDecisionEngine`, `runPortfolio` already exist and produce reallocation data we can build on
- `src/lib/data-source.ts` (Feature 02)

---

## Forecast calculation

The forecast has three components:

### 1. Waste eliminated

If we kill all KILL ads, we recover their spend. That money is reallocated to winners.

```ts
const wasteRecovered = decisions
  .filter(d => d.decision === 'KILL')
  .reduce((sum, d) => sum + d.ad.spend * 30 / daysOfData, 0);
// scale to 30 days
```

### 2. Reallocation revenue gain

That recovered budget, moved to SCALE ads at their existing ROAS, generates new revenue:

```ts
const scaleAds = decisions.filter(d => d.decision === 'SCALE');
const avgWinnerRoas = scaleAds.length
  ? scaleAds.reduce((s, d) => s + d.ad.roas, 0) / scaleAds.length
  : portfolioMedianRoas;

const reallocationRevenue = wasteRecovered * avgWinnerRoas;
```

### 3. Boost from scaling winners

Scaling winners +30% adds revenue at the winner ROAS:

```ts
const scaleBoost = scaleAds.reduce((sum, d) => {
  const additionalSpend = d.ad.spend * 0.30 * 30 / daysOfData;
  return sum + additionalSpend * d.ad.roas;
}, 0);
```

### Total

```ts
const projectedUplift = reallocationRevenue + scaleBoost;
```

Round to the nearest €100 for display (don't show fake precision).

### Confidence

```ts
function forecastConfidence(decisions: DecisionOutput[], daysOfData: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  const totalConversions = decisions.reduce((s, d) => s + d.ad.conversions, 0);
  const highConfDecisions = decisions.filter(d => d.confidence === 'HIGH').length;

  if (daysOfData >= 14 && totalConversions >= 100 && highConfDecisions >= 5) return 'HIGH';
  if (daysOfData >= 7  && totalConversions >= 30) return 'MEDIUM';
  return 'LOW';
}
```

Show LOW-confidence forecasts with hedged language: *"Estimated +€X — needs more data for higher confidence."*

---

## `forecast.ts` API

```ts
// src/lib/forecast.ts
import type { DecisionOutput, Benchmarks } from './types';

export interface Forecast {
  upliftEur: number;              // rounded to nearest 100
  daysProjected: number;          // always 30
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  breakdown: {
    wasteRecovered: number;       // € moved off losers
    reallocationRevenue: number;  // revenue from reallocation
    scaleBoost: number;           // revenue from scaling winners
  };
  assumptions: string[];          // human-readable
}

export function computeForecast(
  decisions: DecisionOutput[],
  daysOfData: number,
  benchmarks: Benchmarks,
): Forecast {
  // ... implementation as above
}
```

Keep this **pure** (no React, no DOM). Easy to unit-test later.

---

## UI spec

```
┌─────────────────────────────────────────────────────────┐
│  📈  PROJECTED 30-DAY UPLIFT          Confidence: HIGH  │
│                                                         │
│      + €12,400                                          │
│                                                         │
│  if you act on Lumière's recommendations                │
│  this week. At the same total budget.                   │
│                                                         │
│  ─────────────────────────────────────────────────      │
│                                                         │
│  Where it comes from:                                   │
│   • Recovered waste (kill 6 losers)         €4,200      │
│   • Reallocate to winners                  €+ 9,200     │
│   • Scale top 4 performers                 €+ 3,200     │
│                                                         │
│  Based on 30 days of data · Updated just now            │
└─────────────────────────────────────────────────────────┘
```

### Styling

- Card: `var(--surface-1)` background, `var(--border)` 1px, rounded-2xl, padding-6
- Headline number: 56px, font-weight 800, color `#10b981` (the SCALE green) with subtle glow `text-shadow: 0 0 32px rgba(16,185,129,0.3)`
- Confidence pill: top-right, color-coded (HIGH = green, MED = amber, LOW = gray)
- Breakdown rows: 14px, monospace numbers right-aligned
- Disclaimer text: `var(--text-3)`, 12px

### Confidence badge variants

| Confidence | Color | Label |
|---|---|---|
| HIGH | `#10b981` | "Confidence: HIGH" |
| MEDIUM | `#f59e0b` | "Confidence: MEDIUM" |
| LOW | `#6366f1` | "Estimate · needs more data" |

For LOW confidence, also gray out the headline number slightly (`opacity: 0.7`) and add hover tooltip: *"More than 14 days of data and 100+ conversions are recommended for a reliable forecast."*

---

## Placement on `/`

Insert at the **top of the dashboard**, immediately after the existing hero/narrative section, before the KPI cards. Full-width on mobile, 2/3 width on desktop with the existing waste callout filling the right 1/3.

On `/r/[hash]` — full-width, between the Money Wasted hero and the decision lists.

---

## Acceptance criteria

- [ ] `src/lib/forecast.ts` exists and exports `computeForecast()`
- [ ] Forecast calculation matches the formula above (waste + reallocation + scale boost)
- [ ] Forecast is rounded to nearest €100
- [ ] `<ForecastCard />` renders correctly on `/`
- [ ] `<ForecastCard />` also renders on `/r/[hash]`
- [ ] Confidence label correctly reflects data volume (test with seed data — should be HIGH for 30-day seed)
- [ ] LOW confidence variant shows hedged language and dimmed number
- [ ] Breakdown shows three rows with correct math (sum should equal headline)
- [ ] Mobile layout: card stacks below hero, headline number scales to fit
- [ ] No console errors
- [ ] `npx tsc --noEmit` passes

---

## Edge cases

1. **No KILL ads** — wasteRecovered = 0. Show only the scale boost. Don't crash.
2. **No SCALE ads** — show wasteRecovered as "Money to redirect" with note: *"Identify new winners by testing more creatives."*
3. **Both empty (account is healthy)** — show different message: *"No major optimisation opportunities detected. Your account is performing above benchmark."*
4. **Negative forecast** (e.g., scaling LOW-confidence ads) — never show negative. Floor at 0 and switch to LOW confidence.

---

## Out of scope

- ❌ User-adjustable assumptions (e.g., "what if winner ROAS drops?")
- ❌ Multi-period forecasts (90-day, 1-year)
- ❌ Historical backtest ("if you'd done this last month, you'd have made €X")
- ❌ Comparison to alternative scenarios

---

## Test plan

1. Open `/` with seed data → confirm forecast appears with non-zero number
2. Verify the breakdown sums to the headline (within €100 rounding)
3. Open Feature 02 banner → click Reset → confirm forecast updates
4. Upload a small CSV (3-5 ads, low volume) → confirm LOW confidence shows
5. Open `/r/[hash]` → confirm forecast also appears
6. Mobile (375px) → confirm number doesn't overflow
7. Hover confidence pill on LOW → confirm tooltip
