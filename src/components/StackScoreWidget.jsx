import React, { useState } from 'react';
import { useStack } from '../contexts/StackContext.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ChevronUp, ChevronDown, Zap, Target, Scale, Gauge, Lightbulb, BarChart3 } from 'lucide-react';
import { StackScoreDetails } from './StackScoreDetails.jsx';

const SUB_SCORE_CONFIG = [
  { key: 'synergy', label: 'Synergy', icon: Zap, color: 'bg-purple-500' },
  { key: 'coverage', label: 'Coverage', icon: Target, color: 'bg-blue-500' },
  { key: 'balance', label: 'Balance', icon: Scale, color: 'bg-green-500' },
  { key: 'efficiency', label: 'Efficiency', icon: Gauge, color: 'bg-orange-500' },
];

function GradeBadge({ grade, label }) {
  const colors = {
    A: 'bg-green-100 text-green-800 border-green-300',
    B: 'bg-blue-100 text-blue-800 border-blue-300',
    C: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    D: 'bg-orange-100 text-orange-800 border-orange-300',
    F: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold border ${colors[grade] || colors.F}`}>
      {grade} — {label}
    </span>
  );
}

function SubScoreBar({ config, value }) {
  const percentage = (value / 25) * 100;
  return (
    <div className="flex items-center gap-2 text-sm">
      <config.icon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="w-20 text-gray-600 shrink-0">{config.label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${config.color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-500 text-xs shrink-0">{Math.round(value)}</span>
    </div>
  );
}

export function StackScoreWidget() {
  const { stackScore, stack, userGoals } = useStack();
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Don't render if no supplements in stack
  if (!stack || stack.length === 0) return null;
  if (!stackScore) return null;

  const { total, grade, gradeLabel, synergy, coverage, balance, efficiency, tip, supplementCount, goalCount } = stackScore;

  return (
    <>
      {/* Floating widget */}
      <div className="fixed bottom-4 right-4 z-50 w-72 sm:w-80">
        <Card className="shadow-lg border-gray-200 overflow-hidden">
          {/* Header — always visible, clickable */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none"
                    stroke={total >= 80 ? '#22c55e' : total >= 60 ? '#eab308' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${(total / 100) * 97.4} 97.4`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {total}
                </span>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Stack Score</div>
                <GradeBadge grade={grade} label={gradeLabel} />
              </div>
            </div>
            {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
          </button>

          {/* Expanded content */}
          {expanded && (
            <div className="px-4 pb-4 pt-1 border-t space-y-3">
              {/* Sub-score bars */}
              <div className="space-y-2">
                {SUB_SCORE_CONFIG.map(config => (
                  <SubScoreBar
                    key={config.key}
                    config={config}
                    value={stackScore[config.key]?.score || 0}
                  />
                ))}
              </div>

              {/* Summary line */}
              <div className="text-xs text-gray-500 flex items-center gap-1">
                {supplementCount} supplement{supplementCount !== 1 ? 's' : ''} &middot; {goalCount} goal{goalCount !== 1 ? 's' : ''}
              </div>

              {/* Optimization tip */}
              {tip && (
                <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
                  <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              )}

              {/* View Details button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setShowDetails(true)}
              >
                <BarChart3 className="w-3.5 h-3.5 mr-1" />
                View Details
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Details modal */}
      <StackScoreDetails
        open={showDetails}
        onClose={() => setShowDetails(false)}
        stackScore={stackScore}
      />
    </>
  );
}
