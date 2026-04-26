# Lumière — Brand Guide

**Version 1.0 · April 2026**

---

## 1. Core Purpose & Mission

Lumière exists to give small DTC brands the clarity they can't afford to hire.

Most SMB teams are flying blind — spending thousands per day on Meta without knowing which ads are burning money and which deserve more budget. Traditional ad tools give you charts and leave the thinking to you. Lumière gives you a verdict: **scale it, kill it, fix it, or hold it.**

> *We are the media buyer a small brand can't afford to hire.*

---

## 2. Target Audience

**Primary:** DTC brand owners and performance marketers spending €5k–€50k/month on Meta Ads.

**Profile:**
- Founder-led brands or 1–3 person marketing teams
- Too small for a dedicated analyst or media agency
- Performance-obsessed but time-starved
- Frustrated by tools that require interpretation
- Suspicious of enterprise pricing and annual contracts
- Age 25–40, direct-response mindset

**They are not looking for dashboards.** They're looking for someone to tell them what to do.

---

## 3. Unique Value Proposition

> **"Northbeam starts at $1,500/month. We're $499. They give you charts. We give you decisions."**

Three differentiators that cannot be matched by incumbents:

1. **Price** — $499/month, month-to-month, cancel anytime. Northbeam's cheapest tier is 3× our price and still requires the user to interpret data themselves.
2. **Decisions, not attribution** — Every ad gets one clear action. We don't model attribution across channels. We tell you what to do on Meta, today.
3. **Depth over breadth** — Meta-first by design. We are the best at one platform, not mediocre at twelve.

---

## 4. Core Values

- **Directness** — Say what the data says, even when it stings. Never soften a KILL with "consider deprioritizing."
- **Clarity** — One decision per ad. No equivocation, no maybes.
- **Speed** — 60 seconds from login to action plan.
- **Honesty** — Read-only access. We never touch your campaigns, budgets, or creative settings.
- **Craft** — A product this opinionated should also be beautiful. Every screen should feel intentional.

---

## 5. Brand Personality

**Direct. Slightly provocative. Confident without being arrogant.**

Lumière is like a smart friend who happens to have access to your ad account. They won't sugarcoat a €4k/month waste problem. They'll say: *"You're bleeding money on three ads. Here's exactly which ones and what to do."*

Personality spectrum:
- Serious ↔ **Playful** → closer to serious, but dry wit is welcome
- Corporate ↔ **Human** → firmly human
- Affordable ↔ **Premium** → premium product, honest price
- Complex ↔ **Simple** → ruthlessly simple

---

## 6. Tone of Voice

**Direct. Data-backed. Occasionally dry. Never corporate.**

| Do | Don't |
|---|---|
| "Your ad is burning €800/day." | "Suboptimal performance has been detected." |
| "Kill it. ROAS 0.7x — below your break-even." | "This ad may benefit from being paused." |
| "60 seconds. No credit card." | "Get started with our easy onboarding flow." |
| "We never touch your campaigns." | "Rest assured, your data is safe with us." |
| "Stop guessing. Start deciding." | "Leverage AI-powered insights to optimise your ROI." |

**Sentence length:** Short. If you need a comma, consider a period instead.

**Jargon rule:** Allowed: ROAS, CTR, CVR, CPA, DTC, Meta, ad set. Forbidden: "leverage," "synergies," "unlock," "granular insights," "holistic view."

---

## 7. Visual System

### Color Palette

#### Surfaces (light editorial)
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FAFAF8` | Page background |
| `--surface-1` | `#FFFFFF` | Cards, panels |
| `--surface-2` | `#F5F4F1` | Subtle fills, inputs |
| `--surface-3` | `#EEECEA` | Deeper insets, track fills |
| `--border` | `#E5E3DF` | All borders |
| `--border-hover` | `#CBC8C3` | Hovered borders |

#### Brand (amber)
| Token | Hex | Use |
|---|---|---|
| `--brand` | `#D97706` | Primary CTA, active states |
| `--brand-light` | `#B45309` | Link text, secondary brand |
| `--brand-glow` | `rgba(217,119,6,0.20)` | Selection highlight |

The amber is warm, decisive, and earned. It says money — which is exactly what this product is about.

#### Text
| Token | Hex | Use |
|---|---|---|
| `--text-1` | `#1A1917` | Headlines, primary content |
| `--text-2` | `#57534E` | Body, descriptions |
| `--text-3` | `#A8A29E` | Labels, metadata, placeholders |

#### Decision Semantic Colors
These are fixed brand assets, not arbitrary UI colors. Consistent use reinforces instant recognition.

| Decision | Color | Background | Use |
|---|---|---|---|
| SCALE | `#059669` | `#ECFDF5` | Growing, winning ads |
| KILL | `#DC2626` | `#FEF2F2` | Underperforming, waste |
| FIX | `#D97706` | `#FFFBEB` | Diagnosable issues |
| HOLD | `#4F46E5` | `#EEF2FF` | Insufficient data |

Note: FIX deliberately shares the brand amber — "needs attention" maps to the brand signal.

#### Dark Surface (footer, inverted sections)
`#1A1917` — warm near-black, not cold.

---

### Typography

**Display / Wordmark:** Fraunces (italic, variable optical size)
- Used for: logo wordmark, hero headlines, editorial pull-quotes
- Weights: 300 (light), 700 (bold), 900 (black)
- CSS class: `.font-display`

**UI / Body:** Inter
- Used for: all interface text, labels, data, copy
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Default font stack: `'Inter', system-ui, -apple-system, sans-serif`

**Typographic scale:**
- Hero headline: `clamp(42px, 4.5vw, 62px)`, `font-weight: 300/900` (mixed), `letter-spacing: -0.03em`
- Section heading: `38px`, `font-weight: 500`, `letter-spacing: -0.02em`
- Card title: `18px`, `font-weight: 600`
- Body: `15–17px`, `line-height: 1.6–1.7`
- Label/meta: `11–13px`, `font-weight: 700`, `letter-spacing: 0.05–0.1em`, uppercase

---

### Spacing

8pt grid. CSS tokens: `--s-1` (2px) through `--s-12` (48px).

Standard section padding: `80px 24px`. Max content width: `1120px`.

---

### Border Radius

| Token | Value | Use |
|---|---|---|
| `--r-sm` | `8px` | Buttons, badges, small elements |
| `--r-md` | `12px` | Cards, inputs |
| `--r-lg` | `16px` | Large cards |
| `--r-xl` | `20px` | Hero cards, modals |

---

### Shadow & Depth

Light editorial shadows (not heavy dark-mode glows):
- Card: `0 1px 4px rgba(26,25,23,0.06), 0 4px 12px rgba(26,25,23,0.04)`
- Elevated: `0 8px 32px rgba(26,25,23,0.08)`
- CTA button: `0 4px 24px rgba(217,119,6,0.30)`

---

### Logo

**Wordmark:** "Lumière" in Fraunces italic, `font-weight: 700`, `font-style: italic`, `letter-spacing: -0.02em`, `font-size: 22px` in nav.

**Icon mark:** Square with rounded corners (`border-radius: 8px`), amber gradient (`#D97706` → `#B45309`), white "L" in font-weight 900.

The name is French for "light" — the product name and visual system should feel like illumination: warm, clear, confident.

---

## 8. Emotional Impact

When a DTC marketer lands on Lumière, they should feel:

1. **Seen** — *"This was built for someone exactly like me."*
2. **Relieved** — *"Finally, someone who doesn't make me interpret charts."*
3. **Confident** — *"I know what to do next."*

The product's job is to eliminate the anxiety of not knowing. Every screen — especially the "wasted spend" reveal — should feel like someone turning a light on, not adding more noise.

---

## 9. Competitive Positioning

### Direct competitors
| Brand | Price | Positioning | Our edge |
|---|---|---|---|
| Northbeam | $1,500+/mo | Multi-touch attribution, enterprise | 3× cheaper, decisions not charts |
| Triple Whale | $300+/mo | Shopify-native analytics | Meta-depth, action-first |
| Madgicx | $44+/mo | AI automation | No black-box automation, human control |

### Indirect competitors
- Spreadsheets + gut feel
- Agency retainer reports
- Facebook Ads Manager raw data

### The frame that wins
Don't compete on features. Compete on the buyer's moment of pain:

> *"Your marketer is staring at a Meta dashboard at 9am, their boss wants to know why ROAS dropped, and they have no idea which of their 20 ads to pause. That's our customer. Northbeam doesn't serve them."*

---

## 10. Brand Promise

> **"Stop guessing. Start deciding."**

Every ad, one verdict. Clarity in 60 seconds.

Supporting proof points:
- €499/month — no annual contract
- Read-only access — we never touch your campaigns
- 60 seconds from upload to action plan
- Scale · Kill · Fix · Hold — the only four words that matter

---

## Application Rules

### Website hierarchy
1. **Marketing pages** (`/onboarding`, `/audit`) — full editorial treatment: Fraunces headlines, warm off-white backgrounds, amber CTAs, generous white space
2. **App pages** (`/`, `/decisions`, `/creatives`) — functional but branded: consistent amber active states, editorial type scale, same surface palette
3. **Shared reports** (`/r/[hash]`) — marketing-grade presentation, same palette, light sticky header

### What to avoid
- Dark glassmorphism (old aesthetic, brand-inconsistent)
- Purple brand color (replaced by amber)
- Light-on-dark text in UI cards (replaced by dark-on-light)
- Jargon in CTAs ("leverage," "unlock," "optimise")
- Multiple competing accent colors in a single screen
- Stock photography — data visualizations only
