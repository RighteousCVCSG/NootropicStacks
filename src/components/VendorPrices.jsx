import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getVendorPrices, hasTrackedPrices, PRICE_SNAPSHOT_DATE } from '../data/priceTable.js';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateLink } from '@/lib/affiliate.js';
import { track } from '../lib/analytics.js';

const VENDOR_LABEL = {
  amazon: 'Amazon',
  iherb: 'iHerb',
  nootropicsdepot: 'ND',
  nordicnaturals: 'Nordic',
  buymodafinilonline: 'Modafinil Online',
};

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
export function VendorPricesCompact({ supplementId, onCardClickSource }) {
  if (!hasTrackedPrices(supplementId)) return null;
  const prices = getVendorPrices(supplementId).slice(0, 3);
  if (prices.length === 0) return null;

  const handleClick = (vendor) => {
    track('price_comparison_click', { supplement_id: supplementId, vendor, source: onCardClickSource || 'card' });
    const url = vendorAffiliateUrl(supplementId, vendor);
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
          const url = vendorAffiliateUrl(supplementId, p.vendor);
          const disabled = !url;
          return (
            <button
              key={p.vendor}
              type="button"
              onClick={() => !disabled && handleClick(p.vendor)}
              disabled={disabled}
              className={`group inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border transition-colors ${
                isBest
                  ? 'bg-accent-050 border-accent-500 text-accent-700 hover:bg-accent-100'
                  : 'bg-surface-card border-ink-200 text-ink-700 hover:border-primary-300 hover:text-primary-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={
                disabled
                  ? 'Price tracked but no affiliate link'
                  : `Open ${VENDOR_LABEL[p.vendor] || p.vendor}`
              }
            >
              <span className="font-medium">{VENDOR_LABEL[p.vendor] || p.vendor}</span>
              <span className="font-mono">${p.price.toFixed(2)}</span>
              {isBest && (
                <span className="ml-0.5 text-[9px] uppercase tracking-wider font-bold">best</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Detailed price-comparison panel for SupplementPage. Shows every tracked
 * vendor with a full Buy button per row.
 */
export function VendorPricesDetailed({ supplementId }) {
  if (!hasTrackedPrices(supplementId)) return null;
  const prices = getVendorPrices(supplementId);
  if (prices.length === 0) return null;

  const handleClick = (vendor) => {
    track('price_comparison_click', { supplement_id: supplementId, vendor, source: 'detail' });
    const url = vendorAffiliateUrl(supplementId, vendor);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-lg border border-ink-200 bg-surface-card overflow-hidden">
      <div className="px-3 py-2 border-b border-ink-200 bg-surface-sunk">
        <h4 className="text-sm font-semibold text-ink-900">Compare prices</h4>
        <p className="text-[11px] text-ink-500">Snapshot {PRICE_SNAPSHOT_DATE}</p>
      </div>
      <ul className="divide-y divide-ink-200">
        {prices.map((p, idx) => {
          const isBest = idx === 0;
          const url = vendorAffiliateUrl(supplementId, p.vendor);
          const disabled = !url;
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
                  <span className="text-[10px] uppercase tracking-wider font-bold text-accent-700 bg-accent-100 px-1.5 py-0.5 rounded">
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
                  onClick={() => !disabled && handleClick(p.vendor)}
                  disabled={disabled}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    isBest
                      ? 'bg-primary-800 text-ink-on-dark hover:bg-primary-700'
                      : 'bg-surface-sunk text-ink-700 border border-ink-200 hover:border-primary-300 hover:text-primary-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Buy <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
