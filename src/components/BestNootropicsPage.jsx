import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Award, Zap, Brain, Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateUtms } from '@/lib/affiliate.js';
import { SEOOptimizer } from './SEOOptimizer.jsx';

const TOP_NOOTROPICS = [
  {
    rank: 1,
    id: 'lions-mane-mushroom',
    name: "Lion's Mane Mushroom",
    tagline: 'Best for Neuroplasticity & Long-Term Brain Health',
    why: "Lion's Mane is the only supplement proven to stimulate Nerve Growth Factor (NGF), supporting new neuron formation and myelin repair. Backed by human trials showing improved cognitive function and reduced anxiety.",
    bestFor: ['Memory', 'Neuroplasticity', 'Mood'],
    dose: '500–1000mg extract daily',
    timeToEffect: '2–4 weeks',
    rating: 9.4
  },
  {
    rank: 2,
    id: 'bacopa-monnieri',
    name: 'Bacopa Monnieri',
    tagline: 'Best for Memory and Learning',
    why: 'Bacopa has the most consistent human clinical evidence of any natural nootropic — 12+ RCTs show improvements in memory formation, recall speed, and anxiety. Requires patience (8–12 weeks) but delivers reliable results.',
    bestFor: ['Memory', 'Learning', 'Anxiety'],
    dose: '300mg standardized extract daily',
    timeToEffect: '8–12 weeks',
    rating: 9.2
  },
  {
    rank: 3,
    id: 'l-theanine',
    name: 'L-Theanine',
    tagline: 'Best for Calm Focus and Caffeine Synergy',
    why: 'The best-studied nootropic synergy in existence. L-Theanine smooths caffeine\'s edge, reduces anxiety, enhances alpha brain waves, and improves focus quality. A daily staple for most stacks.',
    bestFor: ['Focus', 'Calm', 'Caffeine Synergy'],
    dose: '100–200mg (1:2 ratio with caffeine)',
    timeToEffect: '30–60 min',
    rating: 9.1
  },
  {
    rank: 4,
    id: 'ashwagandha',
    name: 'Ashwagandha (KSM-66)',
    tagline: 'Best Adaptogen for Stress and Cortisol Control',
    why: 'KSM-66 ashwagandha has 22+ human clinical trials. It measurably reduces cortisol, improves sleep quality, and supports cognitive performance under stress. Essential for anyone in a high-pressure environment.',
    bestFor: ['Stress', 'Sleep', 'Resilience'],
    dose: '600mg KSM-66 daily',
    timeToEffect: '2–4 weeks',
    rating: 9.0
  },
  {
    rank: 5,
    id: 'alpha-gpc',
    name: 'Alpha-GPC',
    tagline: 'Best Choline Source for Cognition',
    why: 'The most bioavailable choline supplement. Raises brain acetylcholine levels, supports memory and focus, essential for anyone using racetams, and has its own cognitive benefits in clinical studies.',
    bestFor: ['Memory', 'Focus', 'Racetam Stacking'],
    dose: '300–600mg daily',
    timeToEffect: '1–2 hours (acute)',
    rating: 8.8
  },
  {
    rank: 6,
    id: 'rhodiola-rosea',
    name: 'Rhodiola Rosea',
    tagline: 'Best for Mental Fatigue and Acute Stress',
    why: 'Unlike calming adaptogens, Rhodiola is stimulating — it reduces mental fatigue and improves performance under stress within hours of dosing. Excellent for high-cognitive-load days and periods of burnout recovery.',
    bestFor: ['Energy', 'Stress', 'Mental Fatigue'],
    dose: '200–400mg standardized extract',
    timeToEffect: '30–60 min (acute)',
    rating: 8.7
  },
  {
    rank: 7,
    id: 'creatine',
    name: 'Creatine Monohydrate',
    tagline: 'Best Value Cognitive Supplement',
    why: 'Creatine isn\'t just for athletes. It replenishes ATP in neurons, improving working memory, processing speed, and cognitive resilience under sleep deprivation. Cheapest supplement per cognitive benefit unit.',
    bestFor: ['Working Memory', 'Energy', 'Value'],
    dose: '3–5g daily, no loading needed',
    timeToEffect: '1–2 weeks',
    rating: 8.6
  },
  {
    rank: 8,
    id: 'phosphatidylserine',
    name: 'Phosphatidylserine',
    tagline: 'Best for Cortisol and Memory (40+)',
    why: 'The only supplement with an FDA-qualified claim for reducing cognitive decline risk. PS is a key phospholipid in neuron membranes, declines with age, and has strong evidence for memory, focus, and cortisol reduction.',
    bestFor: ['Memory', 'Cortisol', 'Aging'],
    dose: '100–300mg daily',
    timeToEffect: '4–8 weeks',
    rating: 8.5
  },
  {
    rank: 9,
    id: 'magnesium-glycinate',
    name: 'Magnesium Glycinate',
    tagline: 'Best for Sleep, Anxiety, and Foundation Health',
    why: 'Most people are magnesium deficient. Magnesium Glycinate is the best-absorbed form — it improves sleep quality, reduces anxiety, and supports over 300 enzymatic reactions. Every serious stack should include it.',
    bestFor: ['Sleep', 'Anxiety', 'Foundation'],
    dose: '200–400mg elemental magnesium',
    timeToEffect: '1–2 weeks',
    rating: 8.5
  },
  {
    rank: 10,
    id: 'omega-3-dha',
    name: 'Omega-3 / DHA',
    tagline: 'Essential Structural Brain Nutrient',
    why: 'DHA makes up 60% of brain fat. Without adequate omega-3, every other nootropic works less effectively. The research on DHA for mood, cognition, and brain aging is the most robust in the supplement world.',
    bestFor: ['Brain Health', 'Mood', 'Foundation'],
    dose: '1–2g EPA+DHA, minimum 500mg DHA',
    timeToEffect: '4–8 weeks',
    rating: 8.4
  }
];

const getRankColor = (rank) => {
  if (rank === 1) return 'bg-warn-100 border-yellow-300 text-yellow-800';
  if (rank === 2) return 'bg-surface-sunk border-ink-300 text-ink-700';
  if (rank === 3) return 'bg-warn-100 border-warn-500 text-warn-700';
  return 'bg-primary-050 border-primary-300 text-primary-800';
};

export function BestNootropicsPage() {
  const trackClick = (supplementId, vendor) => {
    fetch('/api/track/click', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ supplementId, vendor, page: 'best-nootropics' })
    }).catch(() => {});
  };

  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Best Nootropics 2026: Top 10 Ranked by Evidence | NootropicStacker"
        customDescription="The 10 best nootropics in 2026, ranked by clinical evidence, safety, and real-world results. Includes dosing, timing, and where to buy quality-tested supplements."
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-3">Best Nootropics 2026</h1>
          <p className="text-ink-700 leading-relaxed mb-4">
            We evaluated 195 nootropic compounds across clinical evidence quality, safety profile, dose-response consistency, and real-world results. These 10 earn a place in any serious cognitive enhancement protocol — whether you're a beginner or an experienced biohacker.
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-ink-500">
            <span>✓ Evidence-ranked</span>
            <span>·</span>
            <span>✓ 195 supplements evaluated</span>
            <span>·</span>
            <span>✓ Lab-tested sources only</span>
          </div>
        </div>

        <div className="space-y-6">
          {TOP_NOOTROPICS.map((nootropic) => {
            const links = AFFILIATE_LINKS[nootropic.id];
            return (
              <Card key={nootropic.id} className="border-ink-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${getRankColor(nootropic.rank)}`}>
                      #{nootropic.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-ink-900">{nootropic.name}</h2>
                        <div className="flex items-center gap-1 text-warn-500 text-sm">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-medium text-ink-700">{nootropic.rating}/10</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-primary-800 mb-2">{nootropic.tagline}</p>
                      <p className="text-ink-700 text-sm mb-3">{nootropic.why}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-ink-500 mb-3">
                        <span><strong>Best for:</strong> {nootropic.bestFor.join(', ')}</span>
                        <span><strong>Dose:</strong> {nootropic.dose}</span>
                        <span><strong>Effect timeline:</strong> {nootropic.timeToEffect}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/supplements/${nootropic.id}`} className="text-xs text-primary-700 hover:underline">
                          View full profile →
                        </Link>
                        {links?.amazon && (
                          <a href={withAffiliateUtms(links.amazon, { campaign: `nootropic-${nootropic.id}` })} target="_blank" rel="noopener noreferrer sponsored"
                             onClick={() => trackClick(nootropic.id, 'amazon')}
                             className="flex items-center gap-1 text-xs bg-warn-1000 hover:bg-warn-700 text-white px-3 py-1.5 rounded font-medium transition-colors">
                            <ExternalLink className="w-3 h-3" /> Amazon
                          </a>
                        )}
                        {links?.iherb && (
                          <a href={links.iherb} target="_blank" rel="noopener noreferrer sponsored"
                             onClick={() => trackClick(nootropic.id, 'iherb')}
                             className="flex items-center gap-1 text-xs bg-accent-600 hover:bg-accent-700 text-white px-3 py-1.5 rounded font-medium transition-colors">
                            <ExternalLink className="w-3 h-3" /> iHerb
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 p-6 bg-primary-700 rounded-xl text-white text-center">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-90" />
          <h2 className="text-xl font-bold mb-2">Build Your Stack from These 10</h2>
          <p className="text-blue-100 text-sm mb-4">Use our free Stack Builder to combine the supplements that match your goals, check interactions, and get a personalized Stack Score.</p>
          <Link to="/" className="inline-block bg-white text-primary-800 font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-050 transition-colors">
            Open Stack Builder →
          </Link>
        </div>

        <p className="text-xs text-ink-400 text-center mt-6">* Affiliate links — we earn a small commission at no extra cost to you. We only link to quality-tested sources.</p>
      </div>
    </>
  );
}
