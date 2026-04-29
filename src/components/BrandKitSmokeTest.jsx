export function BrandKitSmokeTest() {
  return (
    <div className="brand-prose max-w-3xl mx-auto py-10 px-4 space-y-10">
      <header>
        <h1 className="font-display text-display-md text-ink-900 mb-2">Brand Kit — Smoke Test</h1>
        <p className="text-ink-500 text-base">NOO-46 visual parity check. All components rendered against the brand-kit spec.</p>
      </header>

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

      {/* Color Palette */}
      <section>
        <h2 className="font-display text-xl text-ink-700 mb-3">Color Tokens</h2>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[
            ['bg-primary-800', 'primary-800'],
            ['bg-primary-700', 'primary-700'],
            ['bg-primary-500', 'primary-500'],
            ['bg-primary-100', 'primary-100'],
            ['bg-accent-500', 'accent-500'],
            ['bg-accent-300', 'accent-300'],
            ['bg-accent-100', 'accent-100'],
            ['bg-ink-900', 'ink-900'],
            ['bg-ink-500', 'ink-500'],
            ['bg-ink-100', 'ink-100'],
            ['bg-surface-page', 'surface-page'],
            ['bg-surface-sunk', 'surface-sunk'],
          ].map(([cls, label]) => (
            <div key={cls} className="flex flex-col gap-1">
              <div className={`${cls} h-8 rounded border border-black/10`} />
              <span className="text-ink-500 leading-none">{label}</span>
            </div>
          ))}
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
