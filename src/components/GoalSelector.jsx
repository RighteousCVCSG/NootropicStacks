import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
  Target,
  Zap,
  Heart,
  Scale,
  Lightbulb,
  Users,
  BookOpen,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { goals } from '../data/supplements.js';

const goalIcons = {
  study:      GraduationCap,  // Focus / concentration
  energy:     Zap,
  balance:    Scale,           // Calm / stress
  mood:       Heart,
  learning:   BookOpen,
  creativity: Lightbulb,
  socialness: Users,
};

// Headline 4 dimensions surface up front. Memory / Creativity / Social tuck
// behind a "more dimensions" toggle so first-time visitors aren't drowning
// in seven options before they've picked one.
const HEADLINE_GOAL_IDS = ['study', 'energy', 'balance', 'mood'];

export function GoalSelector() {
  const { userGoals, setUserGoals } = useStack();
  const [expanded, setExpanded] = useState(false);

  const toggleGoal = (goalId) => {
    if (userGoals.includes(goalId)) {
      setUserGoals(userGoals.filter((g) => g !== goalId));
    } else {
      setUserGoals([...userGoals, goalId]);
    }
  };

  const clearGoals = () => setUserGoals([]);

  const headlineGoals = HEADLINE_GOAL_IDS
    .map((id) => goals.find((g) => g.id === id))
    .filter(Boolean);
  const moreGoals = goals.filter((g) => !HEADLINE_GOAL_IDS.includes(g.id));

  // If a user previously selected a "more" goal, auto-expand so they can see it.
  const hasHiddenSelection = userGoals.some((id) => !HEADLINE_GOAL_IDS.includes(id));
  const showMore = expanded || hasHiddenSelection;

  const renderGoalButton = (goal) => {
    const Icon = goalIcons[goal.id] || Target;
    const isSelected = userGoals.includes(goal.id);
    return (
      <Button
        key={goal.id}
        variant={isSelected ? 'default' : 'outline'}
        onClick={() => toggleGoal(goal.id)}
        className="h-auto p-4 flex flex-col items-center gap-2 text-center min-h-[100px]"
      >
        <Icon className="w-6 h-6 flex-shrink-0" />
        <div className="space-y-1">
          <div className="font-medium text-sm leading-tight">{goal.name}</div>
        </div>
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Your Goals
        </CardTitle>
        <p className="text-sm text-ink-700">
          Pick what you want to optimize for. We'll tune the recommendations to match.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {headlineGoals.map(renderGoalButton)}
        </div>

        {showMore && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-ink-200">
            {moreGoals.map(renderGoalButton)}
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-ink-500 hover:text-ink-700"
            aria-expanded={showMore}
          >
            {showMore ? (
              <>Fewer goals <ChevronUp className="w-3 h-3 ml-1" /></>
            ) : (
              <>More goals (memory, creativity, social) <ChevronDown className="w-3 h-3 ml-1" /></>
            )}
          </Button>

          {userGoals.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearGoals} className="text-xs">
              Clear All
            </Button>
          )}
        </div>

        {userGoals.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-ink-200">
            <span className="text-sm font-medium text-ink-700 mr-1">Selected:</span>
            {userGoals.map((goalId) => {
              const goal = goals.find((g) => g.id === goalId);
              if (!goal) return null;
              return (
                <Badge key={goalId} variant="secondary" className="text-xs">
                  {goal.name}
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
