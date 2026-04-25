# Feature 02 — CSV → Dashboard Persistence

**Sprint:** 1 **Effort:** 1–2 days **Demo impact:** 🔥🔥🔥
**Depends on:** Feature 01 (uses same sessionStorage key) **Blocks:** Feature 03, 04, 06

---

## Context

Today the dashboard at `/` always renders mock seed data (`src/lib/seed.ts`). The CSV import works and produces real decisions, but those results die in the browser the moment the user navigates away. This means:

- The "money wasted" reveal (Feature 01) leads to a dashboard that suddenly shows a fictional skincare brand's data — the demo magic instantly dies.
- Prospects can't refresh the page or share what they see.

This feature wires the uploaded CSV → dashboard so the entire app reflects the prospect's actual data for the duration of the session.

**Persistence layer:** `sessionStorage` for v1 (no auth needed, demo-grade). Sprint 2 will replace this with Supabase + auth.

---

## Goal

After a CSV upload, every page in the `(app)` route group reflects the uploaded data:

- `/` (dashboard) shows their real KPIs, decisions, and reallocation
- `/decisions` lists their real ads
- `/creatives` aggregates their real creatives
- `/reallocation` shows their real losers and winners

If no upload has happened, the dashboard falls back to seed data (so direct visits and the `/onboarding` flow still work).

---

## Files to create / modify

### CREATE
- `src/lib/data-source.ts` — central hook/utility that returns either uploaded data or seed data
- `src/components/DemoBanner.tsx` — small banner at the top of `(app)` pages indicating "Demo mode — using your CSV upload" or "Demo mode — sample data"

### MODIFY
- `src/app/(app)/page.tsx` — replace direct seed import with `useDataSource()` hook
- `src/app/(app)/decisions/page.tsx` — same
- `src/app/(app)/creatives/page.tsx` — same
- `src/app/(app)/reallocation/page.tsx` — same
- `src/app/(app)/layout.tsx` — render `<DemoBanner />` at the top
- `src/app/api/import/csv/route.ts` — confirm response shape includes everything the dashboard needs (ads, decisions, portfolio summary, benchmarks)
- `src/app/reveal/page.tsx` (Feature 01) — uses the same sessionStorage key

### REFERENCE
- `src/lib/seed.ts` — shape of mock data; the uploaded data must match this shape
- `src/lib/types.ts` — `Ad`, `DecisionOutput`, `PortfolioSummary`, `Benchmarks`
- `src/lib/engine.ts` — `runDecisionEngine`, `runPortfolio`

---

## SessionStorage contract

**Key:** `lumiere_demo_data`

**Value (JSON):**
```ts
{
  source: 'csv_upload' | 'seed';
  uploadedAt: string;            // ISO timestamp
  ads: Ad[];                     // raw normalised ads from CSV
  benchmarks: Benchmarks;        // computed from the uploaded ads (medians)
  // Decisions are recomputed on the fly via runDecisionEngine — do not cache them
}
```

**Why not cache decisions:** keeps a single source of truth. If we ever change engine weights, cached decisions go stale. Re-running the engine on 15-100 ads is sub-millisecond — no perf concern.

---

## `data-source.ts` API

```ts
// src/lib/data-source.ts
'use client';
import { useEffect, useState } from 'react';
import type { Ad, Benchmarks } from './types';
import { ads as seedAds, benchmarks as seedBenchmarks } from './seed';

export interface DataSource {
  source: 'csv_upload' | 'seed';
  ads: Ad[];
  benchmarks: Benchmarks;
  uploadedAt: string | null;
}

export function useDataSource(): DataSource {
  const [data, setData] = useState<DataSource>({
    source: 'seed',
    ads: seedAds,
    benchmarks: seedBenchmarks,
    uploadedAt: null,
  });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('lumiere_demo_data');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.ads?.length) {
        setData({
          source: 'csv_upload',
          ads: parsed.ads,
          benchmarks: parsed.benchmarks,
          uploadedAt: parsed.uploadedAt ?? null,
        });
      }
    } catch {
      // fall back silently to seed
    }
  }, []);

  return data;
}

// Helper: persist freshly uploaded data
export function persistUpload(ads: Ad[], benchmarks: Benchmarks) {
  sessionStorage.setItem('lumiere_demo_data', JSON.stringify({
    source: 'csv_upload',
    ads,
    benchmarks,
    uploadedAt: new Date().toISOString(),
  }));
}

// Helper: clear (for "reset to demo data" button)
export function clearUpload() {
  sessionStorage.removeItem('lumiere_demo_data');
}
```

**Note:** `useEffect` is needed because sessionStorage is browser-only and dashboard pages are likely client components or need to be made client. Mark each modified page with `'use client'` if not already.

---

## `DemoBanner` UI spec

A thin banner at the very top of `(app)` pages:

```
┌────────────────────────────────────────────────────────────────┐
│  📊 Showing your CSV upload (uploaded 2 minutes ago)   [Reset] │
└────────────────────────────────────────────────────────────────┘
```

When source is `seed`:
```
┌────────────────────────────────────────────────────────────────┐
│  ✨ You're viewing sample data —  [Upload your own ads →]      │
└────────────────────────────────────────────────────────────────┘
```

Styling:
- Height: 36px
- Background: `var(--surface-1)` with subtle bottom border
- Text: 13px, `var(--text-2)`
- "Reset" button: text link, `var(--text-3)`, hover → `var(--text-1)`
- "Upload your own ads →" link: `#a78bfa` color, links to `/onboarding/connect`

---

## Computing benchmarks from uploaded data

The CSV import API needs to compute account-level medians:

```ts
function computeBenchmarks(ads: Ad[]): Benchmarks {
  const sorted = (key: keyof Ad) => ads.map(a => Number(a[key])).filter(n => isFinite(n)).sort((a,b) => a-b);
  const median = (arr: number[]) => arr.length ? arr[Math.floor(arr.length/2)] : 0;
  return {
    medianRoas: median(sorted('roas')),
    medianCtr:  median(sorted('ctr')),
    medianCvr:  median(sorted('cvr')),
    medianCpa:  median(sorted('cpa')),
  };
}
```

Add this to `src/lib/engine.ts` (or a new `src/lib/stats.ts` if cleaner) — reuse, don't duplicate.

---

## Acceptance criteria

- [ ] After CSV upload, sessionStorage key `lumiere_demo_data` is populated
- [ ] After CSV upload, `/` shows uploaded data (not seed) — verify by ad names
- [ ] After CSV upload, `/decisions`, `/creatives`, `/reallocation` all show uploaded data
- [ ] Refreshing the page preserves the uploaded data (sessionStorage survives reload)
- [ ] Opening a new tab loses the data (sessionStorage is per-tab) — this is acceptable for v1
- [ ] DemoBanner correctly indicates "your CSV" vs "sample data"
- [ ] DemoBanner Reset button clears sessionStorage and reloads to seed mode
- [ ] DemoBanner Upload link sends user to `/onboarding/connect`
- [ ] If sessionStorage is corrupted JSON, page falls back to seed without throwing
- [ ] Account benchmarks (medians) are recomputed from uploaded ads — verify they're not the seed values
- [ ] `npx tsc --noEmit` passes
- [ ] No console errors on any `(app)` page

---

## Edge cases to handle

1. **Empty CSV** — API returns `ads: []`. Don't persist; show error on connect page instead.
2. **CSV with only HOLD verdicts** — dashboard should still render gracefully. KILL/SCALE sections show "No KILL recommendations" empty states.
3. **Browser without sessionStorage** (old Safari private mode) — gracefully degrade to seed mode.
4. **Refresh on `/decisions` page directly** — must work, no flash of wrong data. Use SSR-safe pattern (server returns seed shell, client hydrates with sessionStorage data).

---

## Out of scope (do not build)

- ❌ localStorage persistence (we want sessions to be per-tab)
- ❌ Server-side persistence to Supabase (Sprint 2)
- ❌ Multi-account selector
- ❌ History of past uploads

---

## Test plan

1. Visit `/` in a fresh browser → see seed data + "sample data" banner
2. Click "Upload your own ads →" → land on `/onboarding/connect`
3. Upload a sample Meta CSV → see Feature 01 reveal screen
4. Click "Show me the full breakdown" → land on `/`
5. Confirm dashboard shows uploaded ad names, not "Lumière Summer Glow UGC v3" etc.
6. Click `/decisions` in sidebar → confirm same uploaded ads
7. Click `/creatives` → confirm aggregation works
8. Click `/reallocation` → confirm losers and winners reflect uploaded data
9. Refresh on each page → confirm data persists
10. Click "Reset" in banner → confirm reverts to seed mode
11. Open `/` in a new tab → confirm new tab is seed mode (sessionStorage isolation)
