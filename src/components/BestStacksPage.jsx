import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Brain, Zap, Heart, BookOpen, Moon, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateUtms } from '@/lib/affiliate.js';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { JsonLd } from './JsonLd.jsx';
import { buildItemListSchema } from '@/lib/schema/builders.js';

const CURATED_STACKS = [
  {
    id: 'foundation',
    name: 'The Foundation Stack',
    goal: 'Essential Baseline',
    description: 'The 4 supplements that almost everyone is missing, backed by the most robust research.',
    difficulty: 'Beginner',
    monthlyEstimate: '~$35/month',
    icon: Heart,
    supplements: [
      { id: 'creatine', name: 'Creatine', dose: '5g', why: 'Replenishes ATP in neurons; cheap, proven, universal.' },
      { id: 'magnesium', name: 'Magnesium Glycinate', dose: '400mg', why: 'Most people are deficient; improves sleep and 300+ enzymatic reactions.' },
      { id: 'omega3', name: 'Omega-3', dose: '2g', why: 'DHA is structural brain fat — every nootropic works better with adequate levels.' },
      { id: 'l-theanine', name: 'L-Theanine', dose: '200mg', why: 'Reduces baseline anxiety, enhances alpha waves, pairs with anything.' },
    ],
  },
  {
    id: 'focus',
    name: 'The Focus Stack',
    goal: 'Clean Cognitive Focus',
    description: 'The most popular cognitive enhancement stack in the world. Clean, smooth focus without the jitters.',
    difficulty: 'Beginner',
    monthlyEstimate: '~$45/month',
    icon: Target,
    supplements: [
      { id: 'caffeine', name: 'Caffeine', dose: '100mg', why: 'The world\'s most studied cognitive enhancer — increases alertness and processing speed.' },
      { id: 'l-theanine', name: 'L-Theanine', dose: '200mg', why: 'Smooths caffeine\'s edge, reduces jitters, extends the focus window.' },
      { id: 'alpha-gpc', name: 'Alpha-GPC', dose: '300mg', why: 'Raises brain acetylcholine — the focus and memory neurotransmitter.' },
      { id: 'lions-mane', name: "Lion's Mane", dose: '500mg', why: 'Stimulates NGF for long-term neuroplasticity alongside the acute stack.' },
    ],
  },
  {
    id: 'memory',
    name: 'The Memory & Learning Stack',
    goal: 'Memory & Learning',
    description: 'Optimized for students, researchers, and anyone doing serious learning.',
    difficulty: 'Intermediate',
    monthlyEstimate: '~$65/month',
    icon: BookOpen,
    supplements: [
      { id: 'bacopa', name: 'Bacopa Monnieri', dose: '300mg', why: '12+ RCTs show improvements in memory formation and recall. Requires 8–12 weeks.' },
      { id: 'lions-mane', name: "Lion's Mane", dose: '500mg', why: 'Stimulates NGF — essential for new neuron formation and synaptic plasticity.' },
      { id: 'alpha-gpc', name: 'Alpha-GPC', dose: '400mg', why: 'Acetylcholine precursor; amplifies encoding and consolidation.' },
      { id: 'phosphatidylserine', name: 'Phosphatidylserine', dose: '200mg', why: 'Key neuron membrane phospholipid; FDA-qualified claim for memory support.' },
    ],
  },
  {
    id: 'stress',
    name: 'The Stress & Resilience Stack',
    goal: 'Stress & Resilience',
    description: 'Built for high-pressure environments. Lowers cortisol, builds resilience.',
    difficulty: 'Beginner',
    monthlyEstimate: '~$50/month',
    icon: Heart,
    supplements: [
      { id: 'ashwagandha', name: 'Ashwagandha KSM-66', dose: '600mg', why: '22+ human trials; measurably reduces cortisol and supports sleep quality.' },
      { id: 'rhodiola', name: 'Rhodiola Rosea', dose: '300mg', why: 'Reduces mental fatigue and improves performance under stress within hours.' },
      { id: 'magnesium', name: 'Magnesium Glycinate', dose: '400mg', why: 'Deficiency amplifies the stress response; glycinate form supports GABA.' },
      { id: 'l-theanine', name: 'L-Theanine', dose: '200mg', why: 'Promotes calm alertness by modulating glutamate and boosting GABA.' },
    ],
  },
  {
    id: 'energy',
    name: 'The Energy Stack',
    goal: 'Sustainable Energy',
    description: 'Sustainable energy without the crash. No high-stim pre-workouts needed.',
    difficulty: 'Intermediate',
    monthlyEstimate: '~$55/month',
    icon: Zap,
    supplements: [
      { id: 'rhodiola', name: 'Rhodiola Rosea', dose: '300mg', why: 'Adaptogenic stimulant — reduces mental fatigue without adrenal burnout.' },
      { id: 'caffeine', name: 'Caffeine', dose: '100mg', why: 'Moderate dose for clean adenosine blockade without tolerance buildup.' },
      { id: 'l-theanine', name: 'L-Theanine', dose: '200mg', why: 'Smooths the caffeine curve and extends its effective window.' },
      { id: 'creatine', name: 'Creatine', dose: '5g', why: 'Replenishes ATP in muscle and neurons — the original energy supplement.' },
      { id: 'coq10', name: 'CoQ10', dose: '200mg', why: 'Mitochondrial cofactor; declines with age and statin use — restores cellular energy.' },
    ],
  },
  {
    id: 'longevity',
    name: 'The Longevity Stack',
    goal: 'Long-Term Brain Health',
    description: 'For those optimizing for long-term brain health and healthy aging.',
    difficulty: 'Advanced',
    monthlyEstimate: '~$110/month',
    icon: Brain,
    supplements: [
      { id: null, name: 'NMN', dose: '500mg', why: 'NAD+ precursor that declines with age — supports mitochondrial function and DNA repair.' },
      { id: 'lions-mane', name: "Lion's Mane", dose: '1000mg', why: 'NGF stimulation supports long-term neuroplasticity and neuroprotection.' },
      { id: 'phosphatidylserine', name: 'Phosphatidylserine', dose: '300mg', why: 'Neuron membrane integrity — FDA-qualified claim for reduced cognitive decline risk.' },
      { id: 'omega3', name: 'Omega-3', dose: '2g', why: 'DHA is the structural brain fat that supports every other supplement in this stack.' },
      { id: 'coq10', name: 'CoQ10 Ubiquinol', dose: '200mg', why: 'Ubiquinol form for superior absorption; mitochondrial antioxidant critical over 40.' },
    ],
  },
  {
    id: 'budget',
    name: 'The Budget Stack',
    goal: 'Max Value',
    description: 'Maximum cognitive benefit per dollar. Proven, cheap, effective.',
    difficulty: 'Beginner',
    monthlyEstimate: '~$28/month',
    icon: Target,
    supplements: [
      { id: 'creatine', name: 'Creatine', dose: '5g', why: 'Pennies per day; improves working memory, energy, and cognitive resilience.' },
      { id: 'caffeine', name: 'Caffeine', dose: '100mg', why: 'The cheapest effective nootropic on earth — 200mg tablets are ~$0.03 each.' },
      { id: 'l-theanine', name: 'L-Theanine', dose: '200mg', why: 'Inexpensive, well-tolerated, makes caffeine dramatically cleaner.' },
      { id: 'magnesium', name: 'Magnesium Glycinate', dose: '400mg', why: 'Corrects widespread deficiency for sleep, mood, and cognitive baseline.' },
    ],
  },
  {
    id: 'sleep',
    name: 'The Sleep & Recovery Stack',
    goal: 'Sleep & Recovery',
    description: 'Fix your sleep, fix your cognition. The most underrated performance stack.',
    difficulty: 'Beginner',
    monthlyEstimate: '~$40/month',
    icon: Moon,
    supplements: [
      { id: 'magnesium', name: 'Magnesium Glycinate', dose: '400mg', why: 'The single most impactful supplement for sleep quality. Take 30 min before bed.' },
      { id: 'ashwagandha', name: 'Ashwagandha', dose: '600mg', why: 'Reduces cortisol that keeps you awake; evening dosing improves sleep onset.' },
      { id: 'l-theanine', name: 'L-Theanine', dose: '400mg', why: 'Higher evening dose promotes relaxation and delta wave sleep.' },
      { id: 'melatonin', name: 'Melatonin', dose: '0.5mg', why: 'Low-dose (0.5mg) is as effective as 5mg without grogginess or dependence.' },
    ],
  },
];

const difficultyColor = {
  Beginner: 'bg-accent-100 text-accent-700',
  Intermediate: 'bg-warn-100 text-warn-700',
  Advanced: 'bg-danger-100 text-danger-700',
};

export function BestStacksPage() {
  const trackClick = (supplementId, vendor) => {
    fetch('/api/track/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplementId, vendor, page: 'best-stacks' }),
    }).catch(() => {});
  };

  const itemListItems = CURATED_STACKS.flatMap((stack) =>
    stack.supplements
      .filter((s) => s.id)
      .map((s) => ({
        name: s.name,
        url: `https://nootropicstacker.com/supplements/${s.id}`,
      }))
  );

  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Best Nootropic Stacks 2026: 8 Expert-Curated Combinations | NootropicStacker"
        customDescription="The 8 best nootropic stacks in 2026, curated by goal: focus, memory, energy, stress, sleep, longevity, and budget. Includes exact dosing, cost, and buy links."
      />
      <JsonLd
        data={buildItemListSchema({
          name: 'Best Nootropic Stacks 2026',
          items: itemListItems,
        })}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-ink-900 mb-3">Best Nootropic Stacks 2026</h1>
          <p className="text-ink-700 leading-relaxed mb-4">
            Individual supplements are powerful. Combined correctly, they're transformative. These 8 stacks are curated by goal — each one built around proven synergies, evidence-ranked ingredients, and real-world cost. Find your stack, build it yourself, or use the Stack Builder to customize further.
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-ink-500">
            <span>✓ 8 curated stacks</span>
            <span>·</span>
            <span>✓ Synergy-optimized</span>
            <span>·</span>
            <span>✓ Beginner to Advanced</span>
          </div>
        </div>

        <div className="space-y-4">
          {CURATED_STACKS.map((stack) => {
            const StackIcon = stack.icon;
            const stackIds = stack.supplements
              .map(s => s.id)
              .filter(Boolean)
              .join(',');

            return (
              <Card key={stack.id} className="border-ink-200 hover:shadow-1 transition-shadow">
                <CardContent className="pt-6">
                  {/* Stack header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary-100 flex items-center justify-center">
                      <StackIcon className="w-5 h-5 text-primary-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-xl font-semibold text-ink-900">{stack.name}</h2>
                        <Badge className={`text-xs font-medium ${difficultyColor[stack.difficulty]}`} variant="outline">
                          {stack.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-primary-800 mb-1">{stack.goal} · {stack.monthlyEstimate}</p>
                      <p className="text-ink-700 text-sm">{stack.description}</p>
                    </div>
                  </div>

                  {/* Supplements table */}
                  <div className="space-y-3 mb-5">
                    {stack.supplements.map((supp) => {
                      const links = supp.id ? AFFILIATE_LINKS[supp.id] : null;
                      return (
                        <div key={supp.name} className="flex flex-col sm:flex-row sm:items-start gap-2 p-3 bg-surface-card rounded-md">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-semibold text-sm text-ink-900">{supp.name}</span>
                              <span className="text-xs text-ink-500 bg-white border border-ink-200 px-2 py-0.5 rounded">{supp.dose}</span>
                            </div>
                            <p className="text-xs text-ink-500">{supp.why}</p>
                          </div>
                          {links && (
                            <div className="flex gap-2 flex-shrink-0">
                              {links.amazon && (
                                <a
                                  href={withAffiliateUtms(links.amazon, { campaign: `stack-${stack.id}` })}
                                  target="_blank"
                                  rel="noopener noreferrer sponsored"
                                  onClick={() => trackClick(supp.id, 'amazon')}
                                  className="flex items-center gap-1 text-xs bg-warn-1000 hover:bg-warn-700 text-white px-2.5 py-1 rounded font-medium transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" /> Amazon
                                </a>
                              )}
                              {links.iherb && (
                                <a
                                  href={links.iherb}
                                  target="_blank"
                                  rel="noopener noreferrer sponsored"
                                  onClick={() => trackClick(supp.id, 'iherb')}
                                  className="flex items-center gap-1 text-xs bg-accent-600 hover:bg-accent-700 text-white px-2.5 py-1 rounded font-medium transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" /> iHerb
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Build this stack CTA */}
                  {stackIds && (
                    <Link
                      to={`/?stack=${stackIds}`}
                      className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                    >
                      <Brain className="w-4 h-4" />
                      Build This Stack in the Stack Builder →
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 p-3 bg-primary-050 border border-primary-300 rounded-md text-primary-900 text-center">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-90" />
          <h2 className="text-xl font-semibold mb-2">Customize Any Stack</h2>
          <p className="text-primary-700 text-sm mb-4">Use the free Stack Builder to swap supplements, check interactions, adjust doses, and get a personalized Stack Score.</p>
          <Link to="/build" className="inline-block bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary-800 transition-colors">
            Open Stack Builder →
          </Link>
        </div>

        <p className="text-xs text-ink-400 text-center mt-6">* Affiliate links — we earn a small commission at no extra cost to you. We only link to quality-tested sources.</p>
      </div>
    </>
  );
}
