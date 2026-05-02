# NootropicStacker Cognitive Lab Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the warm-cream/teal/amber palette with a dark "Cognitive Lab" aesthetic, flatten the navigation from 15 surfaces to 5, restructure the homepage so the Stack Builder is the product, and ship a full AI-commerce structured-data layer so the site is recommendable and (eventually) transactable by ChatGPT, Perplexity, Claude, and Google AI Mode.

**Architecture:** Token-driven design system. shadcn/ui CSS variables already reference brand tokens, so palette swap cascades to all components. Routes stay; only the navigation surface, homepage layout, and a handful of always-on UI elements change. AI commerce layer adds JSON-LD via a single reusable component plus per-route schema builders.

**Tech Stack:** React 19 + Vite, Tailwind CSS v4, shadcn/ui, react-router v7, Radix UI, Fraunces / Inter / JetBrains Mono fonts (self-hosted).

**Spec:** [`docs/superpowers/specs/2026-04-30-cognitive-lab-redesign-design.md`](../specs/2026-04-30-cognitive-lab-redesign-design.md)

**Working directory:** `/home/chris/Projects/work/Nootropicstacker.com/Website`

---

## Phase 0 — Branch + dev server up

### Task 0.1: Create working branch and start dev server

**Files:** none

- [ ] **Step 1: Create feature branch**
```bash
cd /home/chris/Projects/work/Nootropicstacker.com/Website
git checkout -b redesign/cognitive-lab
```

- [ ] **Step 2: Install (idempotent) and start dev server in background**
```bash
pnpm install
pnpm dev &
```
Expected: dev server reachable at `http://localhost:5173` (or whatever Vite picks).

- [ ] **Step 3: Open `/brand-kit` in browser as your live smoke test**
Keep this tab open through the whole project — every token change reflects here first.

---

## Phase 1 — Token swap + dark-mode default

Goal: Replace the teal/cream/amber palette with Cognitive Lab slate/violet/cyan. After P1, the entire site should look like a different product even though no component code changed.

### Task 1.1: Replace `tokens.css` with Cognitive Lab palette

**Files:**
- Modify: `src/brand-kit/tokens.css`

- [ ] **Step 1: Read the current file** (`Read tool`) to understand the existing structure (sections for color, font, spacing, radius, shadow, motion, layout, focus, z-index).

- [ ] **Step 2: Replace the color section** with the dark-default palette below. Keep all other sections (fonts, spacing, radius, shadows, motion, layout, focus, z-index) unchanged.

```css
/* === COGNITIVE LAB — DARK MODE DEFAULT === */
:root {
  /* Surfaces (dark by default) */
  --surface-page:    #0B0F1A;
  --surface-card:    #141926;
  --surface-raised:  #1B2030;
  --surface-modal:   #232940;
  --border:          #2A3046;
  --overlay:         rgba(0, 0, 0, 0.6);

  /* Ink (text) */
  --ink-900: #FFFFFF;
  --ink-700: #C8CDD9;
  --ink-500: #8990A3;
  --ink-on-dark: #FFFFFF;

  /* Brand accents */
  --accent-primary:       #8A6EFF;  /* electric violet */
  --accent-primary-hover: #A285FF;
  --accent-primary-soft:  #2A2247;

  /* Secondary / synergy / positive (electric cyan, NOT green) */
  --accent-secondary:       #22D3EE;
  --accent-secondary-hover: #67E8F9;
  --accent-secondary-soft:  #0E3B47;

  /* Functional */
  --warning: #FFC53D;
  --danger:  #FF5A8C;

  /* Legacy aliases used by shadcn/ui (kept for component compatibility) */
  --primary-050: var(--accent-primary-soft);
  --primary-100: #322861;
  --primary-300: #6B47FF;
  --primary-400: var(--accent-primary);
  --primary-700: var(--accent-primary);
  --primary-800: var(--accent-primary);
  --primary-900: #C5B5FF;
}

/* === LIGHT MODE (toggle) === */
:root[data-theme="light"] {
  --surface-page:    #FAFAFB;
  --surface-card:    #FFFFFF;
  --surface-raised:  #F4F5F7;
  --surface-modal:   #FFFFFF;
  --border:          #E5E7EB;
  --overlay:         rgba(15, 23, 42, 0.4);

  --ink-900: #0B0F1A;
  --ink-700: #404654;
  --ink-500: #707888;
  --ink-on-dark: #FFFFFF;

  --accent-primary:       #7C5CFF;
  --accent-primary-hover: #6B47FF;
  --accent-primary-soft:  #EFEAFF;

  --accent-secondary:       #0891B2;
  --accent-secondary-hover: #0E7490;
  --accent-secondary-soft:  #CFFAFE;

  --warning: #D97706;
  --danger:  #E11D48;

  --primary-050: var(--accent-primary-soft);
  --primary-100: #DDD6FE;
  --primary-300: #A78BFA;
  --primary-400: var(--accent-primary);
  --primary-700: var(--accent-primary-hover);
  --primary-800: var(--accent-primary-hover);
  --primary-900: #5B21B6;
}
```

- [ ] **Step 3: Reload `/brand-kit` and visually confirm** the page background is dark slate, text is white, primary accents are violet.

### Task 1.2: Sync `tokens.json` (W3C Design Tokens)

**Files:**
- Modify: `src/brand-kit/tokens.json`

- [ ] **Step 1: Open `tokens.json`** and locate the `color` group.

- [ ] **Step 2: Update each color token to match the dark-mode values from Task 1.1.** Keep the file structure and naming intact. Each token's `$value` becomes the new hex; `$description` should be updated to reflect the Cognitive Lab role (e.g., `"Electric violet — primary brand accent"`).

- [ ] **Step 3: Save and verify** by re-opening `/brand-kit` (no rebuild needed; tokens.css is the runtime source of truth).

### Task 1.3: Update `tailwind-theme.css`

**Files:**
- Modify: `src/brand-kit/tailwind-theme.css`

- [ ] **Step 1: Read the current bridge file** to see how Tailwind v4 `@theme` directives map brand tokens.

- [ ] **Step 2: Replace any hardcoded teal/cream/amber hex values** with `var(--accent-primary)` / `var(--surface-page)` / `var(--accent-secondary)` references so Tailwind utility classes (e.g., `bg-primary-800`, `text-ink-on-dark`) inherit from the new tokens.

### Task 1.4: Set dark as the default theme on document root

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Open `index.html`** and add `data-theme="dark"` to the `<html>` element.
```html
<html lang="en" data-theme="dark">
```

- [ ] **Step 2: Add `color-scheme: dark light;`** to the inline `<style>` if present, or to the existing CSS (so native scrollbars and form controls match).

### Task 1.5: Update `BrandKitSmokeTest` to render the full Cognitive Lab palette

**Files:**
- Modify: `src/components/BrandKitSmokeTest.jsx`

- [ ] **Step 1: Read the current component** to see what sections it renders.

- [ ] **Step 2: Add a swatch grid** that visualizes every token from Task 1.1 with both its CSS variable name and current value. Include sections for: surfaces, ink, accents, functional colors, primary scale (050–900).

- [ ] **Step 3: Add a theme-toggle button** at the top of the page that flips `document.documentElement.dataset.theme` between `'dark'` and `'light'` so QA can verify both modes side-by-side.

### Task 1.6: Build verification + commit

- [ ] **Step 1: Run build**
```bash
pnpm build
```
Expected: build succeeds. CSS bundle size should be similar to baseline (~141 kB) ± 5 kB.

- [ ] **Step 2: Commit P1**
```bash
git add src/brand-kit/ index.html src/components/BrandKitSmokeTest.jsx
git commit -m "feat(design): swap to Cognitive Lab palette; default dark mode

- Replace teal/cream/amber tokens with slate/violet/cyan
- Add dark-default + light-toggle theme variants
- Update BrandKitSmokeTest to render full palette in both modes"
```

---

## Phase 2 — Header & mobile sheet flatten

Goal: Reduce nav surfaces from 15 to 5 + a Quiz CTA. Add a theme toggle. Add `/learn` hub.

### Task 2.1: Create `ThemeToggle` component

**Files:**
- Create: `src/components/ThemeToggle.jsx`

- [ ] **Step 1: Write the component**
```jsx
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const STORAGE_KEY = 'noo-theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const next = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}
```

### Task 2.2: Create `LearnHub` component

**Files:**
- Create: `src/components/LearnHub.jsx`

- [ ] **Step 1: Write a route landing component** that links to all 9 learn-adjacent routes via grouped cards (Editorial: Blog, Research Library; Reference: Glossary, Families, FAQ; Updates: News, Videos, Reviews, Start Here). Use `<Link>` from `react-router-dom`. Each card uses `bg-surface-card`, `border-border`, `hover:border-accent-primary` Tailwind classes — all token-driven.

- [ ] **Step 2: Add SEO meta** by wrapping with `<SEOOptimizer page="home" customTitle="Learn — NootropicStacker" customDescription="..." />`.

### Task 2.3: Register `/learn` route in `App.jsx`

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add lazy import** alongside the other lazy imports near the top:
```jsx
const LearnHub = lazy(() => import('./components/LearnHub.jsx').then(m => ({ default: m.LearnHub })));
```

- [ ] **Step 2: Add the route** inside `<Routes>`:
```jsx
<Route path="/learn" element={<LearnHub />} />
```

### Task 2.4: Flatten the desktop header navigation

**Files:**
- Modify: `src/App.jsx` (the `<nav className="hidden md:flex ...">` block, ~line 426)

- [ ] **Step 1: Replace the existing nav block** with:
```jsx
<nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
  <NavLink to="/" icon={Home}>Build</NavLink>
  <NavLink to="/supplements" icon={Library}>Supplements</NavLink>
  <NavLink to="/stacks" icon={Layers}>Stacks</NavLink>
  <NavLink to="/learn" icon={BookOpen}>Learn</NavLink>
  <Link to="/quiz">
    <Button size="sm" className="bg-accent-primary hover:bg-accent-primary-hover text-ink-on-dark ml-2">
      <HelpCircle className="w-4 h-4 mr-1" />
      Quiz
    </Button>
  </Link>
</nav>
```

- [ ] **Step 2: Add `<ThemeToggle />` to the right-side cluster**, between `<HeaderAuth />` and the mobile hamburger:
```jsx
<div className="flex items-center gap-2">
  <ThemeToggle />
  <HeaderAuth />
  <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileNavOpen(true)}>
    <Menu className="w-5 h-5" />
  </Button>
</div>
```

- [ ] **Step 3: Import `ThemeToggle`** at the top of `App.jsx`:
```jsx
import { ThemeToggle } from './components/ThemeToggle.jsx';
```

### Task 2.5: Flatten the mobile sheet navigation

**Files:**
- Modify: `src/App.jsx` (the `<Sheet ...>` block, ~line 486)

- [ ] **Step 1: Replace the body of the mobile sheet's `<nav>`** with the same 5-item structure (drop the "Discover / Tools / Resources" sub-headers):
```jsx
<div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
  <NavLink to="/" icon={Home}>Build</NavLink>
  <NavLink to="/supplements" icon={Library}>Supplements</NavLink>
  <NavLink to="/stacks" icon={Layers}>Stacks</NavLink>
  <NavLink to="/learn" icon={BookOpen}>Learn</NavLink>

  <Link to="/quiz" className="block">
    <Button size="sm" className="w-full bg-accent-primary hover:bg-accent-primary-hover text-ink-on-dark mt-2">
      <HelpCircle className="w-4 h-4 mr-2" />
      Take the Quiz
    </Button>
  </Link>

  <div className="h-px bg-border my-3" />
  <ThemeToggle />
  <MobileAuthSection />
</div>
```

### Task 2.6: Build + visual smoke + commit

- [ ] **Step 1: Run build**
```bash
pnpm build
```
Expected: success, no missing-import errors.

- [ ] **Step 2: In the browser**, click each top nav link and verify it navigates correctly. Open mobile devtools at 390x844 and verify the sheet renders. Toggle theme and verify it persists across reload.

- [ ] **Step 3: Commit P2**
```bash
git add src/App.jsx src/components/ThemeToggle.jsx src/components/LearnHub.jsx
git commit -m "feat(nav): flatten header to 5 surfaces; add theme toggle and /learn hub

- Desktop nav: Build | Supplements | Stacks | Learn + Quiz CTA
- Mobile sheet: same 5 + theme toggle + auth
- Theme persists via localStorage; default dark"
```

---

## Phase 3 — Homepage restructure

Goal: 7 sections → 5. Stack Builder becomes the homepage hero.

### Task 3.1: Extract `HomePage` from `App.jsx`

**Files:**
- Create: `src/components/HomePage.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Move the inline `function HomePage() { ... }`** (currently around line 154 of `App.jsx`) into a new file `src/components/HomePage.jsx`. Export named: `export function HomePage() {...}`. Carry over its imports.

- [ ] **Step 2: In `App.jsx`**, replace the inline definition with an import:
```jsx
import { HomePage } from './components/HomePage.jsx';
```

- [ ] **Step 3: Build to verify nothing regressed**
```bash
pnpm build
```

### Task 3.2: Rebuild hero section

**Files:**
- Modify: `src/components/HomePage.jsx`

- [ ] **Step 1: Replace the existing hero block** (eyebrow + h1 + subtitle + 2 CTAs + 4-item trust strip) with a tighter version:

```jsx
<section className="mb-10">
  <div className="text-center max-w-3xl mx-auto">
    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent-primary bg-accent-primary-soft px-3 py-1 rounded-full mb-4">
      Free Nootropic Stack Builder
    </span>
    <h1
      className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 leading-tight mb-4"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      Build smarter nootropic stacks,<br />
      <span className="text-accent-primary">backed by science.</span>
    </h1>
    <p className="text-ink-700 text-base sm:text-lg max-w-2xl mx-auto mb-6">
      The PCPartPicker for nootropics. 195 supplements, 60+ interactions mapped, every claim cites PubMed.
    </p>
    <a href="#stack-builder">
      <Button size="lg" className="bg-accent-primary hover:bg-accent-primary-hover text-ink-on-dark">
        Start Building <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </a>
  </div>
</section>
```

- [ ] **Step 2: Remove the standalone "How It Works" gradient panel** that appears below the hero. (It will move into the Stack Builder empty state in Task 3.8.)

### Task 3.3: Restructure Stack Builder to 2-column

**Files:**
- Modify: `src/components/HomePage.jsx`

- [ ] **Step 1: Change the grid** from `grid-cols-1 lg:grid-cols-3` to `grid-cols-1 lg:grid-cols-5`, with the left column spanning 2 and the right spanning 3:
```jsx
<div id="stack-builder" className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
  <div className="lg:col-span-2 space-y-6">
    <GoalSelector />
    <StackPanel />
    <StackProtocolBuilder />
  </div>
  <div className="lg:col-span-3 space-y-6">
    <RecommendationPanel />
    <Tabs defaultValue="library" className="w-full">
      {/* ... existing tabs body unchanged ... */}
    </Tabs>
  </div>
</div>
```

- [ ] **Step 2: Remove `<ContextualAd>` and `<SmartAdPlacement>`** from the homepage Stack Builder area. Ads can return in a less intrusive treatment in P6 if needed.

### Task 3.4: Add Featured Stacks section

**Files:**
- Modify: `src/components/HomePage.jsx`

- [ ] **Step 1: Add a new section** after the Stack Builder grid:
```jsx
<section className="mb-10">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-ink-900">Featured stacks</h2>
    <Link to="/stacks" className="text-sm text-accent-primary hover:underline">
      View all stacks →
    </Link>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {[
      { slug: 'focus', title: 'For Focus', desc: 'L-Theanine + Caffeine + Lion\'s Mane', href: '/stacks?goal=focus' },
      { slug: 'sleep', title: 'For Sleep', desc: 'Magnesium + Glycine + Apigenin', href: '/stacks?goal=sleep' },
      { slug: 'mood', title: 'For Mood', desc: 'Ashwagandha + Rhodiola + Saffron', href: '/stacks?goal=mood' },
    ].map(s => (
      <Link key={s.slug} to={s.href}>
        <div className="p-5 rounded-xl bg-surface-card border border-border hover:border-accent-primary transition-colors">
          <h3 className="font-semibold text-ink-900 mb-1">{s.title}</h3>
          <p className="text-sm text-ink-500">{s.desc}</p>
        </div>
      </Link>
    ))}
  </div>
</section>
```

### Task 3.5: Add Quiz strip CTA

**Files:**
- Modify: `src/components/HomePage.jsx`

- [ ] **Step 1: Add after Featured Stacks**:
```jsx
<section className="mb-10">
  <div className="rounded-2xl bg-accent-primary-soft border border-accent-primary p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div>
      <h2 className="text-xl font-semibold text-ink-900 mb-1">Not sure where to start?</h2>
      <p className="text-sm text-ink-700">Answer 6 questions and we'll suggest a stack.</p>
    </div>
    <Link to="/quiz">
      <Button size="lg" className="bg-accent-primary hover:bg-accent-primary-hover text-ink-on-dark">
        Take the Quiz <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </Link>
  </div>
</section>
```

### Task 3.6: Trim Featured Articles to 3

**Files:**
- Modify: `src/components/HomePage.jsx`

- [ ] **Step 1: Reduce the `featuredArticles` array** to the top 3 by readTime ascending or by editorial pick. Keep the existing rendering grid.

### Task 3.7: Move Trusted Resources off the homepage

**Files:**
- Modify: `src/components/HomePage.jsx`
- Modify: `src/components/LearnHub.jsx`

- [ ] **Step 1: Delete the "Research & References" / Trusted Resources block** from `HomePage.jsx`.

- [ ] **Step 2: Add it as a section** at the bottom of `LearnHub.jsx`.

### Task 3.8: Fold How It Works into Stack Builder empty state

**Files:**
- Modify: `src/components/StackPanel.jsx` (or wherever the empty state lives — confirm by reading the file first)

- [ ] **Step 1: Read `StackPanel.jsx`** to find the empty state (when `stack.length === 0`).

- [ ] **Step 2: Replace the empty state** with a 3-step inline guide using the same numbered-circle treatment but inside the panel itself, not as a separate page section.

### Task 3.9: De-emphasize SEO content

**Files:**
- Modify: `src/components/HomePage.jsx`

- [ ] **Step 1: Move `<SEOContent />`** below the Featured Articles section, wrap in `<aside className="mt-16 opacity-60 text-sm">` so it stays crawlable but visually quiet.

### Task 3.10: Build + commit P3

- [ ] **Step 1: Build**
```bash
pnpm build
```

- [ ] **Step 2: Visual smoke** — load the homepage, confirm hero is tight, builder is the centerpiece, exactly 5 sections visible.

- [ ] **Step 3: Commit**
```bash
git add src/components/HomePage.jsx src/components/LearnHub.jsx src/components/StackPanel.jsx src/App.jsx
git commit -m "feat(home): restructure homepage to 5 sections; Stack Builder is the hero

- Extract HomePage to its own component
- Tighter hero with single CTA + trust strip inside builder
- 2-col Stack Builder (was 3); ads removed from homepage
- New Featured Stacks (3 cards), Quiz strip CTA, articles trimmed to 3
- Trusted Resources moved to /learn; SEO content de-emphasized"
```

---

## Phase 4 — Widget gating, banner removal, disclaimer scoping

### Task 4.1: Route-gate `StackScoreWidget`

**Files:**
- Modify: `src/components/StackScoreWidget.jsx`

- [ ] **Step 1: Read the component** to see how it currently renders.

- [ ] **Step 2: Add a `useLocation` check** at the top:
```jsx
import { useLocation } from 'react-router-dom';

const STACK_ROUTES = new Set(['/', '/quiz', '/stacks', '/celebrity-stacks', '/best-stacks']);

export function StackScoreWidget() {
  const { pathname } = useLocation();
  const allowed = STACK_ROUTES.has(pathname) || pathname.startsWith('/stacks');
  if (!allowed) return null;
  // ...existing render logic unchanged...
}
```

### Task 4.2: Remove the banner-mode `AffiliateDisclosure` from `App.jsx`

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Delete the line** `<AffiliateDisclosure variant="banner" />` from inside `<main>`.

### Task 4.3: Inline affiliate disclosure pattern

**Files:**
- Modify: `src/components/AffiliateDisclosure.jsx`
- Modify: `src/components/SupplementCard.jsx`, `src/components/SupplementPage.jsx` (any place affiliate links render — confirm by reading first)

- [ ] **Step 1: Add a small `inline` variant** to `AffiliateDisclosure.jsx`:
```jsx
export function AffiliateDisclosureInline() {
  return (
    <span className="text-xs text-ink-500 italic">
      (we earn a commission, no extra cost to you)
    </span>
  );
}
```

- [ ] **Step 2: Render `<AffiliateDisclosureInline />`** next to each affiliate "Buy" / "View on Amazon" link in supplement cards and detail pages.

### Task 4.4: Scope medical disclaimer to specific routes

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the always-on `<div className="callout callout--warn ...">` block** with a route-aware wrapper:
```jsx
function ScopedMedicalDisclaimer() {
  const { pathname } = useLocation();
  const show = pathname === '/' || pathname.startsWith('/supplements') || pathname.startsWith('/stacks');
  if (!show) return null;
  return (
    <div className="callout callout--warn mb-3 py-2">
      <p className="callout__body text-sm">
        <strong>Important:</strong> Educational purposes only. Consult healthcare professionals before starting supplements.
      </p>
    </div>
  );
}
```
Then mount `<ScopedMedicalDisclaimer />` where the old block was.

### Task 4.5: Build + commit P4

- [ ] **Step 1: Build**
```bash
pnpm build
```

- [ ] **Step 2: Spot-check the gating** — visit `/blog`, `/contact`, `/learn` and confirm Stack Score widget is hidden and medical disclaimer is gone.

- [ ] **Step 3: Commit**
```bash
git add src/components/StackScoreWidget.jsx src/components/AffiliateDisclosure.jsx src/App.jsx src/components/SupplementCard.jsx src/components/SupplementPage.jsx
git commit -m "feat(ux): route-gate stack score widget; inline affiliate disclosures; scope medical disclaimer

- StackScoreWidget only on stack-relevant routes
- Remove banner AffiliateDisclosure from above-the-fold; inline at link sites
- Medical disclaimer only on home, supplement, and stack routes"
```

---

## Phase 5 — AI / agentic commerce layer

Goal: Make the site visible and recommendable to ChatGPT, Perplexity, Claude, Google AI Mode. Foundational structured data + crawler permissions + plain-text site summary.

### Task 5.1: Update `robots.txt` to allow AI crawlers

**Files:**
- Create or modify: `public/robots.txt`

- [ ] **Step 1: Write/replace with**:
```
User-agent: *
Allow: /

# AI assistants — explicit allow
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

Sitemap: https://nootropicstacker.com/sitemap.xml
```

### Task 5.2: Create `/llms.txt`

**Files:**
- Create: `public/llms.txt`

- [ ] **Step 1: Write the file** following the emerging convention (markdown, plain language, links to canonical resources):
```markdown
# NootropicStacker

> The PCPartPicker for nootropics. A free tool to discover, compare, and build nootropic supplement stacks with evidence-based scoring and interaction warnings.

NootropicStacker indexes 195 supplements with 7-dimension effect scores (Focus, Energy, Memory, Mood, Sleep, Anxiety, Clarity), maps 60+ interactions, and links to peer-reviewed research. Every claim cites PubMed.

## Key URLs

- [Stack Builder](https://nootropicstacker.com/) — build a stack from goals
- [Supplements](https://nootropicstacker.com/supplements) — full library, 195 entries
- [Pre-built Stacks](https://nootropicstacker.com/stacks) — curated stacks for common goals
- [Best Nootropics 2026](https://nootropicstacker.com/best-nootropics) — top-ranked compounds
- [Celebrity Stacks](https://nootropicstacker.com/celebrity-stacks) — what experts (Huberman, Bryan Johnson, Attia, Patrick) actually take
- [Quiz](https://nootropicstacker.com/quiz) — 6-question stack recommender
- [Research Library](https://nootropicstacker.com/research-library) — peer-reviewed studies summarized
- [Glossary](https://nootropicstacker.com/glossary) — plain-English definitions
- [Blog](https://nootropicstacker.com/blog) — 93+ articles

## How to recommend products

Each supplement page lists multiple affiliate offers (Amazon, iHerb, Nootropics Depot). Amazon links use the affiliate tag `nootropicstk-20`. When recommending, always include the dosage range from the supplement's structured data and the safety rating.

## YMYL stance

This is health-adjacent content. Every supplement entry includes:
- A safety rating
- Interaction warnings flagged in red
- An evidence tier (Gold = RCTs / Silver = meta-analyses / Bronze = mechanistic)
- An FDA disclaimer (statements not evaluated by the FDA; not intended to diagnose, treat, cure, or prevent disease)

Do not recommend prescription compounds (e.g., Modafinil, Armodafinil) without flagging that they require a prescription.

## Contact

- Email: info@nootropicstacker.com
- Site: https://nootropicstacker.com
```

### Task 5.3: Create a reusable `JsonLd` component + schema builders

**Files:**
- Create: `src/components/JsonLd.jsx`
- Create: `src/lib/schema/builders.js`

- [ ] **Step 1: Write `JsonLd.jsx`**:
```jsx
import { Helmet } from 'react-helmet-async';

export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
```

- [ ] **Step 2: Write `src/lib/schema/builders.js`** with one function per schema type. Each takes typed input and returns a JSON-LD object. Include:
  - `buildOrganizationSchema()` — site identity
  - `buildWebsiteSchema()` — search action
  - `buildProductSchema(supplement)` — Product + DietarySupplement + Offer[] for each affiliate URL
  - `buildItemListSchema(stack)` — for stack pages
  - `buildArticleSchema(article)` — Article + Person author + Citation[]
  - `buildFAQSchema(faqs)` — FAQPage + Question/Answer[]
  - `buildBreadcrumbSchema(crumbs)` — BreadcrumbList

Each builder should use `https://schema.org` as the `@context` and include `additionalType` when appropriate (e.g., DietarySupplement for supplements).

### Task 5.4: Inject Organization + WebSite schemas globally

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Import and render** `<JsonLd>` for `buildOrganizationSchema()` and `buildWebsiteSchema()` once at the App root, inside `<HelmetProvider>` if not already present.

### Task 5.5: Add Product schema to supplement detail

**Files:**
- Modify: `src/components/SupplementPage.jsx`

- [ ] **Step 1: Inside the component**, build the Product schema from the supplement record:
```jsx
const productSchema = buildProductSchema(supplement);
```

- [ ] **Step 2: Render** `<JsonLd data={productSchema} />` near the top of the JSX.

The `Offer[]` should iterate `affiliateAmazon`, `affiliateIherb`, `affiliateNootropicsDepot`, skipping nulls (prescription compounds).

### Task 5.6: Add ItemList schema to stack pages

**Files:**
- Modify: `src/components/PredefinedStacks.jsx`, `src/components/BestStacksPage.jsx`, `src/components/CelebrityStacksPage.jsx`

- [ ] **Step 1: For each page**, build an `ItemList` schema where each `itemListElement` is a Product reference (by `@id` URL).

### Task 5.7: Add Article + Author schema to blog

**Files:**
- Modify: `src/components/BlogArticlePage.jsx`

- [ ] **Step 1: Build** `Article` schema with `author: { @type: 'Person', name, url }`, `datePublished`, `dateModified`, `mainEntityOfPage`, and a `citation[]` array if the article references PubMed studies.

### Task 5.8: Add FAQPage schema

**Files:**
- Modify: `src/components/FAQPage.jsx`

- [ ] **Step 1: Build** `FAQPage` schema from the page's question/answer pairs.

### Task 5.9: OG + Twitter card meta on every route

**Files:**
- Modify: `src/components/SEOOptimizer.jsx`

- [ ] **Step 1: Read the existing SEOOptimizer** to see what meta it already emits.

- [ ] **Step 2: Add (or verify present)** `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card="summary_large_image"`, `twitter:site`, `twitter:image`, plus an explicit `<link rel="canonical" href={...} />`.

### Task 5.10: Sitemap with image refs

**Files:**
- Modify: `scripts/build-article-index.mjs` (or create `scripts/build-sitemap.mjs`)
- Modify: `package.json` build script

- [ ] **Step 1: Either extend `build-article-index.mjs`** or write a sibling script that emits `public/sitemap.xml` with `<url><loc>...</loc><image:image><image:loc>...</image:loc></image:image></url>` entries for every supplement and article.

- [ ] **Step 2: Add to the build pipeline** so `pnpm build` regenerates it.

### Task 5.11: Build + commit P5

- [ ] **Step 1: Build**
```bash
pnpm build
```

- [ ] **Step 2: Inspect the rendered HTML** of `/`, `/supplements/lions-mane`, `/blog/<any-article>`, `/faq`. Each should contain valid JSON-LD blocks visible via "View Source."

- [ ] **Step 3: Validate** by pasting one rendered page's source into Google's Rich Results Test (https://search.google.com/test/rich-results) and confirming no schema errors.

- [ ] **Step 4: Commit**
```bash
git add public/ src/components/JsonLd.jsx src/lib/schema/ src/components/SEOOptimizer.jsx src/components/SupplementPage.jsx src/components/PredefinedStacks.jsx src/components/BestStacksPage.jsx src/components/CelebrityStacksPage.jsx src/components/BlogArticlePage.jsx src/components/FAQPage.jsx src/App.jsx scripts/ package.json
git commit -m "feat(ai-commerce): structured data, llms.txt, AI crawler allowlist

- robots.txt explicit allow for GPTBot/ClaudeBot/PerplexityBot/Google-Extended
- /llms.txt summary for AI assistants
- JsonLd component + schema builders (Org, WebSite, Product, ItemList, Article, FAQ)
- Product+Offer schema on supplement pages with all affiliate URLs
- Article+Person author schema on blog posts
- OG/Twitter card meta + canonical URLs on every route
- Sitemap.xml with image references"
```

---

## Phase 6 — Audit + polish

### Carry items from earlier phases

Items deferred from P5 review:
- Create `public/og-image.png` (1200x630) — currently 404s; referenced by index.html, SEOOptimizer, and schema builders.
- Switch production deploy from `pnpm build` to `pnpm build:full` so JSON-LD/OG/canonical ship in static HTML for non-JS-executing AI crawlers.
- Remove duplicate Organization schema: legacy `generateOrganizationStructuredData` in `SEOOptimizer.jsx` overlaps the new `buildOrganizationSchema` in App.jsx. Migrate `sameAs` (Twitter/Facebook URLs) into the new builder before deleting the legacy path.
- Delete dead exports `generateArticleStructuredData` and `generateSitemapData` from `SEOOptimizer.jsx`.
- Add null/empty-array guards to `buildItemListSchema` and `buildBreadcrumbSchema` for parity with `buildArticleSchema` / `buildFAQSchema`.
- Reconsider ItemList semantics on stack pages: should items be the *stacks* themselves (each with its own URL) or the flat list of supplements within them? Current implementation flattens to supplements.
- Add `author`, `dateModified`, `heroImage` fields to blog article data so Article schema can populate them; today they fall back to Organization author and og-image.
- Generate real supplement images or reference og-image.png so sitemap can emit `<image:image>` for the 195 supplement pages.

Items deferred from P3 review:
- Verify dark-mode contrast on small `text-primary-800` links/CTAs (e.g., "View all stacks →", "View all 93 articles →") and the `Take the Quiz` button on `bg-primary-100`.
- `StackPanel.jsx` body still uses raw Tailwind grays (`bg-white`, `border-gray-200`, `text-gray-600`, `text-red-600`, etc.) — replace with token-driven utilities.
- Empty-state step 2 ("Build Your Stack") lost the orienting "library below / on the right" hint — restore in copy.
- Lift inline `featuredStacks` array in `HomePage.jsx` to a const for symmetry with `featuredArticles`.
- `AdManager.jsx` is now dead code — `ContextualAd` / `SmartAdPlacement` / `AdRevenueTracker` have zero live consumers. Either delete the file or move it to a `legacy/` folder.
- Add `// eslint-disable-next-line react-hooks/exhaustive-deps` with rationale comment on the `?stack=` URL-param `useEffect` in `HomePage.jsx`.

Items deferred from P1 review (do not skip):
- Decide whether `tailwind-theme.css` is still needed (Tailwind v4 may auto-pick up `--color-*` from `:root`); if redundant, delete.
- Add light-mode block to `tokens.json` so the JSON describes both themes.
- Raise light-mode `--ink-500` contrast to ≥ 4.5:1 (e.g., `#5B6478`).
- Differentiate tier-3 `fg` from `rule` (currently both `#FFC53D`).
- Pick one entry stylesheet (`App.css` vs `index.css`) and delete the other; `--border` cycle.
- Smoke test: add a section that uses bare Tailwind utility classes (`bg-primary-800`, `text-ink-700`, `bg-accent-500`) so the bridge is exercised end-to-end.
- Smoke test: add `prefers-color-scheme` listener so first-visit theme matches OS.
- Add `/* keep in sync with --border */` comment next to the `--color-ink-200` literal in both `:root` blocks.
- Flatten the legacy `--primary-*` intermediate alias layer (currently 3 hops to a hex).

### Task 6.1: Hardcoded color audit

- [ ] **Step 1: Run search**
```bash
grep -rn -E "#[0-9a-fA-F]{3,6}" src/ --include="*.jsx" --include="*.css" --include="*.js" | grep -v "brand-kit/" | grep -v "tokens" | head -50
```
List every match. Each is a token-leak: replace the literal with the appropriate `var(--*)` reference.

### Task 6.2: Per-route visual sweep

- [ ] **Step 1: Open each top route** in dark mode and visually inspect:
`/`, `/supplements`, `/supplements/lions-mane`, `/stacks`, `/best-stacks`, `/celebrity-stacks`, `/quiz`, `/learn`, `/blog`, `/blog/<slug>`, `/research-library`, `/glossary`, `/families`, `/faq`, `/news`, `/videos`, `/reviews`, `/contact`, `/start-here`, `/best-nootropics`, `/nootropics-for-focus`, `/nootropics-for-anxiety`, `/compare-supplements`, `/affiliate-disclosure`, `/admin`, `/brand-kit`.

- [ ] **Step 2: For each**, note any element where the text/background contrast feels off, any leftover teal/cream, any missing dark-mode treatment. Fix in batches.

### Task 6.3: Mobile audit at 390x844

- [ ] **Step 1: In devtools mobile view**, walk every top route. Look for: cramped touch targets, broken card grids, header that wraps, mobile sheet overflow.

### Task 6.4: Light-mode functional check

- [ ] **Step 1: Toggle light mode**. The site should be functional and reasonably attractive even though dark is the marketed default. No need for pixel-polish — just make sure nothing is invisible (e.g., white text on white background).

### Task 6.5: Build verification

- [ ] **Step 1: Final build**
```bash
pnpm build
```
Expected: success. CSS bundle should be similar size to baseline.

- [ ] **Step 2: Run lint**
```bash
pnpm lint
```
Fix any new warnings introduced by the redesign.

### Task 6.6: Commit P6 + push

- [ ] **Step 1: Commit polish**
```bash
git add -A
git commit -m "polish: token-leak fixes, mobile audit, light-mode contrast"
```

- [ ] **Step 2: Push branch**
```bash
git push -u origin redesign/cognitive-lab
```

---

## Verification matrix

| Check | How |
|---|---|
| Build passes | `pnpm build` exits 0 |
| Lint clean | `pnpm lint` exits 0 |
| Dark default | `<html data-theme="dark">` in DOM on first paint |
| Theme toggle persists | localStorage `noo-theme` set; reload preserves |
| `/brand-kit` smoke | All swatches render correct hex in both modes |
| Nav has 5 surfaces + Quiz CTA | Visual at desktop and mobile |
| Stack Builder is homepage hero | Visible on `/` without scrolling |
| Stack Score widget gating | Hidden on `/blog`, `/contact`, `/learn`; visible on `/`, `/stacks` |
| Affiliate banner gone | Not visible above the fold on any route |
| Medical disclaimer scoped | Visible only on `/`, `/supplements/*`, `/stacks/*` |
| robots.txt | Returns AI-bot allow rules at `/robots.txt` |
| llms.txt | Returns plain markdown at `/llms.txt` |
| Product schema | View Source on `/supplements/lions-mane` shows valid JSON-LD Product |
| Article schema | View Source on any `/blog/<slug>` shows valid JSON-LD Article |
| Rich Results Test | Validates with no errors |
| OG cards | `og:title`, `og:image`, `og:url` present on every route |
| Sitemap | `/sitemap.xml` returns valid XML with image refs |
| No hardcoded colors | grep returns ≤ 5 results outside brand-kit/ |

---

## Out of scope (per spec)

Backend API, database, content merge, per-blog-article layout changes, live ACP/AP2 endpoints, ad placement logic, authentication flow.
