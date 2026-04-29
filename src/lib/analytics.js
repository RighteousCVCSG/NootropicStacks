import { AMAZON_TAG } from './affiliate.js';

export function track(event, props = {}) {
  if (typeof window.plausible === 'function') {
    try {
      window.plausible(event, { props });
    } catch (e) {
      console.warn('Plausible track error:', e);
    }
  }

  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', event, props);
    } catch (e) {
      console.warn('GA4 track error:', e);
    }
  }
}

export function trackPageview(url) {
  if (typeof window.plausible === 'function') {
    try {
      window.plausible('pageview', { u: url });
    } catch (e) {
      console.warn('Plausible pageview error:', e);
    }
  }

  if (typeof window.gtag === 'function') {
    try {
      window.gtag('config', 'G-FZEY2PKWFQ', { page_path: url });
    } catch (e) {
      console.warn('GA4 pageview error:', e);
    }
  }
}

const AMAZON_HOST_RE = /^https?:\/\/(?:www\.)?amazon\.[a-z.]+/i;

export function installAffiliateClickTracking() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href) return;

    if (AMAZON_HOST_RE.test(link.href) && link.href.includes(`tag=${AMAZON_TAG}`)) {
      track('affiliate_click', { url: link.href });
    }
  }, true);
}
