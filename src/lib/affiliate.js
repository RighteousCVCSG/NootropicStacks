import { useLocation } from 'react-router-dom';

export const AMAZON_TAG = 'nootropicstk-20';

// iHerb referral code. Read from env (Vite-time) so we can flip without a
// code change. Until set, the helper passes URLs through unchanged so no
// links break — the only effect is "$0 commission today" exactly like the
// pre-helper baseline.
export const IHERB_RCODE = (import.meta.env?.VITE_IHERB_RCODE || '').trim();
// Nootropics Depot uses a `?ref=` slug already baked into the seed URLs.
// Centralizing here so we can rotate without grepping the codebase.
export const ND_REF = (import.meta.env?.VITE_ND_REF || 'nootropicstacker').trim();

const AMAZON_HOST_RE = /^https?:\/\/(?:www\.)?amazon\.[a-z.]+/i;
const AMZN_SHORT_RE = /^https?:\/\/(?:www\.)?amzn\.to/i;
const IHERB_HOST_RE = /^https?:\/\/(?:www\.)?iherb\.com/i;
const ND_HOST_RE   = /^https?:\/\/(?:www\.)?nootropicsdepot\.com/i;

export function isAmazonUrl(url) {
  return typeof url === 'string' && (AMAZON_HOST_RE.test(url) || AMZN_SHORT_RE.test(url));
}

export function isIherbUrl(url) {
  return typeof url === 'string' && IHERB_HOST_RE.test(url);
}

export function isNootropicsDepotUrl(url) {
  return typeof url === 'string' && ND_HOST_RE.test(url);
}

// Idempotently injects iHerb's referral code into a URL.
//
// iHerb has two common URL shapes in our seed data:
//   1. Query string:  https://www.iherb.com/search?kw=TERM
//   2. Hash fragment: https://www.iherb.com/search#query=TERM
//
// For (1) we set `?rcode=…` in the query string. For (2) we append
// `&rcode=…` *inside the hash* so the search-result page on iHerb keeps
// rendering normally (iHerb hash-routes its search SPA). When IHERB_RCODE
// is empty (env var not yet set), the function passes the URL through
// unchanged so links keep working.
export function withIherbRef(url) {
  if (!isIherbUrl(url) || !IHERB_RCODE) return url;
  try {
    const u = new URL(url);
    if (u.hash && u.hash.startsWith('#query=')) {
      // Hash-routed search URL — inject rcode inside the hash.
      const hashBody = u.hash.slice(1); // drop the '#'
      const hashParams = new URLSearchParams(hashBody);
      if (hashParams.get('rcode') !== IHERB_RCODE) {
        hashParams.set('rcode', IHERB_RCODE);
      }
      u.hash = `#${hashParams.toString()}`;
      return u.toString();
    }
    if (u.searchParams.get('rcode') !== IHERB_RCODE) {
      u.searchParams.set('rcode', IHERB_RCODE);
    }
    return u.toString();
  } catch {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}rcode=${encodeURIComponent(IHERB_RCODE)}`;
  }
}

// Single dispatcher: takes a vendor URL and routes through the right
// transform (Amazon UTMs / iHerb rcode / ND ref pass-through).
export function withAffiliateLink(url, options = {}) {
  if (!url) return url;
  if (isAmazonUrl(url)) return withAffiliateUtms(url, options);
  if (isIherbUrl(url))  return withIherbRef(url);
  // ND already carries `?ref=…` in the seed data; nothing to add.
  return url;
}

// Shared display labels for vendors. Single source of truth so cards,
// ship sheet, and price panel all use identical copy.
export const VENDOR_LABEL = {
  amazon: 'Amazon',
  iherb: 'iHerb',
  nootropicsdepot: 'Nootropics Depot',
  nordicnaturals: 'Nordic Naturals',
  buymodafinilonline: 'Modafinil Online',
};

// Short labels (for compact chips / 3-col footers where space is tight).
export const VENDOR_LABEL_SHORT = {
  amazon: 'Amazon',
  iherb: 'iHerb',
  nootropicsdepot: 'ND',
  nordicnaturals: 'Nordic',
  buymodafinilonline: 'Modafinil',
};

// Default fallback preference when we don't have a tracked-price winner.
const VENDOR_PREF_ORDER = [
  'nootropicsdepot',
  'amazon',
  'iherb',
  'nordicnaturals',
  'buymodafinilonline',
];

// Picks the vendor key the Buy button should route to. If we track prices
// for the supplement, prefer the cheapest vendor that ALSO has an affiliate
// link. Otherwise fall back to the canonical preference order. Cards, the
// Ship This Build sheet, and the price comparison panel all funnel through
// this so the user sees consistent "best price" routing across the site.
export function pickPreferredVendor(supplementId, links, getCheapest) {
  if (!links) return null;
  if (typeof getCheapest === 'function') {
    const cheapest = getCheapest(supplementId);
    if (cheapest && links[cheapest.vendor]) return cheapest.vendor;
  }
  for (const v of VENDOR_PREF_ORDER) {
    if (links[v]) return v;
  }
  return (
    Object.keys(links).find((k) => k !== 'commission' && typeof links[k] === 'string') || null
  );
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s/-]/g, '')
    .replace(/[\s/_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Maps an app pathname to a default utm_campaign slug. Pages with their own
// per-card campaign context (best-stacks cards, review cards) should pass
// `campaign` explicitly instead of relying on this fallback.
export function pathnameToCampaign(pathname) {
  if (!pathname || pathname === '/') return 'homepage';

  const supplementMatch = pathname.match(/^\/supplements\/([^/]+)/);
  if (supplementMatch) return `supplement-${supplementMatch[1]}`;

  const blogMatch = pathname.match(/^\/blog\/([^/]+)/);
  if (blogMatch) return `blog-${blogMatch[1]}`;

  const guideMatch = pathname.match(/^\/guides\/([^/]+)/);
  if (guideMatch) return `guides-${guideMatch[1]}`;

  if (pathname === '/supplements') return 'supplements-library';
  if (pathname.startsWith('/best-stacks')) return 'best-stacks';
  if (pathname.startsWith('/best-nootropics')) return 'best-nootropics';
  if (pathname.startsWith('/nootropics-for-')) return slugify(pathname.replace(/^\//, ''));
  if (pathname.startsWith('/reviews')) return 'reviews';
  if (pathname.startsWith('/compare-supplements') || pathname.startsWith('/compare')) return 'compare';
  if (pathname.startsWith('/quiz')) return 'quiz';
  if (pathname.startsWith('/stacks')) return 'stacks';
  if (pathname.startsWith('/start-here')) return 'start-here';

  return slugify(pathname.replace(/^\//, '')) || 'homepage';
}

export function useAffiliateCampaign() {
  const { pathname } = useLocation();
  return pathnameToCampaign(pathname);
}

// Appends utm_source/medium/campaign to an Amazon affiliate URL and ensures the
// associate `tag` is present. Idempotent — replaces any existing utm_* params.
// Non-Amazon URLs and missing campaigns return the original URL unmodified.
export function withAffiliateUtms(url, { campaign, source = 'organic', medium = 'content' } = {}) {
  if (!url || !isAmazonUrl(url) || !campaign) return url;

  try {
    const u = new URL(url);
    if (!u.searchParams.has('tag')) {
      u.searchParams.set('tag', AMAZON_TAG);
    }
    u.searchParams.set('utm_source', source);
    u.searchParams.set('utm_medium', medium);
    u.searchParams.set('utm_campaign', campaign);
    return u.toString();
  } catch {
    const sep = url.includes('?') ? '&' : '?';
    const params = new URLSearchParams({
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign,
    }).toString();
    return `${url}${sep}${params}`;
  }
}

// Builds a full Amazon search affiliate URL with the associate tag and UTMs.
// Use anywhere we used to inline `https://www.amazon.com/s?k=...&tag=...`.
export function buildAmazonSearchLink(searchTerm, options = {}) {
  const url = new URL('https://www.amazon.com/s');
  url.searchParams.set('k', String(searchTerm).trim());
  url.searchParams.set('tag', AMAZON_TAG);
  return withAffiliateUtms(url.toString(), options);
}

// Builds an iHerb search URL routed through withIherbRef so the rcode rides
// along once VITE_IHERB_RCODE is set. Passes through unmonetized (but still
// functional) until then — same graceful behavior as withIherbRef itself.
export function buildIherbSearchLink(searchTerm) {
  const url = new URL('https://www.iherb.com/search');
  url.searchParams.set('kw', String(searchTerm).trim());
  return withIherbRef(url.toString());
}

// Resolves the URL for any "Buy" affordance site-wide. Prefers a curated
// vendor link (routed through the cheapest-tracked-price / preference-order
// logic in pickPreferredVendor); falls back to a monetized Amazon search so
// no buy surface ever goes dead just because a supplement lacks a curated
// AFFILIATE_LINKS entry (currently 148 of 195 supplements).
export function resolveBuyUrl(supplementId, supplementName, links, options = {}) {
  const { vendor, campaign, getCheapest } = options;
  if (links) {
    const v = vendor || pickPreferredVendor(supplementId, links, getCheapest);
    if (v && links[v]) return withAffiliateLink(links[v], { campaign });
  }
  return buildAmazonSearchLink(`${supplementName} supplement`, { campaign });
}

// Resolves the full ordered vendor option list for multi-button surfaces
// (stack modals, ship sheet, vendor rows). Curated links come first; when a
// supplement lacks curated Amazon/iHerb links, monetized search fallbacks
// fill in (marked `curated: false` so callers can label them "(search)").
export function resolveVendorUrls(supplementId, supplementName, links, options = {}) {
  const { campaign } = options;
  const out = [];
  for (const v of VENDOR_PREF_ORDER) {
    if (links?.[v]) {
      out.push({ vendor: v, url: withAffiliateLink(links[v], { campaign }), curated: true });
    }
  }
  if (!links?.amazon) {
    out.push({ vendor: 'amazon', url: buildAmazonSearchLink(`${supplementName} supplement`, { campaign }), curated: false });
  }
  if (!links?.iherb) {
    out.push({ vendor: 'iherb', url: buildIherbSearchLink(supplementName), curated: false });
  }
  return out;
}
