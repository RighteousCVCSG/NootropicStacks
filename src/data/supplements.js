// Comprehensive supplement database for biohackers
export const supplements = [
  {
    id: 'coq10',
    name: 'Coenzyme Q10 (CoQ10)',
    category: 'energy',
    description: 'Essential for cellular energy production and acts as a powerful antioxidant. Supports heart, kidney, and lung function.',
    benefits: ['Cellular energy production', 'Heart health', 'Antioxidant protection', 'Athletic performance'],
    dosage: {
      min: 100,
      max: 300,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 7,
      mood: 2,
      balance: 3,
      creativity: 1,
      socialness: 1,
      learning: 2,
      study: 2
    },
    interactions: ['warfarin'],
    warnings: ['May reduce effectiveness of blood thinners'],
    image: '/supplements/coq10.jpg'
  },
  {
    id: 'nad-precursors',
    name: 'NAD+ Precursors (NMN/NR)',
    category: 'longevity',
    description: 'Supports cellular energy production, DNA repair, and healthy aging by boosting NAD+ levels.',
    benefits: ['DNA repair', 'Cellular energy', 'Longevity', 'Circadian rhythm'],
    dosage: {
      min: 250,
      max: 1000,
      unit: 'mg',
      timing: 'Morning, empty stomach'
    },
    effects: {
      energy: 6,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 1,
      learning: 3,
      study: 3
    },
    interactions: [],
    warnings: ['Start with lower doses to assess tolerance'],
    image: '/supplements/nad.jpg'
  },
  {
    id: 'creatine',
    name: 'Creatine Monohydrate',
    category: 'performance',
    description: 'Enhances muscle strength, power, and cognitive function. One of the most researched supplements.',
    benefits: ['Muscle strength', 'Power output', 'Cognitive function', 'Short-term memory'],
    dosage: {
      min: 3,
      max: 5,
      unit: 'g',
      timing: 'Post-workout or anytime'
    },
    effects: {
      energy: 5,
      mood: 2,
      balance: 2,
      creativity: 1,
      socialness: 2,
      learning: 4,
      study: 4
    },
    interactions: [],
    warnings: ['Increase water intake when supplementing'],
    image: '/supplements/creatine.jpg'
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    category: 'adaptogen',
    description: 'Powerful adaptogen that helps manage stress, reduces cortisol, and promotes calm focus.',
    benefits: ['Stress reduction', 'Cortisol regulation', 'Anxiety relief', 'Sleep quality'],
    dosage: {
      min: 300,
      max: 600,
      unit: 'mg',
      timing: 'Evening or with meals'
    },
    effects: {
      energy: 2,
      mood: 6,
      balance: 8,
      creativity: 3,
      socialness: 4,
      learning: 3,
      study: 4
    },
    interactions: ['sedatives', 'immunosuppressants'],
    warnings: ['May cause drowsiness', 'Avoid with autoimmune conditions'],
    image: '/supplements/ashwagandha.jpg'
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    category: 'stimulant',
    description: 'Natural stimulant that enhances alertness, focus, and physical performance.',
    benefits: ['Alertness', 'Focus', 'Physical performance', 'Fat burning'],
    dosage: {
      min: 50,
      max: 400,
      unit: 'mg',
      timing: 'Morning, avoid after 2 PM'
    },
    effects: {
      energy: 9,
      mood: 4,
      balance: -2,
      creativity: 3,
      socialness: 3,
      learning: 5,
      study: 6
    },
    interactions: ['other-stimulants', 'blood-pressure-meds'],
    warnings: ['Can cause anxiety and sleep disruption', 'Tolerance builds quickly'],
    image: '/supplements/caffeine.jpg'
  },
  {
    id: 'l-theanine',
    name: 'L-Theanine',
    category: 'nootropic',
    description: 'Amino acid that promotes calm focus and reduces anxiety without sedation. Synergistic with caffeine.',
    benefits: ['Calm focus', 'Anxiety reduction', 'Alpha brain waves', 'Stress relief'],
    dosage: {
      min: 100,
      max: 400,
      unit: 'mg',
      timing: 'With or without caffeine'
    },
    effects: {
      energy: 1,
      mood: 5,
      balance: 7,
      creativity: 4,
      socialness: 3,
      learning: 4,
      study: 5
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/l-theanine.jpg'
  },
  {
    id: 'lions-mane',
    name: "Lion's Mane Mushroom",
    category: 'nootropic',
    description: 'Medicinal mushroom that supports nerve growth factor and cognitive function.',
    benefits: ['Nerve growth', 'Memory enhancement', 'Neuroprotection', 'Focus'],
    dosage: {
      min: 500,
      max: 3000,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 2,
      mood: 3,
      balance: 3,
      creativity: 5,
      socialness: 2,
      learning: 6,
      study: 6
    },
    interactions: [],
    warnings: ['May cause skin rash in sensitive individuals'],
    image: '/supplements/lions-mane.jpg'
  },
  {
    id: 'rhodiola',
    name: 'Rhodiola Rosea',
    category: 'adaptogen',
    description: 'Arctic adaptogen that enhances mental performance and reduces fatigue under stress.',
    benefits: ['Mental fatigue reduction', 'Stress adaptation', 'Mood enhancement', 'Physical endurance'],
    dosage: {
      min: 200,
      max: 600,
      unit: 'mg',
      timing: 'Morning, empty stomach'
    },
    effects: {
      energy: 6,
      mood: 6,
      balance: 6,
      creativity: 4,
      socialness: 4,
      learning: 5,
      study: 5
    },
    interactions: ['antidepressants'],
    warnings: ['May cause jitteriness in sensitive individuals'],
    image: '/supplements/rhodiola.jpg'
  },
  {
    id: 'bacopa',
    name: 'Bacopa Monnieri',
    category: 'nootropic',
    description: 'Traditional Ayurvedic herb that enhances memory formation and reduces anxiety.',
    benefits: ['Memory enhancement', 'Learning capacity', 'Anxiety reduction', 'Neuroprotection'],
    dosage: {
      min: 300,
      max: 600,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 1,
      mood: 4,
      balance: 5,
      creativity: 3,
      socialness: 2,
      learning: 7,
      study: 8
    },
    interactions: [],
    warnings: ['May cause initial digestive upset'],
    image: '/supplements/bacopa.jpg'
  },
  {
    id: 'omega3',
    name: 'Omega-3 Fatty Acids',
    category: 'essential',
    description: 'Essential fats crucial for brain health, heart health, and inflammation reduction.',
    benefits: ['Brain health', 'Heart health', 'Anti-inflammatory', 'Mood support'],
    dosage: {
      min: 1000,
      max: 4000,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 2,
      mood: 5,
      balance: 6,
      creativity: 3,
      socialness: 3,
      learning: 4,
      study: 4
    },
    interactions: ['blood-thinners'],
    warnings: ['May increase bleeding risk at high doses'],
    image: '/supplements/omega3.jpg'
  },
  {
    id: 'magnesium',
    name: 'Magnesium Glycinate',
    category: 'mineral',
    description: 'Essential mineral involved in 300+ enzymatic reactions. Supports sleep, muscle function, and stress.',
    benefits: ['Sleep quality', 'Muscle relaxation', 'Stress reduction', 'Bone health'],
    dosage: {
      min: 200,
      max: 400,
      unit: 'mg',
      timing: 'Evening'
    },
    effects: {
      energy: -1,
      mood: 4,
      balance: 7,
      creativity: 2,
      socialness: 2,
      learning: 2,
      study: 3
    },
    interactions: ['antibiotics'],
    warnings: ['May cause digestive upset at high doses'],
    image: '/supplements/magnesium.jpg'
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D3',
    category: 'vitamin',
    description: 'Essential vitamin for immune function, bone health, and mood regulation. Crucial for overall well-being.',
    benefits: ['Immune support', 'Bone health', 'Mood regulation', 'Hormone balance', 'Overall well-being'],
    dosage: {
      min: 1000,
      max: 5000,
      unit: 'IU',
      timing: 'With fat-containing meal'
    },
    effects: {
      energy: 3,
      mood: 5,
      balance: 4,
      creativity: 2,
      socialness: 3,
      learning: 2,
      study: 2
    },
    interactions: [],
    warnings: ['Monitor blood levels to avoid toxicity', 'Consult doctor for optimal dosage'],
    image: '/supplements/vitamin-d.jpg'
  },
  {
    id: 'curcumin',
    name: 'Curcumin',
    category: 'anti-inflammatory',
    description: 'Active compound in turmeric with powerful anti-inflammatory and antioxidant properties.',
    benefits: ['Anti-inflammatory', 'Antioxidant', 'Joint health', 'Brain protection'],
    dosage: {
      min: 500,
      max: 1500,
      unit: 'mg',
      timing: 'With meals and black pepper'
    },
    effects: {
      energy: 2,
      mood: 4,
      balance: 5,
      creativity: 3,
      socialness: 2,
      learning: 3,
      study: 3
    },
    interactions: ['blood-thinners'],
    warnings: ['May increase bleeding risk'],
    image: '/supplements/curcumin.jpg'
  },
  {
    id: 'resveratrol',
    name: 'Resveratrol',
    category: 'longevity',
    description: 'Polyphenol compound with anti-aging properties and cardiovascular benefits.',
    benefits: ['Anti-aging', 'Cardiovascular health', 'Antioxidant', 'Longevity'],
    dosage: {
      min: 100,
      max: 500,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 2,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 1,
      learning: 2,
      study: 2
    },
    interactions: ['blood-thinners'],
    warnings: ['May interact with blood thinning medications'],
    image: '/supplements/resveratrol.jpg'
  },
  {
    id: 'melatonin',
    name: 'Melatonin',
    category: 'sleep',
    description: 'Natural sleep hormone that regulates circadian rhythm and promotes restful sleep.',
    benefits: ['Sleep quality', 'Circadian rhythm', 'Antioxidant', 'Immune support'],
    dosage: {
      min: 0.5,
      max: 10,
      unit: 'mg',
      timing: '30-60 minutes before bed'
    },
    effects: {
      energy: -3,
      mood: 3,
      balance: 6,
      creativity: 1,
      socialness: -2,
      learning: 1,
      study: 1
    },
    interactions: ['sedatives', 'blood-pressure-meds'],
    warnings: ['May cause morning grogginess', 'Start with lowest dose'],
    image: '/supplements/melatonin.jpg'
  },
  {
    id: 'alpha-gpc',
    name: 'Alpha-GPC',
    category: 'nootropic',
    description: 'Choline compound that supports acetylcholine production and cognitive function.',
    benefits: ['Memory enhancement', 'Focus', 'Learning', 'Neuroprotection'],
    dosage: {
      min: 300,
      max: 600,
      unit: 'mg',
      timing: 'Morning or pre-workout'
    },
    effects: {
      energy: 3,
      mood: 2,
      balance: 2,
      creativity: 4,
      socialness: 3,
      learning: 6,
      study: 7
    },
    interactions: [],
    warnings: ['May cause headaches in some individuals'],
    image: '/supplements/alpha-gpc.jpg'
  },
  {
    id: 'ginkgo',
    name: 'Ginkgo Biloba',
    category: 'nootropic',
    description: 'Traditional herb that supports circulation and cognitive function.',
    benefits: ['Circulation', 'Memory', 'Focus', 'Antioxidant'],
    dosage: {
      min: 120,
      max: 240,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 3,
      mood: 3,
      balance: 3,
      creativity: 4,
      socialness: 2,
      learning: 5,
      study: 5
    },
    interactions: ['blood-thinners'],
    warnings: ['May increase bleeding risk'],
    image: '/supplements/ginkgo.jpg'
  },
  {
    id: 'panax-ginseng',
    name: 'Panax Ginseng',
    category: 'adaptogen',
    description: 'Traditional adaptogen that enhances energy, cognitive function, and stress resistance.',
    benefits: ['Energy enhancement', 'Cognitive function', 'Stress resistance', 'Immune support'],
    dosage: {
      min: 200,
      max: 400,
      unit: 'mg',
      timing: 'Morning'
    },
    effects: {
      energy: 6,
      mood: 4,
      balance: 4,
      creativity: 3,
      socialness: 4,
      learning: 4,
      study: 4
    },
    interactions: ['stimulants', 'blood-thinners'],
    warnings: ['May cause overstimulation when combined with caffeine'],
    image: '/supplements/panax-ginseng.jpg'
  },
  {
    id: 'quercetin',
    name: 'Quercetin',
    category: 'antioxidant',
    description: 'Flavonoid with senolytic properties that supports healthy aging and immune function.',
    benefits: ['Senolytic effects', 'Immune support', 'Anti-inflammatory', 'Antioxidant'],
    dosage: {
      min: 500,
      max: 1000,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 2,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 2,
      learning: 2,
      study: 2
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/quercetin.jpg'
  },
  {
    id: 'zinc',
    name: 'Zinc',
    category: 'mineral',
    description: 'Essential mineral for immune function, wound healing, and cognitive health.',
    benefits: ['Immune support', 'Wound healing', 'Cognitive health', 'Hormone balance'],
    dosage: {
      min: 8,
      max: 40,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 2,
      mood: 3,
      balance: 3,
      creativity: 2,
      socialness: 2,
      learning: 3,
      study: 3
    },
    interactions: ['copper'],
    warnings: ['May interfere with copper absorption'],
    image: '/supplements/zinc.jpg'
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C',
    category: 'vitamin',
    description: 'Essential antioxidant vitamin that supports immune function and collagen synthesis.',
    benefits: ['Immune support', 'Antioxidant', 'Collagen synthesis', 'Iron absorption'],
    dosage: {
      min: 500,
      max: 2000,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 3,
      mood: 3,
      balance: 3,
      creativity: 2,
      socialness: 2,
      learning: 2,
      study: 2
    },
    interactions: [],
    warnings: ['May cause digestive upset at high doses'],
    image: '/supplements/vitamin-c.jpg'
  },
  {
    id: 'b-complex',
    name: 'B-Complex Vitamins',
    category: 'vitamin',
    description: 'Essential B vitamins for energy metabolism, nervous system function, and cognitive health.',
    benefits: ['Energy metabolism', 'Nervous system', 'Cognitive function', 'Mood support'],
    dosage: {
      min: 1,
      max: 1,
      unit: 'tablet',
      timing: 'Morning with meals'
    },
    effects: {
      energy: 5,
      mood: 4,
      balance: 3,
      creativity: 3,
      socialness: 3,
      learning: 4,
      study: 4
    },
    interactions: [],
    warnings: ['May cause bright yellow urine (harmless)'],
    image: '/supplements/b-complex.jpg'
  },
  {
    id: 'probiotics',
    name: 'Probiotics',
    category: 'gut-health',
    description: 'Beneficial bacteria that support gut health, immune function, and mood.',
    benefits: ['Gut health', 'Immune support', 'Mood regulation', 'Digestion'],
    dosage: {
      min: 10,
      max: 100,
      unit: 'billion CFU',
      timing: 'With or after meals'
    },
    effects: {
      energy: 2,
      mood: 5,
      balance: 6,
      creativity: 2,
      socialness: 3,
      learning: 3,
      study: 3
    },
    interactions: ['antibiotics'],
    warnings: ['Take 2 hours apart from antibiotics'],
    image: '/supplements/probiotics.jpg'
  },
  {
    id: 'dhea',
    name: 'DHEA',
    category: 'hormone',
    description: 'Hormone precursor that supports healthy aging, mood, and energy levels.',
    benefits: ['Hormone balance', 'Anti-aging', 'Mood support', 'Energy'],
    dosage: {
      min: 25,
      max: 50,
      unit: 'mg',
      timing: 'Morning'
    },
    effects: {
      energy: 4,
      mood: 5,
      balance: 3,
      creativity: 3,
      socialness: 4,
      learning: 2,
      study: 2
    },
    interactions: ['hormone-medications'],
    warnings: ['Consult doctor before use', 'May affect hormone levels'],
    image: '/supplements/dhea.jpg'
  },
  {
    id: 'pqq',
    name: 'PQQ (Pyrroloquinoline Quinone)',
    category: 'energy',
    description: 'Mitochondrial biogenesis factor that supports cellular energy and neuroprotection.',
    benefits: ['Mitochondrial health', 'Cellular energy', 'Neuroprotection', 'Cognitive function'],
    dosage: {
      min: 10,
      max: 40,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 6,
      mood: 3,
      balance: 3,
      creativity: 4,
      socialness: 2,
      learning: 4,
      study: 4
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/pqq.jpg'
  },
  {
    id: 'collagen',
    name: 'Collagen Peptides',
    category: 'protein',
    description: 'Structural protein that supports skin, joint, and bone health.',
    benefits: ['Skin health', 'Joint support', 'Bone health', 'Hair and nails'],
    dosage: {
      min: 10,
      max: 20,
      unit: 'g',
      timing: 'Anytime'
    },
    effects: {
      energy: 1,
      mood: 2,
      balance: 2,
      creativity: 1,
      socialness: 2,
      learning: 1,
      study: 1
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/collagen.jpg'
  },
  {
    id: 'beta-glucan',
    name: 'Beta-Glucan',
    category: 'immune',
    description: 'Immune-modulating fiber that supports immune system function and overall health.',
    benefits: ['Immune support', 'Cholesterol management', 'Blood sugar control', 'Gut health'],
    dosage: {
      min: 250,
      max: 500,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 2,
      mood: 3,
      balance: 4,
      creativity: 1,
      socialness: 2,
      learning: 2,
      study: 2
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/beta-glucan.jpg'
  },
  {
    id: 'tyrosine',
    name: 'L-Tyrosine',
    category: 'nootropic',
    description: 'Amino acid precursor to dopamine that supports focus and stress resilience.',
    benefits: ['Focus enhancement', 'Stress resilience', 'Mood support', 'Cognitive performance'],
    dosage: {
      min: 500,
      max: 2000,
      unit: 'mg',
      timing: 'Empty stomach, morning'
    },
    effects: {
      energy: 4,
      mood: 5,
      balance: 3,
      creativity: 5,
      socialness: 4,
      learning: 5,
      study: 6
    },
    interactions: ['thyroid-medications'],
    warnings: ['May interact with thyroid medications'],
    image: '/supplements/tyrosine.jpg'
  },
  {
    id: 'citicoline',
    name: 'Citicoline (CDP-Choline)',
    category: 'nootropic',
    description: 'Choline compound that supports brain energy metabolism and cognitive function.',
    benefits: ['Brain energy', 'Memory enhancement', 'Focus', 'Neuroprotection'],
    dosage: {
      min: 250,
      max: 500,
      unit: 'mg',
      timing: 'Morning'
    },
    effects: {
      energy: 4,
      mood: 3,
      balance: 3,
      creativity: 4,
      socialness: 3,
      learning: 6,
      study: 7
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/citicoline.jpg'
  },
  {
    id: 'phosphatidylserine',
    name: 'Phosphatidylserine',
    category: 'nootropic',
    description: 'Phospholipid that supports brain cell membrane health and cognitive function.',
    benefits: ['Memory support', 'Cognitive function', 'Stress reduction', 'Sleep quality'],
    dosage: {
      min: 100,
      max: 300,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 2,
      mood: 4,
      balance: 5,
      creativity: 3,
      socialness: 3,
      learning: 5,
      study: 5
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/phosphatidylserine.jpg'
  },
  {
    id: 'mucuna-pruriens',
    name: 'Mucuna Pruriens',
    category: 'adaptogen',
    description: 'Natural source of L-DOPA that supports dopamine production and mood.',
    benefits: ['Dopamine support', 'Mood enhancement', 'Motivation', 'Stress resilience'],
    dosage: {
      min: 300,
      max: 1000,
      unit: 'mg',
      timing: 'Empty stomach'
    },
    effects: {
      energy: 5,
      mood: 7,
      balance: 4,
      creativity: 6,
      socialness: 6,
      learning: 4,
      study: 4
    },
    interactions: ['antidepressants'],
    warnings: ['May interact with psychiatric medications'],
    image: '/supplements/mucuna-pruriens.jpg'
  },
  {
    id: 'cordyceps',
    name: 'Cordyceps Mushroom',
    category: 'adaptogen',
    description: 'Medicinal mushroom that supports energy, endurance, and respiratory function.',
    benefits: ['Energy enhancement', 'Endurance', 'Respiratory health', 'Immune support'],
    dosage: {
      min: 1000,
      max: 3000,
      unit: 'mg',
      timing: 'Morning or pre-workout'
    },
    effects: {
      energy: 6,
      mood: 3,
      balance: 4,
      creativity: 3,
      socialness: 3,
      learning: 3,
      study: 3
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/cordyceps.jpg'
  },
  {
    id: 'reishi',
    name: 'Reishi Mushroom',
    category: 'adaptogen',
    description: 'Calming medicinal mushroom that supports stress reduction and immune function.',
    benefits: ['Stress reduction', 'Immune support', 'Sleep quality', 'Liver health'],
    dosage: {
      min: 1000,
      max: 3000,
      unit: 'mg',
      timing: 'Evening'
    },
    effects: {
      energy: -1,
      mood: 5,
      balance: 7,
      creativity: 2,
      socialness: 2,
      learning: 2,
      study: 3
    },
    interactions: ['immunosuppressants'],
    warnings: ['May enhance effects of immunosuppressive drugs'],
    image: '/supplements/reishi.jpg'
  },
  {
    id: 'green-tea-extract',
    name: 'Green Tea Extract (EGCG)',
    category: 'antioxidant',
    description: 'Potent antioxidant that supports metabolism, brain health, and longevity.',
    benefits: ['Antioxidant', 'Metabolism support', 'Brain health', 'Fat burning'],
    dosage: {
      min: 300,
      max: 800,
      unit: 'mg',
      timing: 'Between meals'
    },
    effects: {
      energy: 4,
      mood: 3,
      balance: 3,
      creativity: 3,
      socialness: 2,
      learning: 4,
      study: 4
    },
    interactions: ['iron-supplements'],
    warnings: ['May reduce iron absorption'],
    image: '/supplements/green-tea-extract.jpg'
  },
  {
    id: 'nmn',
    name: 'NMN (Nicotinamide Mononucleotide)',
    category: 'longevity',
    description: 'Direct NAD+ precursor that supports cellular energy and healthy aging.',
    benefits: ['NAD+ boost', 'Cellular energy', 'DNA repair', 'Longevity'],
    dosage: {
      min: 250,
      max: 1000,
      unit: 'mg',
      timing: 'Morning, empty stomach'
    },
    effects: {
      energy: 6,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 1,
      learning: 3,
      study: 3
    },
    interactions: [],
    warnings: ['Start with lower doses'],
    image: '/supplements/nmn.jpg'
  },
  {
    id: 'berberine',
    name: 'Berberine',
    category: 'metabolic',
    description: 'Plant alkaloid that supports blood sugar control and metabolic health.',
    benefits: ['Blood sugar control', 'Metabolic health', 'Cholesterol management', 'Weight management'],
    dosage: {
      min: 500,
      max: 1500,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 3,
      mood: 2,
      balance: 5,
      creativity: 1,
      socialness: 1,
      learning: 2,
      study: 2
    },
    interactions: ['diabetes-medications'],
    warnings: ['May lower blood sugar significantly'],
    image: '/supplements/berberine.jpg'
  },
  {
    id: 'taurine',
    name: 'Taurine',
    category: 'amino-acid',
    description: 'Amino acid that supports cardiovascular health, exercise performance, and neuroprotection.',
    benefits: ['Cardiovascular health', 'Exercise performance', 'Neuroprotection', 'Antioxidant'],
    dosage: {
      min: 500,
      max: 2000,
      unit: 'mg',
      timing: 'Pre-workout or with meals'
    },
    effects: {
      energy: 3,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 2,
      learning: 3,
      study: 3
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/taurine.jpg'
  },
  {
    id: 'spirulina',
    name: 'Spirulina',
    category: 'superfood',
    description: 'Nutrient-dense blue-green algae that provides protein, vitamins, and antioxidants.',
    benefits: ['Nutrient density', 'Protein source', 'Antioxidant', 'Immune support'],
    dosage: {
      min: 1,
      max: 10,
      unit: 'g',
      timing: 'With meals'
    },
    effects: {
      energy: 4,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 2,
      learning: 3,
      study: 3
    },
    interactions: [],
    warnings: ['Ensure high-quality, tested source'],
    image: '/supplements/spirulina.jpg'
  },
  {
    id: 'chlorella',
    name: 'Chlorella',
    category: 'superfood',
    description: 'Green algae that supports detoxification, immune function, and provides nutrients.',
    benefits: ['Detoxification', 'Immune support', 'Nutrient density', 'Chlorophyll'],
    dosage: {
      min: 1,
      max: 10,
      unit: 'g',
      timing: 'With meals'
    },
    effects: {
      energy: 3,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 2,
      learning: 2,
      study: 2
    },
    interactions: [],
    warnings: ['May cause digestive upset initially'],
    image: '/supplements/chlorella.jpg'
  },
  {
    id: 'mct-oil',
    name: 'MCT Oil',
    category: 'fat',
    description: 'Medium-chain triglycerides that provide quick energy and support ketone production.',
    benefits: ['Quick energy', 'Ketone production', 'Mental clarity', 'Weight management'],
    dosage: {
      min: 5,
      max: 30,
      unit: 'ml',
      timing: 'Morning or pre-workout'
    },
    effects: {
      energy: 6,
      mood: 2,
      balance: 2,
      creativity: 4,
      socialness: 2,
      learning: 4,
      study: 5
    },
    interactions: [],
    warnings: ['Start with small doses to avoid digestive upset'],
    image: '/supplements/mct-oil.jpg'
  },
  {
    id: 'nicotinamide-riboside',
    name: 'Nicotinamide Riboside (NR)',
    category: 'longevity',
    description: 'NAD+ precursor that supports cellular energy metabolism and healthy aging.',
    benefits: ['NAD+ support', 'Cellular energy', 'Mitochondrial health', 'Longevity'],
    dosage: {
      min: 250,
      max: 1000,
      unit: 'mg',
      timing: 'Morning with food'
    },
    effects: {
      energy: 5,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 1,
      learning: 3,
      study: 3
    },
    interactions: [],
    warnings: ['Generally well tolerated'],
    image: '/supplements/nicotinamide-riboside.jpg'
  },
  {
    id: 'alpha-lipoic-acid',
    name: 'Alpha-Lipoic Acid',
    category: 'antioxidant',
    description: 'Universal antioxidant that supports mitochondrial function and glucose metabolism.',
    benefits: ['Antioxidant', 'Mitochondrial support', 'Glucose metabolism', 'Neuroprotection'],
    dosage: {
      min: 300,
      max: 600,
      unit: 'mg',
      timing: 'Empty stomach'
    },
    effects: {
      energy: 4,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 2,
      learning: 3,
      study: 3
    },
    interactions: ['diabetes-medications'],
    warnings: ['May lower blood sugar'],
    image: '/supplements/alpha-lipoic-acid.jpg'
  },
  {
    id: 'fisetin',
    name: 'Fisetin',
    category: 'longevity',
    description: 'Senolytic flavonoid that supports healthy aging by removing senescent cells.',
    benefits: ['Senolytic effects', 'Healthy aging', 'Neuroprotection', 'Antioxidant'],
    dosage: {
      min: 100,
      max: 500,
      unit: 'mg',
      timing: 'With fats for absorption'
    },
    effects: {
      energy: 2,
      mood: 3,
      balance: 4,
      creativity: 2,
      socialness: 1,
      learning: 3,
      study: 3
    },
    interactions: [],
    warnings: ['Limited human studies'],
    image: '/supplements/fisetin.jpg'
  },
  {
    id: 'huperzine-a',
    name: 'Huperzine-A',
    category: 'nootropic',
    description: 'Acetylcholinesterase inhibitor that supports memory and cognitive function.',
    benefits: ['Memory enhancement', 'Learning', 'Neuroprotection', 'Focus'],
    dosage: {
      min: 50,
      max: 200,
      unit: 'mcg',
      timing: 'Morning'
    },
    effects: {
      energy: 2,
      mood: 2,
      balance: 2,
      creativity: 3,
      socialness: 2,
      learning: 7,
      study: 8
    },
    interactions: ['cholinesterase-inhibitors'],
    warnings: ['May interact with Alzheimer medications'],
    image: '/supplements/huperzine-a.jpg'
  },
  {
    id: 'vinpocetine',
    name: 'Vinpocetine',
    category: 'nootropic',
    description: 'Synthetic compound derived from periwinkle that supports cerebral circulation.',
    benefits: ['Cerebral circulation', 'Memory', 'Focus', 'Neuroprotection'],
    dosage: {
      min: 10,
      max: 40,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 3,
      mood: 2,
      balance: 2,
      creativity: 4,
      socialness: 2,
      learning: 5,
      study: 6
    },
    interactions: ['blood-thinners'],
    warnings: ['May interact with blood thinning medications'],
    image: '/supplements/vinpocetine.jpg'
  },
  {
    id: 'piracetam',
    name: 'Piracetam',
    category: 'nootropic',
    description: 'Original racetam nootropic that supports memory, learning, and cognitive function.',
    benefits: ['Memory enhancement', 'Learning', 'Cognitive function', 'Neuroprotection'],
    dosage: {
      min: 1200,
      max: 4800,
      unit: 'mg',
      timing: 'Divided doses with meals'
    },
    effects: {
      energy: 2,
      mood: 3,
      balance: 2,
      creativity: 4,
      socialness: 3,
      learning: 6,
      study: 7
    },
    interactions: [],
    warnings: ['Not FDA approved in US'],
    image: '/supplements/piracetam.jpg'
  },
  {
    id: 'noopept',
    name: 'Noopept',
    category: 'nootropic',
    description: 'Potent synthetic nootropic that supports memory, learning, and neuroprotection.',
    benefits: ['Memory enhancement', 'Learning', 'Neuroprotection', 'Mood'],
    dosage: {
      min: 10,
      max: 30,
      unit: 'mg',
      timing: 'Sublingual or with meals'
    },
    effects: {
      energy: 3,
      mood: 4,
      balance: 3,
      creativity: 5,
      socialness: 3,
      learning: 7,
      study: 8
    },
    interactions: [],
    warnings: ['Not FDA approved', 'Start with lowest dose'],
    image: '/supplements/noopept.jpg'
  },
  {
    id: 'phenylpiracetam',
    name: 'Phenylpiracetam',
    category: 'nootropic',
    description: 'Stimulating racetam that combines cognitive enhancement with physical performance.',
    benefits: ['Enhanced focus', 'Physical performance', 'Cold tolerance', 'Memory'],
    dosage: {
      min: 100,
      max: 200,
      unit: 'mg',
      timing: 'Morning or pre-workout'
    },
    effects: {
      energy: 7,
      mood: 4,
      balance: 2,
      creativity: 5,
      socialness: 3,
      learning: 6,
      study: 7
    },
    interactions: ['stimulants'],
    warnings: ['May cause overstimulation when combined with caffeine'],
    image: '/supplements/phenylpiracetam.jpg'
  },
  {
    id: 'oxiracetam',
    name: 'Oxiracetam',
    category: 'nootropic',
    description: 'Potent racetam known for logical thinking, attention, and memory formation.',
    benefits: ['Logical reasoning', 'Attention span', 'Memory formation', 'Mental clarity'],
    dosage: {
      min: 750,
      max: 1500,
      unit: 'mg',
      timing: 'Morning and afternoon'
    },
    effects: {
      energy: 3,
      mood: 2,
      balance: 1,
      creativity: 3,
      socialness: 1,
      learning: 7,
      study: 8
    },
    interactions: ['choline-supplements'],
    warnings: ['Works best when combined with choline sources'],
    image: '/supplements/oxiracetam.jpg'
  },
  {
    id: 'aniracetam',
    name: 'Aniracetam',
    category: 'nootropic',
    description: 'Anxiolytic racetam that reduces anxiety while enhancing creativity and holistic thinking.',
    benefits: ['Anxiety reduction', 'Creative thinking', 'Mood enhancement', 'Social confidence'],
    dosage: {
      min: 750,
      max: 1500,
      unit: 'mg',
      timing: 'With fats for absorption'
    },
    effects: {
      energy: 2,
      mood: 6,
      balance: 5,
      creativity: 7,
      socialness: 6,
      learning: 5,
      study: 4
    },
    interactions: ['alcohol'],
    warnings: ['Fat-soluble, take with meals containing fats'],
    image: '/supplements/aniracetam.jpg'
  },
  {
    id: 'pramiracetam',
    name: 'Pramiracetam',
    category: 'nootropic',
    description: 'High-potency racetam focused on memory consolidation and recall.',
    benefits: ['Memory consolidation', 'Long-term memory', 'Focus intensity', 'Learning retention'],
    dosage: {
      min: 300,
      max: 600,
      unit: 'mg',
      timing: 'With choline source'
    },
    effects: {
      energy: 1,
      mood: 1,
      balance: 0,
      creativity: 2,
      socialness: 0,
      learning: 8,
      study: 9
    },
    interactions: ['choline-supplements'],
    warnings: ['Requires choline supplementation to prevent headaches'],
    image: '/supplements/pramiracetam.jpg'
  },
  {
    id: 'armodafinil',
    name: 'Armodafinil',
    category: 'prescription',
    description: 'R-enantiomer of modafinil with longer duration and smoother effects.',
    benefits: ['Wakefulness', 'Focus enhancement', 'Reduced fatigue', 'Cognitive performance'],
    dosage: {
      min: 75,
      max: 250,
      unit: 'mg',
      timing: 'Early morning'
    },
    effects: {
      energy: 9,
      mood: 3,
      balance: 1,
      creativity: 4,
      socialness: 2,
      learning: 7,
      study: 9
    },
    interactions: ['birth-control', 'blood-thinners'],
    warnings: ['Prescription required. May affect sleep if taken late'],
    image: '/supplements/armodafinil.jpg'
  },
  {
    id: 'prl-8-53',
    name: 'PRL-8-53',
    category: 'nootropic',
    description: 'Experimental nootropic compound with potent memory enhancement effects.',
    benefits: ['Memory enhancement', 'Learning acceleration', 'Recall improvement', 'Cognitive performance'],
    dosage: {
      min: 5,
      max: 20,
      unit: 'mg',
      timing: 'Before learning sessions'
    },
    effects: {
      energy: 1,
      mood: 1,
      balance: 0,
      creativity: 2,
      socialness: 0,
      learning: 9,
      study: 9
    },
    interactions: [],
    warnings: ['Experimental compound, limited safety data'],
    image: '/supplements/prl-8-53.jpg'
  },
  {
    id: 'sunifiram',
    name: 'Sunifiram',
    category: 'nootropic',
    description: 'Ampakine nootropic with potent cognitive enhancement and memory effects.',
    benefits: ['Memory enhancement', 'Focus improvement', 'Learning capacity', 'Motivation'],
    dosage: {
      min: 5,
      max: 10,
      unit: 'mg',
      timing: 'Morning or before cognitive tasks'
    },
    effects: {
      energy: 4,
      mood: 3,
      balance: 1,
      creativity: 4,
      socialness: 2,
      learning: 8,
      study: 7
    },
    interactions: [],
    warnings: ['Very potent, start with minimal doses'],
    image: '/supplements/sunifiram.jpg'
  },
  {
    id: 'unifiram',
    name: 'Unifiram',
    category: 'nootropic',
    description: 'Ampakine compound similar to sunifiram with cognitive enhancing properties.',
    benefits: ['Cognitive enhancement', 'Memory improvement', 'Focus', 'Mental energy'],
    dosage: {
      min: 5,
      max: 15,
      unit: 'mg',
      timing: 'Morning'
    },
    effects: {
      energy: 5,
      mood: 2,
      balance: 1,
      creativity: 3,
      socialness: 1,
      learning: 7,
      study: 6
    },
    interactions: [],
    warnings: ['Limited research, use with caution'],
    image: '/supplements/unifiram.jpg'
  },
  {
    id: 'coluracetam',
    name: 'Coluracetam',
    category: 'nootropic',
    description: 'Racetam that enhances choline uptake and may improve vision and mood.',
    benefits: ['Choline uptake', 'Visual enhancement', 'Mood improvement', 'Memory'],
    dosage: {
      min: 20,
      max: 80,
      unit: 'mg',
      timing: 'With or without food'
    },
    effects: {
      energy: 2,
      mood: 5,
      balance: 3,
      creativity: 4,
      socialness: 3,
      learning: 6,
      study: 5
    },
    interactions: [],
    warnings: ['May cause vivid dreams or visual effects'],
    image: '/supplements/coluracetam.jpg'
  },
  {
    id: 'fasoracetam',
    name: 'Fasoracetam',
    category: 'nootropic',
    description: 'GABA-B receptor agonist racetam with anxiolytic and cognitive benefits.',
    benefits: ['Anxiety reduction', 'ADHD symptoms', 'Memory enhancement', 'Mood stabilization'],
    dosage: {
      min: 10,
      max: 50,
      unit: 'mg',
      timing: 'Twice daily'
    },
    effects: {
      energy: 1,
      mood: 6,
      balance: 7,
      creativity: 3,
      socialness: 5,
      learning: 5,
      study: 6
    },
    interactions: ['gaba-supplements'],
    warnings: ['May interact with GABA-ergic substances'],
    image: '/supplements/fasoracetam.jpg'
  },
  {
    id: 'nefiracetam',
    name: 'Nefiracetam',
    category: 'nootropic',
    description: 'Racetam with unique mechanisms affecting calcium channels and PKC.',
    benefits: ['Memory consolidation', 'Learning enhancement', 'Neuroprotection', 'Cognitive flexibility'],
    dosage: {
      min: 150,
      max: 900,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 2,
      mood: 3,
      balance: 2,
      creativity: 5,
      socialness: 2,
      learning: 7,
      study: 6
    },
    interactions: [],
    warnings: ['Limited human studies available'],
    image: '/supplements/nefiracetam.jpg'
  },
  {
    id: 'fish-oil',
    name: 'Fish Oil (Omega-3)',
    category: 'essential',
    description: 'Essential fatty acids EPA and DHA that support brain health, mood, and inflammation.',
    benefits: ['Brain health', 'Mood support', 'Anti-inflammatory', 'Heart health'],
    dosage: {
      min: 1000,
      max: 3000,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 2,
      mood: 5,
      balance: 6,
      creativity: 3,
      socialness: 3,
      learning: 4,
      study: 4
    },
    interactions: ['blood-thinners'],
    warnings: ['May increase bleeding risk with blood thinners'],
    image: '/supplements/fish-oil.jpg'
  },
  {
    id: 'kanna',
    name: 'Kanna (Sceletium tortuosum)',
    category: 'adaptogen',
    description: 'South African succulent with mood-enhancing and anxiolytic properties.',
    benefits: ['Mood enhancement', 'Anxiety reduction', 'Social confidence', 'Stress relief'],
    dosage: {
      min: 25,
      max: 100,
      unit: 'mg',
      timing: 'As needed for mood'
    },
    effects: {
      energy: 1,
      mood: 7,
      balance: 5,
      creativity: 4,
      socialness: 7,
      learning: 2,
      study: 1
    },
    interactions: ['ssri', 'maoi'],
    warnings: ['Do not combine with antidepressants'],
    image: '/supplements/kanna.jpg'
  },
  {
    id: 'polygala-tenuifolia',
    name: 'Polygala tenuifolia',
    category: 'nootropic',
    description: 'Traditional Chinese herb that enhances memory and has neuroprotective effects.',
    benefits: ['Memory enhancement', 'Neuroprotection', 'Cognitive performance', 'Mood support'],
    dosage: {
      min: 100,
      max: 300,
      unit: 'mg',
      timing: 'With or without food'
    },
    effects: {
      energy: 2,
      mood: 4,
      balance: 3,
      creativity: 3,
      socialness: 2,
      learning: 6,
      study: 5
    },
    interactions: [],
    warnings: ['May cause mild digestive upset'],
    image: '/supplements/polygala.jpg'
  },
  {
    id: 'centrophenoxine',
    name: 'Centrophenoxine',
    category: 'nootropic',
    description: 'Cholinergic nootropic that enhances memory and has anti-aging properties.',
    benefits: ['Memory enhancement', 'Anti-aging', 'Cognitive performance', 'Neuroprotection'],
    dosage: {
      min: 250,
      max: 1000,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 3,
      mood: 2,
      balance: 2,
      creativity: 3,
      socialness: 1,
      learning: 6,
      study: 6
    },
    interactions: [],
    warnings: ['May cause mild stimulation'],
    image: '/supplements/centrophenoxine.jpg'
  },
  {
    id: 'idebenone',
    name: 'Idebenone',
    category: 'nootropic',
    description: 'Synthetic analog of CoQ10 with potent antioxidant and neuroprotective effects.',
    benefits: ['Neuroprotection', 'Antioxidant', 'Cognitive enhancement', 'Mitochondrial support'],
    dosage: {
      min: 45,
      max: 270,
      unit: 'mg',
      timing: 'With meals'
    },
    effects: {
      energy: 4,
      mood: 3,
      balance: 3,
      creativity: 2,
      socialness: 1,
      learning: 5,
      study: 5
    },
    interactions: [],
    warnings: ['Expensive, limited availability'],
    image: '/supplements/idebenone.jpg'
  },
  {
    id: 'modafinil',
    name: 'Modafinil',
    category: 'prescription',
    description: 'Prescription wakefulness-promoting agent used for narcolepsy and shift work.',
    benefits: ['Wakefulness', 'Focus', 'Cognitive enhancement', 'Alertness'],
    dosage: {
      min: 100,
      max: 200,
      unit: 'mg',
      timing: 'Morning'
    },
    effects: {
      energy: 8,
      mood: 3,
      balance: 1,
      creativity: 4,
      socialness: 2,
      learning: 6,
      study: 8
    },
    interactions: ['many-medications'],
    warnings: ['Prescription required', 'Many drug interactions'],
    image: '/supplements/modafinil.jpg'
  },
  {
    id: 'phenylethylamine',
    name: 'Phenylethylamine (PEA)',
    category: 'stimulant',
    description: 'Naturally occurring trace amine that acts as a neuromodulator, rapidly boosting mood and focus.',
    benefits: ['Mood elevation', 'Focus', 'Energy boost', 'Motivation'],
    dosage: {
      min: 100,
      max: 500,
      unit: 'mg',
      timing: 'As needed, short-acting'
    },
    effects: {
      energy: 7,
      mood: 8,
      balance: -3,
      creativity: 5,
      socialness: 6,
      learning: 4,
      study: 5
    },
    interactions: ['maoi', 'ssri'],
    warnings: ['Do not combine with MAOIs or SSRIs', 'Short duration of action', 'Tolerance builds quickly'],
    image: '/supplements/pea.jpg'
  },
  {
    id: 'hordenine',
    name: 'Hordenine',
    category: 'stimulant',
    description: 'Naturally occurring alkaloid found in plants, often used as a stimulant and fat burner.',
    benefits: ['Energy boost', 'Fat burning', 'Focus', 'Appetite suppression'],
    dosage: {
      min: 20,
      max: 50,
      unit: 'mg',
      timing: 'Morning or pre-workout'
    },
    effects: {
      energy: 6,
      mood: 3,
      balance: -1,
      creativity: 2,
      socialness: 2,
      learning: 3,
      study: 4
    },
    interactions: ['maoi', 'other-stimulants'],
    warnings: ['Do not combine with MAOIs or other stimulants', 'May increase heart rate and blood pressure'],
    image: '/supplements/hordenine.jpg'
  }
];

// Categories for filtering
export const categories = [
  'energy',
  'nootropic',
  'adaptogen',
  'longevity',
  'vitamin',
  'mineral',
  'amino-acid',
  'antioxidant',
  'anti-inflammatory',
  'sleep',
  'performance',
  'essential',
  'gut-health',
  'hormone',
  'protein',
  'immune',
  'metabolic',
  'superfood',
  'fat',
  'prescription',
  'stimulant'
];

// Goals for recommendation system
export const goals = [
  { id: 'energy', name: 'Energy', description: 'Boost physical and mental energy' },
  { id: 'mood', name: 'Mood', description: 'Enhance mood and emotional well-being' },
  { id: 'balance', name: 'Balance', description: 'Achieve overall balance and stress management' },
  { id: 'creativity', name: 'Creativity', description: 'Enhance creative thinking and innovation' },
  { id: 'socialness', name: 'Social', description: 'Improve social confidence and interaction' },
  { id: 'learning', name: 'Learning', description: 'Enhance learning capacity and memory' },
  { id: 'study', name: 'Study', description: 'Optimize focus and concentration for studying' }
];



