import React from 'react';
import { Link } from 'react-router-dom';
import { EmailCaptureForm } from './EmailCaptureForm.jsx';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Pill, BookOpen, Award, ChevronRight } from 'lucide-react';

const EVIDENCE_TIER_LEGEND = [
  { tier: 'T1', label: 'Multiple human RCTs / meta-analysis', color: 'bg-accent-100 text-accent-700' },
  { tier: 'T2', label: 'Small RCTs / consistent observational', color: 'bg-primary-100 text-primary-800' },
  { tier: 'T3', label: 'Mechanistic / animal / single small study', color: 'bg-warn-100 text-warn-700' },
];

const STACKS = [
  {
    name: 'Morning Focus Stack',
    tiers: ['T1', 'T1', 'T2'],
    compounds: 'Caffeine + L-Theanine + Alpha-GPC',
    summary: 'The gold-standard wakefulness stack. Caffeine (100-200mg) blocks adenosine; L-theanine (200mg) smooths the edge with alpha-wave modulation. Alpha-GPC adds choline substrate for acetylcholine synthesis. Multiple RCTs confirm improved reaction time and sustained attention vs caffeine alone.',
  },
  {
    name: 'Memory Encoding Stack',
    tiers: ['T1', 'T2', 'T2'],
    compounds: 'Bacopa Monnieri + Phosphatidylserine + DHA',
    summary: 'Bacopa (300-600mg, 12+ weeks) improves memory recall ~9% in healthy adults via dendritic branching. PS supports cortisol regulation; DHA provides structural substrate for synaptic plasticity. Tier 1 for Bacopa recall; Tier 2 for PS cognitive effects in stressed populations.',
  },
  {
    name: 'Flow State Stack',
    tiers: ['T2', 'T2', 'T3'],
    compounds: 'L-Tyrosine + Theanine + Magnesium L-Threonate',
    summary: 'L-tyrosine (500-2000mg) replenishes dopamine precursors depleted under cognitive demand — effective in multitasking stress paradigms. Theanine synergizes. Magnesium threonate crosses BBB, supports NMDA receptor function. Tier 2 for tyrosine in stress; Tier 3 for MgT cognitive outcomes.',
  },
  {
    name: 'Neuroplasticity Builder',
    tiers: ['T1', 'T2', 'T3'],
    compounds: 'Lion\'s Mane + Omega-3s (high EPA) + PQQ',
    summary: "Lion's Mane (500-3000mg) stimulates NGF synthesis — Tian 2015 showed 8-12 week cognitive improvement. Omega-3s reduce neuroinflammation; PQQ supports mitochondrial biogenesis. Tier 1 for Lion's Mane NGF data; Tier 3 for PQQ cognitive endpoints in humans.",
  },
  {
    name: 'Adaptogenic Stress Shield',
    tiers: ['T1', 'T1', 'T2'],
    compounds: 'Ashwagandha + Rhodiola Rosea + L-Theanine',
    summary: 'Ashwagandha (300-600mg, standardized to 5% withanolides) reduces cortisol 15-30% in chronic stress populations. Rhodiola (200-400mg) improves fatigue resistance during acute stress. Theanine buffers the edge for situational calm. Two Tier-1 herbs with multiple human RCTs.',
  },
  {
    name: 'Creative Divergence Stack',
    tiers: ['T2', 'T2', 'T3'],
    compounds: 'Piracetam + Oxiracetam + Noopept',
    summary: 'Racetam class improves verbal fluency and divergent thinking in small RCTs. Piracetam (1200-4800mg) enhances hemispheric communication; oxiracetam has slightly stronger nootropic signal. Noopept shows promise in animal memory models. Tier 2 for racetams; Tier 3 for Noopept.',
  },
  {
    name: 'Executive Function Stack',
    tiers: ['T1', 'T1', 'T1'],
    compounds: 'Creatine + Omega-3s + B-Complex',
    summary: 'Creatine (5g/day) increases brain phosphocreatine — Rae 2003 showed 18% improvement in working memory on vegetarian diet. Omega-3 DHA/EPA supports prefrontal cortex function. B-vitamins are cofactors for neurotransmitter synthesis and methylation. All three have Tier 1 evidence.',
  },
  {
    name: 'Evening Recovery Stack',
    tiers: ['T2', 'T1', 'T2'],
    compounds: 'Magnesium Glycinate + Apigenin + Glycine',
    summary: 'Magnesium glycinate (200-400mg) supports GABA receptor function. Apigenin (chamomile extract, 50-100mg) binds benzodiazepine site — human RCT shows improved sleep quality. Glycine (3g) reduces core body temperature for sleep onset. Tier 1 for magnesium in sleep quality.',
  },
  {
    name: 'Neuroprotection Stack',
    tiers: ['T2', 'T2', 'T3'],
    compounds: 'NAC + ALCAR + CoQ10',
    summary: 'NAC (600-1200mg) replenishes glutathione, reduces oxidative stress in neurodegeneration models. ALCAR supports mitochondrial energy flux and acetylcholine synthesis. CoQ10 powers electron transport chain. Tier 2 for NAC antioxidant data; Tier 3 for combination synergy in healthy adults.',
  },
  {
    name: 'Minimalist Starter Stack',
    tiers: ['T1', 'T1', 'T2'],
    compounds: 'Caffeine + L-Theanine + Creatine',
    summary: 'The evidence-weighted entry point — three compounds with the highest per-unit effect size in healthy adults. Caffeine-theanine synergy for attention within 60 min. Creatine (5g/day) accumulates over 2-4 weeks for working memory benefit. Zero overlap interactions, maximum safety margin.',
  },
];

function EvidenceBadge({ tier }) {
  const legend = EVIDENCE_TIER_LEGEND.find(l => l.tier === tier);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${legend?.color || 'bg-surface-sunk text-ink-700'}`}>
      {tier}
    </span>
  );
}

export function LeadMagnetDownloadPage() {
  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="10 Evidence-Backed Nootropic Stacks — Free PDF Guide | NootropicStacker"
        customDescription="A curated guide to 10 nootropic stacks with PubMed citations, evidence tiers, and dosing protocols. Created by Vera Huang, UCSD Neuroscience. Free download."
      />

      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium mb-4">
            <Award className="w-3 h-3" />
            Free Guide · 10 Stacks · 12 Pages
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink-900 mb-3 leading-tight">
            10 Evidence-Backed Nootropic Stacks
          </h1>
          <p className="text-lg text-ink-700 mb-4 max-w-2xl mx-auto">
            A curated guide with PubMed citations, dosing protocols, and honest effect-size reporting for each stack.
          </p>

          {/* Author badge */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-semibold text-sm">
              VH
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-ink-900">Vera Huang</p>
              <p className="text-xs text-ink-500">MSc Neuroscience, UCSD · Former nootropic researcher</p>
            </div>
          </div>

          {/* Evidence tier legend */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {EVIDENCE_TIER_LEGEND.map(({ tier, label, color }) => (
              <div key={tier} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs ${color}`}>
                <span className="font-semibold">{tier}</span>
                <span className="text-ink-700">—</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Email capture gate */}
        <div className="mb-10">
          <EmailCaptureForm
            source="lead_magnet"
            variant="lead_magnet"
            leadMagnet="10-stacks-v1"
          />
        </div>

        {/* Why this guide exists */}
        <div className="bg-white rounded-md border p-3 mb-4">
          <h2 className="text-lg font-semibold text-ink-900 mb-3">Why This Guide Exists</h2>
          <div className="space-y-3 text-sm text-ink-700 leading-relaxed">
            <p>
              Most nootropic content online falls into two buckets: affiliate-optimized roundups that cherry-pick
              studies, or scientific papers too dense to apply. This guide aims for a third path — evidence-based
              enough that you can check the citations yourself, practical enough that you could build the stack
              today with readily available supplements.
            </p>
            <p>
              Each stack includes the specific dose range tested in the cited studies, the evidence tier for each
              compound in that context, and — most importantly — the actual effect size so you can decide if the
              benefit is worth the cost and commitment.
            </p>
            <p className="text-xs text-ink-400">
              Nothing in this guide constitutes medical advice. Always consult a healthcare professional before
              starting a new supplement regimen. Evidence tiers reflect the strength of the literature, not safety
              or efficacy guarantees.
            </p>
          </div>
        </div>

        {/* Stack previews */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-ink-900 mb-3">The 10 Stacks</h2>
          <div className="grid gap-4">
            {STACKS.map((stack, i) => (
              <div key={i} className="bg-white rounded-md border p-5 hover:border-primary-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-ink-400">Stack {i + 1}</span>
                      <h3 className="font-semibold text-ink-900">{stack.name}</h3>
                    </div>
                    <p className="text-xs text-ink-500 font-mono">{stack.compounds}</p>
                  </div>
                  <div className="flex gap-1">
                    {stack.tiers.map((tier, j) => (
                      <EvidenceBadge key={j} tier={tier} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-ink-700 leading-relaxed">{stack.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to stack builder */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md border border-blue-100 p-3 text-center mb-4">
          <h2 className="text-lg font-semibold text-ink-900 mb-2">Build Your Own Stack</h2>
          <p className="text-sm text-ink-700 mb-4">
            Use the free stack builder to combine any of 195 supplements, check interactions, and optimize your Stack Score.
          </p>
          <Link to="/build">
            <Button size="sm" className="gap-2">
              <Pill className="w-4 h-4" />
              Open Stack Builder
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* FAQ */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'How do I know which stack is right for me?',
                a: 'Start with the Minimalist Starter Stack — it has the highest per-compound evidence tier and the widest safety margin. From there, add stacks based on your primary goal: focus, memory, energy, or recovery.',
              },
              {
                q: 'Can I combine stacks?',
                a: 'Yes, but check for overlapping compounds. For example, many stacks include L-Theanine — total should stay within 400-600mg/day. Use the Stack Builder on the main site to check interaction warnings automatically.',
              },
              {
                q: 'Where do the citations come from?',
                a: 'Every citation links directly to PubMed (pubmed.ncbi.nlm.nih.gov). We do not cite other supplement blogs or vendor pages. If a claim in this guide doesn\'t have a PubMed link attached, file an issue and we\'ll review within 48 hours.',
              },
              {
                q: 'Is this medical advice?',
                a: 'No. This is a curated summary of published research for educational purposes. Supplement effects vary by individual. Always consult a qualified healthcare provider before starting any new supplement.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-md border p-4 [&[open]]:border-primary-300">
                <summary className="text-sm font-medium text-ink-900 cursor-pointer flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-ink-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-sm text-ink-700 mt-2 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-ink-400 pb-8">
          <p className="mb-1">Guide updated April 29, 2026 · Next review July 29, 2026</p>
          <p>© 2026 NootropicStacker · Affiliate Disclosure: We participate in the Amazon Services LLC Associates Program.</p>
        </div>
      </div>
    </>
  );
}
