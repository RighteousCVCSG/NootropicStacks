import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Target, Zap, Heart, Scale, Lightbulb, Users, BookOpen, GraduationCap } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { goals } from '../data/supplements.js';

const goalIcons = {
  energy: Zap,
  mood: Heart,
  balance: Scale,
  creativity: Lightbulb,
  socialness: Users,
  learning: BookOpen,
  study: GraduationCap
};

export function GoalSelector() {
  const { userGoals, setUserGoals } = useStack();

  const toggleGoal = (goalId) => {
    if (userGoals.includes(goalId)) {
      setUserGoals(userGoals.filter(g => g !== goalId));
    } else {
      setUserGoals([...userGoals, goalId]);
    }
  };

  const clearGoals = () => {
    setUserGoals([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Your Goals
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select what you want to optimize for. This helps us recommend the best supplements for your stack.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {goals.map((goal) => {
            const Icon = goalIcons[goal.id];
            const isSelected = userGoals.includes(goal.id);
            
            return (
              <Button
                key={goal.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => toggleGoal(goal.id)}
                className="h-auto p-4 flex flex-col items-center gap-2 text-center min-h-[100px]"
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="font-medium text-sm leading-tight">{goal.name}</div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {userGoals.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex flex-wrap gap-1">
              <span className="text-sm font-medium">Selected:</span>
              {userGoals.map((goalId) => {
                const goal = goals.find(g => g.id === goalId);
                return (
                  <Badge key={goalId} variant="secondary" className="text-xs">
                    {goal?.name}
                  </Badge>
                );
              })}
            </div>
            <Button variant="ghost" size="sm" onClick={clearGoals}>
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

