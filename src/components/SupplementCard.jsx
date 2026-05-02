import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
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
    <Card className="flex flex-col h-full hover:shadow-2 hover:border-primary-300 transition-colors">
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <TierBadge supplementId={supplement.id} size="xs" />
          <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">
            {supplement.category.replace('-', ' ')}
          </Badge>
        </div>
        <CardTitle className="text-base font-semibold leading-tight">
          {supplement.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-3 space-y-2">
        <p className="text-xs text-ink-700 line-clamp-2 leading-snug">
          {supplement.description}
        </p>
        {/* Fixed-height stat row keeps card grid alignment regardless of
            whether the supplement has a non-zero top effect. */}
        <div className="flex items-center gap-2 text-xs text-ink-500 min-h-[1.25rem]">
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
      </CardContent>

      {/* Footer hierarchy: Add is the primary conversion action (filled),
          Buy is the secondary affiliate action (outline), Details is a small
          icon-only ghost — least visual weight, since it's just a "more info"
          jump. Designer panel called this out: equal-weight buttons hid the
          primary action. */}
      <CardFooter className="pt-0 pb-3 px-3 flex items-stretch gap-1.5">
        <Button asChild variant="ghost" size="sm" className="w-8 px-0 shrink-0 text-ink-500 hover:text-ink-900">
          <Link to={`/supplements/${supplement.id}`} aria-label={`View details for ${supplement.name}`} title={`Details — ${supplement.name}`}>
            <Info className="w-3.5 h-3.5" />
          </Link>
        </Button>
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={isInStack}
          className="flex-1 min-w-0 text-xs px-2"
        >
          <Plus className="w-3.5 h-3.5 mr-0.5 shrink-0" />
          <span className="truncate">{isInStack ? 'Added' : 'Add'}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBuy}
          disabled={!links}
          className="flex-1 min-w-0 text-xs px-2 border-accent-500 text-accent-700 hover:bg-accent-050 disabled:opacity-40"
          title={links ? buyLabel : 'Vendor links not yet available'}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-0.5 shrink-0" />
          <span className="truncate">{buyLabel}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
