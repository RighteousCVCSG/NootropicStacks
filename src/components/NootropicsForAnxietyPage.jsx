import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldAlert, AlertTriangle, Brain, ChevronRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { buildAmazonSearchLink } from '@/lib/affiliate.js';

const ANXIETY_SUPPLEMENTS = [
  {
    rank: 1,
    id: 'ashwagandha',
    name: 'Ashwagandha (KSM-66)',
    tagline: 'Strongest clinical evidence for anxiety and cortisol reduction',
    mechanism: 'Ashwagandha acts as an adaptogen, modulating the HPA axis to lower chronically elevated cortisol. It also binds to GABA receptors, producing a calming effect without sedation.',
    dosage: '300–600mg KSM-66 extract daily',
    timing: 'Evening or with meals',
    evidence: 'Strong',
    bestFor: ['Chronic stress', 'Sleep quality', 'Cortisol reduction'],
  },
  {
    rank: 2,
    id: 'l-theanine',
    name: 'L-Theanine',
    tagline: 'Fast-acting calm focus without drowsiness',
    mechanism: 'L-Theanine increases alpha brain wave activity — the same relaxed-but-alert state achieved in meditation. It elevates GABA, serotonin, and dopamine while blunting cortisol spikes from stress or caffeine.',
    dosage: '100–200mg per dose',
    timing: 'Anytime; 30–60 min before stressful situations',
    evidence: 'Strong',
    bestFor: ['Acute anxiety', 'Caffeine jitters', 'Calm focus'],
  },
  {
    rank: 3,
    id: 'rhodiola',
    name: 'Rhodiola Rosea',
    tagline: 'Best adaptogen for performance anxiety and stress-induced burnout',
    mechanism: 'Rhodiola modulates cortisol response and increases stress resilience via effects on serotonin and dopamine transport. It reduces anxiety-driven fatigue and restores mental clarity under pressure.',
    dosage: '200–400mg standardized extract (3% rosavins, 1% salidroside)',
    timing: 'Morning on an empty stomach',
    evidence: 'Strong',
    bestFor: ['Performance anxiety', 'Mental fatigue', 'Burnout recovery'],
  },
  {
    rank: 4,
    id: 'magnesium',
    name: 'Magnesium Glycinate',
    tagline: 'Foundational mineral most anxious people are deficient in',
    mechanism: 'Magnesium blocks NMDA receptors and activates GABA pathways, producing a natural calming effect. Deficiency — extremely common — is directly linked to heightened anxiety, poor sleep, and muscle tension.',
    dosage: '200–400mg elemental magnesium',
    timing: 'Evening, before bed',
    evidence: 'Strong',
    bestFor: ['Sleep anxiety', 'Physical tension', 'Foundational support'],
  },
  {
    rank: 5,
    id: 'bacopa',
    name: 'Bacopa Monnieri',
    tagline: 'Long-term anxiety reduction with memory benefits',
    mechanism: 'Bacopa reduces anxiety via its anxiolytic effects on serotonin and GABA systems while also lowering stress-response markers. Clinical trials consistently show reduced anxiety scores with 8–12 weeks of use.',
    dosage: '300mg standardized extract (50% bacosides) daily',
    timing: 'With a fatty meal (fat-soluble)',
    evidence: 'Strong',
    bestFor: ['Chronic anxiety', 'Memory support', 'Long-term use'],
  },
  {
    rank: 6,
    id: 'lions-mane',
    name: "Lion's Mane Mushroom",
    tagline: 'Supports mood and anxiety via nerve growth and gut-brain axis',
    mechanism: "Lion's Mane stimulates Nerve Growth Factor (NGF), supporting hippocampal neurogenesis — a key mechanism in anxiety resilience. Emerging research also shows benefits for anxiety and depression through gut microbiome modulation.",
    dosage: '500–1000mg extract daily (30%+ polysaccharides)',
    timing: 'Morning, with food',
    evidence: 'Moderate',
    bestFor: ['Mood support', 'Neuroplasticity', 'Long-term brain health'],
  },
  {
    rank: 7,
    id: 'phosphatidylserine',
    name: 'Phosphatidylserine (PS)',
    tagline: 'Blunts cortisol spikes from stress and exercise',
    mechanism: 'Phosphatidylserine is a phospholipid in neuron membranes that directly dampens the cortisol response to physical and psychological stress. An FDA-qualified health claim supports its role in cognitive function.',
    dosage: '100–300mg daily',
    timing: 'With meals',
    evidence: 'Moderate',
    bestFor: ['Cortisol management', 'Exercise-induced stress', 'Cognitive support'],
  },
  {
    rank: 8,
    id: 'gaba',
    name: 'GABA',
    tagline: 'Direct inhibitory neurotransmitter support',
    mechanism: "GABA is the brain's primary inhibitory neurotransmitter — low GABA activity is directly correlated with anxiety disorders. Supplemental GABA has modest but real acute anxiolytic effects, particularly for stress-induced anxiety.",
    dosage: '500–750mg per dose',
    timing: '30–60 min before stressful events or at bedtime',
    evidence: 'Emerging',
    bestFor: ['Acute anxiety', 'Pre-event nerves', 'Sleep-onset anxiety'],
  },
];

const EVIDENCE_BADGE = {
  Strong: 'bg-accent-100 text-accent-700 border-accent-300',
  Moderate: 'bg-primary-100 text-primary-800 border-primary-300',
  Emerging: 'bg-warn-100 text-warn-700 border-yellow-200',
};

const ANXIETY_TYPES = [
  {
    type: 'Social Anxiety',
    icon: '🗣️',
    description: 'Nervous around people, public speaking, social situations',
    supplements: ['L-Theanine', 'Ashwagandha'],
    ids: ['l-theanine', 'ashwagandha'],
    rationale: 'L-Theanine provides acute calm within 30–60 minutes; Ashwagandha reduces baseline cortisol over weeks, making social situations less activating overall.',
  },
  {
    type: 'Performance Anxiety',
    icon: '🎯',
    description: 'Exams, presentations, athletic events, interviews',
    supplements: ['Rhodiola Rosea', 'Magnesium'],
    ids: ['rhodiola', 'magnesium'],
    rationale: 'Rhodiola sharpens performance under acute stress; Magnesium prevents the physical tension and mental overwhelm that tanks performance.',
  },
  {
    type: 'General / Chronic Stress',
    icon: '⚡',
    description: 'Background anxiety, burnout, high-stress lifestyle',
    supplements: ['Ashwagandha', 'Bacopa', "Lion's Mane"],
    ids: ['ashwagandha', 'bacopa', 'lions-mane'],
    rationale: 'This trio addresses chronic stress from multiple angles: HPA axis regulation (Ashwagandha), serotonin/GABA support (Bacopa), and neuroplasticity (Lion\'s Mane).',
  },
];

const RELATED_ARTICLES = [
  { slug: 'nootropics-for-anxiety-what-actually-works', title: 'Nootropics for Anxiety: What Actually Works', readTime: 10 },
  { slug: 'nootropics-for-social-anxiety-and-confidence', title: 'Nootropics for Social Anxiety and Confidence', readTime: 9 },
  { slug: 'ashwagandha-benefits-dosage-complete-guide', title: 'Ashwagandha: Benefits, Dosage & Complete Guide', readTime: 10 },
  { slug: 'ashwagandha-vs-rhodiola-which-adaptogen-is-right-for-you', title: 'Ashwagandha vs Rhodiola: Which Adaptogen Is Right for You?', readTime: 8 },
  { slug: 'best-nootropic-stack-for-anxiety-calm-focus', title: 'Best Nootropic Stack for Anxiety & Calm Focus', readTime: 9 },
  { slug: 'lions-mane-mushroom-for-anxiety-and-depression-research', title: "Lion's Mane for Anxiety and Depression: The Research", readTime: 8 },
];

const AVOID_LIST = [
  { name: 'High-dose caffeine (200mg+)', reason: 'Directly elevates cortisol and adrenaline; worsens anxiety in sensitive individuals.' },
  { name: 'Racetams without choline', reason: 'Can cause headaches and mental overstimulation, which aggravates anxiety.' },
  { name: 'Stimulant-heavy pre-workouts', reason: 'Blends with synephrine, DMHA, or yohimbine trigger the fight-or-flight response.' },
  { name: 'Noopept and Phenylpiracetam', reason: 'Strong stimulant effects that increase mental arousal — counterproductive for anxiety.' },
  { name: 'High-dose tyrosine on anxious days', reason: 'L-Tyrosine boosts dopamine and norepinephrine; elevating norepinephrine heightens anxiety signals.' },
];

function trackClick(name, vendor) {
  fetch('/api/track/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supplement: name, vendor, page: 'anxiety-pillar' }),
  }).catch(() => {});
}

function AffiliateButtons({ name }) {
  const amazonUrl = buildAmazonSearchLink(`${name} supplement`, { campaign: 'nootropics-for-anxiety' });
  const iherbUrl = `https://www.iherb.com/search?kw=${encodeURIComponent(name)}`;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <a
        href={amazonUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackClick(name, 'amazon')}
        className="flex items-center gap-1 text-xs bg-warn-1000 hover:bg-warn-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
      >
        <ExternalLink className="w-3 h-3" /> Amazon
      </a>
      <a
        href={iherbUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackClick(name, 'iherb')}
        className="flex items-center gap-1 text-xs bg-accent-600 hover:bg-accent-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
      >
        <ExternalLink className="w-3 h-3" /> iHerb
      </a>
    </div>
  );
}

export function NootropicsForAnxietyPage() {
  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Best Nootropics for Anxiety 2026 — Evidence-Based Guide | NootropicStacker"
        customDescription="The 8 best natural supplements for anxiety in 2026, ranked by clinical evidence. Includes mechanisms, dosing, anxiety type matching, and safety guidance."
      />

      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3 text-xs text-ink-500">
            <span>Updated April 2026</span>
            <span>·</span>
            <span>12 min read</span>
            <span>·</span>
            <span>Evidence-based</span>
          </div>
          <h1 className="text-3xl font-semibold text-ink-900 mb-4 leading-tight">
            Best Nootropics for Anxiety 2026 — Evidence-Based Guide
          </h1>
          <p className="text-ink-700 leading-relaxed mb-4">
            Anxiety affects millions, and the supplement market is flooded with overpromising products. This guide cuts through that noise. We evaluated the clinical research on dozens of compounds and identified the 8 with the strongest evidence for reducing anxiety safely — including how they work, who they're best for, and exactly how to dose them.
          </p>

          {/* Disclaimer */}
          <div className="flex gap-3 p-4 bg-warn-100 border border-amber-200 rounded-md mb-5">
            <AlertTriangle className="w-5 h-5 text-warn-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-warn-700">
              <strong>Not medical advice.</strong> This is research-based educational information. Supplements are not a substitute for professional mental health treatment. If you have an anxiety disorder, please consult a qualified healthcare provider before using any supplement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-ink-500">
            <span>✓ 8 evidence-ranked supplements</span>
            <span>·</span>
            <span>✓ Anxiety-type matching</span>
            <span>·</span>
            <span>✓ What to avoid</span>
          </div>
        </div>

        {/* CTA to stack builder */}
        <div className="mb-4 p-4 bg-primary-050 border border-primary-300 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary-900">Want a personalized anxiety stack?</p>
            <p className="text-xs text-primary-800">Use the free Stack Builder to combine supplements, check interactions, and get a Stack Score.</p>
          </div>
          <Link
            to="/"
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            <Brain className="w-4 h-4" /> Build My Stack
          </Link>
        </div>

        {/* Top 8 Supplements */}
        <h2 className="text-xl font-semibold text-ink-900 mb-4">Top 8 Nootropics for Anxiety</h2>
        <div className="space-y-5 mb-6">
          {ANXIETY_SUPPLEMENTS.map((s) => (
            <Card key={s.id} className="border-ink-200 hover:shadow-1 transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 border border-indigo-200 flex items-center justify-center font-semibold text-sm text-primary-800">
                    {s.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-ink-900">{s.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded border ${EVIDENCE_BADGE[s.evidence]}`}>
                        {s.evidence} Evidence
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary-800 mb-2">{s.tagline}</p>
                    <p className="text-ink-700 text-sm mb-3 leading-relaxed">{s.mechanism}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-500 mb-2">
                      <span><strong className="text-ink-700">Dosage:</strong> {s.dosage}</span>
                      <span><strong className="text-ink-700">Timing:</strong> {s.timing}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {s.bestFor.map((tag) => (
                        <span key={tag} className="text-xs bg-surface-sunk text-ink-700 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <Link to={`/supplements/${s.id}`} className="text-xs text-primary-700 hover:underline flex items-center gap-0.5">
                        Full profile <ChevronRight className="w-3 h-3" />
                      </Link>
                      <AffiliateButtons name={s.name.split(' (')[0]} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What Type of Anxiety? */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-ink-900 mb-2">What Type of Anxiety Do You Have?</h2>
          <p className="text-ink-700 text-sm mb-5">Different anxiety patterns respond to different mechanisms. Match your situation to the right stack.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ANXIETY_TYPES.map((item) => (
              <div key={item.type} className="border border-ink-200 rounded-md p-5 bg-white hover:shadow-sm transition-shadow flex flex-col">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-ink-900 text-sm mb-1">{item.type}</h3>
                <p className="text-xs text-ink-500 mb-3">{item.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.supplements.map((name) => (
                    <span key={name} className="text-xs bg-primary-050 text-primary-800 px-2 py-0.5 rounded font-medium">{name}</span>
                  ))}
                </div>
                <p className="text-xs text-ink-700 leading-relaxed mb-4 flex-1">{item.rationale}</p>
                <Link
                  to={`/?stack=${item.ids.join(',')}`}
                  className="text-xs text-primary-700 hover:text-primary-800 font-medium flex items-center gap-1"
                >
                  Build This Stack <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Note */}
        <div className="mb-10 p-5 bg-danger-100 border border-red-200 rounded-md">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-danger-700 mb-2">Important Safety Information</h2>
              <div className="space-y-2 text-sm text-danger-700">
                <p><strong>Anxiety disorders require professional care.</strong> Supplements can support anxiety management, but they are not a replacement for therapy (especially CBT), medication when clinically indicated, or medical supervision for diagnosed anxiety disorders.</p>
                <p><strong>If you take SSRIs, SNRIs, or benzodiazepines</strong> — consult your doctor before adding any supplement. Ashwagandha and Rhodiola can affect serotonin and cortisol pathways; GABA and L-Theanine interact with GABAergic systems that benzodiazepines also target.</p>
                <p><strong>Pregnancy and breastfeeding:</strong> Avoid all adaptogens and most supplements not explicitly cleared by your OB.</p>
                <p>If anxiety is significantly impacting your daily life, please reach out to a mental health professional. The <a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer" className="underline">SAMHSA National Helpline</a> (1-800-662-4357) is free and confidential.</p>
              </div>
            </div>
          </div>
        </div>

        {/* What to Avoid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-ink-900 mb-2">What to Avoid If You Have Anxiety</h2>
          <p className="text-ink-700 text-sm mb-4">Some popular nootropics can actively worsen anxiety. Knowing what to skip is just as important as knowing what to take.</p>

          <div className="space-y-3">
            {AVOID_LIST.map((item) => (
              <div key={item.name} className="flex gap-3 p-4 bg-white border border-ink-200 rounded-md">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-danger-100 flex items-center justify-center mt-0.5">
                  <span className="text-danger-500 text-xs font-semibold">✕</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{item.name}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to Stack Builder */}
        <div className="mb-6 p-3 bg-primary-700 rounded-md text-white text-center">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-90" />
          <h2 className="text-xl font-semibold mb-2">Build Your Anxiety Stack</h2>
          <p className="text-primary-100 text-sm mb-4 max-w-md mx-auto">
            Use the free Stack Builder to combine these supplements, check for interactions, and get a personalized Stack Score based on your goals.
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-primary-800 font-semibold px-6 py-2.5 rounded-md hover:bg-primary-050 transition-colors"
          >
            Open Stack Builder →
          </Link>
        </div>

        {/* Related Articles */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-700" />
            Related Research & Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RELATED_ARTICLES.map((article) => (
              <Link key={article.slug} to={`/blog/${article.slug}`}>
                <div className="p-4 rounded-md border border-ink-200 hover:border-indigo-300 hover:shadow-sm transition-all bg-white h-full">
                  <p className="text-sm font-medium text-ink-900 hover:text-primary-800 leading-snug">{article.title}</p>
                  <p className="text-xs text-ink-400 mt-1">{article.readTime} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-400 text-center mt-6">
          * Affiliate links — we earn a small commission at no extra cost to you. We only link to quality-tested sources.
        </p>
      </div>
    </>
  );
}
