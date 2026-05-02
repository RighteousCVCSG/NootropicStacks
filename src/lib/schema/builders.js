import { getEvidenceTier } from '../evidenceTier.js';
import { getVendorPrices, PRICE_SNAPSHOT_DATE } from '../../data/priceTable.js';

const SITE_URL = 'https://nootropicstacker.com';

// Schema.org `MedicalEvidenceLevel` enumeration:
//   EvidenceLevelA — multiple RCTs / systematic review (Tier 1)
//   EvidenceLevelB — single high-quality study / cohort (Tier 2)
//   EvidenceLevelC — preliminary / mechanistic / case series (Tier 3)
const TIER_TO_EVIDENCE_LEVEL = {
  1: 'https://schema.org/EvidenceLevelA',
  2: 'https://schema.org/EvidenceLevelB',
  3: 'https://schema.org/EvidenceLevelC',
};

// Snapshot prices are good for ~30 days. Compute once, reuse.
function priceValidUntil() {
  if (!PRICE_SNAPSHOT_DATE) return undefined;
  const snap = new Date(`${PRICE_SNAPSHOT_DATE}T00:00:00Z`);
  if (Number.isNaN(snap.getTime())) return undefined;
  snap.setUTCDate(snap.getUTCDate() + 30);
  return snap.toISOString().slice(0, 10);
}

const VENDOR_SELLER = {
  amazon: 'Amazon',
  iherb: 'iHerb',
  nootropicsdepot: 'Nootropics Depot',
  nordicnaturals: 'Nordic Naturals',
  buymodafinilonline: 'BuyModafinilOnline',
};

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NootropicStacker',
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    description:
      'The PCPartPicker for nootropics. Discover, compare, and build supplement stacks with evidence-based scoring.',
    sameAs: [
      'https://twitter.com/nootropicstacker',
      'https://facebook.com/nootropicstacker',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@nootropicstacker.com',
      contactType: 'customer support',
    },
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NootropicStacker',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/supplements?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Builds a single Offer node with optional price + priceValidUntil from the
// curated priceTable snapshot. AI shopping agents (ChatGPT, Perplexity,
// Google AI Mode) require a numeric `price` to surface a "buy here"
// recommendation; without it, the offer reads as incomplete inventory.
function buildOffer({ url, sellerKey, vendorKey, supplementId }) {
  if (!url) return null;
  const offer = {
    '@type': 'Offer',
    url,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: VENDOR_SELLER[sellerKey] || sellerKey },
  };
  // Wire in tracked price from priceTable when we have one.
  if (supplementId && vendorKey) {
    const prices = getVendorPrices(supplementId);
    const match = prices.find((p) => p.vendor === vendorKey);
    if (match) {
      offer.price = match.price.toFixed(2);
      const validUntil = priceValidUntil();
      if (validUntil) offer.priceValidUntil = validUntil;
    }
  }
  return offer;
}

export function buildProductSchema(supplement) {
  if (!supplement) return null;

  const offers = [];
  const amazonOffer = buildOffer({
    url: supplement.affiliateAmazon,
    sellerKey: 'amazon',
    vendorKey: 'amazon',
    supplementId: supplement.id,
  });
  if (amazonOffer) offers.push(amazonOffer);
  const iherbOffer = buildOffer({
    url: supplement.affiliateIherb,
    sellerKey: 'iherb',
    vendorKey: 'iherb',
    supplementId: supplement.id,
  });
  if (iherbOffer) offers.push(iherbOffer);
  const ndOffer = buildOffer({
    url: supplement.affiliateNootropicsDepot,
    sellerKey: 'nootropicsdepot',
    vendorKey: 'nootropicsdepot',
    supplementId: supplement.id,
  });
  if (ndOffer) offers.push(ndOffer);

  // DietarySupplement enrichments — these are silent (only AI crawlers see
  // them in the JSON-LD) but they materially raise citation likelihood for
  // health-adjacent queries.
  const tier = getEvidenceTier(supplement.id);
  const evidenceLevel = TIER_TO_EVIDENCE_LEVEL[tier?.key];
  const safetyConsideration =
    Array.isArray(supplement.warnings) && supplement.warnings.length > 0
      ? supplement.warnings.join(' ')
      : undefined;

  // RecommendedDoseSchedule from the dosage range. doseValue is a string
  // because we represent a min-max range, not a single number.
  const recommendedIntake =
    supplement.dosage?.min != null && supplement.dosage?.max != null
      ? {
          '@type': 'RecommendedDoseSchedule',
          doseUnit: supplement.dosage.unit,
          doseValue: `${supplement.dosage.min}-${supplement.dosage.max}`,
          frequency: supplement.dosage.timing || 'daily',
          targetPopulation: 'Healthy adults',
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    additionalType: 'https://schema.org/DietarySupplement',
    name: supplement.name,
    description: supplement.summary || supplement.description,
    url: `${SITE_URL}/supplements/${supplement.slug || supplement.id}`,
    category: supplement.category,
    // DietarySupplement properties (Substance / MedicalEntity inheritance):
    ...(supplement.description ? { mechanismOfAction: supplement.description } : {}),
    ...(safetyConsideration ? { safetyConsideration } : {}),
    ...(recommendedIntake ? { recommendedIntake } : {}),
    activeIngredient: supplement.name,
    targetPopulation: 'Adults seeking cognitive enhancement',
    // MedicalEntity property — wires our internal evidence-tier classifier to
    // schema.org's MedicalEvidenceLevel enumeration so AI crawlers can
    // machine-read our YMYL credibility position.
    ...(evidenceLevel
      ? {
          medicineSystem: 'https://schema.org/WesternConventional',
          evidenceLevel,
          evidenceOrigin: tier?.description,
        }
      : {}),
    ...(offers.length > 0 ? { offers } : {}),
  };
}

// Items may carry { url, name, description, ratingValue }. ListItem
// description + ratingValue are silent enrichments AI answer engines use
// when ranking a "best for X" page against narrative competitors.
export function buildItemListSchema({ name, items } = {}) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: item.url,
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
      ...(item.ratingValue != null
        ? {
            item: {
              '@type': 'Product',
              name: item.name,
              url: item.url,
              ...(item.description ? { description: item.description } : {}),
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: item.ratingValue,
                bestRating: 10,
                ratingCount: 1,
              },
            },
          }
        : {}),
    })),
  };
}

export function buildArticleSchema(article) {
  if (!article) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || article.excerpt,
    image: article.image || `${SITE_URL}/og-image.png`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: article.author
      ? { '@type': 'Person', name: article.author, url: article.authorUrl }
      : { '@type': 'Organization', name: 'NootropicStacker' },
    publisher: {
      '@type': 'Organization',
      name: 'NootropicStacker',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
    ...(article.citations?.length ? { citation: article.citations } : {}),
  };
}

export function buildFAQSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(crumbs) {
  if (!crumbs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
