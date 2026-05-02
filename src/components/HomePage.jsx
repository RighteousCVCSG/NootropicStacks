import React from 'react';
import { Link } from 'react-router-dom';
import { useStack } from '../contexts/StackContext.jsx';
import { SEOOptimizer, SEOContent } from './SEOOptimizer.jsx';
import { JsonLd } from './JsonLd.jsx';
import { buildBreadcrumbSchema } from '../lib/schema/builders.js';
import { track } from '../lib/analytics.js';
import {
  Layers, BookOpen, ArrowRight, Sparkles, HelpCircle, Activity,
  Target, Moon, Heart,
} from 'lucide-react';

const BUILD_DATE = new Date().toISOString().slice(0, 10);
const UPDATED_LABEL = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

const ARTICLE_COUNT = 93;

const FEATURED_ARTICLES = [
  { slug: 'caffeine-l-theanine-stack-the-ultimate-guide', title: 'Caffeine + L-Theanine: The Ultimate Stack Guide', tags: ['caffeine', 'theanine'], readTime: 8 },
  { slug: 'best-nootropic-stack-for-focus-2026', title: 'Best Nootropic Stack for Focus 2026', tags: ['focus', 'stack'], readTime: 10 },
  { slug: 'ashwagandha-benefits-dosage-complete-guide', title: 'Ashwagandha: Benefits & Dosage Guide', tags: ['ashwagandha', 'adaptogen'], readTime: 10 },
];

const FEATURED_STACKS = [
  { slug: 'focus', title: 'For Focus', desc: "L-Theanine + Caffeine + Lion's Mane", href: '/stacks?goal=focus', icon: Target },
  { slug: 'sleep', title: 'For Sleep', desc: 'Magnesium + Glycine + Apigenin',     href: '/stacks?goal=sleep', icon: Moon },
  { slug: 'mood',  title: 'For Mood',  desc: 'Ashwagandha + Rhodiola + Saffron',   href: '/stacks?goal=mood',  icon: Heart },
];

/**
 * Marketing landing page. The actual stack builder lives at /build.
 * This page exists to introduce the product, route the visitor by
 * readiness level, and surface trust + featured content.
 */
export function HomePage() {
  const { stack, stackScore, stackName, openDrawer, safetyAnalysis } = useStack();
  const isReturning = stack.length > 0;
  const overall = stackScore?.headlineScores?.overall;
  const overallLabel = stackScore?.headlineScores?.dimensionQuals?.overall?.label;
  const warningCount = safetyAnalysis?.warnings?.length || 0;
  // Lightweight urgency cue surfaced beside the Continue link. Three states:
  //   - small stack (1–2): suggest adding more
  //   - has warnings: surface the count
  //   - low score (overall < 6): "room to improve"
  // Falls through silently when none apply.
  const urgencyHint = (() => {
    if (warningCount > 0) {
      return `${warningCount} interaction${warningCount === 1 ? '' : 's'} to review`;
    }
    if (stack.length > 0 && stack.length < 3) {
      return 'Add a few more for stronger synergy';
    }
    if (overall != null && overall < 6) {
      return 'Room to improve';
    }
    return null;
  })();

  return (
    <>
      <SEOOptimizer page="home" />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', url: 'https://nootropicstacker.com/' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          name: 'NootropicStacker — Free Nootropic Stack Builder',
          url: 'https://nootropicstacker.com/',
          description:
            'Free tool to plan, score, and check supplement stacks. 195 compounds, 60+ pairwise interactions, every claim cited to PubMed.',
          inLanguage: 'en-US',
          dateModified: BUILD_DATE,
          lastReviewed: BUILD_DATE,
          medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
          about: {
            '@type': 'MedicalEntity',
            name: 'Nootropic supplementation',
          },
          reviewedBy: {
            '@type': 'Person',
            name: 'Vera Huang',
            jobTitle: 'CMO, NootropicStacker',
            description: 'Neuroscience researcher (UCSD) and editorial reviewer for NootropicStacker.',
          },
          mainEntityOfPage: 'https://nootropicstacker.com/build',
        }}
      />

      {/* Hero — headline + tagline + the three doors directly under the
          tagline (replacing the old separate "Start building" link).
          Credentials + YMYL line + timestamp follow below the doors. */}
      <section className={isReturning ? 'mb-3' : 'mb-6'} aria-labelledby="get-started">
        <h2 id="get-started" className="sr-only">Get started</h2>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink-900 leading-tight tracking-tight mb-3">
            Know exactly what you're stacking —
            <br />
            <em
              className="not-italic text-primary-800"
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
            >
              and why it works.
            </em>
          </h1>
          <p className="text-ink-500 text-sm sm:text-base max-w-2xl mx-auto mb-4">
            A <span className="text-ink-700">stack</span> is the supplements you take together.
            We score how well they work as a combo, flag risky pairs, and link every
            claim to PubMed.
          </p>

          {/* Three doors — the primary action, sitting where the old
              "Start building" CTA used to be. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto text-left mb-3">
            <Link
              to="/build"
              onClick={() => track('door_click', { door: 'build' })}
              className="group rounded-md bg-primary-050 border border-primary-300 hover:border-primary-500 p-3 transition-colors flex items-start gap-3 shadow-1"
            >
              <Layers className="w-4 h-4 text-primary-800 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-semibold text-ink-900">Build my stack</h3>
                  <ArrowRight className="w-3.5 h-3.5 text-primary-800 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <p className="text-xs text-ink-500 mt-0.5">
                  Pick goals, see synergy in real time. ~2 min.
                </p>
              </div>
            </Link>

            <Link
              to="/quiz"
              onClick={() => track('door_click', { door: 'quiz' })}
              className="group rounded-md bg-primary-050 border border-primary-300 hover:border-primary-500 p-3 transition-colors flex items-start gap-3"
            >
              <HelpCircle className="w-4 h-4 text-primary-800 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-semibold text-ink-900">Take the quiz</h3>
                  <ArrowRight className="w-3.5 h-3.5 text-primary-800 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <p className="text-xs text-ink-500 mt-0.5">
                  Five questions, one suggested stack. ~1 min.
                </p>
              </div>
            </Link>

            <Link
              to="/stacks"
              onClick={() => track('door_click', { door: 'stacks' })}
              className="group rounded-md bg-primary-050 border border-primary-300 hover:border-primary-500 p-3 transition-colors flex items-start gap-3"
            >
              <Sparkles className="w-4 h-4 text-primary-800 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-semibold text-ink-900">Browse top stacks</h3>
                  <ArrowRight className="w-3.5 h-3.5 text-primary-800 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <p className="text-xs text-ink-500 mt-0.5">
                  Curated, evidence-backed picks.
                </p>
              </div>
            </Link>
          </div>

          {/* Credential bar — single inline row. <data> wraps numeric
              claims so AI crawlers can extract them unambiguously;
              <time> element gives a fresh-content signal. */}
          <dl className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-500">
            <div className="inline-flex items-center gap-1">
              <dd className="font-semibold text-ink-700 font-mono">
                <data value="195">195</data>
              </dd>
              <dt>compounds</dt>
            </div>
            <span aria-hidden className="text-ink-300">·</span>
            <div className="inline-flex items-center gap-1">
              <dd className="font-semibold text-ink-700 font-mono">
                <data value="60">60+</data>
              </dd>
              <dt>interactions mapped</dt>
            </div>
            <span aria-hidden className="text-ink-300">·</span>
            <dt>Every claim links to PubMed</dt>
          </dl>

          {/* YMYL one-liner — replaces the old chunky banner. Quiet ink-400
              italic so it doesn't dominate, but present above the fold so a
              cautious health-curious visitor sees it before clicking through. */}
          <p className="mt-3 text-[11px] italic text-ink-400">
            Educational tool · not medical advice. We flag interactions and link every claim to PubMed.
          </p>
          <p className="mt-1 text-[11px] text-ink-400">
            <time dateTime={BUILD_DATE}>Updated {UPDATED_LABEL}</time>
            <span aria-hidden className="text-ink-300 mx-2">·</span>
            <span>
              Reviewed by{' '}
              <Link
                to="/start-here"
                className="text-ink-500 hover:text-ink-700 underline-offset-2 hover:underline"
              >
                Vera Huang, UCSD Neuroscience
              </Link>
            </span>
          </p>
        </div>

        {/* Returning-user one-line strip — only when localStorage already has a stack.
            Uses the neutral surface so it doesn't compete visually with the
            clickable "Build my stack" door card immediately below (same navy
            tint there means "click me", same tint here would just confuse). */}
        {isReturning && (
          <div className="max-w-3xl mx-auto mt-4">
            <div className="rounded-md border border-ink-200 bg-surface-card px-3 py-2 flex items-center gap-3 text-sm">
              <Activity className="w-4 h-4 text-ink-500 shrink-0" />
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
              {urgencyHint && (
                <span
                  className={`hidden sm:inline text-[11px] shrink-0 ${
                    warningCount > 0 ? 'text-warn-700' : 'text-ink-500'
                  }`}
                >
                  {urgencyHint}
                </span>
              )}
              <Link
                to="/build"
                onClick={() =>
                  track('returning_continue_click', {
                    stackLength: stack.length,
                    warnings: warningCount,
                  })
                }
                className="text-xs font-semibold text-primary-800 hover:text-primary-700 shrink-0"
              >
                Continue →
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Featured Stacks — divider above gives rhythm without wrapping
          each section in a card. The three doors connect tightly to the
          hero, then content sections start visually separating. */}
      <section className="border-t border-ink-100 pt-8 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
            Featured stacks
          </h2>
          <Link
            to="/stacks"
            onClick={() => track('homepage_view_all_click', { section: 'stacks' })}
            className="text-xs text-primary-800 hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FEATURED_STACKS.map((s) => (
            <Link
              key={s.slug}
              to={s.href}
              onClick={() => track('featured_stack_click', { goal: s.slug })}
              className="group rounded-md bg-surface-card border border-ink-200 hover:border-primary-500 p-3 transition-colors flex items-start gap-3 h-full"
            >
              <s.icon className="w-4 h-4 text-primary-800 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-semibold text-ink-900">{s.title}</h3>
                  <ArrowRight className="w-3.5 h-3.5 text-primary-800 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <p className="text-xs text-ink-500 mt-0.5">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Articles */}
      <section className="border-t border-ink-100 pt-8 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-ink-500 inline-flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-ink-500" />
            Popular guides
          </h2>
          <Link
            to="/blog"
            onClick={() => track('homepage_view_all_click', { section: 'blog' })}
            className="text-xs text-primary-800 hover:underline"
          >
            View all {ARTICLE_COUNT} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURED_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              onClick={() => track('featured_article_click', { slug: article.slug })}
              className="block"
            >
              <div className="p-3 rounded-md border border-ink-200 hover:border-primary-500 transition-colors bg-surface-card h-full">
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] bg-primary-050 text-primary-800 px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
                <p className="text-xs font-semibold text-ink-900 hover:text-primary-700 leading-snug">{article.title}</p>
                <p className="text-[10px] text-ink-500 mt-0.5">{article.readTime} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Crawlable overview content. Was wrapped in <aside opacity-60> — that
          was a quality-rater cloaking risk on a YMYL page (text deliberately
          harder for users to read than for crawlers). Now full opacity in a
          regular section, kept visually quiet via small text + divider rhythm. */}
      <section className="border-t border-ink-100 pt-8 text-sm">
        <SEOContent />
      </section>
    </>
  );
}
