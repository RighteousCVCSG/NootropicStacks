// Pairwise supplement interaction data for Stack Score system
// Types: synergistic (+3), complementary (+1), redundant (-2), conflicting (-4)

export const INTERACTION_TYPES = {
  SYNERGISTIC: { key: 'synergistic', symbol: '+', score: 3, label: 'Synergistic' },
  COMPLEMENTARY: { key: 'complementary', symbol: '~', score: 1, label: 'Complementary' },
  NEUTRAL: { key: 'neutral', symbol: '·', score: 0, label: 'Neutral' },
  REDUNDANT: { key: 'redundant', symbol: '=', score: -2, label: 'Redundant' },
  CONFLICTING: { key: 'conflicting', symbol: '✕', score: -4, label: 'Conflicting' },
};

// Each entry: [supplementA, supplementB, interactionType, reason]
// Order doesn't matter — lookup checks both directions
export const INTERACTIONS = [
  // === CLASSIC SYNERGISTIC PAIRS ===
  ['caffeine', 'l-theanine', 'synergistic', 'L-Theanine smooths caffeine jitters while preserving focus boost'],
  ['piracetam', 'alpha-gpc', 'synergistic', 'Choline fuels racetam-driven acetylcholine demand'],
  ['piracetam', 'citicoline', 'synergistic', 'CDP-choline provides acetylcholine substrate for racetam activity'],
  ['aniracetam', 'alpha-gpc', 'synergistic', 'Choline source enhances racetam cognitive effects'],
  ['aniracetam', 'citicoline', 'synergistic', 'CDP-choline supports racetam acetylcholine turnover'],
  ['oxiracetam', 'alpha-gpc', 'synergistic', 'Choline prevents racetam-induced headaches, boosts effects'],
  ['oxiracetam', 'citicoline', 'synergistic', 'CDP-choline pairs well with oxiracetam for memory'],
  ['pramiracetam', 'alpha-gpc', 'synergistic', 'Pramiracetam has highest choline demand of all racetams'],
  ['pramiracetam', 'citicoline', 'synergistic', 'Essential choline pairing for pramiracetam'],
  ['phenylpiracetam', 'alpha-gpc', 'synergistic', 'Choline source supports phenylpiracetam acetylcholine activity'],
  ['coluracetam', 'alpha-gpc', 'synergistic', 'Coluracetam enhances choline uptake — extra choline amplifies this'],
  ['fasoracetam', 'alpha-gpc', 'synergistic', 'Choline source supports fasoracetam GABAergic/cholinergic effects'],

  // === VITAMIN/MINERAL SYNERGIES ===
  ['vitamin-d3', 'vitamin-k2', 'synergistic', 'K2 directs D3-absorbed calcium to bones, not arteries'],
  ['vitamin-d3', 'magnesium', 'synergistic', 'Magnesium required for vitamin D activation'],
  ['iron', 'vitamin-c', 'synergistic', 'Vitamin C dramatically increases iron absorption'],
  ['zinc', 'copper', 'complementary', 'Copper balances zinc — high zinc depletes copper over time'],
  ['curcumin', 'piperine', 'synergistic', 'Piperine increases curcumin bioavailability by 2000%'],
  ['coq10', 'pqq', 'synergistic', 'PQQ creates new mitochondria, CoQ10 fuels them'],
  ['omega3', 'vitamin-d3', 'complementary', 'Fat-soluble D3 absorbs better with omega-3 fatty acids'],
  ['b-complex', 'magnesium', 'complementary', 'B vitamins and magnesium support overlapping energy pathways'],

  // === ADAPTOGEN COMBINATIONS ===
  ['ashwagandha', 'rhodiola', 'complementary', 'Different adaptogenic mechanisms — cortisol vs fatigue resistance'],
  ['ashwagandha', 'holy-basil', 'complementary', 'Both reduce cortisol through different pathways'],
  ['rhodiola', 'cordyceps', 'complementary', 'Rhodiola for mental stamina, cordyceps for physical endurance'],
  ['panax-ginseng', 'rhodiola', 'complementary', 'Ginseng stimulates, rhodiola balances — complementary adaptogenic effect'],
  ['ashwagandha', 'l-theanine', 'synergistic', 'Calm focus: ashwagandha lowers cortisol, theanine promotes alpha waves'],
  ['reishi', 'lions-mane', 'complementary', 'Reishi calms immune system, lion\'s mane supports nerve growth'],

  // === NOOTROPIC STACKS ===
  ['bacopa-monnieri', 'lions-mane', 'synergistic', 'Bacopa enhances memory consolidation, lion\'s mane promotes NGF'],
  ['lions-mane', 'alpha-gpc', 'complementary', 'NGF support plus acetylcholine substrate for cognitive enhancement'],
  ['bacopa-monnieri', 'ginkgo', 'complementary', 'Different memory mechanisms — consolidation vs cerebral blood flow'],
  ['noopept', 'alpha-gpc', 'synergistic', 'Noopept increases acetylcholine demand, alpha-GPC supplies it'],
  ['noopept', 'citicoline', 'synergistic', 'CDP-choline supports noopept cholinergic activity'],
  ['phosphatidylserine', 'omega3', 'synergistic', 'PS and DHA together support cell membrane fluidity and signaling'],
  ['acetyl-l-carnitine', 'alpha-lipoic-acid', 'synergistic', 'Classic mitochondrial stack — ALCAR shuttles fuel, ALA recycles antioxidants'],
  ['tyrosine', 'b-complex', 'complementary', 'B6 is a cofactor in tyrosine-to-dopamine conversion'],

  // === SLEEP STACK SYNERGIES ===
  ['magnesium', 'glycine', 'synergistic', 'Both promote NMDA modulation and relaxation through different mechanisms'],
  ['magnesium', 'melatonin', 'complementary', 'Magnesium relaxes muscles, melatonin signals sleep onset'],
  ['glycine', 'l-theanine', 'complementary', 'Calming amino acids through different receptor pathways'],
  ['apigenin', 'magnesium', 'complementary', 'Apigenin modulates GABA, magnesium relaxes — complementary sleep support'],
  ['melatonin', 'tart-cherry', 'redundant', 'Tart cherry contains melatonin — stacking adds little'],

  // === MOOD & STRESS ===
  ['sam-e', 'b-complex', 'synergistic', 'B vitamins are essential cofactors in SAMe methylation cycle'],
  ['5-htp', 'b-complex', 'complementary', 'B6 required for 5-HTP to serotonin conversion'],
  ['tyrosine', 'caffeine', 'complementary', 'Tyrosine replenishes dopamine that caffeine depletes'],

  // === REDUNDANT PAIRS (same mechanism class) ===
  ['piracetam', 'oxiracetam', 'redundant', 'Same racetam mechanism — pick one, not both'],
  ['piracetam', 'aniracetam', 'redundant', 'Overlapping racetam mechanisms'],
  ['piracetam', 'pramiracetam', 'redundant', 'Pramiracetam is stronger — piracetam adds little'],
  ['oxiracetam', 'aniracetam', 'redundant', 'Overlapping racetam mechanisms of action'],
  ['alpha-gpc', 'citicoline', 'redundant', 'Both are choline sources — one is sufficient'],
  ['5-htp', 'l-tryptophan', 'redundant', 'Both convert to serotonin — stacking risks serotonin excess'],
  ['modafinil', 'armodafinil', 'redundant', 'Armodafinil is the active isomer of modafinil'],
  ['caffeine', 'theacrine', 'redundant', 'Similar adenosine receptor mechanism'],
  ['valerian', 'passionflower', 'redundant', 'Both GABAergic sedatives — overlapping mechanism'],
  ['melatonin', 'glycine', 'complementary', 'Different sleep mechanisms — signaling vs relaxation'],

  // === CONFLICTING PAIRS ===
  ['caffeine', 'melatonin', 'conflicting', 'Stimulant opposes sleep signaling — counterproductive if taken together'],
  ['modafinil', 'melatonin', 'conflicting', 'Wakefulness agent directly opposes sleep hormone'],
  ['phenylpiracetam', 'melatonin', 'conflicting', 'Stimulating racetam conflicts with sleep induction'],
  ['5-htp', 'sam-e', 'conflicting', 'Both increase serotonin — combined use risks serotonin syndrome'],
  ['5-htp', 'st-johns-wort', 'conflicting', 'Both raise serotonin through different mechanisms — risk of excess'],
  ['st-johns-wort', 'sam-e', 'conflicting', 'Dual serotonin elevation — serotonin syndrome risk'],
  ['caffeine', 'kava', 'conflicting', 'Stimulant vs sedative — working against each other'],
  ['modafinil', 'phenibut', 'conflicting', 'Strong wakefulness agent vs strong sedative'],
  ['armodafinil', 'melatonin', 'conflicting', 'Wakefulness agent opposes sleep signaling'],
];

// Build a lookup map for fast pairwise queries
const interactionMap = new Map();

INTERACTIONS.forEach(([a, b, type, reason]) => {
  const key1 = `${a}|${b}`;
  const key2 = `${b}|${a}`;
  const entry = { type, reason, supplements: [a, b] };
  interactionMap.set(key1, entry);
  interactionMap.set(key2, entry);
});

// Get the interaction between two supplements (or null if neutral/undefined)
export function getInteraction(idA, idB) {
  return interactionMap.get(`${idA}|${idB}`) || null;
}

// Get all interactions for a given stack (array of supplement IDs)
export function getStackInteractions(supplementIds) {
  const results = [];
  for (let i = 0; i < supplementIds.length; i++) {
    for (let j = i + 1; j < supplementIds.length; j++) {
      const interaction = getInteraction(supplementIds[i], supplementIds[j]);
      if (interaction) {
        results.push(interaction);
      }
    }
  }
  return results;
}
