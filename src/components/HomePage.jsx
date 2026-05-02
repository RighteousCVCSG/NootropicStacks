import React from 'react';
import { Link } from 'react-router-dom';
import { useStack } from '../contexts/StackContext.jsx';
import { SEOOptimizer, SEOContent } from './SEOOptimizer.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
  Layers, BookOpen, ArrowRight, Sparkles, HelpCircle,
  Activity, ShieldCheck, FlaskConical,
} from 'lucide-react';

const ARTICLE_COUNT = 93;

const FEATURED_ARTICLES = [
  { slug: 'caffeine-l-theanine-stack-the-ultimate-guide', title: 'Caffeine + L-Theanine: The Ultimate Stack Guide', tags: ['caffeine', 'theanine'], readTime: 8 },
  { slug: 'best-nootropic-stack-for-focus-2026', title: 'Best Nootropic Stack for Focus 2026', tags: ['focus', 'stack'], readTime: 10 },
  { slug: 'ashwagandha-benefits-dosage-complete-guide', title: 'Ashwagandha: Benefits & Dosage Guide', tags: ['ashwagandha', 'adaptogen'], readTime: 10 },
];

const FEATURED_STACKS = [
  { slug: 'focus', title: 'For Focus', desc: "L-Theanine + Caffeine + Lion's Mane", href: '/stacks?goal=focus' },
  { slug: 'sleep', title: 'For Sleep', desc: 'Magnesium + Glycine + Apigenin', href: '/stacks?goal=sleep' },
  { slug: 'mood', title: 'For Mood', desc: 'Ashwagandha + Rhodiola + Saffron', href: '/stacks?goal=mood' },
];

/**
 * Marketing landing page. The actual stack builder lives at /build.
 * This page exists to introduce the product, route the visitor by
 * readiness level, and surface trust + featured content.
 */
export function HomePage() {
  const { stack, stackScore, stackName, openDrawer } = useStack();
  const isReturning = stack.length > 0;
  const overall = stackScore?.headlineScores?.overall;
  const overallLabel = stackScore?.headlineScores?.dimensionQuals?.overall?.label;

  return (
    <>
      <SEOOptimizer page="home" />

      {/* Hero */}
      <section className="mb-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary-900 bg-primary-050 border border-primary-300 px-3 py-1 rounded-full mb-4">
            Free Nootropic Stack Builder
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 leading-tight mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Build smarter nootropic stacks,{' '}
            <span className="text-primary-800">backed by science.</span>
          </h1>
          <p className="text-ink-700 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            The PCPartPicker for nootropics. 195 supplements, 60+ interactions mapped, every claim cites PubMed.
          </p>
          <Link
            to="/build"
            className="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-primary-800 hover:bg-primary-700 text-ink-on-dark transition-colors"
          >
            Start building <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Returning-user one-line strip — only when localStorage already has a stack. */}
        {isReturning && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="rounded-md border border-primary-300 bg-primary-050 px-3 py-2 flex items-center gap-3 text-sm">
              <Activity className="w-4 h-4 text-primary-800 shrink-0" />
              <span className="text-ink-900 flex-1 truncate">
                Welcome back —{' '}
                {stackName ? (
                  <>
                    <span className="font-semibold">{stackName}</span>
                    <span className="text-ink-500">
                      {' · '}
                      {stack.length} supplement{stack.length === 1 ? '' : 's'}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">
                    {stack.length} supplement{stack.length === 1 ? '' : 's'}
                  </span>
                )}
                {overall != null && (
                  <>
                    , Stack Score{' '}
                    <span className="font-semibold">{overall.toFixed(1)}</span>
                    {overallLabel && (
                      <span className="text-ink-500"> ({overallLabel})</span>
                    )}
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={openDrawer}
                className="text-xs font-medium text-primary-800 hover:text-primary-700 shrink-0"
              >
                View →
              </button>
              <Link
                to="/build"
                className="text-xs font-semibold text-primary-800 hover:text-primary-700 shrink-0"
              >
                Continue →
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Three-door entry — the homepage's core navigation pattern. */}
      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <Link
            to="/build"
            className="group rounded-md bg-primary-050 border border-primary-300 hover:border-primary-800 p-4 transition-colors flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-primary-800" />
              <span className="text-xs uppercase tracking-widest font-semibold text-primary-800">Build</span>
            </div>
            <h3 className="text-base font-semibold text-ink-900 mb-1">I'll build my own</h3>
            <p className="text-xs text-ink-700 mb-3 flex-1">
              Pick goals, browse 195 supplements, see real-time synergy and Stack Score.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-800 group-hover:translate-x-0.5 transition-transform">
              Start building <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/quiz"
            className="group rounded-md bg-surface-card border border-ink-200 hover:border-accent-500 hover:bg-accent-050 p-4 transition-colors flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-accent-700" />
              <span className="text-xs uppercase tracking-widest font-semibold text-accent-700">Quiz</span>
            </div>
            <h3 className="text-base font-semibold text-ink-900 mb-1">Not sure where to start</h3>
            <p className="text-xs text-ink-700 mb-3 flex-1">
              Answer 6 questions and we'll suggest a stack tuned to your goals.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-700 group-hover:translate-x-0.5 transition-transform">
              Take the quiz <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/stacks"
            className="group rounded-md bg-surface-card border border-ink-200 hover:border-warn-500 hover:bg-warn-100 p-4 transition-colors flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-warn-700" />
              <span className="text-xs uppercase tracking-widest font-semibold text-warn-700">Browse</span>
            </div>
            <h3 className="text-base font-semibold text-ink-900 mb-1">Show me what works</h3>
            <p className="text-xs text-ink-700 mb-3 flex-1">
              Curated, evidence-backed stacks for focus, sleep, energy, mood, and more.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-warn-700 group-hover:translate-x-0.5 transition-transform">
              See top stacks <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* How it works — three explicit steps with copy. */}
      <section className="mb-12">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-ink-900">How it works</h2>
          <p className="text-sm text-ink-500 mt-1">Three steps from blank page to a full daily protocol.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { n: 1, title: 'Set your goals', desc: 'Focus, calm, energy, sleep, mood — pick what you want to optimize for.' },
            { n: 2, title: 'Add supplements', desc: 'Browse 195 compounds with evidence tiers. Watch the Stack Score react in real time.' },
            { n: 3, title: 'Ship your build', desc: 'Compare prices across vendors. Open all carts in one click. Save and share.' },
          ].map((s) => (
            <div
              key={s.n}
              className="p-4 rounded-md bg-surface-card border border-ink-200"
            >
              <div className="w-7 h-7 rounded-full bg-primary-050 text-primary-800 flex items-center justify-center text-sm font-bold mb-3">
                {s.n}
              </div>
              <h3 className="text-base font-semibold text-ink-900 mb-1">{s.title}</h3>
              <p className="text-sm text-ink-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Stacks */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink-900">Featured stacks</h2>
          <Link to="/stacks" className="text-sm text-primary-800 hover:underline">
            View all stacks →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURED_STACKS.map((s) => (
            <Link key={s.slug} to={s.href}>
              <div className="p-4 rounded-md bg-surface-card border border-ink-200 hover:border-primary-300 transition-colors h-full">
                <h3 className="font-semibold text-ink-900 mb-1">{s.title}</h3>
                <p className="text-sm text-ink-500">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust strip — three short credibility cues. */}
      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <div className="rounded-lg bg-surface-card border border-ink-200 p-4 flex gap-3 items-start">
            <FlaskConical className="w-5 h-5 text-primary-800 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-ink-900 mb-1">Tier-graded evidence</h3>
              <p className="text-xs text-ink-500">
                Every supplement carries a Tier 1/2/3 chip — strong, moderate, or preliminary — so you see what's well-studied at a glance.
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-surface-card border border-ink-200 p-4 flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-accent-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-ink-900 mb-1">Interactions mapped</h3>
              <p className="text-xs text-ink-500">
                60+ interaction pairs flagged in red. Stack Score docks for redundant or risky combinations.
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-surface-card border border-ink-200 p-4 flex gap-3 items-start">
            <BookOpen className="w-5 h-5 text-warn-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-ink-900 mb-1">Cited, not claimed</h3>
              <p className="text-xs text-ink-500">
                Every effect score, dosage range, and warning links to the underlying study. PubMed, not vendor copy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-800" />
            Popular guides
          </h2>
          <Link to="/blog" className="text-sm text-primary-800 hover:underline">
            View all {ARTICLE_COUNT} articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_ARTICLES.map((article) => (
            <Link key={article.slug} to={`/blog/${article.slug}`}>
              <div className="p-4 rounded-lg border border-ink-200 hover:border-primary-300 hover:shadow-sm transition-all bg-surface-card h-full">
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs bg-primary-050 text-primary-800 px-2 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
                <p className="text-sm font-medium text-ink-900 hover:text-primary-700 leading-snug">{article.title}</p>
                <p className="text-xs text-ink-400 mt-1">{article.readTime} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO content — kept crawlable but visually quiet */}
      <aside className="mt-16 opacity-60 text-sm">
        <SEOContent />
      </aside>
    </>
  );
}
