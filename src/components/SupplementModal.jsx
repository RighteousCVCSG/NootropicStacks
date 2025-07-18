import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Plus, AlertTriangle, Clock, Pill } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { AffiliateLinks } from './MonetizationManager.jsx';

export function SupplementModal({ supplement, isOpen, onClose }) {
  const { addSupplement, stack } = useStack();

  if (!supplement) return null;

  const isInStack = stack.some(item => item.supplementId === supplement.id);

  const handleAddToStack = () => {
    const success = addSupplement(supplement);
    if (success) {
      onClose();
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

  const getEffectColor = (value) => {
    if (value >= 7) return 'text-green-600';
    if (value >= 4) return 'text-blue-600';
    if (value >= 1) return 'text-gray-600';
    if (value <= -1) return 'text-red-600';
    return 'text-gray-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{supplement.name}</h2>
              <Badge className={`${getCategoryColor(supplement.category)} mt-2`}>
                {supplement.category.replace('-', ' ')}
              </Badge>
            </div>
            <Button
              onClick={handleAddToStack}
              disabled={isInStack}
              className="ml-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isInStack ? 'In Stack' : 'Add to Stack'}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{supplement.description}</p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-semibold mb-2">Key Benefits</h3>
            <div className="flex flex-wrap gap-2">
              {supplement.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>

          {/* Effects Profile */}
          <div>
            <h3 className="font-semibold mb-3">Effects Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(supplement.effects).map(([effect, value]) => (
                <div key={effect} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{effect}</span>
                    <span className={`text-sm font-bold ${getEffectColor(value)}`}>
                      {value > 0 ? '+' : ''}{value}
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(value) * 10} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dosage Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Dosage</h4>
              </div>
              <p className="text-blue-700">
                {supplement.dosage.min}-{supplement.dosage.max} {supplement.dosage.unit}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-600" />
                <h4 className="font-semibold text-green-800">Timing</h4>
              </div>
              <p className="text-green-700">{supplement.dosage.timing}</p>
            </div>
          </div>

          {/* Affiliate Links */}
          <AffiliateLinks 
            supplementId={supplement.id} 
            supplementName={supplement.name} 
          />

          {/* Warnings */}
          {supplement.warnings && supplement.warnings.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Important Warnings</h3>
              <div className="space-y-2">
                {supplement.warnings.map((warning, index) => (
                  <Alert key={index} className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      {warning}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* Interactions */}
          {supplement.interactions && supplement.interactions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Potential Interactions</h3>
              <div className="flex flex-wrap gap-2">
                {supplement.interactions.map((interaction, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {interaction.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Medical Disclaimer */}
          <Alert className="border-gray-200 bg-gray-50">
            <AlertTriangle className="h-4 w-4 text-gray-600" />
            <AlertDescription className="text-gray-700">
              <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended as medical advice. 
              Always consult with a healthcare professional before starting any new supplement regimen, especially if you have medical conditions or take medications.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}

