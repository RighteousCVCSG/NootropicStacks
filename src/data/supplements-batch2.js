// Batch 2: Additional supplements from Greenfield, Patrick, Ferriss, Attia, Johnson, and category sweep

export const batch2Supplements = [
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
