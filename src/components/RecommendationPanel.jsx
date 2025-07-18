import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Sparkles, Plus, TrendingUp } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { supplements } from '../data/supplements.js';

export function RecommendationPanel() {
  const { recommendations, addSupplement, userGoals } = useStack();

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            {userGoals.length === 0 
              ? "Select your goals above to get personalized recommendations!"
              : "Add some supplements to your stack to get recommendations for synergistic additions!"
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Recommended for You
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on your goals and current stack
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => {
          const supplement = rec.supplement;
          
          return (
            <div key={supplement.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{supplement.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {supplement.description}
                  </p>
                  
                  {/* Reasoning */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {rec.reasoning.map((reason, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {reason}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Dosage: {supplement.dosage.min}-{supplement.dosage.max} {supplement.dosage.unit}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => addSupplement(supplement)}
                  className="ml-4"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {/* Match Score */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Match Score:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(rec.score * 2, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-blue-600">
                  {Math.round(rec.score * 2)}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

