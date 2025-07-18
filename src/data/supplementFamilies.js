// Supplement family groupings with detailed guides
export const supplementFamilies = {
  racetams: {
    id: 'racetams',
    name: 'Racetams',
    description: 'A family of synthetic nootropics that share a common pyrrolidone nucleus structure.',
    methodOfAction: 'Modulate AMPA receptors, enhance acetylcholine function, and improve neuroplasticity',
    neurologicalImpact: 'Increase synaptic plasticity, enhance memory formation, and improve cognitive flexibility',
    directMechanism: 'AMPA receptor positive allosteric modulation, increased acetylcholine release',
    indirectMechanism: 'Enhanced BDNF expression, improved mitochondrial function, increased cerebral blood flow',
    summary: 'Racetams are the original family of nootropics, known for their cognitive enhancement properties with relatively low side effect profiles. They work primarily through modulation of glutamate receptors and cholinergic systems.',
    typicalUsage: 'Cognitive enhancement, memory improvement, learning acceleration, neuroprotection',
    cautions: 'May cause headaches if not combined with choline sources. Start with lower doses to assess tolerance.',
    interactions: {
      positive: ['Choline sources (Alpha-GPC, CDP-Choline)', 'B-vitamins', 'Omega-3 fatty acids'],
      negative: ['Alcohol (may reduce effectiveness)', 'Anticholinergic medications'],
      neutral: ['Most other supplements']
    },
    supplements: ['piracetam', 'oxiracetam', 'aniracetam', 'phenylpiracetam', 'pramiracetam', 'coluracetam', 'fasoracetam', 'nefiracetam'],
    safetyProfile: 'Generally well-tolerated with minimal side effects. Extensive research on piracetam shows good safety profile.',
    researchLevel: 'High - Extensive clinical research, particularly for piracetam',
    legalStatus: 'Unregulated in most countries, not FDA approved in US'
  },
  
  cholinergics: {
    id: 'cholinergics',
    name: 'Cholinergics',
    description: 'Compounds that enhance the cholinergic system, primarily through acetylcholine modulation.',
    methodOfAction: 'Increase acetylcholine levels through various mechanisms including precursor supplementation and enzyme inhibition',
    neurologicalImpact: 'Enhanced memory formation, improved attention, increased neuroplasticity',
    directMechanism: 'Acetylcholine precursor supplementation, acetylcholinesterase inhibition',
    indirectMechanism: 'Improved synaptic transmission, enhanced cognitive processing speed',
    summary: 'Cholinergics support the brain\'s primary learning and memory neurotransmitter system. Essential for optimal cognitive function and often used to support racetam effectiveness.',
    typicalUsage: 'Memory enhancement, learning support, attention improvement, racetam synergy',
    cautions: 'High doses may cause cholinergic side effects (nausea, headaches). Balance with anticholinergic activity.',
    interactions: {
      positive: ['Racetams', 'B-vitamins', 'Omega-3 fatty acids'],
      negative: ['Anticholinergic medications', 'Scopolamine'],
      neutral: ['Most adaptogens', 'Antioxidants']
    },
    supplements: ['alpha-gpc', 'citicoline', 'huperzine-a', 'centrophenoxine'],
    safetyProfile: 'Generally safe with proper dosing. Monitor for cholinergic excess symptoms.',
    researchLevel: 'High - Well-studied mechanisms and effects',
    legalStatus: 'Generally legal as dietary supplements'
  },

  adaptogens: {
    id: 'adaptogens',
    name: 'Adaptogens',
    description: 'Natural compounds that help the body adapt to stress and maintain homeostasis.',
    methodOfAction: 'Modulate the hypothalamic-pituitary-adrenal (HPA) axis and stress response systems',
    neurologicalImpact: 'Reduce cortisol levels, improve stress resilience, enhance mood stability',
    directMechanism: 'HPA axis modulation, cortisol regulation, neurotransmitter balance',
    indirectMechanism: 'Improved energy metabolism, enhanced immune function, better sleep quality',
    summary: 'Adaptogens are nature\'s stress-busters, helping maintain optimal performance under physical and mental stress. They provide sustained energy without the crash associated with stimulants.',
    typicalUsage: 'Stress management, energy enhancement, mood stabilization, immune support',
    cautions: 'May interact with certain medications. Some may cause overstimulation in sensitive individuals.',
    interactions: {
      positive: ['B-vitamins', 'Magnesium', 'Omega-3 fatty acids'],
      negative: ['Immunosuppressants (for some adaptogens)', 'Blood thinners (for some)'],
      neutral: ['Most nootropics', 'Vitamins and minerals']
    },
    supplements: ['ashwagandha', 'rhodiola', 'panax-ginseng', 'mucuna-pruriens', 'cordyceps', 'reishi', 'kanna'],
    safetyProfile: 'Generally very safe with traditional use history. Individual sensitivity varies.',
    researchLevel: 'Moderate to High - Growing body of clinical research',
    legalStatus: 'Legal as dietary supplements and traditional medicines'
  },

  stimulants: {
    id: 'stimulants',
    name: 'Stimulants',
    description: 'Compounds that increase alertness, energy, and cognitive performance through various mechanisms.',
    methodOfAction: 'Increase dopamine, norepinephrine, and other neurotransmitters; block adenosine receptors',
    neurologicalImpact: 'Enhanced alertness, improved focus, increased energy, elevated mood',
    directMechanism: 'Neurotransmitter reuptake inhibition, receptor antagonism, direct release',
    indirectMechanism: 'Increased metabolic rate, enhanced fat oxidation, improved physical performance',
    summary: 'Stimulants provide rapid cognitive and physical enhancement but require careful management to avoid tolerance, dependence, and side effects.',
    typicalUsage: 'Alertness, focus enhancement, energy boost, physical performance',
    cautions: 'Risk of tolerance, dependence, anxiety, sleep disruption. Avoid combining multiple stimulants.',
    interactions: {
      positive: ['L-Theanine (for caffeine)', 'B-vitamins', 'Magnesium'],
      negative: ['Other stimulants', 'MAOIs', 'Blood pressure medications'],
      neutral: ['Most adaptogens', 'Antioxidants']
    },
    supplements: ['caffeine', 'phenylethylamine', 'hordenine', 'modafinil', 'armodafinil'],
    safetyProfile: 'Moderate risk - potential for abuse, cardiovascular effects, sleep disruption',
    researchLevel: 'High - Extensively studied, well-understood mechanisms',
    legalStatus: 'Varies - caffeine legal, modafinil prescription-only, others unregulated'
  },

  vitamins: {
    id: 'vitamins',
    name: 'Vitamins',
    description: 'Essential micronutrients required for optimal brain function and overall health.',
    methodOfAction: 'Serve as cofactors in enzymatic reactions, support neurotransmitter synthesis',
    neurologicalImpact: 'Support cognitive function, mood regulation, energy metabolism',
    directMechanism: 'Enzymatic cofactor activity, antioxidant protection, membrane stability',
    indirectMechanism: 'Enhanced cellular energy production, improved neurotransmitter synthesis',
    summary: 'Vitamins form the foundation of optimal brain function. Deficiencies can significantly impact cognitive performance and mood.',
    typicalUsage: 'Foundational health, cognitive support, energy metabolism, mood regulation',
    cautions: 'Fat-soluble vitamins can accumulate to toxic levels. Water-soluble vitamins generally safe.',
    interactions: {
      positive: ['Minerals', 'Other vitamins', 'Healthy fats (for fat-soluble vitamins)'],
      negative: ['Certain medications may interfere with absorption'],
      neutral: ['Most supplements when properly dosed']
    },
    supplements: ['vitamin-d', 'vitamin-c', 'b-complex'],
    safetyProfile: 'Very safe when used appropriately. Monitor fat-soluble vitamin levels.',
    researchLevel: 'Very High - Extensively researched with established RDAs',
    legalStatus: 'Legal as dietary supplements worldwide'
  },

  minerals: {
    id: 'minerals',
    name: 'Minerals',
    description: 'Inorganic substances essential for brain function, neurotransmitter synthesis, and cellular processes.',
    methodOfAction: 'Serve as cofactors, maintain ionic balance, support enzymatic reactions',
    neurologicalImpact: 'Support neurotransmitter function, maintain membrane potential, enable synaptic transmission',
    directMechanism: 'Ion channel function, enzymatic cofactor activity, protein structure',
    indirectMechanism: 'Cellular energy production, antioxidant enzyme function, hormone synthesis',
    summary: 'Minerals are the building blocks of optimal brain function. Even mild deficiencies can impact cognitive performance and mood.',
    typicalUsage: 'Foundational health, cognitive support, mood stabilization, sleep quality',
    cautions: 'Mineral interactions can affect absorption. Balance is key to avoid deficiencies or excesses.',
    interactions: {
      positive: ['Vitamins', 'Amino acids', 'Healthy fats'],
      negative: ['Competing minerals (zinc/copper, calcium/magnesium)', 'Certain medications'],
      neutral: ['Most other supplements when properly timed']
    },
    supplements: ['magnesium', 'zinc'],
    safetyProfile: 'Safe when used appropriately. Monitor for mineral imbalances.',
    researchLevel: 'Very High - Well-established roles and requirements',
    legalStatus: 'Legal as dietary supplements worldwide'
  },

  antioxidants: {
    id: 'antioxidants',
    name: 'Antioxidants',
    description: 'Compounds that protect against oxidative stress and support cellular health.',
    methodOfAction: 'Neutralize free radicals, support endogenous antioxidant systems, reduce inflammation',
    neurologicalImpact: 'Protect neurons from oxidative damage, support healthy aging, maintain cognitive function',
    directMechanism: 'Free radical scavenging, metal chelation, enzyme induction',
    indirectMechanism: 'Reduced inflammation, improved mitochondrial function, enhanced cellular repair',
    summary: 'Antioxidants provide crucial protection against the oxidative stress that contributes to aging and cognitive decline.',
    typicalUsage: 'Neuroprotection, anti-aging, cognitive preservation, general health',
    cautions: 'High doses may interfere with beneficial oxidative signaling. Balance is important.',
    interactions: {
      positive: ['Other antioxidants', 'Omega-3 fatty acids', 'B-vitamins'],
      negative: ['May reduce effectiveness of certain chemotherapy drugs'],
      neutral: ['Most supplements']
    },
    supplements: ['quercetin', 'green-tea-extract', 'alpha-lipoic-acid', 'curcumin'],
    safetyProfile: 'Generally very safe. Some may interact with medications.',
    researchLevel: 'High - Extensive research on mechanisms and benefits',
    legalStatus: 'Legal as dietary supplements and food components'
  },

  longevity: {
    id: 'longevity',
    name: 'Longevity Compounds',
    description: 'Compounds that support healthy aging, cellular repair, and lifespan extension.',
    methodOfAction: 'Support cellular energy production, activate longevity pathways, enhance DNA repair',
    neurologicalImpact: 'Protect against age-related cognitive decline, support neuroplasticity, enhance cellular repair',
    directMechanism: 'NAD+ enhancement, sirtuin activation, mitochondrial biogenesis',
    indirectMechanism: 'Improved cellular energy, enhanced autophagy, reduced senescent cell burden',
    summary: 'Longevity compounds target the fundamental mechanisms of aging to promote healthspan and potentially lifespan.',
    typicalUsage: 'Healthy aging, cognitive preservation, energy enhancement, cellular protection',
    cautions: 'Limited long-term human data for some compounds. Start with established dosages.',
    interactions: {
      positive: ['Antioxidants', 'B-vitamins', 'Omega-3 fatty acids'],
      negative: ['May interact with certain medications'],
      neutral: ['Most other supplements']
    },
    supplements: ['nad-precursors', 'resveratrol', 'nmn', 'nicotinamide-riboside', 'fisetin', 'pqq'],
    safetyProfile: 'Generally safe but limited long-term data for newer compounds.',
    researchLevel: 'Moderate to High - Rapidly growing field with promising research',
    legalStatus: 'Generally legal as dietary supplements'
  },

  prescription: {
    id: 'prescription',
    name: 'Prescription Nootropics',
    description: 'Pharmaceutical compounds with cognitive enhancing properties that require medical supervision.',
    methodOfAction: 'Various mechanisms including dopamine reuptake inhibition, histamine receptor antagonism',
    neurologicalImpact: 'Powerful cognitive enhancement, wakefulness promotion, focus improvement',
    directMechanism: 'Neurotransmitter reuptake inhibition, receptor modulation, enzyme inhibition',
    indirectMechanism: 'Altered sleep-wake cycles, enhanced motivation, improved executive function',
    summary: 'Prescription nootropics offer powerful cognitive enhancement but require medical supervision due to potential side effects and interactions.',
    typicalUsage: 'Narcolepsy, ADHD, shift work sleep disorder, off-label cognitive enhancement',
    cautions: 'Require prescription and medical supervision. Significant drug interactions and side effects possible.',
    interactions: {
      positive: ['Depends on specific medication'],
      negative: ['Many medications - requires medical review'],
      neutral: ['Varies by compound']
    },
    supplements: ['modafinil', 'armodafinil'],
    safetyProfile: 'Moderate to high risk - requires medical supervision',
    researchLevel: 'Very High - Extensive clinical trials and post-market surveillance',
    legalStatus: 'Prescription required in most countries'
  }
};

// Family relationships and synergies
export const familySynergies = {
  'racetams-cholinergics': {
    description: 'Racetams work synergistically with cholinergic compounds',
    mechanism: 'Racetams increase acetylcholine utilization while cholinergics increase availability',
    benefits: ['Enhanced memory formation', 'Reduced headache risk', 'Improved cognitive effects'],
    recommendation: 'Combine any racetam with Alpha-GPC or CDP-Choline'
  },
  'stimulants-adaptogens': {
    description: 'Adaptogens can smooth out stimulant effects',
    mechanism: 'Adaptogens modulate stress response while stimulants increase arousal',
    benefits: ['Reduced jitters', 'Sustained energy', 'Better stress tolerance'],
    recommendation: 'Combine caffeine with L-Theanine or Rhodiola'
  },
  'antioxidants-longevity': {
    description: 'Antioxidants support longevity compound effectiveness',
    mechanism: 'Antioxidants protect against oxidative stress while longevity compounds enhance repair',
    benefits: ['Enhanced neuroprotection', 'Improved cellular health', 'Synergistic anti-aging effects'],
    recommendation: 'Combine NAD+ precursors with antioxidants like Alpha-Lipoic Acid'
  }
};

// Get supplements by family
export function getSupplementsByFamily(familyId, supplements) {
  const family = supplementFamilies[familyId];
  if (!family) return [];
  
  return supplements.filter(supplement => 
    family.supplements.includes(supplement.id)
  );
}

// Get family for a supplement
export function getFamilyForSupplement(supplementId) {
  for (const [familyId, family] of Object.entries(supplementFamilies)) {
    if (family.supplements.includes(supplementId)) {
      return { id: familyId, ...family };
    }
  }
  return null;
}

// Get recommended combinations within families
export function getFamilyRecommendations(familyId) {
  const recommendations = {
    racetams: [
      {
        name: 'Beginner Racetam Stack',
        supplements: ['piracetam', 'alpha-gpc'],
        description: 'Classic combination for cognitive enhancement'
      },
      {
        name: 'Advanced Memory Stack',
        supplements: ['oxiracetam', 'pramiracetam', 'citicoline'],
        description: 'Powerful memory and learning enhancement'
      }
    ],
    stimulants: [
      {
        name: 'Smooth Energy Stack',
        supplements: ['caffeine', 'l-theanine'],
        description: 'Alert focus without jitters'
      }
    ],
    adaptogens: [
      {
        name: 'Stress Resilience Stack',
        supplements: ['ashwagandha', 'rhodiola'],
        description: 'Comprehensive stress management'
      }
    ]
  };
  
  return recommendations[familyId] || [];
}


