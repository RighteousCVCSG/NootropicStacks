import { useEffect, useState } from 'react';

/**
 * Renders a swatch with its CSS variable name and a live-resolved
 * computed color. Updates when the document `data-theme` changes.
 */
function Swatch({ name, varName, themeKey }) {
  const [resolved, setResolved] = useState('');
  useEffect(() => {
    const el = document.documentElement;
    const v = getComputedStyle(el).getPropertyValue(varName).trim();
    setResolved(v);
  }, [varName, themeKey]);

  return (
    <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-card)] p-3">
      <span
        className="h-10 w-10 shrink-0 rounded-md border border-[var(--border)]"
        style={{ background: `var(${varName})` }}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <div className="text-xs font-mono text-[var(--ink-900)] truncate">{name}</div>
        <div className="text-xs font-mono text-[var(--ink-500)] truncate">{varName}</div>
        <div className="text-xs font-mono text-[var(--ink-500)] truncate">{resolved || '—'}</div>
      </div>
    </div>
  );
}

function SwatchGrid({ items, themeKey }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map(({ name, varName }) => (
        <Swatch key={varName} name={name} varName={varName} themeKey={themeKey} />
      ))}
    </div>
  );
}

const SURFACES = [
  { name: 'Page', varName: '--surface-page' },
  { name: 'Card', varName: '--surface-card' },
  { name: 'Raised', varName: '--surface-raised' },
  { name: 'Modal', varName: '--surface-modal' },
  { name: 'Border', varName: '--border' },
];

const INK = [
  { name: 'Ink 900', varName: '--ink-900' },
  { name: 'Ink 700', varName: '--ink-700' },
  { name: 'Ink 500', varName: '--ink-500' },
  { name: 'Ink on dark', varName: '--ink-on-dark' },
];

const ACCENTS = [
  { name: 'Primary (violet)', varName: '--accent-primary' },
  { name: 'Primary hover', varName: '--accent-primary-hover' },
  { name: 'Primary soft', varName: '--accent-primary-soft' },
  { name: 'Secondary (cyan)', varName: '--accent-secondary' },
  { name: 'Secondary hover', varName: '--accent-secondary-hover' },
  { name: 'Secondary soft', varName: '--accent-secondary-soft' },
];

const FUNCTIONAL = [
  { name: 'Warning', varName: '--warning' },
  { name: 'Danger', varName: '--danger' },
];

const PRIMARY_SCALE = [
  { name: 'Primary 050', varName: '--primary-050' },
  { name: 'Primary 100', varName: '--primary-100' },
  { name: 'Primary 300', varName: '--primary-300' },
  { name: 'Primary 400', varName: '--primary-400' },
  { name: 'Primary 700', varName: '--primary-700' },
  { name: 'Primary 800', varName: '--primary-800' },
  { name: 'Primary 900', varName: '--primary-900' },
];

export function BrandKitSmokeTest() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.dataset.theme || 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="brand-prose max-w-5xl mx-auto py-10 px-4 space-y-10">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-display-md text-ink-900 mb-2">Brand Kit — Cognitive Lab</h1>
          <p className="text-ink-500 text-base">
            Visual parity check for the Cognitive Lab palette. Toggle theme to verify both modes.
          </p>
          <p className="text-ink-500 text-sm mt-1">
            Active theme: <span className="font-mono text-ink-700">{theme}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn--primary"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          Toggle theme ({theme === 'dark' ? 'light' : 'dark'})
        </button>
      </header>

      {/* Surfaces */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Surfaces</h2>
        <SwatchGrid items={SURFACES} themeKey={theme} />
      </section>

      {/* Ink */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Ink (text)</h2>
        <SwatchGrid items={INK} themeKey={theme} />
      </section>

      {/* Brand accents */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Brand accents</h2>
        <SwatchGrid items={ACCENTS} themeKey={theme} />
      </section>

      {/* Functional */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Functional</h2>
        <SwatchGrid items={FUNCTIONAL} themeKey={theme} />
      </section>

      {/* Primary scale (legacy aliases) */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Primary scale (050–900)</h2>
        <p className="text-ink-500 text-sm mb-3">
          Legacy aliases consumed by shadcn/ui &amp; Tailwind utility classes.
        </p>
        <SwatchGrid items={PRIMARY_SCALE} themeKey={theme} />
      </section>

      {/* Disclosure */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Disclosures</h2>
        <div className="disclosure disclosure--inline mb-3">
          <strong>Affiliate disclosure:</strong> Some links on this page are affiliate links. We earn a small commission at no extra cost to you.
        </div>
        <div className="disclosure disclosure--block">
          <strong>Medical disclaimer:</strong> This content is for educational purposes only and is not medical advice. Consult a qualified healthcare provider before starting any supplement regimen.
        </div>
      </section>

      {/* Cite */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Citations (.cite)</h2>
        <p className="text-ink-700">
          Caffeine has well-documented efficacy for alertness.{' '}
          <a href="#ref1" className="cite">[1]</a>{' '}
          L-Theanine promotes relaxation without sedation.{' '}
          <a href="#ref2" className="cite">[2]</a>
        </p>
      </section>

      {/* Hedge */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Hedge (.hedge)</h2>
        <p className="hedge">
          Preliminary animal studies suggest neuroprotective effects, but human RCT evidence remains limited. Treat these findings as hypothesis-generating only.
        </p>
      </section>

      {/* Tier Badges */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Tier Badges</h2>
        <div className="flex gap-3 flex-wrap">
          <span className="tier-badge tier-badge--1">Tier 1 — Strong Evidence</span>
          <span className="tier-badge tier-badge--2">Tier 2 — Moderate Evidence</span>
          <span className="tier-badge tier-badge--3">Tier 3 — Preliminary</span>
        </div>
      </section>

      {/* Cert Badges */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Cert Badges</h2>
        <div className="flex gap-3 flex-wrap">
          <span className="cert-badge">NSF Certified</span>
          <span className="cert-badge">USP Verified</span>
          <span className="cert-badge">Informed Sport</span>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Buttons</h2>
        <div className="flex gap-3 flex-wrap items-center">
          <button className="btn btn--primary">Primary</button>
          <button className="btn btn--primary btn--lg">Primary Large</button>
          <button className="btn btn--secondary">Secondary</button>
          <button className="btn btn--tertiary">Tertiary</button>
          <button className="btn btn--primary btn--sm">Small</button>
        </div>
      </section>

      {/* Callout */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Callout</h2>
        <div className="callout callout--info">
          <strong>Did you know?</strong> The caffeine + L-theanine stack is one of the most studied nootropic combinations, with consistent improvements in attention and reaction time across trials.
        </div>
        <div className="callout callout--warn mt-3">
          <strong>Caution:</strong> High-dose racetams may deplete choline; always pair with a choline source.
        </div>
      </section>

      {/* Comparison Table */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Comparison Table</h2>
        <div className="cmp-table-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <th>Supplement</th>
                <th>Tier</th>
                <th>Primary Benefit</th>
                <th>Typical Dose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Caffeine</td>
                <td><span className="tier-badge tier-badge--1">Tier 1</span></td>
                <td>Alertness, energy</td>
                <td>100–200 mg</td>
              </tr>
              <tr>
                <td>L-Theanine</td>
                <td><span className="tier-badge tier-badge--1">Tier 1</span></td>
                <td>Calm focus</td>
                <td>100–200 mg</td>
              </tr>
              <tr>
                <td>Lion's Mane</td>
                <td><span className="tier-badge tier-badge--2">Tier 2</span></td>
                <td>NGF support</td>
                <td>500–1000 mg</td>
              </tr>
              <tr>
                <td>Bacopa Monnieri</td>
                <td><span className="tier-badge tier-badge--2">Tier 2</span></td>
                <td>Memory consolidation</td>
                <td>300–600 mg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Attribution */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Attribution</h2>
        <p className="attribution">
          Reviewed by the NootropicStacker editorial team. Sources: PubMed, Examine.com. Last updated April 2026.
        </p>
      </section>

      {/* Empty State */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Empty State</h2>
        <div className="empty">
          <p>No supplements in your stack yet.</p>
          <p>Use the Stack Builder to add compounds and get started.</p>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Typography</h2>
        <p className="font-display text-display-lg text-ink-900 leading-none mb-1">Display LG</p>
        <p className="font-display text-display-md text-ink-900 mb-1">Display MD</p>
        <p className="font-display text-display-sm text-ink-700 mb-1">Display SM</p>
        <p className="font-body text-xl text-ink-700 mb-1">Body XL — Inter</p>
        <p className="font-body text-base text-ink-700 mb-1">Body base — Inter, readable at 1rem/1.625 leading</p>
        <p className="font-body text-sm text-ink-500 mb-1">Body SM — supporting text</p>
        <p className="font-mono text-sm text-ink-700">mono — JetBrains Mono code sample</p>
      </section>

      {/* Footer */}
      <footer className="footer -mx-4 px-6 py-8 mt-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-lg mb-1">NootropicStacker</p>
          <p className="text-sm opacity-70">Educational information only. Consult a healthcare professional.</p>
          <p className="text-xs opacity-50 mt-3">© 2026 NootropicStacker. Amazon affiliate disclosure applies.</p>
        </div>
      </footer>
    </div>
  );
}
