import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Brain, Zap, Target, FlaskConical, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { buildAmazonSearchLink } from '@/lib/affiliate.js';

// Top 8 focus supplements — ranked by combined study+learning score from supplements.js
// Mechanism text written to match evidence-based summaries already used in BestNootropicsPage
const TOP_FOCUS_SUPPLEMENTS = [
  {
    rank: 1,
    id: 'bacopa',
    name: 'Bacopa Monnieri',
    focusScore: 87,
    tagline: 'Strongest Evidence for Sustained Focus & Memory',
    mechanism:
      'Bacopa enhances focus by increasing acetylcholine signaling — the neurotransmitter that drives attention and working memory. It also boosts brain-derived neurotrophic factor (BDNF), building new neural pathways over weeks of use. 12+ randomized controlled trials confirm improvements in memory formation speed and retention.',
    dosage: { min: 300, max: 600, unit: 'mg', timing: 'With meals, morning or evening' },
    timeToEffect: '4–8 weeks',
    bestFor: ['Sustained focus', 'Memory', 'Learning speed'],
  },
  {
    rank: 2,
    id: 'caffeine',
    name: 'Caffeine',
    focusScore: 84,
    tagline: 'Fastest-Acting Focus Booster, Best With L-Theanine',
    mechanism:
      'Caffeine blocks adenosine receptors in the brain — adenosine is the chemical that makes you feel tired, so blocking it raises alertness and sharpens focus within 30–60 minutes. It also triggers dopamine release, improving motivation. The catch: tolerance builds in 7–10 days, making cycling important.',
    dosage: { min: 50, max: 200, unit: 'mg', timing: 'Morning, avoid after 2 PM' },
    timeToEffect: '30–60 min',
    bestFor: ['Acute focus', 'Alertness', 'Motivation'],
  },
  {
    rank: 3,
    id: 'alpha-gpc',
    name: 'Alpha-GPC',
    focusScore: 82,
    tagline: 'Best Choline Source for Sharp, Clean Focus',
    mechanism:
      'Alpha-GPC is the most bioavailable form of choline — the direct precursor to acetylcholine. Higher acetylcholine means faster information processing, better attention switching, and sharper working memory. It also stimulates growth hormone release, making it popular for both cognitive and physical performance.',
    dosage: { min: 300, max: 600, unit: 'mg', timing: 'Morning or before demanding work' },
    timeToEffect: '1–2 hours (acute)' ,
    bestFor: ['Focus', 'Working memory', 'Mental clarity'],
  },
  {
    rank: 4,
    id: 'lions-mane',
    name: "Lion's Mane Mushroom",
    focusScore: 78,
    tagline: 'Best Long-Term Focus via Neuroplasticity',
    mechanism:
      "Lion's Mane is the only supplement proven to stimulate Nerve Growth Factor (NGF), supporting new neuron formation and myelin repair. Better myelination means faster signal transmission between neurons — the physical foundation of focus. Human trials show consistent cognitive improvements after 4–8 weeks of daily use.",
    dosage: { min: 500, max: 3000, unit: 'mg', timing: 'With meals' },
    timeToEffect: '4–8 weeks',
    bestFor: ['Neuroplasticity', 'Focus endurance', 'Brain health'],
  },
  {
    rank: 5,
    id: 'l-theanine',
    name: 'L-Theanine',
    focusScore: 75,
    tagline: 'Calm, Distraction-Free Focus — Synergistic with Caffeine',
    mechanism:
      "L-Theanine crosses the blood-brain barrier and increases alpha brain wave activity — the frequency associated with relaxed alertness, the mental state most conducive to sustained focus. It also blunts the anxiety and jitteriness caffeine causes, creating a uniquely clean focus state. The caffeine + L-Theanine combination is the most studied nootropic pairing in existence.",
    dosage: { min: 100, max: 400, unit: 'mg', timing: 'With or without caffeine' },
    timeToEffect: '30–45 min',
    bestFor: ['Calm focus', 'Anxiety reduction', 'Caffeine synergy'],
  },
  {
    rank: 6,
    id: 'rhodiola',
    name: 'Rhodiola Rosea',
    focusScore: 72,
    tagline: 'Best for Focus Under Stress and Fatigue',
    mechanism:
      'Rhodiola works by modulating the HPA axis (your stress response system) to prevent cortisol from degrading cognitive function. Under stress or sleep deprivation, most nootropics become less effective — Rhodiola maintains performance. Clinical studies show significant improvements in mental fatigue, reaction time, and attention within hours of dosing.',
    dosage: { min: 200, max: 600, unit: 'mg', timing: 'Morning, empty stomach' },
    timeToEffect: '30–60 min (acute)',
    bestFor: ['Stress resilience', 'Mental fatigue', 'Focus under pressure'],
  },
  {
    rank: 7,
    id: 'ginkgo',
    name: 'Ginkgo Biloba',
    focusScore: 68,
    tagline: 'Best for Blood Flow-Driven Focus and Clarity',
    mechanism:
      'Ginkgo improves cerebral circulation by dilating blood vessels and reducing platelet aggregation, ensuring neurons get the oxygen and glucose they need to fire at full capacity. It also has antioxidant properties that protect neurons from oxidative stress. Studies show consistent improvements in attention, processing speed, and working memory in adults.',
    dosage: { min: 120, max: 240, unit: 'mg', timing: 'With meals' },
    timeToEffect: '4–6 weeks',
    bestFor: ['Cerebral circulation', 'Processing speed', 'Attention'],
  },
  {
    rank: 8,
    id: 'creatine',
    name: 'Creatine Monohydrate',
    focusScore: 64,
    tagline: 'Best Value Cognitive Enhancer — Underrated for Focus',
    mechanism:
      'The brain consumes about 20% of your body\'s energy despite being 2% of your weight. Creatine replenishes ATP (cellular energy currency) in neurons, directly improving working memory and mental stamina — especially under cognitive load or sleep deprivation. The most cost-effective nootropic per unit of cognitive benefit.',
    dosage: { min: 3, max: 5, unit: 'g', timing: 'Any time, consistency matters' },
    timeToEffect: '1–2 weeks',
    bestFor: ['Working memory', 'Mental endurance', 'Value'],
  },
];

// 3 curated focus stacks
const FOCUS_STACKS = [
  {
    level: 'Beginner',
    levelColor: 'bg-accent-100 text-accent-700 border-accent-300',
    title: 'The Clean Start Stack',
    description: 'Zero jitters. Maximum safety. Perfect for nootropic newcomers who want real, noticeable focus improvement without complexity or risk.',
    supplements: [
      { id: 'caffeine', name: 'Caffeine', dose: '100mg' },
      { id: 'l-theanine', name: 'L-Theanine', dose: '200mg' },
      { id: 'creatine', name: 'Creatine', dose: '5g' },
    ],
    why: "Caffeine + L-Theanine is the world's most studied nootropic combo. Creatine adds cognitive energy with zero stimulant side effects.",
  },
  {
    level: 'Intermediate',
    levelColor: 'bg-primary-100 text-primary-800 border-primary-300',
    title: 'The Deep Work Stack',
    description: 'Designed for 4–6 hour focus sessions. Combines acute stimulation with acetylcholine support for sharp, sustained attention.',
    supplements: [
      { id: 'caffeine', name: 'Caffeine', dose: '100mg' },
      { id: 'l-theanine', name: 'L-Theanine', dose: '200mg' },
      { id: 'alpha-gpc', name: 'Alpha-GPC', dose: '300mg' },
      { id: 'bacopa', name: 'Bacopa', dose: '300mg' },
    ],
    why: 'Alpha-GPC floods acetylcholine pathways for sharp focus. Bacopa builds the long-term memory architecture to make that focus productive.',
  },
  {
    level: 'Advanced',
    levelColor: 'bg-primary-100 text-primary-800 border-primary-300',
    title: 'The Full Spectrum Focus Stack',
    description: 'For experienced biohackers who want peak cognitive performance across all dimensions — focus, memory, stress resilience, and neuroplasticity.',
    supplements: [
      { id: 'caffeine', name: 'Caffeine', dose: '100mg' },
      { id: 'l-theanine', name: 'L-Theanine', dose: '200mg' },
      { id: 'alpha-gpc', name: 'Alpha-GPC', dose: '300mg' },
      { id: 'bacopa', name: 'Bacopa', dose: '300mg' },
      { id: 'lions-mane', name: "Lion's Mane", dose: '1000mg' },
      { id: 'rhodiola', name: 'Rhodiola', dose: '300mg' },
    ],
    why: "Lion's Mane provides the neuroplasticity layer. Rhodiola keeps the stack effective under stress. Together, this covers every mechanism of focus.",
  },
];

const RELATED_ARTICLES = [
  { slug: 'best-nootropic-stack-for-focus-2026', title: 'Best Nootropic Stack for Focus 2026', readTime: 10, tags: ['focus', 'stack'] },
  { slug: 'nootropic-stack-for-programmers-developers', title: 'Nootropic Stack for Programmers & Developers', readTime: 9, tags: ['focus', 'programmers'] },
  { slug: 'caffeine-l-theanine-stack-the-ultimate-guide', title: 'Caffeine + L-Theanine: The Ultimate Guide', readTime: 8, tags: ['caffeine', 'theanine'] },
  { slug: 'natural-nootropics-for-adhd-focus-without-prescription', title: 'Natural Nootropics for ADHD Focus', readTime: 11, tags: ['adhd', 'focus'] },
  { slug: 'the-science-of-flow-states-nootropics-that-help', title: 'The Science of Flow States & Nootropics', readTime: 9, tags: ['flow', 'focus'] },
  { slug: 'nootropics-for-entrepreneurs-and-founders', title: 'Nootropics for Entrepreneurs & Founders', readTime: 8, tags: ['focus', 'performance'] },
];

const MECHANISMS = [
  {
    icon: Zap,
    neurotransmitter: 'Dopamine',
    color: 'text-warn-700',
    bgColor: 'bg-warn-100 border-warn-500',
    headline: 'Motivation & Drive',
    body: "Dopamine is the brain's 'go signal' — it creates the motivated, driven feeling that gets you started and keeps you on task. Supplements like caffeine, L-tyrosine, and Rhodiola increase dopamine availability or protect it from breakdown, producing genuine motivation rather than forced willpower.",
  },
  {
    icon: Brain,
    neurotransmitter: 'Acetylcholine',
    color: 'text-primary-700',
    bgColor: 'bg-primary-050 border-primary-300',
    headline: 'Precision & Working Memory',
    body: "Acetylcholine is the neurotransmitter of attention and memory formation. When acetylcholine is high, you can hold more information in working memory simultaneously and process it faster. Alpha-GPC, Bacopa, and Huperzine-A all raise acetylcholine through different mechanisms — essential for deep, precision-demanding work.",
  },
  {
    icon: Target,
    neurotransmitter: 'Adenosine Blockade',
    color: 'text-danger-500',
    bgColor: 'bg-danger-100 border-red-200',
    headline: 'Fighting Fatigue',
    body: "Adenosine is a byproduct of neural activity that accumulates over the day, creating the sensation of mental fatigue. Caffeine works entirely by blocking adenosine receptors — it doesn't give you energy directly, it removes the brakes. Rhodiola and other adaptogens prevent adenosine buildup under stress, extending your effective focus window.",
  },
];

const getRankColor = (rank) => {
  if (rank === 1) return 'bg-warn-100 border-yellow-300 text-yellow-800';
  if (rank === 2) return 'bg-surface-sunk border-ink-300 text-ink-700';
  if (rank === 3) return 'bg-warn-100 border-warn-500 text-warn-700';
  return 'bg-primary-050 border-primary-300 text-primary-800';
};

const trackClick = (name, vendor) => {
  fetch('/api/track/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supplement: name, vendor, page: 'focus-pillar' }),
  }).catch(() => {});
};

export function NootropicsForFocusPage() {
  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Best Nootropics for Focus 2026 — Ranked by Evidence | NootropicStacker"
        customDescription="The 8 best nootropics for focus in 2026, ranked by clinical evidence. Includes dosage ranges (100mg–3000mg), timing, mechanisms, and a free focus stack builder. Find your optimal focus supplement stack."
      />

      <div className="max-w-3xl mx-auto">

        {/* ── Hero ── */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className="text-primary-800 border-primary-300 bg-primary-050 text-xs font-medium">Pillar Guide</Badge>
            <Badge variant="outline" className="text-ink-700 border-ink-300 bg-surface-card text-xs font-medium">Updated April 2026</Badge>
            <Badge variant="outline" className="text-accent-700 border-green-300 bg-accent-050 text-xs font-medium">Evidence-Ranked</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4 leading-tight">
            Best Nootropics for Focus 2026 —{' '}
            <span className="text-primary-700">Ranked &amp; Reviewed</span>
          </h1>

          <p className="text-ink-700 leading-relaxed mb-5 text-base sm:text-lg">
            We ranked the 8 most effective nootropics for focus by combining clinical trial data, mechanism strength, and real-world user evidence. Each entry includes exact dosage ranges, optimal timing, and the neuroscience behind why it works — so you can build a stack that matches your specific focus goals.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-ink-500 mb-6">
            <span className="flex items-center gap-1"><span className="text-green-500 font-bold">✓</span> 8 supplements ranked</span>
            <span className="flex items-center gap-1"><span className="text-green-500 font-bold">✓</span> Clinical evidence cited</span>
            <span className="flex items-center gap-1"><span className="text-green-500 font-bold">✓</span> 3 curated stacks</span>
            <span className="flex items-center gap-1"><span className="text-green-500 font-bold">✓</span> Free stack builder</span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            <Brain className="w-4 h-4" />
            Build Your Focus Stack Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Top 8 Focus Supplements ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">Top 8 Nootropics for Focus in 2026</h2>
          <p className="text-ink-500 text-sm mb-6">Ranked by a composite focus score combining clinical evidence strength, mechanism clarity, and dose-response reliability.</p>

          <div className="space-y-6">
            {TOP_FOCUS_SUPPLEMENTS.map((s) => {
              const amazonUrl = buildAmazonSearchLink(`${s.name} supplement`, { campaign: 'nootropics-for-focus' });
              const iherbUrl = `https://www.iherb.com/search?kw=${encodeURIComponent(s.name)}`;
              const scoreBarWidth = `${s.focusScore}%`;

              return (
                <Card key={s.id} className="border-ink-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Rank badge */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${getRankColor(s.rank)}`}>
                        #{s.rank}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-ink-900">{s.name}</h3>
                        </div>

                        <p className="text-sm font-medium text-primary-800 mb-3">{s.tagline}</p>

                        {/* Focus score bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
                            <span className="font-medium">Focus Score</span>
                            <span className="font-bold text-ink-700">{s.focusScore}/100</span>
                          </div>
                          <div className="h-2 bg-surface-sunk rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-0500 rounded-full transition-all"
                              style={{ width: scoreBarWidth }}
                            />
                          </div>
                        </div>

                        <p className="text-ink-700 text-sm mb-4 leading-relaxed">{s.mechanism}</p>

                        {/* Dosage + timing */}
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-500 mb-4">
                          <span>
                            <strong className="text-ink-700">Dosage:</strong>{' '}
                            {s.dosage.min}–{s.dosage.max}{s.dosage.unit}
                          </span>
                          <span>
                            <strong className="text-ink-700">Timing:</strong> {s.dosage.timing}
                          </span>
                          <span>
                            <strong className="text-ink-700">Effect onset:</strong> {s.timeToEffect}
                          </span>
                        </div>

                        {/* Best for tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {s.bestFor.map((tag) => (
                            <span key={tag} className="text-xs bg-primary-050 text-primary-800 border border-blue-100 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/supplements/${s.id}`}
                            className="text-xs text-primary-700 hover:underline font-medium"
                          >
                            Full profile →
                          </Link>
                          <a
                            href={amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            onClick={() => trackClick(s.name, 'amazon')}
                            className="flex items-center gap-1 text-xs bg-warn-1000 hover:bg-warn-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" /> Buy on Amazon
                          </a>
                          <a
                            href={iherbUrl}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            onClick={() => trackClick(s.name, 'iherb')}
                            className="flex items-center gap-1 text-xs bg-accent-600 hover:bg-accent-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" /> Buy on iHerb
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── Best Stacks for Focus ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">Best Stacks for Focus</h2>
          <p className="text-ink-500 text-sm mb-6">
            Individual supplements are good. Stacks are better — the right combinations create synergies that single compounds can't match. Click "Build This Stack" to load any stack into our free Stack Builder and customize it.
          </p>

          <div className="space-y-5">
            {FOCUS_STACKS.map((stack) => {
              const stackIds = stack.supplements.map((s) => s.id).join(',');
              return (
                <Card key={stack.level} className="border-ink-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${stack.levelColor}`}>
                        {stack.level}
                      </span>
                      <h3 className="text-base font-bold text-ink-900">{stack.title}</h3>
                    </div>

                    <p className="text-ink-700 text-sm mb-3">{stack.description}</p>

                    {/* Supplement pills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {stack.supplements.map((s) => (
                        <span key={s.id} className="text-xs bg-surface-sunk text-ink-700 border border-ink-200 px-2.5 py-1 rounded-full font-medium">
                          {s.name} <span className="text-ink-400">{s.dose}</span>
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-ink-500 italic mb-4">{stack.why}</p>

                    <Link
                      to={`/?stack=${stackIds}`}
                      className="inline-flex items-center gap-1.5 text-sm bg-primary-700 hover:bg-primary-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      Build This Stack
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── Focus Mechanism Explainer ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">How Nootropics Actually Improve Focus</h2>
          <p className="text-ink-500 text-sm mb-6">
            Most people think of focus as a single thing, but it's actually three overlapping systems. The best stacks address all three simultaneously.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MECHANISMS.map(({ icon: Icon, neurotransmitter, color, bgColor, headline, body }) => (
              <div key={neurotransmitter} className={`rounded-xl border p-5 ${bgColor}`}>
                <Icon className={`w-6 h-6 mb-2 ${color}`} />
                <div className="text-xs font-bold uppercase tracking-wide text-ink-400 mb-0.5">{neurotransmitter}</div>
                <h3 className="font-bold text-ink-900 text-sm mb-2">{headline}</h3>
                <p className="text-xs text-ink-700 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-warn-100 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>The key insight:</strong> Most nootropics only hit one mechanism. A caffeine + L-Theanine stack covers adenosine blockade and calm alertness. Add Alpha-GPC and you add acetylcholine. Add Rhodiola and you protect the dopamine and adenosine systems under stress. This is why stacking outperforms single compounds.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="mb-12 p-6 sm:p-8 bg-primary-700 rounded-xl text-white text-center">
          <Brain className="w-9 h-9 mx-auto mb-3 opacity-90" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Build Your Personal Focus Stack — Free</h2>
          <p className="text-blue-100 text-sm mb-5 max-w-md mx-auto">
            Use our Stack Builder to combine any of these 8 supplements, check interactions, and get a Stack Score across synergy, coverage, and efficiency. No account required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-800 font-semibold px-6 py-3 rounded-lg hover:bg-primary-050 transition-colors"
            >
              <Brain className="w-4 h-4" />
              Open Stack Builder
            </Link>
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center gap-2 bg-primary-0500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors border border-blue-400"
            >
              Take the Stack Quiz
            </Link>
          </div>
        </div>

        {/* ── Related Articles ── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-ink-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-700" />
              Related Focus Guides
            </h2>
            <Link to="/blog" className="text-sm text-primary-700 hover:underline">View all →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RELATED_ARTICLES.map((article) => (
              <Link key={article.slug} to={`/blog/${article.slug}`}>
                <div className="p-4 rounded-lg border border-ink-200 hover:border-primary-300 hover:shadow-sm transition-all bg-white h-full">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-primary-050 text-primary-700 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-ink-900 hover:text-primary-800 leading-snug">{article.title}</p>
                  <p className="text-xs text-ink-400 mt-1">{article.readTime} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <p className="text-xs text-ink-400 text-center mt-2">
          * Affiliate links — we earn a small commission at no extra cost to you. We only link to quality-tested sources.
        </p>
      </div>
    </>
  );
}
