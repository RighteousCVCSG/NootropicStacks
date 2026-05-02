// Heuristic evidence-tier classifier for the 195 supplements in our catalog.
//
// Tier 1 — Strong: multiple human RCTs / meta-analyses. The "knowns."
// Tier 2 — Moderate: meaningful human evidence, not yet definitive. (Default.)
// Tier 3 — Preliminary: mechanistic / animal / single-RCT only.
// Rx     — Prescription compound; flagged separately so the badge can warn.
//
// This is a snapshot — we tune the lists as evidence evolves. The default of
// Tier 2 is intentional: most catalog items sit in the "promising but not
// fully proven" middle, and over-claiming a Tier 1 is a YMYL liability.

const TIER_1 = new Set([
  'caffeine',
  'l-theanine',
  'creatine',
  'omega3',
  'omega-3',
  'fish-oil',
  'magnesium',
  'magnesium-glycinate',
  'vitamin-d',
  'vitamin-d3',
  'b-complex',
  'b-vitamins',
  'melatonin',
  'glycine',
  'zinc',
  'vitamin-c',
  'curcumin',
]);

const TIER_3 = new Set([
  'noopept',
  'piracetam',
  'aniracetam',
  'oxiracetam',
  'phenylpiracetam',
  'pramiracetam',
  'coluracetam',
  'fasoracetam',
  'kanna',
  'huperzine-a',
  'mucuna-pruriens',
  'nad-precursors',
  'nmn',
  'nr',
]);

const PRESCRIPTION = new Set(['modafinil', 'armodafinil']);

export const TIER_META = {
  1: {
    key: 1,
    label: 'Tier 1',
    short: 'Strong',
    description: 'Multiple human RCTs / meta-analyses',
    cssVarFg:   '--color-tier-1-fg',
    cssVarRule: '--color-tier-1-rule',
    cssVarBg:   '--color-tier-1-bg',
  },
  2: {
    key: 2,
    label: 'Tier 2',
    short: 'Moderate',
    description: 'Promising human evidence; not yet definitive',
    cssVarFg:   '--color-tier-2-fg',
    cssVarRule: '--color-tier-2-rule',
    cssVarBg:   '--color-tier-2-bg',
  },
  3: {
    key: 3,
    label: 'Tier 3',
    short: 'Preliminary',
    description: 'Mechanistic / animal / single-RCT — early signal only',
    cssVarFg:   '--color-tier-3-fg',
    cssVarRule: '--color-tier-3-rule',
    cssVarBg:   '--color-tier-3-bg',
  },
  rx: {
    key: 'rx',
    label: 'Prescription',
    short: 'Rx',
    description: 'Prescription compound — requires a doctor',
    cssVarFg:   '--color-danger-500',
    cssVarRule: '--color-danger-500',
    cssVarBg:   '--color-danger-100',
  },
};

export function getEvidenceTier(supplementId) {
  if (!supplementId) return TIER_META[2];
  if (PRESCRIPTION.has(supplementId)) return TIER_META.rx;
  if (TIER_1.has(supplementId)) return TIER_META[1];
  if (TIER_3.has(supplementId)) return TIER_META[3];
  return TIER_META[2];
}
