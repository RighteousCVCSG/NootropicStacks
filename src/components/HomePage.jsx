import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStack } from '../contexts/StackContext.jsx';
import { GoalSelector } from './GoalSelector.jsx';
import { RecommendationPanel } from './RecommendationPanel.jsx';
import { SupplementLibrary } from './SupplementLibrary.jsx';
import { SupplementModal } from './SupplementModal.jsx';
import { SEOOptimizer, SEOContent } from './SEOOptimizer.jsx';
import { StackProtocolBuilder } from './StackProtocolBuilder.jsx';
import { PredefinedStacks } from './PredefinedStacks.jsx';
import { supplements } from '../data/supplements.js';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Layers, Library, BookOpen, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

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

// Home page with stack builder
export function HomePage() {
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { stack, loadStack } = useStack();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stackParam = params.get('stack');
    if (stackParam && stack.length === 0) {
      const ids = stackParam.split(',');
      const itemsToLoad = ids
        .map(id => supplements.find(s => s.id === id))
        .filter(Boolean)
        .map(s => ({
          supplementId: s.id,
          dosage: (s.dosage.min + s.dosage.max) / 2,
          timing: s.dosage.timing,
        }));
      if (itemsToLoad.length > 0) {
        loadStack(itemsToLoad);
      }
    }
    // One-shot URL hydration on mount; loadStack and stack are stable enough
    // that re-running on every change would clobber user edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewDetails = (supplement) => {
    setSelectedSupplement(supplement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplement(null);
  };

  return (
    <>
      <SEOOptimizer page="home" />

      {/* Hero */}
      <section className="mb-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary-800 bg-primary-100 px-3 py-1 rounded-full mb-4">
            Free Nootropic Stack Builder
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Build smarter nootropic stacks,<br />
            <span className="text-primary-800">backed by science.</span>
          </h1>
          <p className="text-ink-700 text-base sm:text-lg max-w-2xl mx-auto">
            The PCPartPicker for nootropics. 195 supplements, 60+ interactions mapped, every claim cites PubMed.
          </p>
        </div>

        {/* Three-door entry — pick your readiness level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <a
            href="#stack-builder"
            className="group rounded-xl bg-primary-050 border border-primary-300 hover:border-primary-800 hover:bg-primary-100 p-5 transition-colors text-left flex flex-col"
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
          </a>

          <Link
            to="/quiz"
            className="group rounded-xl bg-surface-card border border-ink-200 hover:border-accent-500 hover:bg-accent-050 p-5 transition-colors text-left flex flex-col"
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
            className="group rounded-xl bg-surface-card border border-ink-200 hover:border-warn-500 hover:bg-warn-100 p-5 transition-colors text-left flex flex-col"
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

      {/* Stack Builder — 2-col split (2/5 left, 3/5 right). No ads. */}
      <div id="stack-builder" className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
        {/* Left Column - Goals and Stack */}
        <div className="lg:col-span-2 space-y-6">
          <GoalSelector />
          <StackProtocolBuilder />
        </div>

        {/* Right Column - Recommendations and Library */}
        <div className="lg:col-span-3 space-y-6">
          <RecommendationPanel />

          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library" className="flex items-center gap-2">
                <Library className="w-4 h-4" />
                Supplement Library
              </TabsTrigger>
              <TabsTrigger value="stacks" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Pre-Built Stacks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-6">
              <SupplementLibrary onViewDetails={handleViewDetails} />
            </TabsContent>

            <TabsContent value="stacks" className="space-y-6">
              <PredefinedStacks />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Featured Stacks */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink-900">Featured stacks</h2>
          <Link to="/stacks" className="text-sm text-primary-800 hover:underline">
            View all stacks →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURED_STACKS.map(s => (
            <Link key={s.slug} to={s.href}>
              <div className="p-5 rounded-xl bg-surface-card border border-ink-200 hover:border-primary-300 transition-colors">
                <h3 className="font-semibold text-ink-900 mb-1">{s.title}</h3>
                <p className="text-sm text-ink-500">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quiz strip CTA */}
      <section className="mb-10">
        <div className="rounded-2xl bg-primary-100 border border-primary-300 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-ink-900 mb-1">Not sure where to start?</h2>
            <p className="text-sm text-ink-700">Answer 6 questions and we'll suggest a stack.</p>
          </div>
          <Link to="/quiz">
            <Button size="lg" className="bg-primary-800 hover:bg-primary-700 text-ink-on-dark">
              Take the Quiz <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Popular Articles (trimmed to 3) */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-800" />
            Popular Nootropic Guides
          </h2>
          <Link to="/blog" className="text-sm text-primary-800 hover:underline">View all {ARTICLE_COUNT} articles →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_ARTICLES.map(article => (
            <Link key={article.slug} to={`/blog/${article.slug}`}>
              <div className="p-4 rounded-lg border border-ink-200 hover:border-primary-300 hover:shadow-sm transition-all bg-surface-card">
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded">{tag}</span>
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

      <SupplementModal
        supplement={selectedSupplement}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
