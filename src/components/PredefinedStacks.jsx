import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Star, Zap, Brain, Heart, Target, AlertTriangle, Plus, ShoppingCart } from 'lucide-react';
import { predefinedStacks } from '../data/predefinedStacks.js';
import { supplements } from '../data/supplements.js';
import { useStack } from '../contexts/StackContext.jsx';
import { analyzeStackSafety } from '../utils/stackAnalyzer.js';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';

export function PredefinedStacks() {
  const { loadStack, stack } = useStack();
  const [selectedStack, setSelectedStack] = useState(null);

  const getLevelIcon = (level) => {
    switch (level) {
      case 'basic':
        return <Star className="w-4 h-4 text-green-600" />;
      case 'intermediate':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'advanced':
        return <Brain className="w-4 h-4 text-purple-600" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'basic':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <Card className="h-full hover:shadow-md transition-shadow">
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
          <p className="text-sm text-gray-600">{stackData.description}</p>
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

          {/* Supplements */}
          <div>
            <h4 className="text-sm font-medium mb-2">Supplements ({stackData.supplements.length})</h4>
            <div className="space-y-1">
              {stackData.supplements.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-gray-700">{getSupplementName(item.id)}</span>
                  <span className="text-gray-500">{item.dosage}mg</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Safety Score</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                analysis.safetyScore >= 80 ? 'bg-green-500' : 
                analysis.safetyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm">{analysis.safetyScore}/100</span>
            </div>
          </div>

          {/* Warnings */}
          {hasWarnings && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-xs">
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
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{stackData.name}</h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{stackData.description}</p>
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
                      <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Link to={`/supplements/${item.id}`} className="font-medium hover:text-blue-600">
                            {supplement?.name || item.id}
                          </Link>
                          <span className="text-sm text-gray-600">{item.dosage}mg</span>
                        </div>
                        {supplement && (
                          <p className="text-sm text-gray-600">{supplement.description}</p>
                        )}
                        {hasAffiliate && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => {
                              const links = AFFILIATE_LINKS[item.id];
                              const url = links.nootropicsdepot || links.amazon || links.iherb || Object.values(links).find(v => typeof v === 'string');
                              if (url) window.open(url, '_blank');
                            }}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Buy {supplement?.name.split(' ')[0]}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Safety Analysis */}
              <div>
                <h3 className="font-semibold mb-3">Safety Analysis</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Overall Safety Score</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        analysis.safetyScore >= 80 ? 'bg-green-500' : 
                        analysis.safetyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="font-bold">{analysis.safetyScore}/100</span>
                    </div>
                  </div>

                  {analysis.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Warnings & Considerations</h4>
                      <div className="space-y-2">
                        {analysis.warnings.map((warning, index) => (
                          <Alert key={index} className="border-orange-200 bg-orange-50">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800">
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
                            value >= 7 ? 'text-green-600' : 
                            value >= 4 ? 'text-blue-600' : 'text-gray-500'
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Pre-Built Supplement Stacks</h2>
        <p className="text-gray-600">
          Expertly curated supplement combinations for specific goals and experience levels.
        </p>
      </div>

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
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
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

