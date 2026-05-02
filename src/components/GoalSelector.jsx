import React, { useState } from 'react';
import {
  Target, Zap, Heart, Scale, Lightbulb, Users, BookOpen, GraduationCap,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { goals } from '../data/supplements.js';

const goalIcons = {
  study:      GraduationCap,
  energy:     Zap,
  balance:    Scale,
  mood:       Heart,
  learning:   BookOpen,
  creativity: Lightbulb,
  socialness: Users,
};

const HEADLINE_GOAL_IDS = ['study', 'energy', 'balance', 'mood'];

/**
 * Goals panel. Replaces the previous full-shadcn-Card with chunky 100px
 * tile buttons. Now: a thin section heading + compact two-row grid of
 * icon + label chips that read like dashboard filters, not marketing
 * blocks. MeasureBoard tone.
 */
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

  const hasHiddenSelection = userGoals.some((id) => !HEADLINE_GOAL_IDS.includes(id));
  const showMore = expanded || hasHiddenSelection;

  const renderGoalChip = (goal) => {
    const Icon = goalIcons[goal.id] || Target;
    const isSelected = userGoals.includes(goal.id);
    const base = 'inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium transition-colors w-full';
    const styled = isSelected
      ? 'bg-primary-800 text-ink-on-dark hover:bg-primary-700'
      : 'bg-surface-card border border-ink-200 text-ink-700 hover:border-primary-300 hover:text-ink-900';
    return (
      <button
        key={goal.id}
        type="button"
        onClick={() => toggleGoal(goal.id)}
        aria-pressed={isSelected}
        className={`${base} ${styled}`}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{goal.name}</span>
      </button>
    );
  };

  return (
    <section className="rounded-md bg-surface-card border border-ink-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-ink-900 inline-flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-primary-800" />
          Goals
          {userGoals.length > 0 && (
            <span className="text-[10px] font-mono text-ink-500">({userGoals.length})</span>
          )}
        </h2>
        {userGoals.length > 0 && (
          <button
            type="button"
            onClick={clearGoals}
            className="text-[11px] text-ink-500 hover:text-ink-900"
          >
            Clear
          </button>
        )}
      </div>
      <p className="text-xs text-ink-500 mb-2.5">
        What to optimize for. Recommendations follow your picks.
      </p>

      <div className="grid grid-cols-2 gap-1.5">
        {headlineGoals.map(renderGoalChip)}
      </div>

      {showMore && (
        <div className="grid grid-cols-2 gap-1.5 mt-1.5 pt-2 border-t border-ink-100">
          {moreGoals.map(renderGoalChip)}
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={showMore}
        className="mt-2 text-[11px] text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
      >
        {showMore ? (
          <>Fewer <ChevronUp className="w-3 h-3" /></>
        ) : (
          <>More (memory, creativity, social) <ChevronDown className="w-3 h-3" /></>
        )}
      </button>
    </section>
  );
}
