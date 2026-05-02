// Manually-curated price snapshot per supplement per vendor.
//
// Each entry is an estimated retail price for a 30-day supply at typical
// dosing. Prices fluctuate constantly; we re-snapshot on a regular cadence.
// Format:
//   '<supplementId>': {
//     amazon:           { price: 14.99, lastCheckedISO: 'YYYY-MM-DD' },
//     iherb:            { price: 12.49, lastCheckedISO: 'YYYY-MM-DD' },
//     nootropicsdepot:  { price: 18.00, lastCheckedISO: 'YYYY-MM-DD' },
//     ...
//   }
//
// The catalog is intentionally narrow (~30 most-built supplements). Items
// not in this table fall through to the legacy single-link buy flow.
//
// Snapshot date used as the "as of" stamp shown to users:
export const PRICE_SNAPSHOT_DATE = '2026-05-01';

// Helper to keep dates terse below.
const D = PRICE_SNAPSHOT_DATE;

export const PRICE_TABLE = {
  'caffeine': {
    amazon: { price: 8.99, lastCheckedISO: D },
    iherb:  { price: 7.99, lastCheckedISO: D },
  },
  'l-theanine': {
    amazon: { price: 14.99, lastCheckedISO: D },
    iherb:  { price: 11.49, lastCheckedISO: D },
    nootropicsdepot: { price: 12.99, lastCheckedISO: D },
  },
  'lions-mane': {
    amazon: { price: 28.99, lastCheckedISO: D },
    iherb:  { price: 24.99, lastCheckedISO: D },
    nootropicsdepot: { price: 23.99, lastCheckedISO: D },
  },
  'bacopa': {
    amazon: { price: 18.99, lastCheckedISO: D },
    iherb:  { price: 14.99, lastCheckedISO: D },
    nootropicsdepot: { price: 16.99, lastCheckedISO: D },
  },
  'ashwagandha': {
    amazon: { price: 19.99, lastCheckedISO: D },
    iherb:  { price: 14.99, lastCheckedISO: D },
  },
  'rhodiola': {
    amazon: { price: 21.99, lastCheckedISO: D },
    iherb:  { price: 17.49, lastCheckedISO: D },
    nootropicsdepot: { price: 19.99, lastCheckedISO: D },
  },
  'magnesium': {
    amazon: { price: 16.99, lastCheckedISO: D },
    iherb:  { price: 12.99, lastCheckedISO: D },
  },
  'magnesium-glycinate': {
    amazon: { price: 16.99, lastCheckedISO: D },
    iherb:  { price: 12.99, lastCheckedISO: D },
  },
  'omega3': {
    amazon: { price: 22.99, lastCheckedISO: D },
    iherb:  { price: 19.49, lastCheckedISO: D },
    nordicnaturals: { price: 32.99, lastCheckedISO: D },
  },
  'fish-oil': {
    amazon: { price: 22.99, lastCheckedISO: D },
    iherb:  { price: 19.49, lastCheckedISO: D },
    nordicnaturals: { price: 32.99, lastCheckedISO: D },
  },
  'vitamin-d': {
    amazon: { price: 8.99, lastCheckedISO: D },
    iherb:  { price: 6.99, lastCheckedISO: D },
  },
  'vitamin-d3': {
    amazon: { price: 8.99, lastCheckedISO: D },
    iherb:  { price: 6.99, lastCheckedISO: D },
  },
  'creatine': {
    amazon: { price: 16.99, lastCheckedISO: D },
    iherb:  { price: 13.49, lastCheckedISO: D },
  },
  'alpha-gpc': {
    amazon: { price: 25.99, lastCheckedISO: D },
    iherb:  { price: 22.99, lastCheckedISO: D },
    nootropicsdepot: { price: 19.99, lastCheckedISO: D },
  },
  'citicoline': {
    amazon: { price: 26.99, lastCheckedISO: D },
    iherb:  { price: 22.99, lastCheckedISO: D },
    nootropicsdepot: { price: 21.99, lastCheckedISO: D },
  },
  'phosphatidylserine': {
    amazon: { price: 28.99, lastCheckedISO: D },
    iherb:  { price: 24.99, lastCheckedISO: D },
  },
  'b-complex': {
    amazon: { price: 11.99, lastCheckedISO: D },
    iherb:  { price: 9.49, lastCheckedISO: D },
  },
  'zinc': {
    amazon: { price: 8.99, lastCheckedISO: D },
    iherb:  { price: 6.49, lastCheckedISO: D },
  },
  'melatonin': {
    amazon: { price: 7.99, lastCheckedISO: D },
    iherb:  { price: 6.49, lastCheckedISO: D },
  },
  'tyrosine': {
    amazon: { price: 14.99, lastCheckedISO: D },
    iherb:  { price: 11.99, lastCheckedISO: D },
  },
  'l-tyrosine': {
    amazon: { price: 14.99, lastCheckedISO: D },
    iherb:  { price: 11.99, lastCheckedISO: D },
  },
  'taurine': {
    amazon: { price: 11.99, lastCheckedISO: D },
    iherb:  { price: 9.49, lastCheckedISO: D },
  },
  'curcumin': {
    amazon: { price: 18.99, lastCheckedISO: D },
    iherb:  { price: 14.99, lastCheckedISO: D },
  },
  'glycine': {
    amazon: { price: 12.99, lastCheckedISO: D },
    iherb:  { price: 9.99, lastCheckedISO: D },
  },
  'cordyceps': {
    amazon: { price: 24.99, lastCheckedISO: D },
    iherb:  { price: 21.99, lastCheckedISO: D },
    nootropicsdepot: { price: 22.99, lastCheckedISO: D },
  },
  'reishi': {
    amazon: { price: 21.99, lastCheckedISO: D },
    iherb:  { price: 17.99, lastCheckedISO: D },
    nootropicsdepot: { price: 18.99, lastCheckedISO: D },
  },
  'noopept': {
    nootropicsdepot: { price: 18.00, lastCheckedISO: D },
  },
  'piracetam': {
    nootropicsdepot: { price: 22.00, lastCheckedISO: D },
  },
  'phenylpiracetam': {
    nootropicsdepot: { price: 28.00, lastCheckedISO: D },
  },
  'huperzine-a': {
    amazon: { price: 16.99, lastCheckedISO: D },
    iherb:  { price: 13.99, lastCheckedISO: D },
  },
};

/** Returns the array of { vendor, price, lastCheckedISO } sorted ascending. */
export function getVendorPrices(supplementId) {
  const entry = PRICE_TABLE[supplementId];
  if (!entry) return [];
  return Object.entries(entry)
    .map(([vendor, info]) => ({ vendor, ...info }))
    .sort((a, b) => a.price - b.price);
}

/** Returns the cheapest { vendor, price, lastCheckedISO } or null. */
export function getCheapestVendor(supplementId) {
  const list = getVendorPrices(supplementId);
  return list.length > 0 ? list[0] : null;
}

/** True if we have any tracked prices for this supplement. */
export function hasTrackedPrices(supplementId) {
  return Boolean(PRICE_TABLE[supplementId]);
}
