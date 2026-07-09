import React from 'react';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { getVendorPrices, hasTrackedPrices, PRICE_SNAPSHOT_DATE } from '../data/priceTable.js';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateLink, resolveBuyUrl, VENDOR_LABEL_SHORT as VENDOR_LABEL } from '@/lib/affiliate.js';
import { track } from '../lib/analytics.js';

function vendorAffiliateUrl(supplementId, vendor) {
  const links = AFFILIATE_LINKS[supplementId];
  const url = links?.[vendor];
  if (!url) return null;
  return withAffiliateLink(url, { campaign: `price-${supplementId}` });
}

/**
 * Compact horizontal price-comparison strip for SupplementCard.
 * Shows up to 3 vendors with a "best today" highlight on the cheapest.
 * Returns null when we have no tracked prices for this supplement.
 */
export function VendorPricesCompact({ supplementId, supplementName, onCardClickSource }) {
  if (!hasTrackedPrices(supplementId)) return null;
  const prices = getVendorPrices(supplementId).slice(0, 3);
  if (prices.length === 0) return null;

  const handleClick = (vendor) => {
    track('price_comparison_click', { supplement_id: supplementId, vendor, source: onCardClickSource || 'card' });
    const url = resolveBuyUrl(supplementId, supplementName || supplementId, AFFILIATE_LINKS[supplementId], { vendor, campaign: `price-${supplementId}` });
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-1">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">
        Prices today
      </div>
      <div className="flex flex-wrap gap-1.5">
        {prices.map((p, idx) => {
          const isBest = idx === 0;
          const hasLink = Boolean(vendorAffiliateUrl(supplementId, p.vendor));
          return (
            <button
              key={p.vendor}
              type="button"
              onClick={() => handleClick(p.vendor)}
              className={`group inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border transition-colors ${
                isBest
                  ? 'bg-accent-050 border-accent-500 text-accent-700 hover:bg-accent-100'
                  : 'bg-surface-card border-ink-200 text-ink-700 hover:border-primary-300 hover:text-primary-800'
              }`}
              title={hasLink ? `Open ${VENDOR_LABEL[p.vendor] || p.vendor}` : `Search Amazon — no direct ${VENDOR_LABEL[p.vendor] || p.vendor} link yet`}
            >
              <span className="font-medium">{VENDOR_LABEL[p.vendor] || p.vendor}</span>
              <span className="font-mono">${p.price.toFixed(2)}</span>
              {isBest && (
                <span className="ml-0.5 text-[9px] uppercase tracking-wider font-semibold">best</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Single purchase block for SupplementPage. Three tiers depending on what
 * data we have for this supplement:
 *   1. Tracked prices — full price-comparison table, cheapest highlighted.
 *   2. Curated AFFILIATE_LINKS but no tracked price — vendor buy list,
 *      no price column.
 *   3. Neither — one monetized Amazon-search fallback button so the page
 *      never ships a dead purchase surface.
 * This is the ONLY buy surface on the supplement detail page — it used to
 * sit next to a second, redundant "Buy <name>" card grid.
 */
export function VendorPricesDetailed({ supplementId, supplementName }) {
  const tracked = hasTrackedPrices(supplementId);
  const prices = tracked ? getVendorPrices(supplementId) : [];
  const links = AFFILIATE_LINKS[supplementId];
  const linkVendors = links
    ? Object.keys(links).filter((k) => k !== 'commission' && typeof links[k] === 'string')
    : [];

  const handleClick = (vendor) => {
    track('price_comparison_click', { supplement_id: supplementId, vendor, source: 'detail' });
    const url = resolveBuyUrl(supplementId, supplementName || supplementId, links, { vendor, campaign: `price-${supplementId}` });
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Tier 1: tracked prices — the strongest converter, full comparison table.
  if (tracked && prices.length > 0) {
    return (
      <div className="rounded-md border border-ink-200 bg-surface-card overflow-hidden">
        <div className="px-3 py-2 border-b border-ink-200 bg-surface-sunk">
          <h4 className="text-sm font-semibold text-ink-900">Compare prices</h4>
          <p className="text-[11px] text-ink-500">Snapshot {PRICE_SNAPSHOT_DATE}</p>
        </div>
        <ul className="divide-y divide-ink-200">
          {prices.map((p, idx) => {
            const isBest = idx === 0;
            const hasLink = Boolean(vendorAffiliateUrl(supplementId, p.vendor));
            return (
              <li
                key={p.vendor}
                className={`flex items-center justify-between px-3 py-2 ${
                  isBest ? 'bg-accent-050' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink-900">
                    {VENDOR_LABEL[p.vendor] || p.vendor}
                  </span>
                  {isBest && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-accent-700 bg-accent-100 px-1.5 py-0.5 rounded">
                      Best today
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-ink-900">
                    ${p.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleClick(p.vendor)}
                    title={hasLink ? undefined : 'No direct link yet — opens an Amazon search'}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      isBest
                        ? 'bg-accent-500 text-ink-on-dark hover:bg-accent-600'
                        : 'bg-surface-sunk text-ink-700 border border-ink-200 hover:border-primary-300 hover:text-primary-800'
                    }`}
                  >
                    Buy on {hasLink ? (VENDOR_LABEL[p.vendor] || p.vendor) : 'Amazon'} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Tier 2: curated vendor links but no tracked price — plain buy list.
  if (linkVendors.length > 0) {
    return (
      <div className="rounded-md border border-ink-200 bg-surface-card overflow-hidden">
        <div className="px-3 py-2 border-b border-ink-200 bg-surface-sunk">
          <h4 className="text-sm font-semibold text-ink-900">Where to buy</h4>
        </div>
        <ul className="divide-y divide-ink-200">
          {linkVendors.map((vendor) => (
            <li key={vendor} className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-ink-900">{VENDOR_LABEL[vendor] || vendor}</span>
              <button
                type="button"
                onClick={() => handleClick(vendor)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-surface-sunk text-ink-700 border border-ink-200 hover:border-primary-300 hover:text-primary-800 transition-colors"
              >
                Buy on {VENDOR_LABEL[vendor] || vendor} <ExternalLink className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Tier 3: nothing curated at all — one monetized fallback button.
  return (
    <div className="rounded-md border border-ink-200 bg-surface-card p-3">
      <h4 className="text-sm font-semibold text-ink-900 mb-2">Where to buy</h4>
      <button
        type="button"
        onClick={() => handleClick('amazon')}
        className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md text-sm font-medium bg-accent-500 text-ink-on-dark hover:bg-accent-600 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        Buy on Amazon <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
