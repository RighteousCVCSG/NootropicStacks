import { useLocation } from 'react-router-dom';

export const AMAZON_TAG = 'nootropicstk-20';

const AMAZON_HOST_RE = /^https?:\/\/(?:www\.)?amazon\.[a-z.]+/i;
const AMZN_SHORT_RE = /^https?:\/\/(?:www\.)?amzn\.to/i;

export function isAmazonUrl(url) {
  return typeof url === 'string' && (AMAZON_HOST_RE.test(url) || AMZN_SHORT_RE.test(url));
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
