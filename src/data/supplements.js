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
  },

  // === NEW SUPPLEMENTS: Asprey, Huberman, Sinclair, Patrick, Ferriss, Attia, Johnson ===
// === HUBERMAN LAB RECOMMENDATIONS ===
  {
    id: 'tongkat-ali',
    name: 'Tongkat Ali (Eurycoma Longifolia)',
    category: 'hormone',
    description: 'A Southeast Asian herb that increases free testosterone by reducing sex hormone-binding globulin (SHBG). Widely recommended by Andrew Huberman for vitality and hormonal balance.',
    benefits: ['Testosterone support', 'Increased energy', 'Improved libido', 'Reduced cortisol'],
    dosage: { min: 200, max: 600, unit: 'mg', timing: 'Morning with food' },
    effects: { energy: 6, mood: 5, balance: 4, creativity: 2, socialness: 5, learning: 2, study: 2 },
    interactions: ['blood-pressure-medications', 'hormone-therapies'],
    warnings: ['May affect blood sugar levels', 'Cycle 8 weeks on, 2 weeks off'],
    image: '/supplements/tongkat-ali.jpg'
  },
  {
    id: 'fadogia-agrestis',
    name: 'Fadogia Agrestis',
    category: 'hormone',
    description: 'A Nigerian shrub extract that supports luteinizing hormone production and testosterone levels. Often paired with Tongkat Ali in Huberman-style protocols.',
    benefits: ['Testosterone support', 'Luteinizing hormone', 'Athletic performance', 'Recovery'],
    dosage: { min: 400, max: 600, unit: 'mg', timing: 'Morning with food' },
    effects: { energy: 5, mood: 3, balance: 2, creativity: 1, socialness: 3, learning: 1, study: 1 },
    interactions: ['hormone-therapies'],
    warnings: ['Cycle 8-12 weeks on, 2-4 weeks off', 'Limited long-term human safety data', 'Monitor liver enzymes'],
    image: '/supplements/fadogia.jpg'
  },
  {
    id: 'apigenin',
    name: 'Apigenin',
    category: 'sleep',
    description: 'A natural flavonoid found in chamomile that promotes relaxation and sleep by modulating GABA receptors. Also inhibits CD38, helping preserve NAD+ levels for longevity.',
    benefits: ['Sleep quality', 'Relaxation', 'NAD+ preservation', 'Anti-inflammatory'],
    dosage: { min: 50, max: 250, unit: 'mg', timing: 'Before bed' },
    effects: { energy: -1, mood: 4, balance: 6, creativity: 1, socialness: 1, learning: 2, study: 1 },
    interactions: ['sedatives', 'blood-thinners'],
    warnings: ['May cause drowsiness', 'Start with lower dose'],
    image: '/supplements/apigenin.jpg'
  },
  {
    id: 'inositol',
    name: 'Myo-Inositol',
    category: 'sleep',
    description: 'A naturally occurring sugar alcohol that supports serotonin signaling, reduces anxiety, and improves sleep quality. Recommended by Huberman for sleep on alternate nights.',
    benefits: ['Sleep onset', 'Anxiety reduction', 'Serotonin support', 'Hormonal balance'],
    dosage: { min: 500, max: 2000, unit: 'mg', timing: 'Before bed, every other night' },
    effects: { energy: 0, mood: 5, balance: 6, creativity: 1, socialness: 2, learning: 2, study: 1 },
    interactions: ['lithium', 'ssris'],
    warnings: ['May cause GI discomfort at high doses', 'Consult doctor if taking psychiatric medications'],
    image: '/supplements/inositol.jpg'
  },
  {
    id: 'glycine',
    name: 'Glycine',
    category: 'amino-acid',
    description: 'The simplest amino acid that lowers core body temperature to enhance sleep onset and quality. Also supports collagen synthesis and acts as an inhibitory neurotransmitter.',
    benefits: ['Sleep quality', 'Temperature regulation', 'Collagen support', 'Neuroprotection'],
    dosage: { min: 1000, max: 3000, unit: 'mg', timing: 'Before bed' },
    effects: { energy: 0, mood: 3, balance: 5, creativity: 1, socialness: 1, learning: 2, study: 1 },
    interactions: ['clozapine'],
    warnings: ['Generally very safe', 'May cause mild stomach discomfort'],
    image: '/supplements/glycine.jpg'
  },
  {
    id: 'gaba',
    name: 'GABA (Gamma-Aminobutyric Acid)',
    category: 'amino-acid',
    description: 'The primary inhibitory neurotransmitter in the brain. Supplemental GABA promotes calmness, reduces anxiety, and supports sleep. Debated whether it crosses the blood-brain barrier.',
    benefits: ['Calmness', 'Sleep support', 'Anxiety reduction', 'Growth hormone release'],
    dosage: { min: 100, max: 750, unit: 'mg', timing: 'Before bed or when stressed' },
    effects: { energy: -1, mood: 4, balance: 6, creativity: 1, socialness: 2, learning: 1, study: 1 },
    interactions: ['benzodiazepines', 'sedatives', 'blood-pressure-medications'],
    warnings: ['May cause drowsiness', 'Do not combine with sedative medications'],
    image: '/supplements/gaba.jpg'
  },
  {
    id: 'grape-seed-extract',
    name: 'Grape Seed Extract',
    category: 'antioxidant',
    description: 'Rich in proanthocyanidins (OPCs), grape seed extract provides powerful antioxidant protection, supports cardiovascular health, and improves blood flow.',
    benefits: ['Antioxidant protection', 'Cardiovascular health', 'Blood flow', 'Skin health'],
    dosage: { min: 200, max: 800, unit: 'mg', timing: 'With meals' },
    effects: { energy: 2, mood: 2, balance: 4, creativity: 1, socialness: 1, learning: 2, study: 1 },
    interactions: ['blood-thinners', 'nsaids'],
    warnings: ['May increase bleeding risk with blood thinners'],
    image: '/supplements/grape-seed.jpg'
  },
  {
    id: 'boron',
    name: 'Boron',
    category: 'mineral',
    description: 'A trace mineral that reduces sex hormone-binding globulin (SHBG), increasing free testosterone. Also supports bone density, brain function, and reduces inflammation.',
    benefits: ['Free testosterone', 'Bone health', 'Brain function', 'Anti-inflammatory'],
    dosage: { min: 2, max: 6, unit: 'mg', timing: 'With meals' },
    effects: { energy: 3, mood: 2, balance: 3, creativity: 1, socialness: 2, learning: 2, study: 1 },
    interactions: ['hormone-therapies'],
    warnings: ['Do not exceed 20mg daily', 'Generally very safe at recommended doses'],
    image: '/supplements/boron.jpg'
  },
  {
    id: 'alcar',
    name: 'Acetyl-L-Carnitine (ALCAR)',
    category: 'amino-acid',
    description: 'An acetylated form of L-carnitine that crosses the blood-brain barrier. Enhances fat oxidation for energy, supports mitochondrial function, and provides neuroprotection.',
    benefits: ['Mental energy', 'Fat metabolism', 'Neuroprotection', 'Mitochondrial support'],
    dosage: { min: 500, max: 2000, unit: 'mg', timing: 'Morning, empty stomach' },
    effects: { energy: 6, mood: 4, balance: 3, creativity: 3, socialness: 2, learning: 5, study: 5 },
    interactions: ['thyroid-medications', 'blood-thinners'],
    warnings: ['May cause restlessness in some', 'Avoid late in the day'],
    image: '/supplements/alcar.jpg'
  },
  {
    id: 'nac',
    name: 'N-Acetyl Cysteine (NAC)',
    category: 'antioxidant',
    description: 'A precursor to glutathione, the body\'s master antioxidant. Supports liver detoxification, immune defense, and has been studied for mood and compulsive behavior disorders.',
    benefits: ['Glutathione production', 'Liver support', 'Immune defense', 'Mood support'],
    dosage: { min: 600, max: 1800, unit: 'mg', timing: 'Away from meals' },
    effects: { energy: 2, mood: 4, balance: 5, creativity: 1, socialness: 1, learning: 2, study: 2 },
    interactions: ['nitroglycerin', 'blood-thinners', 'activated-charcoal'],
    warnings: ['May interact with nitroglycerin', 'Take away from food for best absorption'],
    image: '/supplements/nac.jpg'
  },
  {
    id: 'shilajit',
    name: 'Shilajit',
    category: 'mineral',
    description: 'A mineral-rich resin from Himalayan mountains containing fulvic acid. Increases testosterone, improves sperm quality, provides trace minerals, and enhances CoQ10 activity.',
    benefits: ['Testosterone support', 'Trace minerals', 'Energy production', 'Sperm quality'],
    dosage: { min: 250, max: 500, unit: 'mg', timing: 'Morning with food' },
    effects: { energy: 5, mood: 3, balance: 4, creativity: 2, socialness: 2, learning: 2, study: 2 },
    interactions: ['blood-pressure-medications', 'iron-supplements'],
    warnings: ['Ensure purified product (avoid heavy metals)', 'Source from reputable brands'],
    image: '/supplements/shilajit.jpg'
  },
  {
    id: 'garlic-extract',
    name: 'Garlic Extract (Allicin)',
    category: 'immune',
    description: 'Concentrated garlic compound that supports cardiovascular health, lowers TMAO levels, boosts immune function, and has antimicrobial properties.',
    benefits: ['Cardiovascular health', 'Immune support', 'Antimicrobial', 'Cholesterol management'],
    dosage: { min: 300, max: 600, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['blood-thinners', 'hiv-medications'],
    warnings: ['May increase bleeding risk', 'Can cause digestive discomfort'],
    image: '/supplements/garlic.jpg'
  },
  {
    id: 'ginger-extract',
    name: 'Ginger Root Extract',
    category: 'gut-health',
    description: 'A powerful anti-inflammatory digestive aid that reduces nausea, supports gut motility, and has been shown to reduce muscle soreness and pain.',
    benefits: ['Digestion', 'Anti-nausea', 'Anti-inflammatory', 'Pain reduction'],
    dosage: { min: 500, max: 1500, unit: 'mg', timing: 'With meals' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['blood-thinners', 'diabetes-medications'],
    warnings: ['May increase bleeding risk', 'Can cause heartburn in some people'],
    image: '/supplements/ginger.jpg'
  },

  // === DAVID ASPREY RECOMMENDATIONS ===
  {
    id: 'glutathione',
    name: 'Glutathione (Liposomal)',
    category: 'antioxidant',
    description: 'The body\'s master antioxidant. Liposomal form ensures absorption. Critical for cellular detoxification, immune support, and anti-aging. A cornerstone of Dave Asprey\'s protocol.',
    benefits: ['Detoxification', 'Immune support', 'Anti-aging', 'Cellular protection'],
    dosage: { min: 250, max: 1000, unit: 'mg', timing: 'Morning, empty stomach' },
    effects: { energy: 3, mood: 2, balance: 4, creativity: 1, socialness: 0, learning: 1, study: 1 },
    interactions: ['chemotherapy-drugs'],
    warnings: ['Liposomal form recommended for absorption', 'Oral forms poorly absorbed'],
    image: '/supplements/glutathione.jpg'
  },
  {
    id: 'vitamin-k2',
    name: 'Vitamin K2 (MK-7)',
    category: 'vitamin',
    description: 'Directs calcium into bones and away from arteries. Essential partner for vitamin D3. Supports cardiovascular and bone health. Recommended by Asprey and Sinclair.',
    benefits: ['Bone health', 'Cardiovascular protection', 'Calcium metabolism', 'Vitamin D synergy'],
    dosage: { min: 100, max: 400, unit: 'mcg', timing: 'With fat-containing meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['warfarin', 'blood-thinners'],
    warnings: ['Contraindicated with warfarin/Coumadin', 'Take with dietary fat for absorption'],
    image: '/supplements/vitamin-k2.jpg'
  },
  {
    id: 'vitamin-a',
    name: 'Vitamin A (Retinol)',
    category: 'vitamin',
    description: 'Essential fat-soluble vitamin for immune function, vision, skin integrity, and cellular communication. Often undercounted in modern diets.',
    benefits: ['Immune function', 'Vision health', 'Skin integrity', 'Cellular health'],
    dosage: { min: 750, max: 3000, unit: 'mcg', timing: 'With fat-containing meals' },
    effects: { energy: 1, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['retinoid-medications', 'blood-thinners'],
    warnings: ['Toxic in high doses', 'Do not exceed 3000 mcg daily without medical supervision', 'Avoid during pregnancy'],
    image: '/supplements/vitamin-a.jpg'
  },
  {
    id: 'iodine',
    name: 'Iodine',
    category: 'mineral',
    description: 'Essential trace mineral for thyroid hormone production. Supports metabolism, cognitive performance, and energy levels. Commonly deficient in many populations.',
    benefits: ['Thyroid function', 'Metabolism', 'Cognitive performance', 'Energy'],
    dosage: { min: 150, max: 1000, unit: 'mcg', timing: 'Morning with food' },
    effects: { energy: 4, mood: 2, balance: 3, creativity: 1, socialness: 1, learning: 3, study: 2 },
    interactions: ['thyroid-medications', 'lithium'],
    warnings: ['Excessive intake can disrupt thyroid function', 'Start low if you have thyroid issues'],
    image: '/supplements/iodine.jpg'
  },
  {
    id: 'selenium',
    name: 'Selenium',
    category: 'mineral',
    description: 'Essential trace mineral for thyroid function and glutathione peroxidase activity. Powerful antioxidant that reduces oxidative stress and supports immune function.',
    benefits: ['Thyroid support', 'Antioxidant', 'Immune function', 'DNA protection'],
    dosage: { min: 100, max: 200, unit: 'mcg', timing: 'With meals' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: ['blood-thinners', 'statins'],
    warnings: ['Toxic above 400 mcg daily', 'Brazil nuts are a natural source (1-2 nuts = daily dose)'],
    image: '/supplements/selenium.jpg'
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'mineral',
    description: 'Essential trace mineral and cofactor for superoxide dismutase and energy enzymes. Important to balance with zinc supplementation to prevent copper depletion.',
    benefits: ['Enzyme function', 'Iron metabolism', 'Connective tissue', 'Energy production'],
    dosage: { min: 1, max: 2, unit: 'mg', timing: 'With meals, separate from zinc' },
    effects: { energy: 2, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['zinc', 'penicillamine'],
    warnings: ['Too much causes toxicity', 'Balance with zinc (15:1 zinc-to-copper ratio)', 'Separate from zinc by 2 hours'],
    image: '/supplements/copper.jpg'
  },
  {
    id: 'astaxanthin',
    name: 'Astaxanthin',
    category: 'antioxidant',
    description: 'A carotenoid from microalgae that is 6000x more potent than vitamin C as an antioxidant. Protects eyes, skin, and mitochondria from oxidative damage. A Dave Asprey staple.',
    benefits: ['Skin protection', 'Eye health', 'Mitochondrial protection', 'Exercise recovery'],
    dosage: { min: 4, max: 12, unit: 'mg', timing: 'With fat-containing meals' },
    effects: { energy: 3, mood: 2, balance: 3, creativity: 1, socialness: 0, learning: 1, study: 1 },
    interactions: ['blood-pressure-medications', 'blood-thinners'],
    warnings: ['May lower blood pressure', 'Take with dietary fat for absorption'],
    image: '/supplements/astaxanthin.jpg'
  },
  {
    id: 'calcium-d-glucarate',
    name: 'Calcium D-Glucarate',
    category: 'longevity',
    description: 'Supports liver detoxification pathways and helps remove excess estrogen and other hormones. Dave Asprey considers it essential for reducing toxic load.',
    benefits: ['Liver detox', 'Estrogen balance', 'Cholesterol support', 'Cancer risk reduction'],
    dosage: { min: 500, max: 1500, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 2, balance: 4, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['hormone-therapies'],
    warnings: ['May affect hormone medication effectiveness', 'Generally very safe'],
    image: '/supplements/calcium-d-glucarate.jpg'
  },
  {
    id: 'activated-charcoal',
    name: 'Activated Charcoal',
    category: 'gut-health',
    description: 'Binds toxins, gas, and mycotoxins in the GI tract. Used by Dave Asprey after restaurant meals or when consuming food of uncertain quality.',
    benefits: ['Toxin binding', 'Gas relief', 'Mycotoxin removal', 'Digestive comfort'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: 'As needed, away from other supplements' },
    effects: { energy: 0, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['all-medications', 'other-supplements'],
    warnings: ['Take 2+ hours away from ALL medications and supplements', 'Can cause constipation', 'Not for daily use'],
    image: '/supplements/charcoal.jpg'
  },
  {
    id: 'krill-oil',
    name: 'Krill Oil',
    category: 'fat',
    description: 'An omega-3 source with EPA/DHA bound to phospholipids for superior bioavailability. Contains astaxanthin naturally. Lower contaminant risk than fish oil.',
    benefits: ['Omega-3s', 'Heart health', 'Brain function', 'Joint support'],
    dosage: { min: 500, max: 2000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 2, mood: 4, balance: 4, creativity: 2, socialness: 1, learning: 3, study: 2 },
    interactions: ['blood-thinners'],
    warnings: ['Shellfish allergy risk', 'May increase bleeding risk with blood thinners'],
    image: '/supplements/krill-oil.jpg'
  },
  {
    id: 'artichoke-extract',
    name: 'Artichoke Extract',
    category: 'nootropic',
    description: 'Inhibits PDE4 enzyme to increase cAMP levels, enhancing memory and long-term potentiation. Often paired with forskolin in the "CILTEP" nootropic stack.',
    benefits: ['Memory enhancement', 'cAMP increase', 'Liver support', 'Cholesterol management'],
    dosage: { min: 500, max: 900, unit: 'mg', timing: 'Morning' },
    effects: { energy: 2, mood: 2, balance: 2, creativity: 4, socialness: 1, learning: 6, study: 5 },
    interactions: ['bile-duct-medications'],
    warnings: ['May cause digestive discomfort', 'Best combined with forskolin for nootropic effect'],
    image: '/supplements/artichoke.jpg'
  },
  {
    id: 'theacrine',
    name: 'Theacrine (TeaCrine)',
    category: 'energy',
    description: 'Structurally similar to caffeine but without tolerance buildup. Provides smooth, sustained energy and focus without the jitters or crash associated with caffeine.',
    benefits: ['Sustained energy', 'No tolerance buildup', 'Focus', 'Mood enhancement'],
    dosage: { min: 100, max: 300, unit: 'mg', timing: 'Morning or pre-workout' },
    effects: { energy: 7, mood: 4, balance: 3, creativity: 3, socialness: 3, learning: 3, study: 4 },
    interactions: ['other-stimulants'],
    warnings: ['May affect sleep if taken late', 'Can be stacked with caffeine at lower doses'],
    image: '/supplements/theacrine.jpg'
  },
  {
    id: 'pine-bark-extract',
    name: 'Pine Bark Extract (Pycnogenol)',
    category: 'antioxidant',
    description: 'A potent OPC antioxidant that improves blood flow, reduces inflammation, and supports endothelial function. Clinically studied for ADHD, skin health, and circulation.',
    benefits: ['Blood flow', 'Antioxidant', 'Skin health', 'ADHD support'],
    dosage: { min: 50, max: 300, unit: 'mg', timing: 'With meals' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 2, socialness: 1, learning: 3, study: 3 },
    interactions: ['blood-thinners', 'immunosuppressants'],
    warnings: ['May increase bleeding risk', 'Start with lower dose'],
    image: '/supplements/pine-bark.jpg'
  },
  {
    id: 'boswellia',
    name: 'Boswellia Extract (Frankincense)',
    category: 'anti-inflammatory',
    description: 'Inhibits 5-LOX enzyme to reduce chronic inflammation. Traditionally used for joint health, gut inflammation, and respiratory conditions.',
    benefits: ['Joint health', 'Anti-inflammatory', 'Gut support', 'Respiratory health'],
    dosage: { min: 300, max: 500, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 2, balance: 4, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: ['nsaids', 'blood-thinners'],
    warnings: ['May cause digestive discomfort', 'Look for standardized AKBA content'],
    image: '/supplements/boswellia.jpg'
  },
  {
    id: 'rosemary-extract',
    name: 'Rosemary Extract',
    category: 'nootropic',
    description: 'Rich in carnosic acid and rosmarinic acid. Supports memory, focus, and neuroprotection. The scent alone has been shown to improve cognitive performance in studies.',
    benefits: ['Memory support', 'Neuroprotection', 'Antioxidant', 'Focus'],
    dosage: { min: 200, max: 500, unit: 'mg', timing: 'With meals' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 3, socialness: 1, learning: 4, study: 4 },
    interactions: ['blood-thinners', 'ace-inhibitors'],
    warnings: ['Generally very safe', 'May interact with blood pressure medications'],
    image: '/supplements/rosemary.jpg'
  },

  // === DAVID SINCLAIR RECOMMENDATIONS ===
  {
    id: 'spermidine',
    name: 'Spermidine',
    category: 'longevity',
    description: 'A polyamine that induces autophagy — the cellular cleanup process. Found in aged cheese and wheat germ. Studied extensively for anti-aging and cellular renewal.',
    benefits: ['Autophagy activation', 'Cellular renewal', 'Heart health', 'Memory support'],
    dosage: { min: 1, max: 6, unit: 'mg', timing: 'Morning' },
    effects: { energy: 2, mood: 2, balance: 4, creativity: 1, socialness: 0, learning: 3, study: 2 },
    interactions: [],
    warnings: ['Relatively new as a supplement', 'Generally well tolerated'],
    image: '/supplements/spermidine.jpg'
  },
  {
    id: 'tmg',
    name: 'Trimethylglycine (TMG / Betaine)',
    category: 'longevity',
    description: 'A methyl donor that supports methylation balance, which may be depleted by high-dose NMN supplementation. Important for homocysteine metabolism and liver health.',
    benefits: ['Methylation support', 'Homocysteine reduction', 'Liver health', 'NMN companion'],
    dosage: { min: 500, max: 1500, unit: 'mg', timing: 'With NMN or morning' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 1, socialness: 0, learning: 2, study: 1 },
    interactions: [],
    warnings: ['May cause digestive discomfort', 'Often recommended alongside NMN supplementation'],
    image: '/supplements/tmg.jpg'
  },
  {
    id: 'nattokinase',
    name: 'Nattokinase',
    category: 'longevity',
    description: 'A fibrinolytic enzyme from Japanese fermented soybeans (natto) that may help dissolve arterial plaque and improve circulation. Cited by David Sinclair for cardiovascular protection.',
    benefits: ['Arterial health', 'Blood clot prevention', 'Circulation', 'Cardiovascular protection'],
    dosage: { min: 2000, max: 4000, unit: 'FU', timing: 'Between meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['blood-thinners', 'aspirin'],
    warnings: ['Do NOT take with blood thinners', 'Discontinue before surgery', 'Soy allergy risk'],
    image: '/supplements/nattokinase.jpg'
  },

  // === AMINO ACIDS & NEUROTRANSMITTER SUPPORT ===
  {
    id: 'l-glutamine',
    name: 'L-Glutamine',
    category: 'amino-acid',
    description: 'The most abundant amino acid in the body. Critical for gut lining repair, immune function, and muscle recovery. Often depleted during stress and intense exercise.',
    benefits: ['Gut repair', 'Immune support', 'Muscle recovery', 'Sugar craving reduction'],
    dosage: { min: 2000, max: 10000, unit: 'mg', timing: 'Between meals or post-workout' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: ['anti-seizure-medications'],
    warnings: ['Very safe at recommended doses', 'Avoid with liver disease'],
    image: '/supplements/glutamine.jpg'
  },
  {
    id: 'l-citrulline',
    name: 'L-Citrulline',
    category: 'performance',
    description: 'An amino acid that converts to arginine, boosting nitric oxide production for improved blood flow, exercise performance, and cardiovascular health.',
    benefits: ['Blood flow', 'Exercise performance', 'Nitric oxide', 'Blood pressure support'],
    dosage: { min: 3000, max: 8000, unit: 'mg', timing: '30-60 min before exercise' },
    effects: { energy: 5, mood: 2, balance: 2, creativity: 1, socialness: 1, learning: 1, study: 1 },
    interactions: ['blood-pressure-medications', 'pde5-inhibitors'],
    warnings: ['May lower blood pressure', 'Start with lower dose'],
    image: '/supplements/citrulline.jpg'
  },
  {
    id: 'beta-alanine',
    name: 'Beta-Alanine',
    category: 'performance',
    description: 'A non-essential amino acid that increases muscle carnosine levels, buffering acid during high-intensity exercise. Improves endurance and reduces fatigue.',
    benefits: ['Exercise endurance', 'Muscle buffering', 'Fatigue reduction', 'High-intensity performance'],
    dosage: { min: 2000, max: 5000, unit: 'mg', timing: 'Pre-workout or split doses' },
    effects: { energy: 5, mood: 1, balance: 1, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: [],
    warnings: ['Causes harmless tingling/paresthesia sensation', 'Split doses to reduce tingling'],
    image: '/supplements/beta-alanine.jpg'
  },
  {
    id: 'l-tryptophan',
    name: 'L-Tryptophan',
    category: 'amino-acid',
    description: 'An essential amino acid and precursor to serotonin and melatonin. Supports mood, sleep, and emotional well-being. More gradual effect than 5-HTP.',
    benefits: ['Serotonin production', 'Sleep support', 'Mood enhancement', 'Anxiety reduction'],
    dosage: { min: 500, max: 2000, unit: 'mg', timing: 'Before bed or between meals' },
    effects: { energy: -1, mood: 6, balance: 5, creativity: 2, socialness: 2, learning: 1, study: 0 },
    interactions: ['ssris', 'maois', 'triptans'],
    warnings: ['Do NOT combine with SSRIs or MAOIs (serotonin syndrome risk)', 'May cause drowsiness'],
    image: '/supplements/tryptophan.jpg'
  },
  {
    id: '5-htp',
    name: '5-HTP (5-Hydroxytryptophan)',
    category: 'amino-acid',
    description: 'Direct precursor to serotonin, one step closer than tryptophan. Supports mood, sleep, and appetite control. Popular for depression and anxiety support.',
    benefits: ['Mood support', 'Sleep quality', 'Appetite control', 'Anxiety reduction'],
    dosage: { min: 50, max: 300, unit: 'mg', timing: 'Before bed' },
    effects: { energy: -1, mood: 7, balance: 5, creativity: 2, socialness: 3, learning: 1, study: 0 },
    interactions: ['ssris', 'maois', 'triptans', 'carbidopa'],
    warnings: ['NEVER combine with SSRIs or MAOIs (serotonin syndrome risk)', 'Start with 50mg', 'May cause nausea'],
    image: '/supplements/5-htp.jpg'
  },

  // === MUSHROOM EXTRACTS ===
  {
    id: 'chaga',
    name: 'Chaga Mushroom',
    category: 'immune',
    description: 'A fungal growth from birch trees loaded with antioxidants, beta-glucans, and melanin. One of the highest ORAC-scored natural substances for immune and antioxidant support.',
    benefits: ['Immune modulation', 'Antioxidant', 'Anti-inflammatory', 'Gut health'],
    dosage: { min: 500, max: 2000, unit: 'mg', timing: 'Morning or with meals' },
    effects: { energy: 2, mood: 2, balance: 4, creativity: 1, socialness: 0, learning: 1, study: 1 },
    interactions: ['blood-thinners', 'diabetes-medications'],
    warnings: ['May lower blood sugar', 'Avoid if you have autoimmune conditions', 'High in oxalates'],
    image: '/supplements/chaga.jpg'
  },
  {
    id: 'turkey-tail',
    name: 'Turkey Tail Mushroom (Trametes versicolor)',
    category: 'immune',
    description: 'One of the most researched medicinal mushrooms for immune function. Contains PSK and PSP polysaccharides used alongside cancer treatment in Japan.',
    benefits: ['Immune support', 'Gut microbiome', 'Cancer support', 'Antioxidant'],
    dosage: { min: 1000, max: 3000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['immunosuppressants'],
    warnings: ['Generally very safe', 'May modulate immune response'],
    image: '/supplements/turkey-tail.jpg'
  },
  {
    id: 'maitake',
    name: 'Maitake Mushroom (Grifola frondosa)',
    category: 'immune',
    description: 'An adaptogenic mushroom rich in D-fraction beta-glucans that modulates immune function, supports blood sugar regulation, and may help manage weight.',
    benefits: ['Blood sugar support', 'Immune modulation', 'Weight management', 'Cholesterol support'],
    dosage: { min: 500, max: 3000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 2, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['diabetes-medications', 'blood-thinners'],
    warnings: ['May lower blood sugar', 'Monitor if diabetic'],
    image: '/supplements/maitake.jpg'
  },
  {
    id: 'tremella',
    name: 'Tremella Mushroom (Snow Fungus)',
    category: 'antioxidant',
    description: 'Known as the "beauty mushroom" for its exceptional capacity to hold moisture. Contains polysaccharides that rival hyaluronic acid for skin hydration and anti-aging.',
    benefits: ['Skin hydration', 'Anti-aging', 'Immune support', 'Antioxidant'],
    dosage: { min: 500, max: 2000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: [],
    warnings: ['Generally very safe', 'Quality varies by brand'],
    image: '/supplements/tremella.jpg'
  },

  // === ADAPTOGENS & HERBALS ===
  {
    id: 'holy-basil',
    name: 'Holy Basil (Tulsi)',
    category: 'adaptogen',
    description: 'Sacred herb in Ayurvedic medicine that reduces cortisol, supports stress resilience, and balances blood sugar. One of the most well-studied adaptogens.',
    benefits: ['Stress reduction', 'Cortisol management', 'Blood sugar balance', 'Mental clarity'],
    dosage: { min: 300, max: 600, unit: 'mg', timing: 'Morning and evening' },
    effects: { energy: 2, mood: 5, balance: 7, creativity: 2, socialness: 2, learning: 2, study: 2 },
    interactions: ['blood-thinners', 'diabetes-medications'],
    warnings: ['May lower blood sugar', 'Avoid before surgery'],
    image: '/supplements/holy-basil.jpg'
  },
  {
    id: 'schisandra',
    name: 'Schisandra Berry',
    category: 'adaptogen',
    description: 'The "five-flavor berry" used in traditional Chinese medicine. Supports liver function, stress resilience, endurance, and has been shown to improve mental performance.',
    benefits: ['Liver support', 'Stress resilience', 'Mental performance', 'Endurance'],
    dosage: { min: 500, max: 1500, unit: 'mg', timing: 'Morning or with meals' },
    effects: { energy: 3, mood: 3, balance: 5, creativity: 2, socialness: 2, learning: 3, study: 3 },
    interactions: ['cyp3a4-substrates'],
    warnings: ['May interact with drugs metabolized by CYP3A4', 'Avoid during pregnancy'],
    image: '/supplements/schisandra.jpg'
  },
  {
    id: 'eleuthero',
    name: 'Eleuthero (Siberian Ginseng)',
    category: 'adaptogen',
    description: 'Not a true ginseng but a powerful adaptogen that enhances physical and mental stamina, improves immune function, and supports stress recovery.',
    benefits: ['Stamina', 'Immune support', 'Stress recovery', 'Physical performance'],
    dosage: { min: 300, max: 1200, unit: 'mg', timing: 'Morning' },
    effects: { energy: 5, mood: 3, balance: 5, creativity: 1, socialness: 2, learning: 2, study: 3 },
    interactions: ['blood-thinners', 'digoxin', 'lithium'],
    warnings: ['May interact with heart medications', 'Avoid if you have high blood pressure'],
    image: '/supplements/eleuthero.jpg'
  },
  {
    id: 'astragalus',
    name: 'Astragalus Root',
    category: 'adaptogen',
    description: 'A foundational herb in Traditional Chinese Medicine that supports immune function, telomere length maintenance, and cardiovascular health. Contains cycloastragenol.',
    benefits: ['Immune support', 'Telomere protection', 'Anti-aging', 'Cardiovascular health'],
    dosage: { min: 500, max: 1500, unit: 'mg', timing: 'Morning with meals' },
    effects: { energy: 3, mood: 2, balance: 4, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: ['immunosuppressants', 'lithium'],
    warnings: ['May modulate immune function', 'Avoid with autoimmune conditions'],
    image: '/supplements/astragalus.jpg'
  },
  {
    id: 'gotu-kola',
    name: 'Gotu Kola (Centella Asiatica)',
    category: 'nootropic',
    description: 'An Ayurvedic herb called "the student herb" for its ability to enhance memory, learning, and neural regeneration. Also supports wound healing and reduces anxiety.',
    benefits: ['Memory enhancement', 'Anxiety reduction', 'Neural regeneration', 'Wound healing'],
    dosage: { min: 250, max: 750, unit: 'mg', timing: 'Morning and evening' },
    effects: { energy: 1, mood: 4, balance: 5, creativity: 3, socialness: 2, learning: 6, study: 5 },
    interactions: ['sedatives', 'hepatotoxic-drugs'],
    warnings: ['May cause headache initially', 'Rare liver concerns with long-term use', 'Cycle every 6 weeks'],
    image: '/supplements/gotu-kola.jpg'
  },
  {
    id: 'valerian-root',
    name: 'Valerian Root',
    category: 'sleep',
    description: 'A traditional sleep herb that increases GABA levels in the brain. Reduces time to fall asleep and improves sleep quality without morning grogginess.',
    benefits: ['Sleep onset', 'Sleep quality', 'Anxiety reduction', 'Muscle relaxation'],
    dosage: { min: 300, max: 600, unit: 'mg', timing: '30-60 min before bed' },
    effects: { energy: -2, mood: 3, balance: 5, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['sedatives', 'benzodiazepines', 'alcohol'],
    warnings: ['May cause morning drowsiness at high doses', 'Do not combine with alcohol or sedatives'],
    image: '/supplements/valerian.jpg'
  },
  {
    id: 'passionflower',
    name: 'Passionflower (Passiflora incarnata)',
    category: 'sleep',
    description: 'A calming herb that increases GABA levels, reduces anxiety, and improves sleep quality. Studies show it rivals benzodiazepines for anxiety without the side effects.',
    benefits: ['Anxiety reduction', 'Sleep quality', 'GABA enhancement', 'Calmness'],
    dosage: { min: 250, max: 500, unit: 'mg', timing: 'Before bed or when anxious' },
    effects: { energy: -1, mood: 4, balance: 6, creativity: 1, socialness: 2, learning: 1, study: 1 },
    interactions: ['sedatives', 'maois', 'blood-thinners'],
    warnings: ['May cause drowsiness', 'Avoid with MAOIs', 'Avoid during pregnancy'],
    image: '/supplements/passionflower.jpg'
  },
  {
    id: 'lemon-balm',
    name: 'Lemon Balm (Melissa officinalis)',
    category: 'nootropic',
    description: 'A calming herb from the mint family that reduces anxiety and improves cognitive function by inhibiting GABA transaminase. Enhances calm focus.',
    benefits: ['Calm focus', 'Anxiety reduction', 'Cognitive function', 'Herpes virus support'],
    dosage: { min: 300, max: 600, unit: 'mg', timing: 'Morning or as needed' },
    effects: { energy: 0, mood: 5, balance: 6, creativity: 3, socialness: 3, learning: 3, study: 3 },
    interactions: ['thyroid-medications', 'sedatives'],
    warnings: ['May affect thyroid function', 'Can cause drowsiness in some people'],
    image: '/supplements/lemon-balm.jpg'
  },
  {
    id: 'black-seed-oil',
    name: 'Black Seed Oil (Nigella sativa)',
    category: 'immune',
    description: 'Known as "the remedy for everything except death" in traditional medicine. Contains thymoquinone, a powerful anti-inflammatory and immune modulator.',
    benefits: ['Immune modulation', 'Anti-inflammatory', 'Blood sugar support', 'Allergy relief'],
    dosage: { min: 500, max: 2000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 2, mood: 2, balance: 4, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: ['blood-thinners', 'diabetes-medications', 'beta-blockers'],
    warnings: ['May lower blood sugar and blood pressure', 'Start with low dose'],
    image: '/supplements/black-seed-oil.jpg'
  },
  {
    id: 'forskolin',
    name: 'Forskolin (Coleus forskohlii)',
    category: 'nootropic',
    description: 'Activates adenylate cyclase to increase cAMP, enhancing memory, learning, and fat metabolism. The key partner to artichoke extract in the CILTEP nootropic stack.',
    benefits: ['cAMP activation', 'Memory enhancement', 'Fat metabolism', 'Testosterone support'],
    dosage: { min: 100, max: 250, unit: 'mg', timing: 'Morning' },
    effects: { energy: 3, mood: 2, balance: 2, creativity: 4, socialness: 1, learning: 6, study: 5 },
    interactions: ['blood-pressure-medications', 'blood-thinners'],
    warnings: ['May lower blood pressure', 'Look for 10-20% standardized extract'],
    image: '/supplements/forskolin.jpg'
  },

  // === HORMONAL SUPPORT ===
  {
    id: 'dim',
    name: 'DIM (Diindolylmethane)',
    category: 'hormone',
    description: 'A compound from cruciferous vegetables that helps metabolize estrogen into less harmful forms. Supports hormonal balance in both men and women.',
    benefits: ['Estrogen metabolism', 'Hormonal balance', 'Prostate health', 'PMS support'],
    dosage: { min: 100, max: 300, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 3, balance: 5, creativity: 0, socialness: 1, learning: 0, study: 0 },
    interactions: ['hormone-therapies', 'tamoxifen'],
    warnings: ['May affect hormone medications', 'Can cause GI discomfort initially'],
    image: '/supplements/dim.jpg'
  },
  {
    id: 'pregnenolone',
    name: 'Pregnenolone',
    category: 'hormone',
    description: 'The "mother hormone" — precursor to all steroid hormones including DHEA, testosterone, estrogen, and cortisol. Supports memory, mood, and hormonal balance.',
    benefits: ['Hormone precursor', 'Memory support', 'Mood enhancement', 'Neuroprotection'],
    dosage: { min: 10, max: 50, unit: 'mg', timing: 'Morning' },
    effects: { energy: 3, mood: 5, balance: 4, creativity: 3, socialness: 3, learning: 4, study: 3 },
    interactions: ['hormone-therapies', 'benzodiazepines'],
    warnings: ['May affect hormone levels', 'Start with lowest dose', 'Monitor hormone panels'],
    image: '/supplements/pregnenolone.jpg'
  },

  // === MINERALS & VITAMINS ===
  {
    id: 'chromium',
    name: 'Chromium Picolinate',
    category: 'mineral',
    description: 'A trace mineral that enhances insulin sensitivity and supports blood sugar regulation. May help reduce carbohydrate cravings and support healthy body composition.',
    benefits: ['Blood sugar regulation', 'Insulin sensitivity', 'Craving reduction', 'Body composition'],
    dosage: { min: 200, max: 1000, unit: 'mcg', timing: 'With meals' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: ['diabetes-medications', 'thyroid-medications'],
    warnings: ['May interact with diabetes medications', 'Picolinate form best absorbed'],
    image: '/supplements/chromium.jpg'
  },
  {
    id: 'potassium',
    name: 'Potassium',
    category: 'mineral',
    description: 'Essential electrolyte for nerve function, muscle contraction, and blood pressure regulation. Most people get insufficient potassium from diet alone.',
    benefits: ['Blood pressure support', 'Muscle function', 'Nerve signaling', 'Electrolyte balance'],
    dosage: { min: 200, max: 500, unit: 'mg', timing: 'With meals (supplemental dose)' },
    effects: { energy: 2, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['ace-inhibitors', 'potassium-sparing-diuretics'],
    warnings: ['High doses can cause hyperkalemia', 'Supplement with caution if on heart/kidney meds'],
    image: '/supplements/potassium.jpg'
  },
  {
    id: 'vitamin-e',
    name: 'Vitamin E (Mixed Tocopherols)',
    category: 'vitamin',
    description: 'A fat-soluble antioxidant that protects cell membranes from oxidative damage. Best taken as mixed tocopherols, not synthetic dl-alpha-tocopherol.',
    benefits: ['Antioxidant', 'Skin health', 'Immune support', 'Cell membrane protection'],
    dosage: { min: 100, max: 400, unit: 'IU', timing: 'With fat-containing meals' },
    effects: { energy: 1, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['blood-thinners', 'statins', 'chemotherapy'],
    warnings: ['High doses may increase bleeding risk', 'Use mixed tocopherols, not synthetic'],
    image: '/supplements/vitamin-e.jpg'
  },
  {
    id: 'biotin',
    name: 'Biotin (Vitamin B7)',
    category: 'vitamin',
    description: 'A B vitamin essential for hair, skin, and nail growth. Also plays a role in fat and carbohydrate metabolism and gene regulation.',
    benefits: ['Hair growth', 'Nail strength', 'Skin health', 'Metabolism support'],
    dosage: { min: 2500, max: 10000, unit: 'mcg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 1, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['anti-seizure-medications'],
    warnings: ['Can interfere with lab test results (thyroid, troponin)', 'Disclose use to doctors before blood work'],
    image: '/supplements/biotin.jpg'
  },
  {
    id: 'folate',
    name: 'Methylfolate (5-MTHF)',
    category: 'vitamin',
    description: 'The active form of folate, bypassing the MTHFR gene mutation that affects up to 40% of people. Essential for DNA synthesis, brain function, and mood regulation.',
    benefits: ['DNA synthesis', 'Brain function', 'Mood support', 'Homocysteine reduction'],
    dosage: { min: 400, max: 1000, unit: 'mcg', timing: 'Morning' },
    effects: { energy: 2, mood: 4, balance: 3, creativity: 1, socialness: 1, learning: 3, study: 2 },
    interactions: ['methotrexate', 'anti-seizure-medications'],
    warnings: ['Use methylfolate, not folic acid', 'May mask B12 deficiency'],
    image: '/supplements/folate.jpg'
  },

  // === SPECIALTY NOOTROPICS ===
  {
    id: 'lithium-orotate',
    name: 'Lithium Orotate',
    category: 'nootropic',
    description: 'A micro-dose form of lithium used as a neuroprotective agent. Supports brain-derived neurotrophic factor (BDNF), mood stability, and neuroprotection at much lower doses than pharmaceutical lithium.',
    benefits: ['Neuroprotection', 'BDNF support', 'Mood stability', 'Anti-aging brain'],
    dosage: { min: 5, max: 20, unit: 'mg', timing: 'Evening' },
    effects: { energy: 0, mood: 6, balance: 6, creativity: 2, socialness: 2, learning: 3, study: 2 },
    interactions: ['nsaids', 'ace-inhibitors', 'diuretics', 'ssris'],
    warnings: ['Not the same as pharmaceutical lithium', 'Very low dose is key', 'Monitor thyroid with long-term use'],
    image: '/supplements/lithium-orotate.jpg'
  },
  {
    id: 'sulforaphane',
    name: 'Sulforaphane (Broccoli Sprout Extract)',
    category: 'longevity',
    description: 'A potent activator of the Nrf2 pathway, the body\'s master antioxidant defense system. Found concentrated in broccoli sprouts. Studied for cancer prevention and detoxification.',
    benefits: ['Nrf2 activation', 'Detoxification', 'Cancer prevention', 'Anti-inflammatory'],
    dosage: { min: 10, max: 50, unit: 'mg', timing: 'Morning with meals' },
    effects: { energy: 1, mood: 2, balance: 4, creativity: 0, socialness: 0, learning: 2, study: 1 },
    interactions: ['thyroid-medications'],
    warnings: ['May affect thyroid function at very high doses', 'Myrosinase-activated form preferred'],
    image: '/supplements/sulforaphane.jpg'
  },
  {
    id: 'uridine',
    name: 'Uridine Monophosphate',
    category: 'nootropic',
    description: 'A nucleotide that supports synapse formation and dopamine receptor density. Part of the "Mr. Happy Stack" with fish oil and choline for mood and cognitive enhancement.',
    benefits: ['Synapse formation', 'Dopamine support', 'Mood enhancement', 'RNA synthesis'],
    dosage: { min: 150, max: 500, unit: 'mg', timing: 'Morning or evening' },
    effects: { energy: 2, mood: 5, balance: 3, creativity: 3, socialness: 3, learning: 5, study: 4 },
    interactions: [],
    warnings: ['Best combined with omega-3 and choline', 'Sublingual form may be more effective'],
    image: '/supplements/uridine.jpg'
  },
  {
    id: 'phenibut',
    name: 'Phenibut',
    category: 'nootropic',
    description: 'A GABA-B receptor agonist developed in Russia for anxiety and sleep. Provides strong anxiolytic and social effects but carries significant dependence risk.',
    benefits: ['Anxiety reduction', 'Social confidence', 'Sleep aid', 'Stress relief'],
    dosage: { min: 250, max: 1000, unit: 'mg', timing: 'Morning or as needed, MAX 2x per week' },
    effects: { energy: 2, mood: 7, balance: 3, creativity: 3, socialness: 8, learning: 2, study: 2 },
    interactions: ['alcohol', 'benzodiazepines', 'opioids', 'all-sedatives'],
    warnings: ['HIGH DEPENDENCE RISK — DO NOT use daily', 'Maximum 2x per week', 'Never combine with alcohol', 'Withdrawal can be severe', 'Banned or regulated in some countries'],
    image: '/supplements/phenibut.jpg'
  },
  {
    id: 'semax',
    name: 'Semax',
    category: 'nootropic',
    description: 'A synthetic peptide derived from ACTH that enhances BDNF, focus, and cognitive performance. Developed in Russia and administered as a nasal spray.',
    benefits: ['BDNF increase', 'Focus enhancement', 'Neuroprotection', 'Memory support'],
    dosage: { min: 200, max: 600, unit: 'mcg', timing: 'Morning, nasal spray' },
    effects: { energy: 4, mood: 4, balance: 3, creativity: 4, socialness: 3, learning: 7, study: 7 },
    interactions: [],
    warnings: ['Research chemical — not FDA approved', 'Nasal spray administration', 'Limited long-term safety data'],
    image: '/supplements/semax.jpg'
  },
  {
    id: 'selank',
    name: 'Selank',
    category: 'nootropic',
    description: 'A synthetic peptide with anxiolytic and nootropic properties. Modulates GABA and serotonin systems. Developed in Russia as the "anti-anxiety" companion to Semax.',
    benefits: ['Anxiety reduction', 'Cognitive enhancement', 'Mood stabilization', 'Immune modulation'],
    dosage: { min: 250, max: 750, unit: 'mcg', timing: 'Morning or as needed, nasal spray' },
    effects: { energy: 1, mood: 6, balance: 6, creativity: 3, socialness: 5, learning: 5, study: 4 },
    interactions: ['benzodiazepines', 'ssris'],
    warnings: ['Research chemical — not FDA approved', 'Nasal spray administration', 'Limited long-term safety data'],
    image: '/supplements/selank.jpg'
  },

  // === LONGEVITY & ANTI-AGING ===
  {
    id: 'pterostilbene',
    name: 'Pterostilbene',
    category: 'longevity',
    description: 'A methylated form of resveratrol with 4x better bioavailability. Found in blueberries. Activates SIRT1 and has potent antioxidant and anti-inflammatory properties.',
    benefits: ['Sirtuin activation', 'Better than resveratrol absorption', 'Cognitive support', 'Blood sugar support'],
    dosage: { min: 50, max: 250, unit: 'mg', timing: 'Morning with fat' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 1, socialness: 0, learning: 3, study: 2 },
    interactions: ['blood-thinners', 'diabetes-medications'],
    warnings: ['May lower blood sugar', 'Can be combined with or used instead of resveratrol'],
    image: '/supplements/pterostilbene.jpg'
  },
  {
    id: 'ergothioneine',
    name: 'Ergothioneine',
    category: 'longevity',
    description: 'A unique amino acid antioxidant found in mushrooms that accumulates in mitochondria. The body has a dedicated transporter for it, suggesting biological importance.',
    benefits: ['Mitochondrial protection', 'Antioxidant', 'Cognitive longevity', 'Cellular defense'],
    dosage: { min: 5, max: 25, unit: 'mg', timing: 'Morning' },
    effects: { energy: 2, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 2, study: 1 },
    interactions: [],
    warnings: ['Relatively new as a supplement', 'Generally very safe'],
    image: '/supplements/ergothioneine.jpg'
  },
  {
    id: 'pyrroloquinoline-quinone',
    name: 'PQQ (Pyrroloquinoline Quinone)',
    category: 'longevity',
    description: 'Stimulates mitochondrial biogenesis — the creation of new mitochondria. One of the few compounds known to do this. Supports cognitive function and cellular energy.',
    benefits: ['New mitochondria creation', 'Cognitive function', 'Nerve growth factor', 'Heart health'],
    dosage: { min: 10, max: 20, unit: 'mg', timing: 'Morning' },
    effects: { energy: 4, mood: 3, balance: 3, creativity: 2, socialness: 1, learning: 4, study: 3 },
    interactions: [],
    warnings: ['Best taken with CoQ10 for synergistic effect', 'Generally very safe'],
    image: '/supplements/pqq-longevity.jpg'
  },
  {
    id: 'olive-oil-extract',
    name: 'Olive Leaf Extract (Oleuropein)',
    category: 'longevity',
    description: 'Contains oleuropein and hydroxytyrosol, powerful polyphenols that support cardiovascular health, immune function, and healthy aging. A Mediterranean diet cornerstone.',
    benefits: ['Cardiovascular health', 'Immune support', 'Anti-inflammatory', 'Blood pressure support'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['blood-pressure-medications', 'diabetes-medications'],
    warnings: ['May lower blood pressure and blood sugar', 'Choose standardized extract'],
    image: '/supplements/olive-leaf.jpg'
  },

  // === GUT HEALTH ===
  {
    id: 'butyrate',
    name: 'Butyrate (Tributyrin)',
    category: 'gut-health',
    description: 'A short-chain fatty acid that is the primary fuel for colon cells. Supports gut barrier integrity, reduces inflammation, and promotes a healthy microbiome.',
    benefits: ['Gut barrier repair', 'Anti-inflammatory', 'Microbiome support', 'Immune modulation'],
    dosage: { min: 300, max: 1000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 2, balance: 4, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: [],
    warnings: ['May cause digestive discomfort initially', 'Tributyrin form better tolerated than sodium butyrate'],
    image: '/supplements/butyrate.jpg'
  },
  {
    id: 'digestive-enzymes',
    name: 'Digestive Enzymes',
    category: 'gut-health',
    description: 'A blend of protease, lipase, amylase, and other enzymes that improve nutrient absorption and reduce bloating, gas, and digestive discomfort.',
    benefits: ['Nutrient absorption', 'Reduced bloating', 'Digestive comfort', 'Food tolerance'],
    dosage: { min: 1, max: 2, unit: 'capsules', timing: 'With meals' },
    effects: { energy: 2, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['blood-thinners'],
    warnings: ['Not a substitute for addressing root cause digestive issues', 'Bromelain may increase bleeding risk'],
    image: '/supplements/digestive-enzymes.jpg'
  },

  // === PERFORMANCE ===
  {
    id: 'hmb',
    name: 'HMB (Beta-Hydroxy Beta-Methylbutyrate)',
    category: 'performance',
    description: 'A metabolite of leucine that prevents muscle breakdown and supports lean muscle preservation. Particularly effective during caloric restriction or intense training.',
    benefits: ['Muscle preservation', 'Recovery', 'Lean body mass', 'Anti-catabolic'],
    dosage: { min: 1500, max: 3000, unit: 'mg', timing: 'Split doses with meals' },
    effects: { energy: 3, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['statins'],
    warnings: ['Generally very safe', 'Best during cutting phases or intense training'],
    image: '/supplements/hmb.jpg'
  },
  {
    id: 'whey-protein',
    name: 'Whey Protein',
    category: 'protein',
    description: 'A complete protein with all essential amino acids and high leucine content for maximal muscle protein synthesis. Also contains immunoglobulins for immune support.',
    benefits: ['Muscle growth', 'Recovery', 'Immune support', 'Satiety'],
    dosage: { min: 20, max: 40, unit: 'g', timing: 'Post-workout or between meals' },
    effects: { energy: 3, mood: 1, balance: 1, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: [],
    warnings: ['Avoid if lactose intolerant (use isolate)', 'Some people sensitive to dairy proteins'],
    image: '/supplements/whey.jpg'
  },
  {
    id: 'citrulline-malate',
    name: 'Citrulline Malate',
    category: 'performance',
    description: 'Citrulline bound to malic acid for enhanced nitric oxide production and ATP regeneration. The gold standard pre-workout for pumps, endurance, and recovery.',
    benefits: ['Nitric oxide', 'Exercise endurance', 'ATP regeneration', 'Reduced soreness'],
    dosage: { min: 6000, max: 8000, unit: 'mg', timing: '30-60 min before exercise' },
    effects: { energy: 6, mood: 2, balance: 1, creativity: 1, socialness: 1, learning: 0, study: 0 },
    interactions: ['blood-pressure-medications', 'pde5-inhibitors'],
    warnings: ['May lower blood pressure', 'Very safe at recommended doses'],
    image: '/supplements/citrulline-malate.jpg'
  },

  // === ADDITIONAL HERBAL & SPECIALTY ===
  {
    id: 'cbd',
    name: 'CBD (Cannabidiol)',
    category: 'adaptogen',
    description: 'A non-psychoactive compound from hemp that interacts with the endocannabinoid system. Supports anxiety reduction, sleep, pain management, and inflammation control.',
    benefits: ['Anxiety reduction', 'Sleep support', 'Pain management', 'Anti-inflammatory'],
    dosage: { min: 10, max: 50, unit: 'mg', timing: 'As needed or before bed' },
    effects: { energy: 0, mood: 5, balance: 6, creativity: 2, socialness: 2, learning: 1, study: 1 },
    interactions: ['blood-thinners', 'cyp450-substrates', 'sedatives'],
    warnings: ['May interact with many medications via CYP450', 'Legal status varies by location', 'Quality varies widely'],
    image: '/supplements/cbd.jpg'
  },
  {
    id: 'saffron-extract',
    name: 'Saffron Extract',
    category: 'nootropic',
    description: 'A spice extract with clinically proven antidepressant effects rivaling fluoxetine in studies. Supports mood, reduces PMS symptoms, and enhances libido.',
    benefits: ['Mood enhancement', 'Antidepressant', 'PMS relief', 'Libido support'],
    dosage: { min: 15, max: 30, unit: 'mg', timing: 'Morning or split doses' },
    effects: { energy: 1, mood: 7, balance: 4, creativity: 3, socialness: 3, learning: 2, study: 2 },
    interactions: ['ssris', 'blood-thinners'],
    warnings: ['Do not exceed 30mg daily', 'Standardized to safranal and crocin'],
    image: '/supplements/saffron.jpg'
  },
  {
    id: 'black-maca',
    name: 'Maca Root',
    category: 'adaptogen',
    description: 'A Peruvian root vegetable adaptogen that supports energy, libido, hormonal balance, and mood. Black maca is particularly studied for memory and learning.',
    benefits: ['Energy', 'Libido', 'Hormonal balance', 'Memory support'],
    dosage: { min: 1500, max: 3000, unit: 'mg', timing: 'Morning with food' },
    effects: { energy: 5, mood: 4, balance: 5, creativity: 2, socialness: 3, learning: 3, study: 2 },
    interactions: ['hormone-therapies'],
    warnings: ['May affect hormone levels', 'Gelatinized form better tolerated'],
    image: '/supplements/maca.jpg'
  },
  {
    id: 'lutein-zeaxanthin',
    name: 'Lutein & Zeaxanthin',
    category: 'antioxidant',
    description: 'Carotenoids that accumulate in the macula of the eye, filtering blue light and protecting against age-related macular degeneration. Essential for screen workers.',
    benefits: ['Eye protection', 'Blue light filtering', 'Macular health', 'Visual performance'],
    dosage: { min: 10, max: 20, unit: 'mg', timing: 'With fat-containing meals' },
    effects: { energy: 0, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: [],
    warnings: ['Very safe', 'Take with dietary fat for absorption'],
    image: '/supplements/lutein.jpg'
  },
  {
    id: 'saw-palmetto',
    name: 'Saw Palmetto',
    category: 'hormone',
    description: 'A palm berry extract that inhibits 5-alpha reductase, reducing DHT conversion. Widely used for prostate health and hair loss prevention in men.',
    benefits: ['Prostate health', 'DHT reduction', 'Hair loss prevention', 'Urinary function'],
    dosage: { min: 160, max: 320, unit: 'mg', timing: 'With meals' },
    effects: { energy: 0, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['blood-thinners', 'hormone-therapies', 'oral-contraceptives'],
    warnings: ['May affect hormone levels', 'Not for women of childbearing age'],
    image: '/supplements/saw-palmetto.jpg'
  },
  {
    id: 'elderberry',
    name: 'Elderberry (Sambucus nigra)',
    category: 'immune',
    description: 'A berry rich in anthocyanins and flavonoids that supports immune function. Clinically shown to reduce duration and severity of cold and flu symptoms.',
    benefits: ['Immune defense', 'Cold/flu recovery', 'Antioxidant', 'Anti-viral'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: 'Daily or at first sign of illness' },
    effects: { energy: 1, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['immunosuppressants', 'diabetes-medications'],
    warnings: ['Raw elderberries are toxic — use processed extract only', 'May stimulate immune system'],
    image: '/supplements/elderberry.jpg'
  },
  {
    id: 'milk-thistle',
    name: 'Milk Thistle (Silymarin)',
    category: 'longevity',
    description: 'The gold standard liver support supplement. Silymarin protects liver cells from toxins, supports regeneration, and has antioxidant and anti-inflammatory properties.',
    benefits: ['Liver protection', 'Liver regeneration', 'Antioxidant', 'Detoxification support'],
    dosage: { min: 200, max: 400, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['cyp450-substrates', 'diabetes-medications'],
    warnings: ['May interact with medications metabolized by the liver', 'Look for standardized 80% silymarin'],
    image: '/supplements/milk-thistle.jpg'
  },
  {
    id: 'omega-7',
    name: 'Omega-7 (Sea Buckthorn / Palmitoleic Acid)',
    category: 'fat',
    description: 'A lesser-known fatty acid that supports mucous membrane health, skin hydration, cardiovascular health, and metabolic function. Found in sea buckthorn and macadamia.',
    benefits: ['Skin hydration', 'Mucous membrane health', 'Cardiovascular support', 'Metabolic health'],
    dosage: { min: 200, max: 500, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['blood-thinners'],
    warnings: ['Generally very safe', 'Purified forms recommended to avoid palmitic acid'],
    image: '/supplements/omega-7.jpg'
  },
  {
    id: 'd-ribose',
    name: 'D-Ribose',
    category: 'energy',
    description: 'A simple sugar that is a direct building block for ATP, the body\'s energy currency. Particularly beneficial for heart health and chronic fatigue conditions.',
    benefits: ['ATP production', 'Heart energy', 'Exercise recovery', 'Chronic fatigue support'],
    dosage: { min: 2000, max: 5000, unit: 'mg', timing: 'Before and after exercise' },
    effects: { energy: 6, mood: 2, balance: 2, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: ['diabetes-medications', 'insulin'],
    warnings: ['May lower blood sugar', 'Use caution with diabetes'],
    image: '/supplements/d-ribose.jpg'
  },
  {
    id: 'agmatine',
    name: 'Agmatine Sulfate',
    category: 'nootropic',
    description: 'A metabolite of arginine that modulates NMDA receptors, nitric oxide, and multiple neurotransmitter systems. Supports mood, pain modulation, and neuroprotection.',
    benefits: ['Mood support', 'Pain modulation', 'Nitric oxide', 'Neuroprotection'],
    dosage: { min: 250, max: 1000, unit: 'mg', timing: 'Morning or pre-workout' },
    effects: { energy: 3, mood: 4, balance: 3, creativity: 2, socialness: 2, learning: 3, study: 2 },
    interactions: ['blood-pressure-medications'],
    warnings: ['May lower blood pressure', 'Avoid with protein meals for best absorption'],
    image: '/supplements/agmatine.jpg'
  },
  {
    id: 'palmitoylethanolamide',
    name: 'PEA (Palmitoylethanolamide)',
    category: 'anti-inflammatory',
    description: 'An endogenous fatty acid amide that modulates the endocannabinoid system. Provides pain relief, reduces inflammation, and supports neuroprotection without psychoactive effects.',
    benefits: ['Pain relief', 'Anti-inflammatory', 'Neuroprotection', 'Immune modulation'],
    dosage: { min: 300, max: 600, unit: 'mg', timing: 'Twice daily with meals' },
    effects: { energy: 1, mood: 3, balance: 4, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: [],
    warnings: ['Very safe profile', 'Micronized form better absorbed'],
    image: '/supplements/pea.jpg'
  },
  {
    id: 'l-carnosine',
    name: 'L-Carnosine',
    category: 'longevity',
    description: 'A dipeptide of beta-alanine and histidine that acts as an anti-glycation agent, protecting proteins from damage by sugar. Supports cellular longevity and skin health.',
    benefits: ['Anti-glycation', 'Cellular longevity', 'Skin health', 'Antioxidant'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: 'On empty stomach' },
    effects: { energy: 2, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: [],
    warnings: ['Take on empty stomach for best absorption', 'Generally very safe'],
    image: '/supplements/carnosine.jpg'
  },
  {
    id: 'manganese',
    name: 'Manganese',
    category: 'mineral',
    description: 'A trace mineral essential for bone formation, blood clotting, metabolism, and antioxidant defense via superoxide dismutase (SOD).',
    benefits: ['Bone health', 'Antioxidant defense', 'Metabolism', 'Blood sugar support'],
    dosage: { min: 1, max: 5, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['antibiotics', 'antacids'],
    warnings: ['Toxic at high doses', 'Most people get enough from diet', 'Do not exceed 11mg daily'],
    image: '/supplements/manganese.jpg'
  },
  {
    id: 'thorne-methyl-guard',
    name: 'Methylated B Vitamins (B12 + Folate)',
    category: 'vitamin',
    description: 'Combination of methylcobalamin (B12) and methylfolate for optimal methylation support. Bypasses MTHFR mutations that affect up to 40% of the population.',
    benefits: ['Methylation', 'Energy production', 'Mood support', 'Homocysteine management'],
    dosage: { min: 1000, max: 5000, unit: 'mcg', timing: 'Morning (B12 + folate)' },
    effects: { energy: 4, mood: 4, balance: 3, creativity: 1, socialness: 1, learning: 3, study: 3 },
    interactions: ['methotrexate'],
    warnings: ['Use methylated forms, not cyanocobalamin or folic acid', 'May cause anxiety in some COMT variants'],
    image: '/supplements/methylated-b.jpg'
  },

  // === BATCH 2: Additional Research ===
// === ADDITIONAL MUSHROOMS ===
  {
    id: 'shiitake',
    name: 'Shiitake Mushroom (Lentinula edodes)',
    category: 'immune',
    description: 'A culinary and medicinal mushroom rich in lentinan and eritadenine. Supports cardiovascular health, cholesterol management, and immune function.',
    benefits: ['Cholesterol management', 'Immune support', 'Cardiovascular health', 'Antiviral'],
    dosage: { min: 500, max: 1500, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['blood-thinners'],
    warnings: ['Raw shiitake can cause flagellate dermatitis — use extract', 'Generally very safe'],
    image: '/supplements/shiitake.jpg'
  },

  // === AMINO ACIDS (from Ferriss, Attia, category sweep) ===
  {
    id: 'l-ornithine',
    name: 'L-Ornithine',
    category: 'amino-acid',
    description: 'An amino acid that reduces ammonia levels in the blood, improving sleep quality, reducing fatigue, and supporting the urea cycle during intense exercise.',
    benefits: ['Ammonia detox', 'Sleep quality', 'Exercise recovery', 'Growth hormone support'],
    dosage: { min: 1000, max: 3000, unit: 'mg', timing: 'Before bed or post-workout' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: [],
    warnings: ['May cause GI distress at high doses', 'Generally very safe'],
    image: '/supplements/ornithine.jpg'
  },
  {
    id: 'bcaas',
    name: 'BCAAs (Branched-Chain Amino Acids)',
    category: 'performance',
    description: 'Leucine, isoleucine, and valine — the three essential amino acids that directly stimulate muscle protein synthesis and reduce exercise-induced fatigue.',
    benefits: ['Muscle recovery', 'Protein synthesis', 'Fatigue reduction', 'Muscle preservation'],
    dosage: { min: 5000, max: 10000, unit: 'mg', timing: 'During or after exercise' },
    effects: { energy: 3, mood: 1, balance: 1, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: [],
    warnings: ['Unnecessary if eating sufficient protein', 'May spike insulin'],
    image: '/supplements/bcaas.jpg'
  },
  {
    id: 'sam-e',
    name: 'SAM-e (S-Adenosylmethionine)',
    category: 'nootropic',
    description: 'A major methyl donor that supports mood, joint health, and liver function. Clinically studied for depression with results comparable to tricyclic antidepressants.',
    benefits: ['Mood support', 'Joint health', 'Liver support', 'Methylation'],
    dosage: { min: 200, max: 800, unit: 'mg', timing: 'Morning, empty stomach' },
    effects: { energy: 3, mood: 7, balance: 3, creativity: 2, socialness: 2, learning: 2, study: 2 },
    interactions: ['ssris', 'maois', 'levodopa', 'triptans'],
    warnings: ['May trigger mania in bipolar disorder', 'Do not combine with antidepressants', 'Enteric-coated form preferred'],
    image: '/supplements/sam-e.jpg'
  },
  {
    id: 'phenylalanine',
    name: 'DL-Phenylalanine (DLPA)',
    category: 'amino-acid',
    description: 'An essential amino acid and precursor to dopamine, norepinephrine, and endorphins. The DL form combines mood-boosting and pain-modulating properties.',
    benefits: ['Dopamine precursor', 'Pain modulation', 'Mood enhancement', 'Focus'],
    dosage: { min: 500, max: 1500, unit: 'mg', timing: 'Morning, empty stomach' },
    effects: { energy: 4, mood: 5, balance: 2, creativity: 3, socialness: 3, learning: 3, study: 3 },
    interactions: ['maois', 'levodopa', 'antipsychotics'],
    warnings: ['Avoid if you have PKU', 'May raise blood pressure', 'Do not combine with MAOIs'],
    image: '/supplements/phenylalanine.jpg'
  },

  // === LONGEVITY (from Patrick, Johnson, Attia) ===
  {
    id: 'urolithin-a',
    name: 'Urolithin A',
    category: 'longevity',
    description: 'A postbiotic compound that stimulates mitophagy — the selective removal of damaged mitochondria. Shown to improve muscle endurance and cellular energy in clinical trials.',
    benefits: ['Mitophagy activation', 'Mitochondrial renewal', 'Muscle endurance', 'Cellular energy'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: 'Morning' },
    effects: { energy: 4, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 2, study: 1 },
    interactions: [],
    warnings: ['Relatively new supplement', 'Generally well tolerated in clinical trials'],
    image: '/supplements/urolithin-a.jpg'
  },
  {
    id: 'calcium-akg',
    name: 'Calcium Alpha-Ketoglutarate (Ca-AKG)',
    category: 'longevity',
    description: 'A Krebs cycle metabolite shown to extend lifespan in animal models by 12%. May reduce biological age markers and support healthy aging. Bryan Johnson protocol staple.',
    benefits: ['Biological age reduction', 'Cellular energy', 'Bone health', 'Healthy aging'],
    dosage: { min: 1000, max: 1500, unit: 'mg', timing: 'Morning, empty stomach' },
    effects: { energy: 3, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: [],
    warnings: ['May affect stomach acid', 'Take on empty stomach for best results'],
    image: '/supplements/calcium-akg.jpg'
  },
  {
    id: 'epigallocatechin-gallate',
    name: 'EGCG (Epigallocatechin Gallate)',
    category: 'longevity',
    description: 'The most potent catechin from green tea with powerful antioxidant, anti-inflammatory, and autophagy-promoting effects. Supports metabolism and cancer prevention.',
    benefits: ['Autophagy', 'Fat oxidation', 'Antioxidant', 'Cancer prevention'],
    dosage: { min: 400, max: 800, unit: 'mg', timing: 'Between meals' },
    effects: { energy: 3, mood: 2, balance: 3, creativity: 1, socialness: 0, learning: 2, study: 2 },
    interactions: ['blood-thinners', 'beta-blockers', 'iron-supplements'],
    warnings: ['High doses may cause liver issues', 'Take with food to reduce liver risk', 'May reduce iron absorption'],
    image: '/supplements/egcg.jpg'
  },
  {
    id: 'epicatechin',
    name: 'Epicatechin',
    category: 'performance',
    description: 'A cacao flavanol that increases follistatin (which inhibits myostatin), potentially supporting natural muscle growth and improving blood flow.',
    benefits: ['Muscle growth support', 'Blood flow', 'Antioxidant', 'Insulin sensitivity'],
    dosage: { min: 100, max: 200, unit: 'mg', timing: 'With meals' },
    effects: { energy: 3, mood: 2, balance: 2, creativity: 1, socialness: 0, learning: 1, study: 1 },
    interactions: [],
    warnings: ['Generally safe', 'Derived from dark chocolate'],
    image: '/supplements/epicatechin.jpg'
  },

  // === ADAPTOGENS (from sweep) ===
  {
    id: 'shatavari',
    name: 'Shatavari (Asparagus racemosus)',
    category: 'adaptogen',
    description: 'An Ayurvedic adaptogen traditionally used as a female reproductive tonic. Supports hormonal balance, fertility, lactation, and immune function.',
    benefits: ['Hormonal balance', 'Fertility support', 'Immune modulation', 'Digestive health'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: 'Morning and evening' },
    effects: { energy: 2, mood: 4, balance: 6, creativity: 1, socialness: 2, learning: 1, study: 1 },
    interactions: ['diuretics', 'diabetes-medications'],
    warnings: ['May affect estrogen-sensitive conditions', 'Consult doctor if pregnant'],
    image: '/supplements/shatavari.jpg'
  },
  {
    id: 'magnolia-bark',
    name: 'Magnolia Bark Extract',
    category: 'sleep',
    description: 'Contains honokiol and magnolol — compounds that reduce cortisol, promote relaxation, and support deep sleep. Used in traditional Chinese medicine for centuries.',
    benefits: ['Cortisol reduction', 'Sleep support', 'Anxiety relief', 'Anti-inflammatory'],
    dosage: { min: 200, max: 400, unit: 'mg', timing: 'Before bed' },
    effects: { energy: -1, mood: 4, balance: 6, creativity: 1, socialness: 1, learning: 1, study: 0 },
    interactions: ['sedatives', 'blood-thinners'],
    warnings: ['May cause drowsiness', 'Do not combine with alcohol'],
    image: '/supplements/magnolia-bark.jpg'
  },
  {
    id: 'cistanche',
    name: 'Cistanche (Rou Cong Rong)',
    category: 'adaptogen',
    description: 'Called the "ginseng of the desert" in Traditional Chinese Medicine. Supports energy, libido, immune function, and neuroprotection. Used for anti-aging.',
    benefits: ['Energy', 'Libido', 'Neuroprotection', 'Anti-aging'],
    dosage: { min: 100, max: 300, unit: 'mg', timing: 'Morning' },
    effects: { energy: 4, mood: 3, balance: 4, creativity: 1, socialness: 2, learning: 2, study: 2 },
    interactions: [],
    warnings: ['Limited Western research', 'Generally well tolerated'],
    image: '/supplements/cistanche.jpg'
  },

  // === HERBALS (from sweep) ===
  {
    id: 'st-johns-wort',
    name: "St. John's Wort (Hypericum perforatum)",
    category: 'nootropic',
    description: 'One of the most studied herbal antidepressants. Modulates serotonin, dopamine, and norepinephrine. Comparable to SSRIs for mild-to-moderate depression in clinical trials.',
    benefits: ['Antidepressant', 'Mood support', 'Anxiety reduction', 'Nerve pain'],
    dosage: { min: 300, max: 900, unit: 'mg', timing: 'Split into 3 doses daily' },
    effects: { energy: 1, mood: 7, balance: 4, creativity: 2, socialness: 3, learning: 1, study: 1 },
    interactions: ['ssris', 'maois', 'birth-control', 'blood-thinners', 'hiv-medications', 'cyclosporine', 'many-other-drugs'],
    warnings: ['MAJOR drug interactions — reduces effectiveness of many medications', 'Causes photosensitivity', 'Do NOT combine with antidepressants', 'Consult pharmacist before use'],
    image: '/supplements/st-johns-wort.jpg'
  },
  {
    id: 'kava',
    name: 'Kava (Piper methysticum)',
    category: 'nootropic',
    description: 'A powerful anxiolytic herb from the Pacific Islands that works through GABA modulation. Reduces anxiety without cognitive impairment — unlike benzodiazepines.',
    benefits: ['Anxiety reduction', 'Muscle relaxation', 'Calm focus', 'Social ease'],
    dosage: { min: 120, max: 250, unit: 'mg kavalactones', timing: 'As needed or evening' },
    effects: { energy: 0, mood: 5, balance: 6, creativity: 2, socialness: 6, learning: 1, study: 1 },
    interactions: ['alcohol', 'benzodiazepines', 'hepatotoxic-drugs', 'levodopa'],
    warnings: ['Linked to liver damage in some cases', 'Banned in some countries', 'Never combine with alcohol', 'Use noble kava varieties only'],
    image: '/supplements/kava.jpg'
  },
  {
    id: 'chamomile-extract',
    name: 'Chamomile Extract',
    category: 'sleep',
    description: 'Rich in apigenin, chamomile extract promotes relaxation and sleep quality. Clinically shown to reduce generalized anxiety disorder symptoms.',
    benefits: ['Sleep quality', 'Anxiety reduction', 'Digestive comfort', 'Anti-inflammatory'],
    dosage: { min: 300, max: 600, unit: 'mg', timing: 'Before bed' },
    effects: { energy: -1, mood: 4, balance: 5, creativity: 1, socialness: 1, learning: 0, study: 0 },
    interactions: ['blood-thinners', 'sedatives'],
    warnings: ['Allergic reactions possible if sensitive to ragweed', 'Generally very safe'],
    image: '/supplements/chamomile.jpg'
  },
  {
    id: 'lavender-oil',
    name: 'Lavender Oil (Silexan)',
    category: 'sleep',
    description: 'Standardized lavender oil capsules (Silexan) are clinically proven to reduce anxiety comparable to lorazepam, without sedation or dependency risk.',
    benefits: ['Anxiety reduction', 'Sleep quality', 'Calm without sedation', 'Stress relief'],
    dosage: { min: 80, max: 160, unit: 'mg', timing: 'Morning or before bed' },
    effects: { energy: 0, mood: 5, balance: 6, creativity: 1, socialness: 2, learning: 1, study: 1 },
    interactions: [],
    warnings: ['May cause GI upset', 'Non-sedating — safe during the day', 'Use capsule form, not topical'],
    image: '/supplements/lavender.jpg'
  },
  {
    id: 'sage-extract',
    name: 'Sage Extract (Salvia officinalis)',
    category: 'nootropic',
    description: 'An acetylcholinesterase inhibitor that supports memory and cognitive performance. Clinically studied in both young adults and elderly populations.',
    benefits: ['Memory enhancement', 'Cognitive performance', 'Antioxidant', 'Menopause support'],
    dosage: { min: 300, max: 600, unit: 'mg', timing: 'Morning' },
    effects: { energy: 1, mood: 2, balance: 3, creativity: 2, socialness: 1, learning: 5, study: 5 },
    interactions: ['diabetes-medications', 'anticonvulsants'],
    warnings: ['Contains thujone — avoid very high doses long-term', 'May lower blood sugar'],
    image: '/supplements/sage.jpg'
  },
  {
    id: 'oregano-oil',
    name: 'Oil of Oregano',
    category: 'immune',
    description: 'A potent antimicrobial herb containing carvacrol and thymol. Used for gut pathogen control, immune support, and respiratory infections. Ben Greenfield staple.',
    benefits: ['Antimicrobial', 'Gut pathogen control', 'Immune support', 'Respiratory health'],
    dosage: { min: 150, max: 300, unit: 'mg', timing: 'With meals, short-term use' },
    effects: { energy: 1, mood: 0, balance: 2, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['blood-thinners', 'diabetes-medications', 'iron-supplements'],
    warnings: ['Use short-term only (2-4 weeks)', 'May disrupt gut flora with prolonged use', 'Very potent — dilute properly'],
    image: '/supplements/oregano-oil.jpg'
  },
  {
    id: 'moringa',
    name: 'Moringa Leaf',
    category: 'superfood',
    description: 'One of the most nutrient-dense plants on earth, containing all essential amino acids, iron, calcium, and potent antioxidants. Supports energy, inflammation, and blood sugar.',
    benefits: ['Nutrient density', 'Anti-inflammatory', 'Blood sugar support', 'Antioxidant'],
    dosage: { min: 500, max: 2000, unit: 'mg', timing: 'Morning with food' },
    effects: { energy: 3, mood: 2, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: ['thyroid-medications', 'diabetes-medications', 'blood-pressure-medications'],
    warnings: ['May affect thyroid', 'Laxative at high doses', 'Avoid roots/bark (toxic)'],
    image: '/supplements/moringa.jpg'
  },
  {
    id: 'olive-leaf-extract',
    name: 'Olive Leaf Extract',
    category: 'longevity',
    description: 'Contains oleuropein and hydroxytyrosol — powerful polyphenols from the Mediterranean diet. Supports cardiovascular health, blood pressure, and immune function.',
    benefits: ['Cardiovascular health', 'Blood pressure support', 'Immune function', 'Anti-inflammatory'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['blood-pressure-medications', 'diabetes-medications'],
    warnings: ['May lower blood pressure and blood sugar', 'Choose standardized oleuropein extract'],
    image: '/supplements/olive-leaf.jpg'
  },

  // === HORMONAL (from sweep) ===
  {
    id: 'fenugreek',
    name: 'Fenugreek Extract',
    category: 'hormone',
    description: 'Contains furostanolic saponins that support testosterone levels, libido, and blood sugar regulation. Also used for lactation support.',
    benefits: ['Testosterone support', 'Libido', 'Blood sugar regulation', 'Lactation support'],
    dosage: { min: 500, max: 600, unit: 'mg', timing: 'With meals' },
    effects: { energy: 3, mood: 3, balance: 3, creativity: 1, socialness: 2, learning: 1, study: 1 },
    interactions: ['blood-thinners', 'diabetes-medications'],
    warnings: ['May cause maple syrup-smelling sweat/urine', 'May lower blood sugar'],
    image: '/supplements/fenugreek.jpg'
  },
  {
    id: 'stinging-nettle',
    name: 'Stinging Nettle Root',
    category: 'hormone',
    description: 'Binds to sex hormone-binding globulin (SHBG) to potentially increase free testosterone. Also supports prostate health and has anti-inflammatory properties.',
    benefits: ['Free testosterone', 'Prostate health', 'Anti-inflammatory', 'Allergy relief'],
    dosage: { min: 300, max: 600, unit: 'mg', timing: 'With meals' },
    effects: { energy: 2, mood: 2, balance: 3, creativity: 0, socialness: 1, learning: 1, study: 0 },
    interactions: ['blood-thinners', 'diabetes-medications', 'diuretics'],
    warnings: ['Has diuretic effect', 'May lower blood pressure'],
    image: '/supplements/stinging-nettle.jpg'
  },
  {
    id: 'turkesterone',
    name: 'Turkesterone',
    category: 'performance',
    description: 'A plant ecdysteroid from Ajuga turkestanica marketed for muscle growth and performance. Activates estrogen receptor beta without androgenic side effects.',
    benefits: ['Muscle growth', 'Performance', 'Recovery', 'No hormonal side effects'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: 'With meals, split doses' },
    effects: { energy: 4, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: [],
    warnings: ['Limited human research', 'Quality/purity concerns common', 'Expensive'],
    image: '/supplements/turkesterone.jpg'
  },

  // === GUT HEALTH (from Johnson, sweep) ===
  {
    id: 'colostrum',
    name: 'Colostrum (Bovine)',
    category: 'gut-health',
    description: 'First-milk bioactive compound rich in immunoglobulins, lactoferrin, and growth factors. Repairs gut lining, supports immune function, and may improve athletic performance.',
    benefits: ['Gut lining repair', 'Immune support', 'Growth factors', 'Athletic performance'],
    dosage: { min: 1000, max: 5000, unit: 'mg', timing: 'Morning, empty stomach' },
    effects: { energy: 2, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: [],
    warnings: ['Dairy-derived — avoid with dairy allergy', 'Quality varies significantly by brand'],
    image: '/supplements/colostrum.jpg'
  },
  {
    id: 'saccharomyces-boulardii',
    name: 'Saccharomyces Boulardii',
    category: 'gut-health',
    description: 'A beneficial yeast probiotic that prevents and treats diarrhea, supports gut immunity, and is uniquely safe to take during antibiotic treatment.',
    benefits: ['Diarrhea prevention', 'Gut immunity', 'Antibiotic companion', 'Traveler\'s diarrhea'],
    dosage: { min: 250, max: 500, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['antifungals'],
    warnings: ['Safe during antibiotic use', 'Avoid if severely immunocompromised'],
    image: '/supplements/saccharomyces.jpg'
  },
  {
    id: 'slippery-elm',
    name: 'Slippery Elm',
    category: 'gut-health',
    description: 'A mucilaginous herb that coats and soothes the digestive tract lining, reducing irritation from acid reflux, IBS, and inflammatory bowel conditions.',
    benefits: ['Gut lining protection', 'Acid reflux relief', 'IBS support', 'Digestive comfort'],
    dosage: { min: 400, max: 800, unit: 'mg', timing: 'Before meals' },
    effects: { energy: 0, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['all-oral-medications'],
    warnings: ['May slow absorption of other medications — take 2 hours apart', 'Generally very safe'],
    image: '/supplements/slippery-elm.jpg'
  },

  // === SPECIALTY & PERFORMANCE ===
  {
    id: 'magnesium-threonate',
    name: 'Magnesium L-Threonate',
    category: 'nootropic',
    description: 'The only form of magnesium proven to cross the blood-brain barrier. Enhances synaptic plasticity, sleep quality, and cognitive function. Peter Attia and Huberman recommend.',
    benefits: ['Brain magnesium', 'Sleep quality', 'Synaptic plasticity', 'Cognitive function'],
    dosage: { min: 1000, max: 2000, unit: 'mg', timing: 'Before bed (provides ~144mg elemental Mg)' },
    effects: { energy: 0, mood: 4, balance: 5, creativity: 2, socialness: 1, learning: 5, study: 4 },
    interactions: ['antibiotics', 'bisphosphonates', 'diuretics'],
    warnings: ['Different from other magnesium forms — specifically for brain', 'May cause drowsiness'],
    image: '/supplements/mag-threonate.jpg'
  },
  {
    id: 'bpc-157',
    name: 'BPC-157',
    category: 'performance',
    description: 'A synthetic peptide derived from gastric juice that accelerates healing of tendons, ligaments, gut lining, and muscles. Popular in biohacking for injury recovery.',
    benefits: ['Tendon healing', 'Gut repair', 'Muscle recovery', 'Neuroprotection'],
    dosage: { min: 250, max: 500, unit: 'mcg', timing: 'Twice daily (oral or injection)' },
    effects: { energy: 1, mood: 2, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: [],
    warnings: ['Not FDA approved', 'Recently included in FDA peptide ban category', 'Limited human trials', 'Oral capsule form available'],
    image: '/supplements/bpc-157.jpg'
  },
  {
    id: 'methylene-blue',
    name: 'Methylene Blue',
    category: 'nootropic',
    description: 'An electron carrier that enhances mitochondrial electron transport chain efficiency, boosting ATP production in brain cells. Used at very low doses for cognitive enhancement.',
    benefits: ['Mitochondrial function', 'Cognitive enhancement', 'Neuroprotection', 'Memory support'],
    dosage: { min: 500, max: 2000, unit: 'mcg', timing: 'Morning (very low dose)' },
    effects: { energy: 4, mood: 3, balance: 2, creativity: 3, socialness: 1, learning: 5, study: 5 },
    interactions: ['ssris', 'maois', 'serotonergic-drugs'],
    warnings: ['USP pharmaceutical grade ONLY', 'Stains skin and urine blue', 'NEVER combine with SSRIs (serotonin syndrome)', 'Very low doses only'],
    image: '/supplements/methylene-blue.jpg'
  },
  {
    id: 'dmae',
    name: 'DMAE (Dimethylaminoethanol)',
    category: 'nootropic',
    description: 'A choline-related compound that supports acetylcholine production, may reduce age spots (lipofuscin), and enhances mental clarity and focus.',
    benefits: ['Acetylcholine support', 'Mental clarity', 'Skin health', 'Focus'],
    dosage: { min: 100, max: 300, unit: 'mg', timing: 'Morning' },
    effects: { energy: 3, mood: 2, balance: 2, creativity: 3, socialness: 2, learning: 4, study: 4 },
    interactions: ['acetylcholinesterase-inhibitors'],
    warnings: ['Avoid during pregnancy', 'May worsen bipolar or seizure disorders'],
    image: '/supplements/dmae.jpg'
  },
  {
    id: 'oat-straw',
    name: 'Oat Straw Extract (Avena Sativa)',
    category: 'nootropic',
    description: 'Increases alpha brain waves associated with calm alertness and supports cerebral blood flow. Traditionally used for cognitive vitality and stress resilience.',
    benefits: ['Alpha brain waves', 'Calm focus', 'Cerebral blood flow', 'Stress resilience'],
    dosage: { min: 800, max: 1600, unit: 'mg', timing: 'Morning' },
    effects: { energy: 2, mood: 3, balance: 4, creativity: 3, socialness: 2, learning: 3, study: 3 },
    interactions: [],
    warnings: ['Very safe', 'May contain gluten — not safe for celiac disease'],
    image: '/supplements/oat-straw.jpg'
  },
  {
    id: 'piperine',
    name: 'Piperine (BioPerine)',
    category: 'metabolic',
    description: 'Black pepper extract that increases the bioavailability of curcumin by 2000%, CoQ10 by 30%, and many other supplements. A crucial absorption enhancer.',
    benefits: ['Absorption enhancement', 'Curcumin synergy', 'Metabolism support', 'Anti-inflammatory'],
    dosage: { min: 5, max: 20, unit: 'mg', timing: 'With curcumin or other supplements' },
    effects: { energy: 1, mood: 0, balance: 1, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['many-medications'],
    warnings: ['May increase absorption of prescription drugs — consult pharmacist', 'Generally safe at recommended doses'],
    image: '/supplements/piperine.jpg'
  },
  {
    id: 'beetroot-extract',
    name: 'Beetroot Extract',
    category: 'performance',
    description: 'A natural nitrate source that the body converts to nitric oxide, improving blood flow, endurance, and blood pressure. Clinically proven to enhance exercise performance.',
    benefits: ['Nitric oxide', 'Exercise endurance', 'Blood pressure support', 'Blood flow'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: '60-90 min before exercise' },
    effects: { energy: 5, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['pde5-inhibitors', 'blood-pressure-medications'],
    warnings: ['May cause red urine/stool (harmless)', 'Avoid mouthwash — it kills oral bacteria needed for nitrate conversion'],
    image: '/supplements/beetroot.jpg'
  },
  {
    id: 'tart-cherry',
    name: 'Tart Cherry Extract',
    category: 'performance',
    description: 'Reduces exercise-induced inflammation and muscle soreness through anthocyanin antioxidants. Also contains natural melatonin for sleep support.',
    benefits: ['Muscle recovery', 'Anti-inflammatory', 'Sleep support', 'Antioxidant'],
    dosage: { min: 500, max: 1000, unit: 'mg', timing: 'Post-workout or before bed' },
    effects: { energy: 1, mood: 2, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 0 },
    interactions: ['blood-thinners'],
    warnings: ['May interact with blood thinners', 'High in oxalates'],
    image: '/supplements/tart-cherry.jpg'
  },
  {
    id: 'msm',
    name: 'MSM (Methylsulfonylmethane)',
    category: 'performance',
    description: 'An organic sulfur compound that reduces joint inflammation, supports connective tissue repair, and provides the sulfur needed for glutathione production.',
    benefits: ['Joint health', 'Anti-inflammatory', 'Connective tissue', 'Glutathione support'],
    dosage: { min: 1000, max: 3000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['blood-thinners'],
    warnings: ['Generally very safe', 'May cause mild GI discomfort initially'],
    image: '/supplements/msm.jpg'
  },
  {
    id: 'paraxanthine',
    name: 'Paraxanthine',
    category: 'energy',
    description: 'The primary active metabolite of caffeine, providing clean energy, focus, and alertness without the jitters, anxiety, or crash often associated with caffeine.',
    benefits: ['Clean energy', 'Focus', 'No jitters', 'No crash'],
    dosage: { min: 100, max: 300, unit: 'mg', timing: 'Morning' },
    effects: { energy: 7, mood: 3, balance: 3, creativity: 3, socialness: 3, learning: 4, study: 5 },
    interactions: ['other-stimulants'],
    warnings: ['Newer to market — less research than caffeine', 'Appears to have better safety profile'],
    image: '/supplements/paraxanthine.jpg'
  },
  {
    id: 'nicotine-gum',
    name: 'Nicotine (Low-dose, Non-tobacco)',
    category: 'stimulant',
    description: 'A potent cognitive enhancer that improves focus, attention, and working memory at very low doses. Used by some biohackers via gum or patches separate from tobacco.',
    benefits: ['Acute focus', 'Working memory', 'Attention enhancement', 'Neuroprotection research'],
    dosage: { min: 1, max: 2, unit: 'mg', timing: 'As needed (gum or patch)' },
    effects: { energy: 5, mood: 3, balance: 0, creativity: 3, socialness: 2, learning: 5, study: 6 },
    interactions: ['other-stimulants', 'blood-pressure-medications'],
    warnings: ['HIGHLY ADDICTIVE — use with extreme caution', 'Never use if you use tobacco products', 'Cardiovascular risks', 'Not recommended for regular use'],
    image: '/supplements/nicotine.jpg'
  },

  // === ADDITIONAL VITAMINS/MINERALS ===
  {
    id: 'vitamin-b6-p5p',
    name: 'Vitamin B6 (P-5-P)',
    category: 'vitamin',
    description: 'The active, coenzyme form of vitamin B6 (pyridoxal-5-phosphate). Directly supports neurotransmitter synthesis including serotonin, dopamine, and GABA.',
    benefits: ['Neurotransmitter synthesis', 'Mood support', 'Homocysteine reduction', 'PMS relief'],
    dosage: { min: 25, max: 100, unit: 'mg', timing: 'Morning' },
    effects: { energy: 2, mood: 4, balance: 3, creativity: 1, socialness: 1, learning: 2, study: 2 },
    interactions: ['levodopa', 'phenytoin'],
    warnings: ['Nerve damage (neuropathy) possible above 200mg/day long-term', 'P-5-P form is pre-activated'],
    image: '/supplements/vitamin-b6.jpg'
  },
  {
    id: 'niacin',
    name: 'Niacin (Vitamin B3)',
    category: 'vitamin',
    description: 'Supports NAD+ production, cardiovascular health, and cholesterol management. The flush form (nicotinic acid) also dilates blood vessels and supports skin health.',
    benefits: ['NAD+ production', 'Cholesterol management', 'Cardiovascular health', 'Skin health'],
    dosage: { min: 500, max: 2000, unit: 'mg', timing: 'With meals' },
    effects: { energy: 3, mood: 2, balance: 2, creativity: 1, socialness: 0, learning: 2, study: 1 },
    interactions: ['statins', 'blood-thinners', 'diabetes-medications'],
    warnings: ['Causes harmless but uncomfortable skin flushing', 'Monitor liver enzymes at high doses', 'Start low and increase gradually'],
    image: '/supplements/niacin.jpg'
  },
  {
    id: 'iron-bisglycinate',
    name: 'Iron Bisglycinate',
    category: 'mineral',
    description: 'A highly bioavailable, gentle form of iron that supports oxygen transport, energy production, and cognitive function without the GI issues of other iron forms.',
    benefits: ['Oxygen transport', 'Energy production', 'Cognitive function', 'Red blood cell formation'],
    dosage: { min: 18, max: 30, unit: 'mg', timing: 'With vitamin C, away from calcium' },
    effects: { energy: 4, mood: 2, balance: 2, creativity: 0, socialness: 0, learning: 2, study: 2 },
    interactions: ['antibiotics', 'thyroid-medications', 'calcium', 'antacids'],
    warnings: ['Only supplement if deficient — excess iron is toxic', 'Get ferritin tested first', 'Take with vitamin C for absorption'],
    image: '/supplements/iron.jpg'
  },
  {
    id: 'calcium',
    name: 'Calcium (Citrate)',
    category: 'mineral',
    description: 'Essential mineral for bone density, muscle contraction, nerve signaling, and blood clotting. Citrate form is well-absorbed and less likely to cause constipation.',
    benefits: ['Bone density', 'Muscle function', 'Nerve signaling', 'Blood clotting'],
    dosage: { min: 500, max: 1200, unit: 'mg', timing: 'Split doses with meals' },
    effects: { energy: 1, mood: 1, balance: 2, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['thyroid-medications', 'antibiotics', 'bisphosphonates'],
    warnings: ['Take with vitamin D and K2 for proper utilization', 'Excess may increase cardiovascular risk', 'Separate from iron by 2 hours'],
    image: '/supplements/calcium.jpg'
  },
  {
    id: 'pantothenic-acid',
    name: 'Pantothenic Acid (Vitamin B5)',
    category: 'vitamin',
    description: 'Precursor to Coenzyme A, which is essential for energy metabolism, adrenal function, and fatty acid synthesis. Supports stress response and skin health.',
    benefits: ['Energy metabolism', 'Adrenal support', 'Skin health', 'Stress response'],
    dosage: { min: 100, max: 500, unit: 'mg', timing: 'With meals' },
    effects: { energy: 3, mood: 2, balance: 3, creativity: 0, socialness: 0, learning: 1, study: 1 },
    interactions: [],
    warnings: ['Very safe — water-soluble and excreted if excess', 'High doses may cause diarrhea'],
    image: '/supplements/b5.jpg'
  },
  {
    id: 'serrapeptase',
    name: 'Serrapeptase',
    category: 'anti-inflammatory',
    description: 'A proteolytic enzyme originally from silkworms that breaks down non-living tissue, reduces inflammation, and thins mucus. Used for sinusitis, pain, and swelling.',
    benefits: ['Anti-inflammatory', 'Mucus thinning', 'Pain reduction', 'Sinus support'],
    dosage: { min: 60000, max: 120000, unit: 'SPU', timing: 'Empty stomach' },
    effects: { energy: 1, mood: 1, balance: 3, creativity: 0, socialness: 0, learning: 0, study: 0 },
    interactions: ['blood-thinners', 'nsaids'],
    warnings: ['Must take on empty stomach', 'Avoid with blood thinners', 'Enteric-coated form required'],
    image: '/supplements/serrapeptase.jpg'
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



