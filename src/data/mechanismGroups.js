// Supplement mechanism groups for Balance scoring
// Used to detect category stacking (too many of one type)

export const MECHANISM_GROUPS = {
  stimulants: {
    label: 'Stimulants',
    supplements: [
      'caffeine', 'modafinil', 'armodafinil', 'phenylpiracetam',
      'theacrine', 'paraxanthine', 'cordyceps'
    ]
  },
  gabaergics: {
    label: 'GABAergics',
    supplements: [
      'gaba', 'phenibut', 'valerian', 'passionflower', 'kava',
      'magnolia-bark', 'taurine'
    ]
  },
  cholinergics: {
    label: 'Cholinergics',
    supplements: [
      'alpha-gpc', 'citicoline', 'huperzine-a', 'centrophenoxine', 'dmae'
    ]
  },
  serotonergics: {
    label: 'Serotonergics',
    supplements: [
      '5-htp', 'l-tryptophan', 'saffron-extract', 'st-johns-wort', 'sam-e'
    ]
  },
  dopaminergics: {
    label: 'Dopaminergics',
    supplements: [
      'mucuna-pruriens', 'tyrosine', 'phenylalanine', 'sam-e', 'sulbutiamine'
    ]
  },
  adaptogens: {
    label: 'Adaptogens',
    supplements: [
      'ashwagandha', 'rhodiola', 'holy-basil', 'eleuthero',
      'schisandra', 'panax-ginseng', 'reishi'
    ]
  },
  racetams: {
    label: 'Racetams',
    supplements: [
      'piracetam', 'aniracetam', 'oxiracetam', 'pramiracetam',
      'phenylpiracetam', 'coluracetam', 'fasoracetam', 'nefiracetam'
    ]
  },
  sleepAids: {
    label: 'Sleep Aids',
    supplements: [
      'melatonin', 'glycine', 'apigenin', 'magnolia-bark', 'valerian',
      'passionflower', 'chamomile-extract', 'lavender-oil', 'tart-cherry'
    ]
  },
  hormonal: {
    label: 'Hormonal',
    supplements: [
      'tongkat-ali', 'fadogia-agrestis', 'dhea', 'pregnenolone',
      'dim', 'fenugreek', 'boron'
    ]
  }
};

// Get all mechanism groups a supplement belongs to
export function getSupplementGroups(supplementId) {
  const groups = [];
  for (const [groupId, group] of Object.entries(MECHANISM_GROUPS)) {
    if (group.supplements.includes(supplementId)) {
      groups.push({ id: groupId, label: group.label });
    }
  }
  return groups;
}

// Count supplements per mechanism group for a given stack
export function countByMechanismGroup(supplementIds) {
  const counts = {};
  for (const [groupId, group] of Object.entries(MECHANISM_GROUPS)) {
    const count = supplementIds.filter(id => group.supplements.includes(id)).length;
    if (count > 0) {
      counts[groupId] = { label: group.label, count };
    }
  }
  return counts;
}
