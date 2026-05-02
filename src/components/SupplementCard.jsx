import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Plus, Info, ShoppingCart } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateUtms } from '@/lib/affiliate.js';
import { TierBadge } from './TierBadge.jsx';

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

  const handleBuy = () => {
    if (!links) return;
    const url =
      links.nootropicsdepot ||
      (links.amazon
        ? withAffiliateUtms(links.amazon, { campaign: `card-${supplement.id}` })
        : links.iherb || Object.values(links).find((v) => typeof v === 'string'));
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
        <div className="flex items-center gap-2 text-xs text-ink-500">
          {top && (
            <span className="inline-flex items-center gap-1">
              <span className="font-semibold text-ink-700">{top.name}</span>
              <span className="font-mono">+{top.value}</span>
            </span>
          )}
          {top && <span aria-hidden>·</span>}
          <span className="font-mono">
            {supplement.dosage.min}–{supplement.dosage.max} {supplement.dosage.unit}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-3 px-4 grid grid-cols-3 gap-1.5">
        <Link to={`/supplements/${supplement.id}`} className="col-span-1">
          <Button variant="outline" size="sm" className="w-full text-xs px-1">
            <Info className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={isInStack}
          className="col-span-1 text-xs px-1"
        >
          <Plus className="w-3.5 h-3.5 mr-0.5" />
          {isInStack ? 'Added' : 'Add'}
        </Button>
        {links ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBuy}
            className="col-span-1 text-xs px-1 border-accent-500 text-accent-700 hover:bg-accent-050"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-0.5" />
            Buy
          </Button>
        ) : (
          <span className="col-span-1" aria-hidden />
        )}
      </CardFooter>
    </Card>
  );
}
