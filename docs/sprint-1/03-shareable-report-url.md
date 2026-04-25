# Feature 03 — Shareable Report URL

**Sprint:** 1 **Effort:** 2–3 days **Demo impact:** 🔥🔥🔥
**Depends on:** Feature 02 (uses persisted data) **Blocks:** none

---

## Context

Today, after a prospect's demo ends, they have nothing to take with them. They go back to their inbox, get distracted, and never sign up. This is the #1 reason demos don't convert.

This feature creates a **shareable, public, no-login URL** the prospect can send to their CFO, team, or boss. Each share = a brand impression + a potential lead.

This is also the most powerful **growth mechanic** in the product. Loom and Notion grew this way.

---

## Goal

After a CSV upload (or anywhere on the dashboard), the user can click a "Share this report" button. The system:

1. Persists their current data + computed decisions to Supabase (anonymously)
2. Generates a URL like `https://lumiere.ai/r/abc123def456` (no login required to view)
3. Shows a "Copy link" UI with a one-click copy
4. Optionally lets the user email the link to themselves or a colleague

The recipient opens the URL and sees a **read-only**, beautifully styled, public version of the report:

- Money Wasted hero (top of page)
- Top decisions table (KILL list, SCALE list)
- Forecast / projected uplift
- Branded footer: *"Powered by Lumière — your AI media buyer. €499/mo."* with CTA *"Get yours →"*

The shareable view auto-expires after 30 days.

---

## Files to create / modify

### CREATE
- `src/app/r/[hash]/page.tsx` — public shareable report (server component, no auth)
- `src/app/api/share/create/route.ts` — POST: persist data, return hash
- `src/app/api/share/[hash]/route.ts` — GET: fetch persisted data by hash
- `src/components/ShareButton.tsx` — the "Share this report" button + modal
- `src/lib/share.ts` — hash generation utility, encryption helpers if needed
- `supabase/migrations/00X_create_shared_reports.sql` — DB schema (or note for manual application)

### MODIFY
- `src/app/(app)/page.tsx` — add `<ShareButton />` to the dashboard top-right

### REFERENCE
- `src/lib/data-source.ts` (Feature 02) — source of current data
- `src/lib/supabase.ts` — `createServiceClient()` for inserts

---

## Database schema

Add to Supabase via migration:

```sql
create table shared_reports (
  hash text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  view_count integer not null default 0
);

create index idx_shared_reports_expires_at on shared_reports (expires_at);

-- RLS: anyone can SELECT a non-expired report by hash
alter table shared_reports enable row level security;

create policy "anyone can read non-expired reports"
  on shared_reports for select
  using (expires_at > now());

create policy "anyone can insert reports"
  on shared_reports for insert
  with check (true);

-- Cleanup function (run via cron or scheduled function later)
create or replace function delete_expired_reports() returns void as $$
  delete from shared_reports where expires_at < now();
$$ language sql;
```

Apply this manually or via Supabase migration tooling. Document in `supabase/migrations/` for the next agent.

---

## Hash generation

Use `nanoid` or a simple `crypto.randomBytes` approach:

```ts
// src/lib/share.ts
import { randomBytes } from 'crypto';

export function generateHash(): string {
  // 12 bytes → 16 base64url chars; collision-resistant for this scale
  return randomBytes(12).toString('base64url');
}
```

If `nanoid` isn't already a dep, prefer `crypto` (Node built-in).

---

## API routes

### `POST /api/share/create`

**Request body:**
```ts
{
  ads: Ad[];                    // from sessionStorage
  benchmarks: Benchmarks;
  // No PII — anonymise account name to "DTC brand" if present
}
```

**Response:**
```ts
{
  hash: string;
  url: string;                  // full URL: `${BASE_URL}/r/${hash}`
  expiresAt: string;            // ISO
}
```

**Implementation:**
1. Generate hash
2. Compute decisions + portfolio summary server-side via `runDecisionEngine` and `runPortfolio`
3. Insert row into `shared_reports` with `data = { ads, benchmarks, decisions, portfolio, generatedAt }`
4. Return hash + URL

### `GET /api/share/[hash]`

**Response:**
```ts
{
  data: {
    ads: Ad[];
    benchmarks: Benchmarks;
    decisions: DecisionOutput[];
    portfolio: PortfolioSummary;
    generatedAt: string;
  };
  createdAt: string;
  expiresAt: string;
}
```

**Implementation:**
1. SELECT from `shared_reports` WHERE hash = $1 AND expires_at > now()
2. If not found: return 404 with `{ error: 'Report not found or expired' }`
3. UPDATE view_count = view_count + 1
4. Return data

---

## Public report page (`/r/[hash]`)

Server component. Fetches data on the server, renders fully. No client-side JS needed beyond minor interactions.

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│  [Lumière logo]                  [Get your own →]   │ ← thin top bar
├─────────────────────────────────────────────────────┤
│                                                     │
│  Generated April 21, 2026 · Expires in 28 days      │
│                                                     │
│  ╔══════════════════════════════════════════════╗   │
│  ║                                              ║   │
│  ║  This brand wasted                           ║   │
│  ║                                              ║   │
│  ║       € 4,237                                ║   │
│  ║                                              ║   │
│  ║  on 6 ads in the last 30 days.               ║   │
│  ║                                              ║   │
│  ╚══════════════════════════════════════════════╝   │
│                                                     │
│  🔴 Should be killed (6 ads)                        │
│  ┌───────────────────────────────────────────────┐  │
│  │ Founder Story 30s    €1,240   ROAS 0.4x   ▼  │  │
│  │ Retarget Cart Abdn   €  890   ROAS 0.6x   ▼  │  │
│  │ ...                                           │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  🟢 Should be scaled (4 ads)                        │
│  [...]                                              │
│                                                     │
│  📊 Projected uplift if action is taken             │
│  +€12,400 next month at the same total budget       │
│                                                     │
│  ╔══════════════════════════════════════════════╗   │
│  ║  Want this for your own Meta account?        ║   │
│  ║                                              ║   │
│  ║  Lumière is your AI media buyer.             ║   │
│  ║  €499/month. Cancel anytime.                 ║   │
│  ║                                              ║   │
│  ║  [ Get yours — free 14-day trial → ]         ║   │
│  ╚══════════════════════════════════════════════╝   │
│                                                     │
│  Powered by Lumière · lumiere.ai                    │
└─────────────────────────────────────────────────────┘
```

### Style notes

- Mobile-first responsive: works perfectly on phone (CFOs check links on mobile)
- Same dark theme as the rest of the app
- The "Get yours" CTA at the bottom is the main conversion point — make it prominent
- Show `view_count` discreetly: *"Viewed 3 times"* (mild social proof)

---

## Share button + modal

Place a button in the top-right of `/` (and optionally other dashboard pages):

```
[ Share this report ▾ ]
```

On click → modal:

```
┌─────────────────────────────────────────┐
│  Share this report                  ✕   │
│                                         │
│  Send a snapshot to your team or CFO.   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ https://lumiere.ai/r/aB3xK9pZ   │ 📋 │
│  └─────────────────────────────────┘    │
│                                         │
│  Expires in 30 days · Read-only         │
│                                         │
│  Or send by email:                      │
│  ┌─────────────────────────────────┐    │
│  │ colleague@brand.com              │ ➤ │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

Email send: out of scope for this sprint. Either hide the email field or wire it to a `mailto:` with prefilled subject/body for now.

```ts
const mailto = `mailto:?subject=Ad performance report from Lumière&body=Take a look:%0A%0A${url}`;
```

---

## Acceptance criteria

- [ ] Migration created and documented (or applied directly to Supabase)
- [ ] `POST /api/share/create` works: returns valid hash + URL
- [ ] `GET /api/share/[hash]` returns data for valid hash, 404 for invalid/expired
- [ ] `/r/[hash]` page renders with all key elements (Money Wasted, KILL list, SCALE list, forecast, CTA)
- [ ] Share button on `/` opens modal
- [ ] Modal shows generated URL with one-click copy
- [ ] Copy button gives visual feedback ("Copied!" briefly)
- [ ] Email link opens user's mail client with prefilled body
- [ ] Public report page works on mobile (test at 375px)
- [ ] Public report page works in incognito (no auth required)
- [ ] Expired reports return a friendly 404 page, not a crash
- [ ] view_count increments on each visit
- [ ] No PII leaked in shared report (anonymise account names if needed)
- [ ] `npx tsc --noEmit` passes

---

## Out of scope

- ❌ Branded white-label option (Sprint 3+)
- ❌ Email sending via SendGrid/Resend (mailto only for now)
- ❌ Password-protected reports
- ❌ "Update report" flow (each share is a snapshot)
- ❌ Analytics on who viewed (just a counter for now)

---

## Test plan

1. From `/`, click "Share this report"
2. Confirm modal opens with a valid URL
3. Copy URL
4. Open URL in incognito browser → confirm full report renders
5. Refresh → confirm view_count went up
6. Manually update DB to set `expires_at = now() - interval '1 day'`
7. Refresh URL → confirm friendly "expired" message
8. Test on mobile (Chrome DevTools 375px) → confirm layout
9. Confirm mailto link prefills correctly
10. Confirm "Get yours" CTA navigates to `/onboarding`

---

## Growth tracking (instrument this from day 1)

Even if there's no analytics tool wired yet, log to console or a simple `analytics_events` Supabase table:

- `share_url_generated` (when modal opens)
- `share_url_copied` (when copy button clicked)
- `share_url_emailed` (when email sent)
- `shared_report_viewed` (each visit to `/r/[hash]`)
- `shared_report_cta_clicked` (when "Get yours" clicked)

This becomes your viral coefficient. Sprint 2 will hook this to Posthog/Plausible properly.
