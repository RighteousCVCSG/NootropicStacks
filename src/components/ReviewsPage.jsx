import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, Brain, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { withAffiliateUtms } from '@/lib/affiliate.js';

const REVIEWS = [
  {
    id: 'mind-lab-pro',
    name: 'Mind Lab Pro',
    tagline: 'Universal Nootropic',
    rating: 4.6,
    price: '~$69/month',
    verdict: 'The cleanest pre-made nootropic on the market. Transparent dosing, no fillers, and a well-rounded formula that earns its price for most users.',
    pros: [
      'Fully transparent label — no proprietary blends',
      '11 ingredients covering 6 bio-pathways',
      "Lion's Mane + Bacopa + B vitamins in one capsule",
      'NutriCaps prebiotic capsules (better absorption)',
      'Good entry point for beginners',
    ],
    cons: [
      'Citicoline dosed at 250mg — optimal is closer to 500mg',
      'No stimulant, which some users find underwhelming',
      'Premium pricing for what is, ultimately, a convenience product',
    ],
    bestFor: 'Beginners wanting an all-in-one, professionals, daily use',
    badge: 'Editor\'s Pick',
    badgeColor: 'bg-primary-100 text-primary-800',
    links: {
      amazon: 'https://www.amazon.com/s?k=Mind+Lab+Pro+nootropic&tag=nootropicstk-20',
      iherb: 'https://www.iherb.com/search?kw=Mind+Lab+Pro',
    },
  },
  {
    id: 'qualia-mind',
    name: 'Qualia Mind',
    tagline: 'Premium / Comprehensive',
    rating: 4.4,
    price: '~$139/month',
    verdict: 'The most comprehensive formula available — 28 ingredients, transparent dosing, and serious research behind it. Worth the price only if you\'ve already optimized the basics.',
    pros: [
      '28 ingredients including PQQ, phosphatidylserine, and multiple adaptogens',
      'Fully disclosed doses — no blends',
      'Includes several ingredients Mind Lab Pro omits',
      'Well-regarded by the experienced biohacking community',
    ],
    cons: [
      'Very expensive at $139/month — hard to justify vs. a custom stack',
      '7 capsules per day is a significant pill burden',
      'Overkill for most users; harder to isolate what\'s working',
      'Some ingredient overlaps create redundancy without added benefit',
    ],
    bestFor: 'Experienced biohackers wanting maximum coverage',
    badge: 'Premium',
    badgeColor: 'bg-primary-100 text-primary-800',
    links: {
      amazon: 'https://www.amazon.com/s?k=Qualia+Mind+nootropic&tag=nootropicstk-20',
    },
  },
  {
    id: 'performance-lab-mind',
    name: 'Performance Lab Mind',
    tagline: 'Stimulant-Free Focus',
    rating: 4.2,
    price: '~$49/month',
    verdict: 'A lean, well-formulated stim-free option. Maritime Pine Bark extract is a genuinely unique inclusion. Best used as part of a broader stack rather than standalone.',
    pros: [
      'Maritime Pine Bark extract — uncommon and well-dosed',
      'Clean prebiotic capsules, no artificial fillers',
      'Stimulant-free makes it ideal for PM use or caffeine-sensitive users',
      'Good value for what it contains',
    ],
    cons: [
      'Only 4 ingredients — most users will need to stack it with other compounds',
      'Citicoline dosed at 250mg (same underdose issue as Mind Lab Pro)',
      'Standalone results are subtle for most people',
    ],
    bestFor: 'Stacking with a stimulant, afternoon/PM cognitive support',
    badge: 'Stim-Free',
    badgeColor: 'bg-accent-100 text-accent-700',
    links: {},
  },
  {
    id: 'thesis-nootropics',
    name: 'Thesis Nootropics',
    tagline: 'Personalized Formulas',
    rating: 4.1,
    price: '~$79/month',
    verdict: 'An interesting personalization model — the quiz and rotation system genuinely help users find what works for them. The premium pricing and some redundant ingredient choices hold it back.',
    pros: [
      '6 formula options (Clarity, Energy, Motivation, Logic, Creativity, Confidence)',
      'Personalization quiz helps match formula to goals',
      'Rotation approach discourages tolerance buildup',
      'Good customer support and optimization coaching',
    ],
    cons: [
      'Some formulas pair CDP-choline + Alpha-GPC together (redundant choline stacking)',
      'Quiz algorithm is opaque — unclear how rigorously it personalizes',
      'Expensive for ingredient quantities that could be sourced separately for less',
      'Effects vary significantly between individuals',
    ],
    bestFor: 'People who want a guided approach and are willing to pay for curation',
    badge: 'Personalized',
    badgeColor: 'bg-warn-100 text-warn-700',
    links: {},
  },
  {
    id: 'alpha-brain',
    name: 'Alpha Brain',
    tagline: "Onnit's Flagship",
    rating: 3.8,
    price: '~$35–$80/month',
    verdict: "Heavily marketed and widely available, but the proprietary blends make it impossible to verify whether you're getting therapeutic doses. The huperzine A inclusion is a real cycling concern for daily users.",
    pros: [
      'Bacopa + Alpha-GPC + Huperzine A is a reasonable combination in theory',
      'Widely available including Amazon Prime',
      'One of the most clinically studied pre-made nootropics (two Onnit-funded RCTs)',
      'Convenient and easy to find',
    ],
    cons: [
      'Proprietary blends: you cannot verify whether any ingredient is therapeutically dosed',
      'Huperzine A accumulates and should NOT be taken daily — requires cycling, which conflicts with a daily nootropic format',
      'Overpriced relative to what you can build yourself for the same outcome',
      'The clinical trials were small and company-funded',
    ],
    bestFor: 'Amazon Prime shoppers, people who prioritize convenience over optimization',
    badge: 'Use With Caution',
    badgeColor: 'bg-warn-100 text-warn-700',
    links: {
      amazon: 'https://www.amazon.com/s?k=Onnit+Alpha+Brain&tag=nootropicstk-20',
    },
  },
  {
    id: 'now-alcar',
    name: 'NOW Foods Acetyl-L-Carnitine',
    tagline: 'Budget Value Pick',
    rating: 4.5,
    price: '~$15/month',
    verdict: 'The clearest example of why custom stacking beats pre-formulated products for value. A single well-researched compound from a trusted manufacturer at a fraction of the cost.',
    pros: [
      'Exceptional value — one of the best cost-per-dose ratios in nootropics',
      'NOW Foods is one of the most rigorously tested supplement brands',
      'Well-researched: ALCAR is supported by 30+ human trials',
      'Versatile — adds to almost any stack',
    ],
    cons: [
      'Single compound only — no synergistic coverage',
      'Subtle effects on their own; most noticeable in those with deficiency or fatigue',
      'No "stack experience" — you\'re essentially sourcing one ingredient',
    ],
    bestFor: 'Budget-conscious users, custom stack builders, energy optimization',
    badge: 'Best Value',
    badgeColor: 'bg-accent-100 text-accent-700',
    links: {
      amazon: 'https://www.amazon.com/s?k=NOW+Foods+Acetyl+L-Carnitine&tag=nootropicstk-20',
      iherb: 'https://www.iherb.com/search?kw=NOW+acetyl+l-carnitine',
    },
  },
];

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-warn-500 text-warn-500" />
      ))}
      {hasHalf && (
        <div className="relative w-4 h-4">
          <Star className="absolute w-4 h-4 text-ink-300" />
          <div className="overflow-hidden w-2 absolute">
            <Star className="w-4 h-4 fill-warn-500 text-warn-500" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-ink-300" />
      ))}
      <span className="ml-1 text-sm font-semibold text-ink-700">{rating.toFixed(1)}</span>
      <span className="text-xs text-ink-400">/5</span>
    </div>
  );
}

export function ReviewsPage() {
  const trackClick = (productName, vendor) => {
    fetch('/api/track/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplement: productName, vendor, page: 'reviews' }),
    }).catch(() => {});
  };

  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Best Nootropic Supplements Reviewed 2026 — Mind Lab Pro, Alpha Brain & More | NootropicStacker"
        customDescription="Honest reviews of the best nootropic supplements in 2026. Mind Lab Pro, Alpha Brain, Qualia Mind compared on ingredients, dosing, and value."
      />

      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-ink-900 mb-3">
            Nootropic Brand Reviews 2026 — Honest Ratings
          </h1>
          <p className="text-ink-700 leading-relaxed mb-4">
            These reviews are based on ingredient analysis, dose transparency, value for money, and the published evidence behind each formula — not brand relationships or paid placement. We rate each product on what's actually in the bottle.
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-ink-500">
            <span>✓ 6 products reviewed</span>
            <span>·</span>
            <span>✓ Pros AND cons — no fluff</span>
            <span>·</span>
            <span>✓ Updated April 2026</span>
          </div>
        </div>

        {/* Rating System */}
        <div className="mb-4 p-5 bg-primary-050 border border-primary-100 rounded-md">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-semibold text-ink-900 mb-1">Our Rating Methodology</h2>
              <p className="text-sm text-ink-700 leading-relaxed">
                Ratings are scored across four criteria: <strong>ingredient quality</strong> (form and source), <strong>dose transparency</strong> (no proprietary blends preferred), <strong>evidence base</strong> (human trials over anecdotes), and <strong>value</strong> (cost per therapeutic dose). We are not affiliated with any brand reviewed on this page.
              </p>
            </div>
          </div>
        </div>

        {/* Product Cards */}
        <div className="space-y-3">
          {REVIEWS.map((product) => (
            <Card key={product.id} className="border-ink-200 hover:shadow-1 transition-shadow">
              <CardContent className="pt-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-xl font-semibold text-ink-900">{product.name}</h2>
                      <Badge className={`text-xs font-medium ${product.badgeColor}`} variant="outline">
                        {product.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-ink-500">{product.tagline}</p>
                  </div>
                  <div className="text-right">
                    <StarRating rating={product.rating} />
                    <p className="text-sm font-medium text-ink-700 mt-1">{product.price}</p>
                  </div>
                </div>

                {/* Verdict */}
                <p className="text-sm text-ink-700 leading-relaxed mb-4 italic border-l-2 border-primary-300 pl-3">
                  {product.verdict}
                </p>

                {/* Pros / Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-accent-700 uppercase tracking-wide mb-2">Pros</p>
                    <ul className="space-y-1.5">
                      {product.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                          <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-danger-500 uppercase tracking-wide mb-2">Cons</p>
                    <ul className="space-y-1.5">
                      {product.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                          <XCircle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Best For + Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-ink-200">
                  <p className="text-xs text-ink-500">
                    <span className="font-semibold text-ink-700">Best for:</span> {product.bestFor}
                  </p>
                  <div className="flex gap-2 flex-shrink-0">
                    {product.links.amazon && (
                      <a
                        href={withAffiliateUtms(product.links.amazon, { campaign: `reviews-${product.id}` })}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() => trackClick(product.name, 'amazon')}
                        className="flex items-center gap-1.5 text-xs bg-warn-700 hover:bg-warn-800 text-white px-3 py-1.5 rounded font-medium transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Amazon
                      </a>
                    )}
                    {product.links.iherb && (
                      <a
                        href={product.links.iherb}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() => trackClick(product.name, 'iherb')}
                        className="flex items-center gap-1.5 text-xs bg-accent-600 hover:bg-accent-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> iHerb
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Build Your Own Stack CTA */}
        <div className="mt-10 p-3 bg-primary-050 border border-primary-300 rounded-md text-primary-900 text-center">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-90" />
          <h2 className="text-xl font-semibold mb-2">Build Your Own Stack Instead</h2>
          <p className="text-primary-700 text-sm mb-4">
            A custom stack is almost always cheaper and more effective than a pre-formulated product. You control the doses, eliminate redundancy, and pay only for what you actually need.
          </p>
          <Link
            to="/build"
            className="inline-block bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-primary-800 transition-colors"
          >
            Open the Free Stack Builder →
          </Link>
        </div>

        {/* Pre-Made vs Custom Comparison */}
        <div className="mt-10 p-3 bg-white border border-ink-200 rounded-md">
          <h2 className="text-lg font-semibold text-ink-900 mb-1">Pre-Made Stacks vs. Custom Stacks</h2>
          <p className="text-sm text-ink-500 mb-5">An honest comparison — pre-made products have real advantages, but they come at a cost.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-semibold text-ink-900 mb-3">Pre-Made (like the products above)</p>
              <ul className="space-y-2 text-sm text-ink-700">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" /> One product, one order, one capsule routine</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" /> Good for beginners who aren't ready to research individual compounds</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" /> Formulated by someone who has already done the synergy thinking</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" /> You pay a 2–4x markup for that convenience</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" /> Impossible to adjust individual doses</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" /> You can't isolate what's working or causing issues</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900 mb-3">Custom Stack (what this site helps you build)</p>
              <ul className="space-y-2 text-sm text-ink-700">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" /> Full control over every dose and compound</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" /> Typically 40–60% cheaper for equivalent coverage</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" /> You can test, track, and optimize each variable</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" /> Takes more research upfront</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" /> More capsules to manage daily</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" /> Requires sourcing from multiple vendors</li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-ink-500 mt-5 leading-relaxed">
            <strong>Bottom line:</strong> Pre-made products make sense when you're starting out or value simplicity. Once you know what works for you, building a custom stack almost always wins on cost and precision. The Stack Builder above makes it easy — 195 compounds, real-time synergy analysis, and a Stack Score to guide your build.
          </p>
        </div>

        <p className="text-xs text-ink-400 text-center mt-6">
          * Affiliate links — we earn a small commission at no extra cost to you. Our ratings are not influenced by these relationships.
        </p>
      </div>
    </>
  );
}
