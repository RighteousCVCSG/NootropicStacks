import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Star, Zap, Brain, Heart, Target, AlertTriangle, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import { predefinedStacks } from '../data/predefinedStacks.js';
import { supplements } from '../data/supplements.js';
import { useStack } from '../contexts/StackContext.jsx';
import { analyzeStackSafety, calculateItemContribution } from '../utils/stackAnalyzer.js';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { resolveVendorUrls } from '@/lib/affiliate.js';
import { JsonLd } from './JsonLd.jsx';
import { buildItemListSchema } from '../lib/schema/builders.js';

export function PredefinedStacks() {
  const { loadStack, stack } = useStack();
  const [selectedStack, setSelectedStack] = useState(null);

  const getLevelIcon = (level) => {
    switch (level) {
      case 'basic':
        return <Star className="w-4 h-4 text-accent-700" />;
      case 'intermediate':
        return <Zap className="w-4 h-4 text-primary-700" />;
      case 'advanced':
        return <Brain className="w-4 h-4 text-primary-700" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'basic':
        return 'bg-accent-100 text-accent-700 border-accent-300';
      case 'intermediate':
        return 'bg-primary-100 text-primary-800 border-primary-300';
      case 'advanced':
        return 'bg-primary-100 text-primary-800 border-primary-300';
      default:
        return 'bg-surface-sunk text-ink-900 border-ink-200';
    }
  };

  const getGoalIcon = (goal) => {
    const icons = {
      focus: <Brain className="w-3 h-3" />,
      energy: <Zap className="w-3 h-3" />,
      mood: <Heart className="w-3 h-3" />,
      balance: <Target className="w-3 h-3" />,
      creativity: <Star className="w-3 h-3" />,
      learning: <Brain className="w-3 h-3" />,
      study: <Brain className="w-3 h-3" />,
      socialness: <Heart className="w-3 h-3" />,
      sleep: <Target className="w-3 h-3" />,
      performance: <Zap className="w-3 h-3" />,
      longevity: <Heart className="w-3 h-3" />
    };
    return icons[goal] || <Target className="w-3 h-3" />;
  };

  const handleLoadStack = (stackData) => {
    const stackItems = stackData.supplements.map(item => ({
      supplementId: item.id,
      dosage: item.dosage
    }));
    
    loadStack(stackItems);
    setSelectedStack(null);
  };

  const analyzeStackPreview = (stackData) => {
    const stackItems = stackData.supplements.map(item => ({
      supplementId: item.id,
      dosage: item.dosage
    }));
    
    return analyzeStackSafety(stackItems);
  };

  const getSupplementName = (id) => {
    const supplement = supplements.find(s => s.id === id);
    return supplement ? supplement.name : id;
  };

  const stacksByLevel = {
    basic: predefinedStacks.filter(s => s.level === 'basic'),
    intermediate: predefinedStacks.filter(s => s.level === 'intermediate'),
    advanced: predefinedStacks.filter(s => s.level === 'advanced')
  };

  const StackCard = ({ stackData }) => {
    const analysis = analyzeStackPreview(stackData);
    const hasWarnings = analysis.warnings.length > 0;

    return (
      <Card className="h-full hover:shadow-1 transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{stackData.name}</CardTitle>
            <div className="flex items-center gap-2">
              {getLevelIcon(stackData.level)}
              <Badge className={getLevelColor(stackData.level)}>
                {stackData.level}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-ink-700">{stackData.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Goals */}
          <div>
            <h4 className="text-sm font-medium mb-2">Primary Goals</h4>
            <div className="flex flex-wrap gap-1">
              {stackData.goals.map(goal => (
                <Badge key={goal} variant="outline" className="text-xs">
                  {getGoalIcon(goal)}
                  <span className="ml-1 capitalize">{goal}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Supplements — each row is a Link to the supplement's research
              page. Tiny color-coded dimension dots after the name show what
              this supplement contributes to (Overall / Sleep / Energy / Mind),
              matching the dimension chip colors used in the StackDrawer. */}
          <div>
            <h4 className="text-sm font-medium mb-2">Supplements ({stackData.supplements.length})</h4>
            <div className="space-y-0.5">
              {stackData.supplements.map(item => {
                const contribution = calculateItemContribution({
                  supplementId: item.id,
                  dosage: item.dosage,
                });
                const dims = [
                  { key: 'overall', accent: 'var(--color-primary-500)', score: contribution.overall, label: 'Overall' },
                  { key: 'sleep',   accent: 'var(--color-info-500)',    score: contribution.sleep,   label: 'Sleep' },
                  { key: 'energy',  accent: 'var(--color-warn-500)',    score: contribution.energy,  label: 'Energy' },
                  { key: 'mind',    accent: 'var(--color-accent-500)',  score: contribution.mind,    label: 'Mind' },
                ];
                return (
                  <Link
                    key={item.id}
                    to={`/supplements/${item.id}`}
                    className="flex items-center justify-between text-xs px-1.5 py-0.5 rounded hover:bg-primary-050 transition-colors group"
                  >
                    <span className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="text-ink-700 truncate group-hover:text-primary-800">
                        {getSupplementName(item.id)}
                      </span>
                      <span className="inline-flex items-center gap-0.5 shrink-0">
                        {dims.map((d) => (
                          <span
                            key={d.key}
                            title={`${d.label}: ${d.score.toFixed(1)}`}
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: d.accent,
                              opacity: d.score >= 1 ? 1 : 0.18,
                            }}
                          />
                        ))}
                      </span>
                    </span>
                    <span className="text-ink-500 shrink-0 ml-2 font-mono">{item.dosage}mg</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Safety Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Safety Score</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                analysis.safetyScore >= 80 ? 'bg-accent-500' : 
                analysis.safetyScore >= 60 ? 'bg-warn-700' : 'bg-danger-700'
              }`} />
              <span className="text-sm">{analysis.safetyScore}/100</span>
            </div>
          </div>

          {/* Warnings */}
          {hasWarnings && (
            <Alert className="border-warn-500 bg-warn-100">
              <AlertTriangle className="h-4 w-4 text-warn-700" />
              <AlertDescription className="text-warn-700 text-xs">
                {analysis.warnings.length} warning(s) - Click "View Details" for more info
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => setSelectedStack(stackData)}
              variant="outline"
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              size="sm"
              onClick={() => handleLoadStack(stackData)}
              className="flex-1"
            >
              <Plus className="w-3 h-3 mr-1" />
              Load Stack
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StackDetailModal = ({ stackData, onClose }) => {
    if (!stackData) return null;

    const analysis = analyzeStackPreview(stackData);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">{stackData.name}</h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            <div className="space-y-3">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-ink-700">{stackData.description}</p>
              </div>

              {/* Level and Goals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Level</h3>
                  <Badge className={getLevelColor(stackData.level)}>
                    {getLevelIcon(stackData.level)}
                    <span className="ml-1 capitalize">{stackData.level}</span>
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Primary Goals</h3>
                  <div className="flex flex-wrap gap-1">
                    {stackData.goals.map(goal => (
                      <Badge key={goal} variant="outline" className="text-xs">
                        {getGoalIcon(goal)}
                        <span className="ml-1 capitalize">{goal}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Supplements Detail */}
              <div>
                <h3 className="font-semibold mb-3">Supplement Breakdown</h3>
                <div className="space-y-3">
                  {stackData.supplements.map(item => {
                    const supplement = supplements.find(s => s.id === item.id);
                    const hasAffiliate = AFFILIATE_LINKS[item.id];
                    return (
                      <div key={item.id} className="p-3 bg-surface-card rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <Link to={`/supplements/${item.id}`} className="font-medium hover:text-primary-700">
                            {supplement?.name || item.id}
                          </Link>
                          <span className="text-sm text-ink-700">{item.dosage}mg</span>
                        </div>
                        {supplement && (
                          <p className="text-sm text-ink-700">{supplement.description}</p>
                        )}
                        {(() => {
                          const trackClick = (vendor) => {
                            fetch('/api/track/click', {
                              method: 'POST',
                              headers: {'Content-Type':'application/json'},
                              body: JSON.stringify({ supplementId: item.id, vendor, page: 'stacks' })
                            }).catch(() => {});
                          };
                          const vendorClasses = {
                            amazon: 'bg-warn-700 hover:bg-warn-800',
                            iherb: 'bg-accent-600 hover:bg-accent-700',
                          };
                          const options = resolveVendorUrls(item.id, supplement?.name || item.id, hasAffiliate, { campaign: `stack-${stackData.id}` })
                            .filter(o => vendorClasses[o.vendor]);
                          return (
                            <div className="flex gap-2 mt-2">
                              {options.map(o => (
                                <a key={o.vendor} href={o.url} target="_blank" rel="noopener noreferrer sponsored"
                                   onClick={() => trackClick(o.vendor)}
                                   className={`flex items-center gap-1 text-xs ${vendorClasses[o.vendor]} text-white px-3 py-1.5 rounded font-medium transition-colors`}>
                                  <ShoppingCart className="w-3 h-3" /> {o.vendor === 'amazon' ? 'Amazon' : 'iHerb'}{o.curated ? '' : ' (search)'}
                                </a>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Safety Analysis */}
              <div>
                <h3 className="font-semibold mb-3">Safety Analysis</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface-card rounded-md">
                    <span className="font-medium">Overall Safety Score</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        analysis.safetyScore >= 80 ? 'bg-accent-500' : 
                        analysis.safetyScore >= 60 ? 'bg-warn-700' : 'bg-danger-700'
                      }`} />
                      <span className="font-semibold">{analysis.safetyScore}/100</span>
                    </div>
                  </div>

                  {analysis.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Warnings & Considerations</h4>
                      <div className="space-y-2">
                        {analysis.warnings.map((warning, index) => (
                          <Alert key={index} className="border-warn-500 bg-warn-100">
                            <AlertTriangle className="h-4 w-4 text-warn-700" />
                            <AlertDescription className="text-warn-700">
                              <strong>{warning.severity.toUpperCase()}:</strong> {warning.message}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Effects Preview */}
                  <div>
                    <h4 className="font-medium mb-2">Expected Effects</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(analysis.totalEffects).map(([effect, value]) => (
                        <div key={effect} className="flex justify-between text-sm">
                          <span className="capitalize">{effect}</span>
                          <span className={`font-medium ${
                            value >= 7 ? 'text-accent-700' : 
                            value >= 4 ? 'text-primary-700' : 'text-ink-500'
                          }`}>
                            {value.toFixed(1)}/9.5
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Load Stack Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => handleLoadStack(stackData)}
                  className="w-full md:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Load This Stack
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const itemListItems = predefinedStacks.flatMap((s) =>
    s.supplements
      .filter((item) => item.id)
      .map((item) => ({
        name: getSupplementName(item.id),
        url: `https://nootropicstacker.com/supplements/${item.id}`,
      }))
  );

  return (
    <div className="space-y-3">
      <JsonLd
        data={buildItemListSchema({
          name: 'Pre-Built Nootropic Supplement Stacks',
          items: itemListItems,
        })}
      />
      <div>
        <h2 className="text-2xl font-semibold mb-2">Pre-Built Supplement Stacks</h2>
        <p className="text-ink-700">
          Expertly curated supplement combinations for specific goals and experience levels.
        </p>
      </div>

      {/* Points to the fuller, fully-monetized stack collection — this tab
          only carries a handful of legacy stacks with partial buy links. */}
      <Link
        to="/best-stacks"
        className="flex items-center justify-between gap-2 p-3 rounded-md border border-primary-300 bg-primary-050 hover:bg-primary-100 transition-colors group"
      >
        <span className="text-sm font-medium text-primary-800">
          See our 8 expert-curated stacks with full buy links →
        </span>
        <ArrowRight className="w-4 h-4 text-primary-800 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Basic ({stacksByLevel.basic.length})
          </TabsTrigger>
          <TabsTrigger value="intermediate" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Intermediate ({stacksByLevel.intermediate.length})
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Advanced ({stacksByLevel.advanced.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stacksByLevel.basic.map(stackData => (
              <StackCard key={stackData.id} stackData={stackData} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stacksByLevel.intermediate.map(stackData => (
              <StackCard key={stackData.id} stackData={stackData} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Alert className="border-warn-500 bg-warn-100">
            <AlertTriangle className="h-4 w-4 text-warn-700" />
            <AlertDescription className="text-warn-700">
              <strong>Advanced Stacks:</strong> These combinations are for experienced users only. 
              Some may contain prescription substances or require medical supervision.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stacksByLevel.advanced.map(stackData => (
              <StackCard key={stackData.id} stackData={stackData} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Stack Detail Modal */}
      {selectedStack && (
        <StackDetailModal
          stackData={selectedStack}
          onClose={() => setSelectedStack(null)}
        />
      )}
    </div>
  );
}

