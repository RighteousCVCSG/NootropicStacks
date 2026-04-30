import React from 'react';
import { Link } from 'react-router-dom';
import { SEOOptimizer } from './SEOOptimizer.jsx';

const GROUPS = [
  {
    title: 'Editorial',
    description: 'Long-form research and stack guides.',
    cards: [
      { to: '/blog', title: 'Blog', desc: 'Deep dives into nootropic research, stacks, and trends.' },
      { to: '/research-library', title: 'Research Library', desc: 'Plain-English summaries of peer-reviewed studies.' },
    ],
  },
  {
    title: 'Reference',
    description: 'Quick lookups and structured knowledge.',
    cards: [
      { to: '/glossary', title: 'Glossary', desc: 'Definitions of nootropic terms, compounds, and concepts.' },
      { to: '/families', title: 'Families', desc: 'Racetams, adaptogens, cholinergics, and other supplement groups.' },
      { to: '/faq', title: 'FAQ', desc: 'Common questions about stacking, safety, and cycling.' },
    ],
  },
  {
    title: 'Updates',
    description: 'What’s new and where to start.',
    cards: [
      { to: '/news', title: 'News', desc: 'Latest supplement news and industry updates.' },
      { to: '/videos', title: 'Videos', desc: 'Curated educational videos from top researchers.' },
      { to: '/reviews', title: 'Reviews', desc: 'Honest reviews of supplements and brands.' },
      { to: '/start-here', title: 'Start Here', desc: 'New to nootropics? Begin with this orientation.' },
    ],
  },
];

export function LearnHub() {
  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Learn — NootropicStacker"
        customDescription="Your hub for nootropic learning: blog, research library, glossary, family guides, FAQ, news, videos, reviews, and a beginner's start-here guide."
      />

      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">Learn</h1>
          <p className="text-ink-500 text-base sm:text-lg max-w-2xl">
            Everything we publish about nootropics — research, reference material, and updates — organized so you can find what you need fast.
          </p>
        </header>

        <div className="space-y-10">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-ink-900">{group.title}</h2>
                <p className="text-sm text-ink-500">{group.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.cards.map((card) => (
                  <Link
                    key={card.to}
                    to={card.to}
                    className="block p-5 rounded-xl bg-surface-card border border-ink-200 hover:border-primary-300 transition-colors"
                  >
                    <h3 className="text-base font-semibold text-ink-900 mb-1">{card.title}</h3>
                    <p className="text-sm text-ink-500">{card.desc}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* Trusted Resources (moved from homepage in P3) */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-ink-900">Trusted Resources</h2>
              <p className="text-sm text-ink-500">Supplement data cross-referenced with peer-reviewed sources and trusted industry resources.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Examine.com', desc: 'Supplement research database', url: 'https://examine.com' },
                { name: 'PubMed', desc: 'Clinical research studies', url: 'https://pubmed.ncbi.nlm.nih.gov' },
                { name: 'Nootropics Depot', desc: 'Third-party lab tested', url: 'https://nootropicsdepot.com' },
                { name: 'Labdoor', desc: 'Supplement quality rankings', url: 'https://labdoor.com' },
              ].map((resource) => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 rounded-xl bg-surface-card border border-ink-200 hover:border-primary-300 transition-colors"
                >
                  <h3 className="text-base font-semibold text-ink-900 mb-1">{resource.name}</h3>
                  <p className="text-sm text-ink-500">{resource.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
