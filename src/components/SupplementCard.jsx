import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Plus, Info, ShoppingCart, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateUtms } from '@/lib/affiliate.js';
import { AffiliateDisclosureInline } from './AffiliateDisclosure.jsx';
import { TierBadge } from './TierBadge.jsx';
import { calculateStackScore } from '../utils/stackAnalyzer.js';

export function SupplementCard({ supplement, onViewDetails }) {
  const { addSupplement, stack, userGoals, stackScore } = useStack();

  const isInStack = stack.some(item => item.supplementId === supplement.id);

  // What-if simulator: precompute the score delta if this candidate were
  // added to the current stack. Cheap enough to run on every render of a
  // visible card; useMemo keys on stack/userGoals/supplement so the work
  // only happens when something actually changes.
  const whatIf = useMemo(() => {
    if (isInStack) return null;
    const candidate = {
      supplementId: supplement.id,
      dosage: (supplement.dosage.min + supplement.dosage.max) / 2,
      timing: supplement.dosage.timing,
    };
    const nextStack = [...stack, candidate];
    const nextScore = calculateStackScore(nextStack, userGoals)?.headlineScores?.overall;
    const cur = stackScore?.headlineScores?.overall;
    if (cur == null || nextScore == null) return null;
    const delta = nextScore - cur;
    return { current: cur, next: nextScore, delta };
  }, [isInStack, supplement.id, supplement.dosage.min, supplement.dosage.max, supplement.dosage.timing, stack, userGoals, stackScore]);

  const handleAddToStack = () => {
    const success = addSupplement(supplement);
    if (!success) {
      console.log('Supplement already in stack');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'energy': 'bg-orange-100 text-orange-800',
      'nootropic': 'bg-blue-100 text-blue-800',
      'adaptogen': 'bg-green-100 text-green-800',
      'longevity': 'bg-purple-100 text-purple-800',
      'vitamin': 'bg-yellow-100 text-yellow-800',
      'mineral': 'bg-gray-100 text-gray-800',
      'amino-acid': 'bg-pink-100 text-pink-800',
      'antioxidant': 'bg-red-100 text-red-800',
      'anti-inflammatory': 'bg-indigo-100 text-indigo-800',
      'sleep': 'bg-violet-100 text-violet-800',
      'performance': 'bg-emerald-100 text-emerald-800',
      'essential': 'bg-teal-100 text-teal-800',
      'gut-health': 'bg-lime-100 text-lime-800',
      'hormone': 'bg-rose-100 text-rose-800',
      'protein': 'bg-amber-100 text-amber-800',
      'immune': 'bg-cyan-100 text-cyan-800',
      'metabolic': 'bg-slate-100 text-slate-800',
      'superfood': 'bg-green-200 text-green-900',
      'fat': 'bg-orange-200 text-orange-900',
      'prescription': 'bg-red-200 text-red-900'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTopEffects = () => {
    const effects = Object.entries(supplement.effects)
      .filter(([_, value]) => value > 0)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3);
    
    return effects.map(([effect, value]) => ({
      name: effect.charAt(0).toUpperCase() + effect.slice(1),
      value
    }));
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold leading-tight mb-2">
              {supplement.name}
            </CardTitle>
            <div className="flex items-center gap-1.5 flex-wrap">
              <TierBadge supplementId={supplement.id} />
              <Badge variant="outline" className="text-xs capitalize">
                {supplement.category.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-3">
          {supplement.description}
        </CardDescription>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Top Effects:</div>
          <div className="flex flex-wrap gap-1">
            {getTopEffects().map(effect => (
              <Badge 
                key={effect.name} 
                variant="outline" 
                className="text-xs px-2 py-1"
              >
                {effect.name} +{effect.value}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Dosage: {supplement.dosage.min}-{supplement.dosage.max} {supplement.dosage.unit}
        </div>

        {whatIf && stack.length > 0 && (
          <div
            className="mt-3 flex items-center gap-2 text-xs px-2 py-1.5 rounded-md bg-surface-sunk border border-ink-200"
            title={`Adding ${supplement.name} would move your Stack Score from ${whatIf.current.toFixed(1)} to ${whatIf.next.toFixed(1)}`}
          >
            {whatIf.delta > 0.05 ? (
              <TrendingUp className="w-3.5 h-3.5 text-accent-700 shrink-0" />
            ) : whatIf.delta < -0.05 ? (
              <TrendingDown className="w-3.5 h-3.5 text-danger-500 shrink-0" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-ink-500 shrink-0" />
            )}
            <span className="text-ink-700">
              Adds → Score{' '}
              <span className="font-semibold text-ink-900">
                {whatIf.current.toFixed(1)} → {whatIf.next.toFixed(1)}
              </span>
              {Math.abs(whatIf.delta) >= 0.05 && (
                <span
                  className={
                    whatIf.delta > 0
                      ? 'ml-1 text-accent-700 font-semibold'
                      : 'ml-1 text-danger-500 font-semibold'
                  }
                >
                  ({whatIf.delta > 0 ? '+' : ''}{whatIf.delta.toFixed(1)})
                </span>
              )}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-3 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Link to={`/supplements/${supplement.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Info className="w-4 h-4 mr-1" />
              Details
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleAddToStack}
            disabled={isInStack}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-1" />
            {isInStack ? 'In Stack' : 'Add'}
          </Button>
        </div>
        {AFFILIATE_LINKS[supplement.id] && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-green-700 border-green-300 hover:bg-green-50"
              onClick={() => {
                const links = AFFILIATE_LINKS[supplement.id];
                const url = links.nootropicsdepot || (
                  links.amazon ? withAffiliateUtms(links.amazon, { campaign: `supplement-${supplement.id}` }) : (
                    links.iherb || Object.values(links).find(v => typeof v === 'string')
                  )
                );
                if (url) window.open(url, '_blank');
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Buy {supplement.name.split(' ')[0]}
            </Button>
            <div className="w-full text-center">
              <AffiliateDisclosureInline />
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

