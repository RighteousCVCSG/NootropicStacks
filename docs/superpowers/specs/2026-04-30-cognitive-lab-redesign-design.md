# NootropicStacker — Cognitive Lab Redesign

**Date:** 2026-04-30
**Status:** Approved (design)
**Owner:** Chris Gauvin
**Scope:** Visual + IA redesign of nootropicstacker.com (Website repo). No backend changes.

---

## Goal

Replace the warm-cream + deep-teal + amber palette that shipped on 2026-04-29 with a dark "Cognitive Lab" aesthetic, and flatten an over-stuffed information architecture into a tool-first experience. The site should read as a serious data-rich nootropic stack builder (Linear / Huberman Lab / Bryan Johnson Blueprint adjacent), not a wellness blog.

The brand kit's typography, token plumbing, and component primitives stay. Only the palette, navigation surface, homepage layout, and a handful of always-on UI elements change.

## Design direction

**Cognitive Lab.** Dark slate canvas as default, electric violet primary, electric cyan secondary. Editorial Fraunces serif for headlines, Inter sans for UI, JetBrains Mono for tabular numerical data. Warm amber for warnings, hot magenta for danger. No green anywhere. Light mode ships as a toggle but is not the marketed default.

## Color tokens

| Role | Dark (default) | Light (toggle) |
|---|---|---|
| `--surface-page` | `#0B0F1A` | `#FAFAFB` |
| `--surface-card` | `#141926` | `#FFFFFF` |
| `--surface-raised` | `#1B2030` | `#F4F5F7` |
| `--surface-modal` | `#232940` | `#FFFFFF` |
| `--border` | `#2A3046` | `#E5E7EB` |
| `--ink-900` | `#FFFFFF` | `#0B0F1A` |
| `--ink-700` | `#C8CDD9` | `#404654` |
| `--ink-500` | `#8990A3` | `#707888` |
| `--accent-primary` | `#8A6EFF` | `#7C5CFF` |
| `--accent-primary-hover` | `#A285FF` | `#6B47FF` |
| `--accent-primary-soft` | `#2A2247` | `#EFEAFF` |
| `--accent-secondary` (synergy/positive) | `#22D3EE` | `#0891B2` |
| `--warning` | `#FFC53D` | `#D97706` |
| `--danger` | `#FF5A8C` | `#E11D48` |
| `--overlay` | `rgba(0,0,0,0.6)` | `rgba(15,23,42,0.4)` |

Replaces (from current `tokens.css`): `#0f4c46` deep teal, `#faf7f2` warm cream, `#c9831f` warm amber.

shadcn/ui CSS variables already reference brand tokens (per Aria's 2026-04-29 wiring), so changing `tokens.css` cascades to every shadcn component without code edits.

## Typography (unchanged)

- Display / headlines: **Fraunces** (variable serif, self-hosted via `public/fonts/`)
- Body / UI: **Inter** (variable sans)
- Tabular data: **JetBrains Mono** (dosages, scores, evidence ratings)

Type scale and line-height tokens stay as defined in `src/brand-kit/tokens.css`.

## Information architecture

**Top navigation: 5 surfaces (down from 15).**

Header = `Build` | `Supplements` | `Stacks` | `Learn` | **`Quiz`** (accent CTA) | auth + theme toggle

| Group | Lives at | What it bundles |
|---|---|---|
| **Build** | `/` | Stack Builder is the homepage. Goal Selector lives inside the builder, not as a separate route. |
| **Supplements** | `/supplements` | Library + per-row "Compare" action. The following routes still resolve and are linked from within `/supplements` rather than from the top nav: `/compare/:slugs`, `/compare-supplements`, `/best-nootropics`, `/nootropics-for-focus`, `/nootropics-for-anxiety`. |
| **Stacks** | `/stacks` | Tabbed: Pre-Built / Best Stacks / Celebrity Stacks. Old routes still resolve. |
| **Learn** | `/learn` (new hub) | Blog, Research Library, Glossary, Families, FAQ, News, Videos, Reviews, Start Here. Each existing route still works; `/learn` is a curated landing. |
| **Quiz** | `/quiz` | Promoted as accent button — main acquisition funnel. |

**No URLs are deleted.** This is a navigation flatten. Existing redirects (`/library` → `/supplements`, `/research` → `/blog`, `/guides/:slug` → `/blog/:slug`) stay. SEO untouched.

Footer keeps the full sitemap as today.

Mobile sheet flattens to match the desktop nav (5 items + Quiz CTA + auth + theme toggle). Sub-headers ("Discover / Tools / Resources") removed.

## Homepage layout

Reduce from 7 sections to 5. Stack Builder gets to be the product, not a section.

1. **Hero band** — eyebrow chip, single headline, primary CTA, 4-item trust micro-strip (e.g., "195 supplements indexed · 60+ interactions mapped · 93+ research articles · Every claim cites PubMed").
2. **Stack Builder** — 2-column (was 3). Left: Goal selector + current stack panel + protocol notes. Right: Recommendations + Library/Pre-Built tabs. Full content width.
3. **Featured Stacks** — 3 cards (For Focus / For Sleep / For Mood) linking into `/stacks`.
4. **Quiz strip** — single-line CTA: "Not sure where to start? Answer 6 questions and we'll suggest a stack."
5. **Featured Articles** — 3 cards. Link to `/learn` for the full archive.

Removed or relocated:
- **How It Works** — folded into Stack Builder empty state (when stack is empty, show 3 inline numbered steps inside the builder).
- **Trusted Resources** — moves to `/learn`.
- **SEO content (`<SEOContent />`)** — still rendered for crawlers; visually de-emphasized as a single block at the bottom of the page, below the footer fold.

## Key component changes

- **`App.jsx` header** — collapse from 5 nav + 9-item More dropdown to 4 nav + Quiz accent CTA + auth + theme toggle.
- **`App.jsx` mobile sheet** — flatten to match. Drop sub-headers.
- **`StackScoreWidget`** — route-gated. Render only on `/`, `/quiz`, `/stacks`, `/celebrity-stacks`. Currently floats on every route.
- **`AffiliateDisclosure`** — remove `variant="banner"` use at App.jsx level (currently rendered above every route). Use inline pattern at affiliate-link sites: small "(we earn a commission)" next to each affiliate link or product card.
- **Medical disclaimer** — replace the always-on `callout--warn` block in `App.jsx` with a thin top-strip that only renders on supplement-detail and stack-builder routes. Other routes don't need it above the fold.
- **Surface elevation system** — define 4 dark-mode surfaces (page / card / raised / modal) with subtle borders. Apply via existing `--surface-*` tokens; no new component classes.
- **Theme toggle** — add a single `Sun/Moon` button in the header that flips `data-theme` on the document root. Default to `dark`. Persist in `localStorage`.
- **`HomePage` extraction** — move the inline `HomePage` function out of `App.jsx` into `src/components/HomePage.jsx` so the homepage can be edited independently of the app shell.
- **`LearnHub` (new)** — small landing component at `/learn` that links into the 9 existing learn-adjacent routes with grouped cards.

## Implementation phases

| Phase | Scope | Why this order |
|---|---|---|
| **P1** | Token swap + dark-mode default | Single biggest visual change. ~80% of the perceived aesthetic flips here. |
| **P2** | Header + mobile sheet flatten | Eliminates the "junk drawer" feeling immediately. |
| **P3** | Homepage restructure (extract `HomePage`, rebuild 5 sections, kill 2) | Site stops reading like 7 disconnected sections; tool becomes the hero. |
| **P4** | StackScoreWidget gating + affiliate banner removal + medical disclaimer scoping + new `LearnHub` | Cleanup; quality polish. |
| **P5** | AI / agentic commerce layer — `robots.txt`, `/llms.txt`, JSON-LD schemas, OG/Twitter cards, canonical URLs, sitemap | Makes the site visible and recommendable to ChatGPT, Perplexity, Claude, Google AI Mode. Foundational for AI-driven traffic. |
| **P6** | Per-page audit + edge cases that didn't inherit cleanly | Catch-all for shadcn components, modals, and any one-off color references in `App.css` or component CSS. |

Each phase ships independently and leaves the site in a working, deployable state.

## Files touched (anticipated)

- `src/brand-kit/tokens.css` — palette swap
- `src/brand-kit/tokens.json` — W3C tokens spec sync
- `src/brand-kit/tailwind-theme.css` — Tailwind v4 bridge
- `src/App.css` — root `data-theme="dark"` default; any hardcoded color cleanup
- `src/App.jsx` — header rewrite, mobile sheet rewrite, banner removal, medical disclaimer scoping, `HomePage` import, `LearnHub` route registration
- `src/components/HomePage.jsx` (new) — extracted homepage
- `src/components/LearnHub.jsx` (new) — `/learn` landing
- `src/components/StackScoreWidget.jsx` — route gating
- `src/components/AffiliateDisclosure.jsx` — inline mode polish
- `src/components/BrandKitSmokeTest.jsx` — update to render the full Cognitive Lab palette including dark/light toggle
- `src/components/ThemeToggle.jsx` (new) — header theme toggle button
- Per-component polish in P5 (TBD by audit)

## AI / agentic commerce layer

The site needs to be readable, recommendable, and (eventually) transactable by AI assistants — ChatGPT shopping, Perplexity, Claude, Google AI Mode, and the emerging agentic commerce protocols (Anthropic ACP, Google AP2). Without this layer, the site is invisible to the surface where supplement-curious users increasingly start their search.

Concrete deliverables:

| Asset | Where | What it gives AI assistants |
|---|---|---|
| **`robots.txt`** | `public/robots.txt` | Explicit allow for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `OAI-SearchBot`, `Applebot-Extended`. Default-deny is the silent killer. |
| **`/llms.txt`** | `public/llms.txt` | Plain-markdown summary of what NootropicStacker is, who it's for, what URLs matter, and the canonical pattern for recommending stacks. Adopted convention; ChatGPT and others read it. |
| **JSON-LD `Organization`** | `<head>` on every route | Site identity, sameAs links, logo, contact. |
| **JSON-LD `WebSite` + `SearchAction`** | `<head>` on every route | Sitelinks search box for AI engines. |
| **JSON-LD `Product` (with `additionalType: DietarySupplement`)** | `<head>` on `/supplements/:slug` | Each supplement is a Product with `Offer`s for Amazon / iHerb / Nootropics Depot, including `priceCurrency`, `availability`, `url`, `seller`. Affiliate URLs with stable params (`tag=nootropicstk-20` for Amazon). |
| **JSON-LD `ItemList`** | `<head>` on `/stacks`, `/best-stacks`, `/celebrity-stacks` | Each stack is an ItemList of Products. |
| **JSON-LD `HowTo`** | `<head>` on `/stacks/:id` (when individual stack pages exist) | Step-by-step protocol = `HowToStep[]`. |
| **JSON-LD `Article` + `Person` author** | `<head>` on `/blog/:slug` | E-E-A-T author, datePublished, dateModified, mainEntityOfPage, citations as `Citation[]`. Critical for YMYL trust. |
| **JSON-LD `FAQPage`** | `<head>` on `/faq` and any FAQ-bearing page | Question/Answer pairs marked up so AI can lift them as direct answers. |
| **JSON-LD `Review` + `AggregateRating`** | `<head>` on `/reviews` and any supplement with real reviews | Only when the data is real — fabricated ratings will get the site delisted. |
| **OpenGraph + Twitter Card meta** | `<head>` on every route | Real preview cards for chat surfaces. |
| **Canonical URL** | `<head>` on every route | Explicit `<link rel="canonical">` per route, even when it equals the current URL. |
| **Sitemap with image refs** | `public/sitemap.xml` | Product images included so AI engines can index them. |
| **Stable affiliate URLs** | All product CTAs | Amazon `tag=nootropicstk-20` (per `client/src/lib/affiliate-fallback.ts` if it exists; otherwise centralize). No URL shorteners — agents can't follow them reliably. |

Implementation pattern: a single `<JsonLd type="..." data={...} />` component that renders `<script type="application/ld+json">`, used inside `SEOOptimizer` (already present) at every route. Each schema lives in a typed builder function (`buildProductSchema(supplement)`, `buildArticleSchema(article)`, etc.) so the data and the markup never drift.

Out-of-scope for this redesign: live integration with Anthropic ACP / Google AP2 endpoints (`/.well-known/agent-card.json`, signed product feeds). Those need a backend. We do prepare the page surface so when the backend ships, the agent integration is one route handler away.

## Out of scope (deliberately)

- Backend / API / MySQL / Drizzle / seed
- Old-admin content merge (separate effort, see `_old-admin-reference/`)
- Per-blog-article layout changes (articles inherit new tokens; layout unchanged)
- Light-mode pixel polish (light mode builds and works, but dark is the marketed default)
- Adsense / ad placement logic (`AdManager`, `SmartAdPlacement`) — visual inheritance only
- Stack scoring logic, supplement data, affiliate tag enforcement (`nootropicstk-20`)
- Authentication flow
- Live agentic commerce protocol endpoints (ACP `/.well-known/agent-card.json`, signed product feeds) — needs backend; surface preparation only

## Verification

- `vite build` passes
- `/brand-kit` smoke test renders the full Cognitive Lab palette in both modes
- Manual visual check on every top-level route post-P1, post-P2, post-P3
- Mobile sheet renders correctly at 390x844
- Theme toggle persists across reloads
- No console errors on first paint
- Stack Score widget does not appear on `/supplements`, `/blog`, `/learn`, `/contact`
- Medical disclaimer only appears on `/`, `/supplements/:id`, and stack-builder routes
- Affiliate banner removed from above-the-fold; inline disclosures present at every affiliate link

## Risks / gotchas

- Some components reference colors directly (not via tokens). P5 audit will catch these.
- `BrandKitSmokeTest` was wired today (2026-04-29) with the teal palette — must update to verify the new palette before broader QA.
- The `App.css` shadcn `:root` block currently maps to brand tokens; verify dark mode `data-theme` selector matches what shadcn expects.
- Existing redirects and route patterns must not regress during nav flatten.
- Image assets for supplement cards may need a subtle drop-shadow in dark mode (white bottles against dark surfaces) — handled per-component in P5.
