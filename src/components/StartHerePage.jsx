import React from 'react';
import { Link } from 'react-router-dom';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import {
  Brain, Zap, Layers, BookOpen, HelpCircle, Star, AlertTriangle,
  ArrowRight, CheckCircle, ChevronRight, Target, Shield, TrendingUp,
  Users, Award, Coffee
} from 'lucide-react';

const BEGINNER_STACKS = [
  {
    name: 'The Classic Starter',
    description: 'The most well-researched, beginner-safe combination. Works within 30 minutes, no cycling required.',
    supplements: ['Caffeine', 'L-Theanine'],
    goals: ['Energy', 'Focus', 'Calm'],
    difficulty: 'Beginner',
    cost: '$15–25/mo',
    stackUrl: '/?stack=caffeine,l-theanine',
    why: 'Caffeine sharpens focus and energy; L-Theanine smooths out the jitters and crash. Together they create alert, sustained focus without anxiety. Backed by dozens of studies.',
  },
  {
    name: 'The Memory Stack',
    description: 'A daily foundation for long-term cognitive health. Takes 4–8 weeks for full effect.',
    supplements: ['Lion\'s Mane', 'Bacopa Monnieri', 'Alpha-GPC'],
    goals: ['Memory', 'Neuroprotection', 'Learning'],
    difficulty: 'Beginner',
    cost: '$40–60/mo',
    stackUrl: '/?stack=lions-mane,bacopa-monnieri,alpha-gpc',
    why: 'Lion\'s Mane stimulates NGF for neurogenesis; Bacopa improves memory encoding over weeks; Alpha-GPC provides choline for acetylcholine synthesis. All three are evidence-backed and have excellent safety profiles.',
  },
  {
    name: 'The Anti-Stress Stack',
    description: 'Reduces cortisol and anxiety while maintaining sharp focus. Excellent for high-pressure work or study.',
    supplements: ['Ashwagandha', 'L-Theanine', 'Rhodiola Rosea'],
    goals: ['Mood', 'Anxiety', 'Stress'],
    difficulty: 'Beginner',
    cost: '$30–45/mo',
    stackUrl: '/?stack=ashwagandha,l-theanine,rhodiola-rosea',
    why: 'Ashwagandha reduces cortisol and anxiety over 4–8 weeks; L-Theanine provides immediate calm focus; Rhodiola is an adaptogen that improves stress resilience and mental endurance.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Define Your Goal',
    description: 'Nootropics work best when you have a specific target: focus, memory, energy, mood, or sleep quality. Trying to optimize everything at once dilutes results and makes it hard to know what\'s working.',
    icon: Target,
    color: 'bg-primary-100 text-primary-800',
    action: { label: 'Take the Stack Quiz →', to: '/quiz' }
  },
  {
    number: '02',
    title: 'Start With One Stack',
    description: 'Resist the urge to stack 8 things on day one. Start with 2–3 proven compounds. Give them 4–8 weeks. Track effects. Then add or adjust. More isn\'t better — targeted is better.',
    icon: Layers,
    color: 'bg-primary-100 text-primary-800',
    action: { label: 'Open Stack Builder →', to: '/' }
  },
  {
    number: '03',
    title: 'Research Each Supplement',
    description: 'Understand what you\'re taking: mechanism of action, dosage range, timing, potential interactions. Our supplement database covers 195 compounds with complete profiles.',
    icon: BookOpen,
    color: 'bg-accent-100 text-accent-700',
    action: { label: 'Browse 195 Supplements →', to: '/supplements' }
  },
  {
    number: '04',
    title: 'Check for Interactions',
    description: 'Some combinations are synergistic (caffeine + L-theanine). Others are redundant (two cholinergics at high doses) or potentially conflicting (stimulants + sleep aids). The Stack Score flags these automatically.',
    icon: Shield,
    color: 'bg-warn-100 text-warn-700',
    action: { label: 'View Safety Guide →', to: '/blog/stacking-nootropics-safely-interaction-guide' }
  },
  {
    number: '05',
    title: 'Track and Adjust',
    description: 'Keep a simple log: what you took, when, and how you felt. This is how you distinguish placebo from real effect and find your optimal doses. Most experienced biohackers still track.',
    icon: TrendingUp,
    color: 'bg-teal-100 text-teal-700',
    action: { label: 'Read Biohacker\'s Guide →', to: '/blog/biohackers-guide-to-nootropics-testing-and-tracking' }
  },
];

const CATEGORIES = [
  {
    name: 'Racetams',
    description: 'The original synthetic nootropics. Piracetam, aniracetam, oxiracetam. Require choline supplementation.',
    link: '/blog/complete-racetam-guide-piracetam-aniracetam-oxiracetam',
    level: 'Intermediate',
    icon: '🧪',
  },
  {
    name: 'Adaptogens',
    description: 'Ashwagandha, rhodiola, lion\'s mane. Stress reduction and long-term resilience.',
    link: '/blog/ashwagandha-vs-rhodiola-which-adaptogen-is-right-for-you',
    level: 'Beginner',
    icon: '🌿',
  },
  {
    name: 'Cholinergics',
    description: 'Alpha-GPC, citicoline, huperzine A. Support acetylcholine for memory and learning.',
    link: '/supplements',
    level: 'Beginner–Intermediate',
    icon: '⚡',
  },
  {
    name: 'Stimulants',
    description: 'Caffeine, modafinil alternatives, phenylpiracetam. Energy and focus at a cost — cycle these.',
    link: '/blog/legal-modafinil-alternatives-nootropics-that-work',
    level: 'Beginner',
    icon: '☕',
  },
  {
    name: 'Neuroprotectives',
    description: 'Lion\'s mane, bacopa, omega-3. Long-term brain health, neurogenesis, inflammation control.',
    link: '/blog/best-nootropics-for-longevity-brain-aging-guide',
    level: 'Beginner',
    icon: '🛡️',
  },
  {
    name: 'Mood & Anxiety',
    description: 'L-theanine, ashwagandha, magnesium threonate. Reduce cortisol and anxiety without sedation.',
    link: '/blog/nootropics-for-anxiety-what-actually-works',
    level: 'Beginner',
    icon: '😌',
  },
];

const MYTHS = [
  {
    myth: '"More supplements = more effect"',
    truth: 'Redundant supplements often cancel each other out or compete for the same receptors. A tight 3-compound stack usually outperforms a 10-ingredient shotgun approach.',
  },
  {
    myth: '"Nootropics are all placebo"',
    truth: 'Some are. Many aren\'t. Caffeine, creatine, bacopa monnieri, and lion\'s mane all have strong clinical evidence. The key is knowing which ones are studied vs. hyped.',
  },
  {
    myth: '"They\'re only for studying or exams"',
    truth: 'The biohacking community includes executives, athletes, programmers, parents, and people in their 60s wanting to preserve cognition. Use cases are extremely broad.',
  },
  {
    myth: '"They\'re safe because they\'re natural"',
    truth: '"Natural" doesn\'t mean safe. Some herbal nootropics interact with medications or hormones. Research everything before stacking.',
  },
];

export function StartHerePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-16">
      <SEOOptimizer
        page="home"
        customTitle="Nootropics Guide for Beginners 2026 — How to Start Safely | NootropicStacker"
        customDescription="Complete beginner's guide to nootropics: how to start, which supplements to choose, safe stacking principles, and the 5 steps to your first stack. Free stack builder included."
      />

      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-050 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
          <Brain className="w-4 h-4" />
          Start Here — Beginner's Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-ink-900 leading-tight">
          Your First Nootropic Stack:<br />
          <span className="text-primary-700">A Practical Starter Guide</span>
        </h1>
        <p className="text-lg text-ink-700 max-w-2xl mx-auto">
          The nootropics space is full of hype, overpriced stacks, and bad advice.
          This guide cuts through it — with evidence-backed recommendations, real dosages, and a
          free tool to build and score your first stack.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link to="/quiz" className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-md font-medium transition-colors">
            <HelpCircle className="w-4 h-4" />
            Take the Quiz
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 bg-white border border-ink-200 hover:border-primary-300 text-ink-700 px-5 py-2.5 rounded-md font-medium transition-colors">
            <Layers className="w-4 h-4" />
            Open Stack Builder
          </Link>
        </div>
      </div>

      {/* 5 Steps */}
      <section>
        <h2 className="text-2xl font-semibold text-ink-900 mb-2">The 5-Step Framework</h2>
        <p className="text-ink-700 mb-8">Every successful nootropic protocol follows these steps, whether you're a first-timer or a veteran biohacker.</p>
        <div className="space-y-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-md shadow-sm hover:shadow-1 transition-shadow">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-ink-400">{step.number}</span>
                    <h3 className="font-semibold text-ink-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-ink-700 mb-2">{step.description}</p>
                  <Link to={step.action.to} className="text-sm text-primary-700 hover:text-primary-800 font-medium inline-flex items-center gap-1">
                    {step.action.label}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Beginner Stacks */}
      <section>
        <h2 className="text-2xl font-semibold text-ink-900 mb-2">3 Proven Starter Stacks</h2>
        <p className="text-ink-700 mb-6">These combinations are well-researched, beginner-safe, and cover the three most common goals. Pick one and run it for 30 days before adding anything.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BEGINNER_STACKS.map((stack) => (
            <Card key={stack.name} className="border-ink-200 hover:border-primary-300 transition-colors">
              <CardContent className="p-5 space-y-3">
                <div>
                  <h3 className="font-semibold text-ink-900">{stack.name}</h3>
                  <p className="text-xs text-ink-500 mt-0.5">{stack.cost} · {stack.difficulty}</p>
                </div>
                <p className="text-sm text-ink-700">{stack.description}</p>
                <div className="flex flex-wrap gap-1">
                  {stack.goals.map(g => (
                    <span key={g} className="text-xs bg-primary-050 text-primary-800 px-2 py-0.5 rounded-full">{g}</span>
                  ))}
                </div>
                <div className="text-xs text-ink-500">
                  <span className="font-medium">Supplements: </span>
                  {stack.supplements.join(' + ')}
                </div>
                <p className="text-xs text-ink-700 border-l-2 border-primary-300 pl-2">{stack.why}</p>
                <Link
                  to={stack.stackUrl}
                  className="block text-center text-sm bg-primary-700 hover:bg-primary-800 text-white py-2 rounded-md font-medium transition-colors"
                >
                  Build This Stack →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-semibold text-ink-900 mb-2">Nootropic Categories Explained</h2>
        <p className="text-ink-700 mb-6">Every nootropic belongs to a mechanism family. Understanding these helps you build non-redundant stacks.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} to={cat.link} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-md hover:border-primary-300 hover:shadow-sm transition-all group">
              <span className="text-2xl flex-shrink-0">{cat.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-ink-900 group-hover:text-primary-800 transition-colors">{cat.name}</span>
                  <span className="text-xs text-ink-400">{cat.level}</span>
                </div>
                <p className="text-sm text-ink-700">{cat.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-300 group-hover:text-primary-500 transition-colors flex-shrink-0 self-center" />
            </Link>
          ))}
        </div>
      </section>

      {/* Myths */}
      <section>
        <h2 className="text-2xl font-semibold text-ink-900 mb-6">4 Common Myths (Debunked)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MYTHS.map((item) => (
            <div key={item.myth} className="p-4 bg-white border border-gray-100 rounded-md">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-ink-700">{item.myth}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-ink-700">{item.truth}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular reads */}
      <section className="bg-surface-card rounded-md p-6">
        <h2 className="text-xl font-semibold text-ink-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-warn-500" />
          Most Popular Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Caffeine + L-Theanine: The Ultimate Stack Guide', to: '/blog/caffeine-l-theanine-stack-the-ultimate-guide' },
            { label: "Best Nootropic Stack for Focus 2026", to: '/blog/best-nootropic-stack-for-focus-2026' },
            { label: "Lion's Mane: Benefits, Dosage & Complete Guide", to: '/blog/lions-mane-mushroom-benefits-dosage-complete-guide' },
            { label: 'Legal Modafinil Alternatives That Actually Work', to: '/blog/legal-modafinil-alternatives-nootropics-that-work' },
            { label: 'Nootropics for ADHD Adults: Complete Guide 2026', to: '/blog/nootropics-for-adhd-adults-complete-guide-2026' },
            { label: 'How to Cycle Nootropics (Prevent Tolerance)', to: '/blog/how-to-cycle-nootropics-prevent-tolerance-and-burnout' },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="flex items-center gap-2 text-sm text-ink-700 hover:text-primary-800 group p-2 rounded-md hover:bg-white transition-all">
              <ArrowRight className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
              <span className="group-hover:underline">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-ink-200">
          <Link to="/blog" className="text-sm text-primary-700 hover:text-primary-800 font-medium inline-flex items-center gap-1">
            View all 83 articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md p-8 text-white space-y-4">
        <Brain className="w-10 h-10 mx-auto opacity-90" />
        <h2 className="text-2xl font-semibold">Ready to Build Your Stack?</h2>
        <p className="text-blue-100 max-w-lg mx-auto text-sm">
          Use the free NootropicStacker tool to browse 195 supplements, check interactions,
          and get a real-time Stack Score across synergy, coverage, balance, and efficiency.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="inline-flex items-center gap-2 bg-white text-primary-800 hover:bg-primary-050 px-5 py-2.5 rounded-md font-semibold transition-colors">
            <Layers className="w-4 h-4" />
            Open Stack Builder
          </Link>
          <Link to="/quiz" className="inline-flex items-center gap-2 bg-primary-0500 hover:bg-blue-400 text-white border border-blue-400 px-5 py-2.5 rounded-md font-medium transition-colors">
            <HelpCircle className="w-4 h-4" />
            Take the Quiz
          </Link>
        </div>
      </section>
    </div>
  );
}
