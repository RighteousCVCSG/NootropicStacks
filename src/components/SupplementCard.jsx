import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Plus, Info } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';

export function SupplementCard({ supplement, onViewDetails }) {
  const { addSupplement, stack } = useStack();
  
  const isInStack = stack.some(item => item.supplementId === supplement.id);
  
  const handleAddToStack = () => {
    const success = addSupplement(supplement);
    if (!success) {
      // Could show a toast notification here
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
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold leading-tight mb-2">
              {supplement.name}
            </CardTitle>
            <Badge className={`${getCategoryColor(supplement.category)} text-xs`}>
              {supplement.category.replace('-', ' ')}
            </Badge>
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
      </CardContent>
      
      <CardFooter className="pt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(supplement)}
          className="flex-1"
        >
          <Info className="w-4 h-4 mr-1" />
          Details
        </Button>
        <Button
          size="sm"
          onClick={handleAddToStack}
          disabled={isInStack}
          className="flex-1"
        >
          <Plus className="w-4 h-4 mr-1" />
          {isInStack ? 'In Stack' : 'Add'}
        </Button>
      </CardFooter>
    </Card>
  );
}

