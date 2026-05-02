import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge.jsx';
import { Plus, Info, ShoppingCart } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateLink, pickPreferredVendor, VENDOR_LABEL_SHORT } from '@/lib/affiliate.js';
import { TierBadge } from './TierBadge.jsx';
import { getCheapestVendor } from '../data/priceTable.js';

// One supplement card. Designed to render at a predictable, compact
// height across the library grid:
//   1. Header — tier badge, category chip, name
//   2. One-line description (clamped to 2 lines max)
//   3. Stat line — top effect + dosage range
//   4. Footer — Details · Add · Buy (single row on desktop, wraps on mobile)
//
// Heavy/secondary content (full description, all 7 effect scores, what-if
// simulator, multi-vendor price comparison) lives on /supplements/<id>.

function topEffect(supplement) {
  const entries = Object.entries(supplement.effects || {})
    .filter(([, v]) => typeof v === 'number' && v > 0)
    .sort(([, a], [, b]) => b - a);
  if (entries.length === 0) return null;
  const [name, value] = entries[0];
  return { name: name.charAt(0).toUpperCase() + name.slice(1), value };
}

export function SupplementCard({ supplement }) {
  const { addSupplement, stack } = useStack();
  const isInStack = stack.some((item) => item.supplementId === supplement.id);
  const links = AFFILIATE_LINKS[supplement.id];
  const top = topEffect(supplement);

  const handleAdd = () => {
    addSupplement(supplement);
  };

  const preferredVendor = pickPreferredVendor(supplement.id, links, getCheapestVendor);
  const cheapest = getCheapestVendor(supplement.id);
  const vendorShort = preferredVendor ? (VENDOR_LABEL_SHORT[preferredVendor] || preferredVendor) : '';
  // Vendor-first label keeps the price anchor visible without reading as a
  // price-tag-first storefront on a YMYL site. Falls back to vendor-only when
  // we don't have tracked-price data so cards never show stale numbers.
  const buyLabel = preferredVendor
    ? (cheapest && cheapest.vendor === preferredVendor
        ? `${vendorShort} · $${cheapest.price.toFixed(2)}`
        : vendorShort)
    : 'Buy';

  const handleBuy = () => {
    if (!links || !preferredVendor) return;
    const rawUrl = links[preferredVendor];
    const url = withAffiliateLink(rawUrl, { campaign: `card-${supplement.id}` });
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col h-full rounded-md bg-surface-card border border-ink-200 hover:border-primary-300 transition-colors">
      <div className="px-3 pt-2.5 pb-1.5 space-y-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <TierBadge supplementId={supplement.id} size="xs" />
          <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">
            {supplement.category.replace('-', ' ')}
          </Badge>
        </div>
        <h3 className="text-sm font-semibold leading-tight text-ink-900">
          {supplement.name}
        </h3>
      </div>

      <div className="flex-1 px-3 pb-2 space-y-1.5">
        <p className="text-xs text-ink-700 line-clamp-2 leading-snug">
          {supplement.description}
        </p>
        {/* Fixed-height stat row keeps card grid alignment regardless of
            whether the supplement has a non-zero top effect. */}
        <div className="flex items-center gap-2 text-[11px] text-ink-500 min-h-[1.1rem]">
          {top && (
            <>
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-ink-700">{top.name}</span>
                <span className="font-mono">+{top.value}</span>
              </span>
              <span aria-hidden>·</span>
            </>
          )}
          <span className="font-mono">
            {supplement.dosage.min}–{supplement.dosage.max} {supplement.dosage.unit}
          </span>
        </div>
      </div>

      {/* Footer hierarchy: Add primary, Buy secondary outline, Details
          is the tiny ghost icon. Custom anchors at h-7 to match the
          MeasureBoard density we use everywhere else. */}
      <div className="px-2 pb-2 flex items-stretch gap-1">
        <Link
          to={`/supplements/${supplement.id}`}
          aria-label={`View details for ${supplement.name}`}
          title={`Details — ${supplement.name}`}
          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-ink-500 hover:text-ink-900 hover:bg-surface-sunk shrink-0"
        >
          <Info className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isInStack}
          className="inline-flex items-center justify-center gap-1 h-7 px-2 rounded-md text-[11px] font-medium bg-primary-050 hover:bg-primary-100 text-primary-800 border border-primary-300 hover:border-primary-500 transition-colors flex-1 min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3 shrink-0" />
          <span className="truncate">{isInStack ? 'Added' : 'Add'}</span>
        </button>
        <button
          type="button"
          onClick={handleBuy}
          disabled={!links}
          title={links ? buyLabel : 'Vendor links not yet available'}
          className="inline-flex items-center justify-center gap-1 h-7 px-2 rounded-md text-[11px] font-medium border border-accent-500 text-accent-700 hover:bg-accent-050 transition-colors flex-1 min-w-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-3 h-3 shrink-0" />
          <span className="truncate">{buyLabel}</span>
        </button>
      </div>
    </div>
  );
}
