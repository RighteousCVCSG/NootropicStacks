import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Trash2, AlertTriangle, CheckCircle, XCircle, Save, ShoppingCart, ExternalLink } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { supplements } from '../data/supplements.js';
import { SaveStackDialog } from './SaveStackDialog.jsx';
import { SavedStacksList } from './SavedStacksList.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';

// Estimated monthly costs in USD (based on typical market prices for quality products)
const MONTHLY_COSTS = {
  'coq10': 22, 'ashwagandha': 18, 'l-theanine': 12, 'caffeine': 6,
  'lions-mane': 28, 'lion-mane': 28, 'lions-mane-mushroom': 28,
  'bacopa': 18, 'alpha-gpc': 25, 'alpha-gpc-choline': 25,
  'creatine': 14, 'magnesium': 16, 'magnesium-glycinate': 16,
  'vitamin-d': 8, 'vitamin-d3': 8, 'omega3': 22, 'fish-oil': 20,
  'rhodiola': 20, 'rhodiola-rosea': 20, 'citicoline': 24,
  'phosphatidylserine': 28, 'huperzine-a': 16, 'noopept': 18,
  'piracetam': 20, 'aniracetam': 24, 'phenylpiracetam': 28,
  'oxiracetam': 26, 'modafinil': 80, 'armodafinil': 90,
  'nad-precursors': 45, 'nmn': 45, 'nr': 40, 'resveratrol': 20,
  'curcumin': 18, 'turmeric': 12, 'zinc': 8, 'melatonin': 8,
  'b-complex': 10, 'tyrosine': 14, 'l-tyrosine': 14, 'taurine': 10,
  'cordyceps': 24, 'reishi': 20, 'lions-mane-extract': 28,
  'panax-ginseng': 18, 'mucuna-pruriens': 16, 'ginkgo': 12,
  'bacopa-monnieri': 18, 'collagen': 22, 'probiotics': 26,
  'vitamin-c': 8, 'mct-oil': 18, 'spirulina': 16,
  'green-tea-extract': 12, 'berberine': 18, 'alpha-lipoic-acid': 16,
  'kanna': 22, 'pramiracetam': 30, 'coluracetam': 32, 'fasoracetam': 28,
};

function getMonthlyStackCost(stack) {
  return stack.reduce((total, item) => {
    const cost = MONTHLY_COSTS[item.supplementId] || 20; // default $20 if unknown
    return total + cost;
  }, 0);
}

export function StackPanel() {
  const { stack, safetyAnalysis, removeSupplement, updateDosage } = useStack();
  const { user } = useAuth();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  if (stack.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            My Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No supplements in your stack yet. Add some from the library below!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getEffectColor = (value) => {
    if (value >= 9.5) return 'bg-red-500';
    if (value >= 8) return 'bg-orange-500';
    if (value >= 6) return 'bg-yellow-500';
    if (value >= 3) return 'bg-green-500';
    return 'bg-gray-300';
  };

  const getEffectTextColor = (value) => {
    if (value >= 9.5) return 'text-red-700';
    if (value >= 8) return 'text-orange-700';
    if (value >= 6) return 'text-yellow-700';
    if (value >= 3) return 'text-green-700';
    return 'text-gray-600';
  };

  const getSafetyIcon = () => {
    if (!safetyAnalysis) return <CheckCircle className="w-5 h-5 text-green-500" />;
    
    const hasHighSeverity = safetyAnalysis.warnings.some(w => w.severity === 'high');
    const hasMediumSeverity = safetyAnalysis.warnings.some(w => w.severity === 'medium');
    
    if (hasHighSeverity) return <XCircle className="w-5 h-5 text-red-500" />;
    if (hasMediumSeverity) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getSafetyColor = () => {
    if (!safetyAnalysis) return 'text-green-600';
    
    const hasHighSeverity = safetyAnalysis.warnings.some(w => w.severity === 'high');
    const hasMediumSeverity = safetyAnalysis.warnings.some(w => w.severity === 'medium');
    
    if (hasHighSeverity) return 'text-red-600';
    if (hasMediumSeverity) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              My Stack ({stack.length} supplements)
            </div>
            <div className="flex items-center gap-2">
              {user && stack.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)} className="text-xs">
                  <Save className="w-3.5 h-3.5 mr-1" />Save
                </Button>
              )}
              {getSafetyIcon()}
              <span className={`text-sm font-medium ${getSafetyColor()}`}>
                Safety: {safetyAnalysis?.safetyScore || 100}/100
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Effect Meters */}
          {safetyAnalysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(safetyAnalysis.totalEffects).map(([effect, value]) => (
                <div key={effect} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{effect}</span>
                    <span className={`text-sm font-bold ${getEffectTextColor(value)}`}>
                      {value.toFixed(1)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(value * 10, 100)} 
                    className="h-2"
                    style={{
                      '--progress-background': getEffectColor(value)
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {safetyAnalysis?.warnings && safetyAnalysis.warnings.length > 0 && (
            <div className="space-y-2">
              {safetyAnalysis.warnings.map((warning, index) => (
                <Alert 
                  key={index} 
                  className={`${
                    warning.severity === 'high' ? 'border-red-200 bg-red-50' :
                    warning.severity === 'medium' ? 'border-orange-200 bg-orange-50' :
                    'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <AlertTriangle className={`h-4 w-4 ${
                    warning.severity === 'high' ? 'text-red-600' :
                    warning.severity === 'medium' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                  <AlertDescription className={`${
                    warning.severity === 'high' ? 'text-red-800' :
                    warning.severity === 'medium' ? 'text-orange-800' :
                    'text-yellow-800'
                  }`}>
                    {warning.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Stack Items */}
          <div className="space-y-3">
            {stack.map((stackItem) => {
              const supplement = supplements.find(s => s.id === stackItem.supplementId);
              if (!supplement) return null;

              return (
                <div key={stackItem.supplementId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{supplement.name}</div>
                    <div className="text-sm text-gray-600">
                      {stackItem.dosage} {supplement.dosage.unit} • {stackItem.timing}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={stackItem.dosage}
                      onChange={(e) => updateDosage(stackItem.supplementId, parseFloat(e.target.value))}
                      min={supplement.dosage.min}
                      max={supplement.dosage.max}
                      step={supplement.dosage.unit === 'mcg' ? 10 : supplement.dosage.unit === 'mg' ? 50 : 1}
                      className="w-20 px-2 py-1 text-sm border rounded"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSupplement(stackItem.supplementId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shop Your Stack */}
          {(() => {
            const stackWithLinks = stack.filter(item => AFFILIATE_LINKS[item.supplementId]);
            if (stackWithLinks.length === 0) return null;
            return (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  Shop Your Stack
                </h4>
                <div className="space-y-1">
                  {stackWithLinks.slice(0, 5).map(item => {
                    const links = AFFILIATE_LINKS[item.supplementId];
                    const supplement = supplements.find(s => s.id === item.supplementId);
                    const buyUrl = links.amazon || links.iherb || links.nootropicsdepot || Object.values(links).find(v => typeof v === 'string');
                    if (!supplement || !buyUrl) return null;
                    return (
                      <a
                        key={item.supplementId}
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded hover:bg-green-50 text-sm group"
                      >
                        <span className="text-gray-700 group-hover:text-green-800 truncate mr-2">{supplement.name}</span>
                        <span className="text-green-600 text-xs font-medium shrink-0 flex items-center gap-1">
                          Buy <ExternalLink className="w-3 h-3" />
                        </span>
                      </a>
                    );
                  })}
                </div>
                {stackWithLinks.length > 5 && (
                  <p className="text-xs text-gray-500 mt-1">+{stackWithLinks.length - 5} more in your stack</p>
                )}
              </div>
            );
          })()}

          {/* Monthly Cost Estimate */}
          {stack.length > 0 && (
            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Estimated monthly cost</p>
                <p className="text-lg font-bold text-gray-800">${getMonthlyStackCost(stack)}/mo</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{stack.length} supplement{stack.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-400">~${Math.round(getMonthlyStackCost(stack)/30)}/day</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved stacks (when logged in) */}
      {user && <SavedStacksList />}

      {/* Save dialog */}
      <SaveStackDialog open={showSaveDialog} onOpenChange={setShowSaveDialog} />
    </div>
  );
}

