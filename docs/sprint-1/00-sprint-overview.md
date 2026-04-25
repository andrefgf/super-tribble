# Sprint 1 — The Demo-Closer Sprint

**Duration:** 2 weeks **Goal:** Every prospect demoed in this window converts at ≥40% to a paid pilot.

---

## Why this sprint exists

Lumière's MVP looks great but doesn't close in a demo. The decision engine, design, and architecture are solid — but the moments that make a prospect reach for their card are missing. This sprint builds those moments.

Every feature in this sprint is filtered through one question: **"Does this make a prospect pull out their card during the demo?"** If the answer is no, it doesn't ship this sprint.

---

## Competitor Leverage — Northbeam (our headline rival)

We did a fresh recon on northbeam.io. Key findings — **all of these are leverage points for sales conversations and product positioning**:

### Their pricing (the bombshell)

| Tier | Price | Target |
|---|---|---|
| Starter | **$1,500/mo** | <$1.5M annual ad spend |
| Professional | Custom (est. $3k+/mo) | >$250k/month spend |
| Enterprise | Custom (est. $5k+/mo) | >$500k/month spend |

**Lumière is $499/month. That's 1/3 of Northbeam's *cheapest* tier.**

### Where Northbeam leaves money on the table (= our market)

1. **Their floor is too high for SMB DTC.** Northbeam targets brands spending $1.5M+ annually. Our ICP (small teams spending $60k–$600k annually on Meta) is **explicitly excluded** from their cheapest tier. We own that segment by default.

2. **They don't publish pricing.** "Book a demo" gating signals enterprise sales motion. SMB buyers want transparency. We publish $499/mo on the homepage.

3. **They sell attribution, not decisions.** Their messaging: *"Make your marketing more profitable"* via "multi-touch attribution," "media mix modeling," "incrementality testing." That's analyst-speak. Our buyer doesn't have an analyst — they have a stressed marketer who needs to know what to pause TODAY.

4. **Annual contracts at higher tiers.** Professional and Enterprise require annual commitments. We're month-to-month, cancel anytime. SMB-friendly.

5. **No "AI media buyer" framing.** They are infrastructure for a marketing team. We are the marketing team a small brand can't afford to hire.

6. **No shareable artefacts mentioned.** Their value lives behind a login. Lumière's shareable report URL becomes a viral loop.

7. **20+ integrations as a feature.** That's a complexity tax. We are deliberately Meta-first — depth over breadth. *"We are the best at one platform, not mediocre at twelve."*

### Sales script anchors derived from this

When a prospect asks *"how is this different from Northbeam?"*, the answer is one of these — never a feature comparison:

- *"Northbeam starts at $1,500/month and is built for brands doing $1.5M+ annually. We're built for the $5k–$50k/month spender that they don't serve."*
- *"They give you charts. We give you decisions. Different product."*
- *"They want a year contract. We're month-to-month."*
- *"Their cheapest plan is 3× our price and you still have to interpret the data yourself."*

---

## Sprint Backlog

7 features, ordered by demo impact. **Build in order** — later features depend on earlier ones.

| # | Feature | Demo impact | Effort | Spec |
|---|---|---|---|---|
| 1 | Money Wasted reveal screen | 🔥🔥🔥 | 1d | [01-money-wasted-reveal.md](./01-money-wasted-reveal.md) |
| 2 | CSV → dashboard persistence | 🔥🔥🔥 | 1–2d | [02-csv-to-dashboard-persistence.md](./02-csv-to-dashboard-persistence.md) |
| 3 | Shareable report URL | 🔥🔥🔥 | 2–3d | [03-shareable-report-url.md](./03-shareable-report-url.md) |
| 4 | Forecast / ROI anchor card | 🔥🔥 | 2d | [04-forecast-roi-card.md](./04-forecast-roi-card.md) |
| 5 | Slack-style alert mockup | 🔥🔥 | 1d | [05-slack-alert-mockup.md](./05-slack-alert-mockup.md) |
| 6 | Industry benchmark comparison | 🔥🔥 | 1–2d | [06-industry-benchmarks.md](./06-industry-benchmarks.md) |
| 7 | Free CSV audit landing page | 🔥🔥 | 2d | [07-free-csv-audit-landing.md](./07-free-csv-audit-landing.md) |

**Total: ~10–13 dev days.**

---

## Definition of Done (sprint level)

A non-technical friend can be walked through the demo flow in under 8 minutes and ends with *"how do I sign up."*

End-to-end test:
1. Open `/audit` in incognito (no signup)
2. Upload a sample Meta CSV
3. "Money Wasted" reveal appears within 5 seconds with a real € number
4. Click into a killed ad → reasoning panel with confidence label appears
5. Forecast card shows projected uplift in € for next month
6. Industry benchmark card shows comparison to vertical median
7. Slack alert mock component renders convincingly
8. Click "share this report" → copy URL
9. Open URL in different browser → confirm same data renders, fully styled

---

## What's deliberately NOT in this sprint

These were considered and explicitly cut. Don't let scope creep add them back:

- ❌ User auth (Sprint 2)
- ❌ Stripe billing (Sprint 2)
- ❌ Real Slack/Telegram integration (Sprint 3+)
- ❌ Auto-execute (one-click pause via Meta API) (Sprint 3+)
- ❌ Multi-account dashboard for agencies (Sprint 3+)
- ❌ Google Ads / TikTok ingestion (deliberate single-platform focus)
- ❌ Email digest (Sprint 2)

---

## Cross-cutting rules for every feature

These apply to **every** spec in this sprint. Read once, apply always.

1. **Heed `AGENTS.md` at repo root.** This is Next.js 16.2.4 with breaking changes from older versions. Before touching any Next.js API, check `node_modules/next/dist/docs/`. Do not assume training-data behaviour.

2. **Match the existing visual language.** Dark theme, glassmorphism, CSS custom properties (`--bg`, `--surface-1/2/3`, `--text-1/2/3`, `--border`). Verdict colors: SCALE `#10b981`, KILL `#ef4444`, FIX `#f59e0b`, HOLD `#6366f1`. Inter font.

3. **Reuse existing primitives.** Before writing new code, grep `src/lib/` for utilities. The decision engine (`engine.ts`), types (`types.ts`), and seed data (`seed.ts`) are stable APIs.

4. **No new dependencies without justification.** The stack is set: Next.js, TypeScript, Tailwind, Recharts, Lucide React, Supabase. Anything else needs a 1-sentence reason.

5. **Demo-first mindset.** Polish the moments a prospect SEES. Skip polish on internals. A janky admin page is fine; a janky reveal screen kills the sale.

6. **Tailwind + inline `style` is fine.** The codebase mixes both. Don't refactor to one or the other.

7. **TypeScript strict.** Run `npx tsc --noEmit` before declaring done. CI will fail otherwise.

8. **No emojis in source code unless they're already there for a verdict label.** Keep code clean.

---

## Success metrics (90 days post-sprint)

| Metric | 30-day target | 90-day target |
|---|---|---|
| Demo → pilot conversion | 40% | 55% |
| Pilot → paid conversion | 50% | 70% |
| Time to "money wasted" reveal in demo | < 90 sec | < 60 sec |
| Shareable URL sends per customer per month | 2 | 5 |
| MRR | $5K | $20K |
