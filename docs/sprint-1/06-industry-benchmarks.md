# Feature 06 — Industry Benchmark Comparison

**Sprint:** 1 **Effort:** 1–2 days **Demo impact:** 🔥🔥
**Depends on:** Feature 02 **Blocks:** none

---

## Context

Saying *"your ROAS is 2.1x"* is meaningless. Saying *"your ROAS is 2.1x — bottom 35% for DTC skincare in EU; top performers are at 3.4x"* triggers competitive insecurity → buying intent.

This is a sales weapon. Northbeam doesn't do this for SMB. Triple Whale doesn't do this. We can win the demo on this single feature alone.

**The data starts thin.** We don't have a customer base yet, so the benchmark dataset is bootstrapped from publicly available sources (industry reports, Meta's own benchmarking, agency-published data). That's fine — we ship with honest, well-cited numbers and the dataset becomes a real network-effect moat as customers join.

---

## Goal

A new "Industry Benchmark" card on the dashboard (and on `/r/[hash]`) that compares the user's account to vertical-specific medians + top performer numbers across:

- ROAS
- CTR
- CVR
- CPA
- Frequency

For each metric: where they sit (percentile), what the median is, what the top quartile is. Shown visually so the prospect doesn't have to read numbers.

---

## Files to create / modify

### CREATE
- `src/lib/benchmarks-industry.ts` — static benchmark dataset by vertical
- `src/components/IndustryBenchmarkCard.tsx` — visual card

### MODIFY
- `src/app/(app)/page.tsx` — render `<IndustryBenchmarkCard />` mid-page
- `src/app/r/[hash]/page.tsx` — render in public report
- `src/lib/types.ts` — add `IndustryVertical`, `BenchmarkBand` types
- `src/lib/data-source.ts` — add a way to set/get the user's selected vertical (sessionStorage)

### REFERENCE
- `src/lib/data-source.ts` (Feature 02) — where the user's data comes from

---

## Verticals to support (v1)

Start with 6 verticals. Add more as we get real data.

| Slug | Display name | Source notes |
|---|---|---|
| `dtc_skincare` | DTC Skincare & Beauty | Common Thread Collective benchmarks 2024, Wpromote DTC report |
| `dtc_apparel` | DTC Apparel & Fashion | Klaviyo benchmarks, Shopify Plus reports |
| `dtc_food` | DTC Food & Beverage | Triple Whale published benchmarks |
| `dtc_home` | DTC Home & Lifestyle | Industry-aggregated medians |
| `b2b_saas` | B2B SaaS | LinkedIn/Meta B2B reports |
| `general_ecom` | General E-commerce | Meta's own published benchmarks |

Default to `general_ecom` if user hasn't selected one.

---

## Benchmark data structure

```ts
// src/lib/benchmarks-industry.ts
export interface IndustryBenchmark {
  vertical: string;
  displayName: string;
  region: 'global' | 'eu' | 'us';
  metrics: {
    roas:      { p25: number; p50: number; p75: number; p90: number };
    ctr:       { p25: number; p50: number; p75: number; p90: number };
    cvr:       { p25: number; p50: number; p75: number; p90: number };
    cpa:       { p25: number; p50: number; p75: number; p90: number };  // lower is better
    frequency: { p25: number; p50: number; p75: number; p90: number };
  };
  source: string;      // citation
  asOf: string;        // "2024-Q4"
}

export const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  dtc_skincare: {
    vertical: 'dtc_skincare',
    displayName: 'DTC Skincare & Beauty',
    region: 'global',
    metrics: {
      roas:      { p25: 1.4, p50: 2.3, p75: 3.4, p90: 4.8 },
      ctr:       { p25: 0.012, p50: 0.020, p75: 0.031, p90: 0.045 },
      cvr:       { p25: 0.018, p50: 0.028, p75: 0.042, p90: 0.061 },
      cpa:       { p25: 65,    p50: 42,    p75: 28,    p90: 18 },
      frequency: { p25: 1.4,   p50: 2.1,   p75: 3.2,   p90: 4.5 },
    },
    source: 'Common Thread Collective DTC Benchmarks 2024',
    asOf: '2024-Q4',
  },
  // ... 5 more verticals
};
```

**Be honest about source.** Cite real reports. If a number is estimated/interpolated, mark it. We will update this as we learn — don't manufacture confidence.

### Where to find source data

A research task for this feature is to find and cite real numbers. Use:

- Common Thread Collective's annual DTC report
- Wordstream / Wpromote benchmarking blog posts
- Klaviyo's published e-commerce benchmarks
- Meta's own Business Help Center (Ad performance benchmarks)
- Triple Whale and Motion blog posts (cite competitors when their data is public)

**Do not invent numbers.** If a vertical's data is uncertain, label it "preliminary" in the source string.

---

## Computing user's percentile

For each metric, find which band (p25, p50, p75, p90) the user falls into and interpolate to a percentile:

```ts
function percentile(value: number, bands: { p25: number; p50: number; p75: number; p90: number }, lowerIsBetter = false): number {
  // For metrics where higher is better (ROAS, CTR, CVR, frequency-up-to-3)
  // For CPA, use lowerIsBetter = true and flip
  const v = lowerIsBetter ? -value : value;
  const b25 = lowerIsBetter ? -bands.p75 : bands.p25;
  const b50 = lowerIsBetter ? -bands.p50 : bands.p50;
  const b75 = lowerIsBetter ? -bands.p25 : bands.p75;
  const b90 = lowerIsBetter ? -bands.p10 ?? -bands.p25 : bands.p90;
  // simple piecewise-linear interpolation between bands
  if (v < b25) return Math.max(0, Math.round(25 * v / b25));
  if (v < b50) return Math.round(25 + 25 * (v - b25) / (b50 - b25));
  if (v < b75) return Math.round(50 + 25 * (v - b50) / (b75 - b50));
  if (v < b90) return Math.round(75 + 15 * (v - b75) / (b90 - b75));
  return Math.min(99, Math.round(90 + 9 * (v - b90) / (b90 || 1)));
}
```

(Pseudo-code — implementer should clean this up.)

---

## UI spec

```
┌────────────────────────────────────────────────────────────────┐
│  🌍  HOW YOU COMPARE                                           │
│                                                                │
│  vs. DTC Skincare & Beauty (Global)                            │
│  Source: Common Thread Collective 2024     [Change vertical ▾] │
│                                                                │
│  ROAS                                                          │
│  ──────────────────────────────────────────────────            │
│   You: 2.1x                                Bottom 35%          │
│   Industry median: 2.3x                                        │
│   Top quartile: 3.4x                                           │
│   ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░  ← your position bar               │
│                                                                │
│  CTR                                                           │
│  ──────────────────────────────────────────────────            │
│   You: 1.8%                                Bottom 28%          │
│   Industry median: 2.0%                                        │
│   ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░                                     │
│                                                                │
│  CPA                                                           │
│  ──────────────────────────────────────────────────            │
│   You: €58                                 Top 22% (lower=bet) │
│   Industry median: €42                                         │
│   ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░  ← (inverted scale for CPA)      │
│                                                                │
│  ─────────────────────────────────────────────────────         │
│  💡 If you closed the gap to the industry median ROAS,         │
│     you'd earn an extra €2,800 next month at the same spend.   │
└────────────────────────────────────────────────────────────────┘
```

### Styling

- Each metric block: clean section, label left, value right
- Position bar: 8px tall, gradient from red (`#ef4444`) → amber (`#f59e0b`) → green (`#10b981`); white indicator (4px wide) at user's percentile
- "Bottom X%" or "Top X%" badge color-coded:
  - Bottom 0–33%: red
  - Middle 33–66%: amber
  - Top 66–100%: green
- "Change vertical" dropdown: simple `<select>` styled to match dark theme; persists choice to sessionStorage
- The "what-if" line at the bottom is computed from the gap to median

---

## Vertical selector

A dropdown at the top of the card lets the user pick their vertical. Persist to sessionStorage as `lumiere_vertical`. Default to `general_ecom`.

```tsx
const verticals = Object.values(INDUSTRY_BENCHMARKS);
<select onChange={e => setVertical(e.target.value)} value={vertical}>
  {verticals.map(v => <option key={v.vertical} value={v.vertical}>{v.displayName}</option>)}
</select>
```

In the onboarding flow (Sprint 2), we'll ask this upfront. For now, dashboard dropdown is enough.

---

## Acceptance criteria

- [ ] `src/lib/benchmarks-industry.ts` exists with at least 6 verticals, each with cited source
- [ ] No invented numbers — every figure has a real-world citation
- [ ] `<IndustryBenchmarkCard />` renders on `/` and `/r/[hash]`
- [ ] Card shows ROAS, CTR, CVR, CPA, Frequency comparisons
- [ ] User's percentile is correctly computed and shown ("Bottom X%" / "Top X%")
- [ ] Position bar visually represents the percentile
- [ ] Vertical selector dropdown works and persists to sessionStorage
- [ ] CPA correctly inverted (lower is better)
- [ ] "What-if" line shows realistic potential uplift
- [ ] Source citation visible (small print)
- [ ] Mobile-friendly layout
- [ ] `npx tsc --noEmit` passes

---

## Edge cases

1. **User's data is way better than top quartile** — show "Top 5%" or similar; celebrate them. Don't fake a "you could do better" message.
2. **User's data is way worse than p25** — clamp to "Bottom 5%" or similar. Be honest.
3. **Insufficient data (1-2 ads)** — hide the card entirely with a small note: *"Industry comparison available once you have 5+ ads."*
4. **Frequency >5 (very fatigued)** — call this out specifically: *"Your frequency is significantly above industry — strong creative fatigue signal."*

---

## Out of scope

- ❌ Region-specific benchmarks (just use `global` for v1)
- ❌ Time-period-specific benchmarks (Q1 vs Q4 etc.)
- ❌ Custom peer groups ("brands like mine")
- ❌ Benchmark drilldown by ad type (video vs image)
- ❌ Cross-customer benchmark network (Sprint 3+ once we have customers)

---

## Test plan

1. Open `/` with seed data → confirm card appears with non-zero percentiles
2. Switch vertical via dropdown → confirm benchmarks change
3. Refresh → confirm vertical choice persists
4. Upload a CSV with very high ROAS → confirm "Top X%" badge appears
5. Upload a CSV with low ROAS → confirm "Bottom X%" badge appears
6. Mobile (375px) → confirm layout doesn't break
7. View on `/r/[hash]` → confirm card also appears in public report
8. Confirm citations are visible (small print at top of card)

---

## Citation requirement (read this carefully)

We are publishing benchmark data. Every number must trace to a real, cited source. The "asOf" date and source field are not decoration — they're legal hygiene and trust signals. If we ever get pushback ("where did you get this?"), the answer is in the dataset.

If you can't find a real number for a vertical-metric combination, **leave it out** rather than guess. A partial benchmark is better than a fabricated one.
