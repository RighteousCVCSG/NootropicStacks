import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStack } from '../contexts/StackContext.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
  ChevronUp, ChevronDown, Moon, Zap, Brain, BarChart3,
  Target, Scale, Gauge, Lightbulb, Activity
} from 'lucide-react';
import { StackScoreDetails } from './StackScoreDetails.jsx';

// Route allow-list: widget renders only on stack-relevant routes
const STACK_ROUTES = new Set(['/', '/quiz', '/stacks', '/celebrity-stacks', '/best-stacks']);

// Token-driven dimension colors. cssVar resolves at render via the active
// :root[data-theme] block, so the widget tracks dark/light theme switches.
const DIMENSION_CONFIG = [
  { key: 'sleep',  label: 'Sleep',  icon: Moon,  description: 'Rest & recovery readiness',   cssVar: '--color-accent-500' },
  { key: 'energy', label: 'Energy', icon: Zap,   description: 'Physical & mental drive',     cssVar: '--color-warn-500' },
  { key: 'mind',   label: 'Mind',   icon: Brain, description: 'Cognition & mood',            cssVar: '--color-primary-500' },
];

const QUAL_COLORS = {
  Low: {
    bar:   'bg-ink-300',
    badge: 'bg-ink-100 text-ink-500 border-ink-200',
    text:  'text-ink-500',
  },
  Moderate: {
    bar:   'bg-primary-500',
    badge: 'bg-primary-050 text-primary-800 border-primary-300',
    text:  'text-primary-800',
  },
  Strong: {
    bar:   'bg-accent-500',
    badge: 'bg-accent-050 text-accent-700 border-accent-300',
    text:  'text-accent-700',
  },
  Maxed: {
    bar:   'bg-warn-500',
    badge: 'bg-warn-100 text-warn-700 border-warn-500',
    text:  'text-warn-700',
  },
};

function ScoreBar({ value, qual }) {
  const pct = Math.min(100, (value / 9.5) * 100);
  const colors = QUAL_COLORS[qual] || QUAL_COLORS.Low;
  return (
    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function DimensionCard({ config, score, qual }) {
  const { label, icon: Icon, description } = config;
  const colors = QUAL_COLORS[qual] || QUAL_COLORS.Low;
  const isMaxed = qual === 'Maxed';

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
      isMaxed ? 'bg-warn-100 border-warn-500' : 'bg-surface-sunk border-ink-200'
    }`}>
      <div className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
        isMaxed ? 'bg-warn-100 text-warn-700' : 'bg-surface-card text-ink-500 border border-ink-200'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-ink-900 truncate">{label}</span>
            {description && (
              <span className="text-xs text-ink-500 hidden sm:inline truncate">{description}</span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className={`text-sm font-bold ${colors.text}`}>{score.toFixed(1)}</span>
            <span className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full border ${colors.badge}`}>
              {qual}
            </span>
          </div>
        </div>
        <ScoreBar value={score} qual={qual} />
      </div>
    </div>
  );
}

function MaxedCallout({ dimension, message }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-warn-100 border-l-2 border-warn-500 rounded-r-md text-xs text-warn-700">
      <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-warn-700" />
      <div>
        <span className="font-semibold uppercase tracking-wider text-[10px] text-warn-700 block mb-0.5">
          {dimension} &mdash; Maxed
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}

function DiagnosticsPanel({ synergy, coverage, balance, efficiency }) {
  const [open, setOpen] = useState(false);

  const subScores = [
    { key: 'synergy',    label: 'Synergy',    icon: Target, score: synergy.score,    max: 25, color: 'bg-primary-500' },
    { key: 'coverage',   label: 'Coverage',   icon: Target, score: coverage.score,   max: 25, color: 'bg-accent-500' },
    { key: 'balance',    label: 'Balance',    icon: Scale,  score: balance.score,    max: 25, color: 'bg-success-500' },
    { key: 'efficiency', label: 'Efficiency', icon: Gauge,  score: efficiency.score, max: 25, color: 'bg-warn-500' },
  ];

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-700 transition-colors"
      >
        <BarChart3 className="w-3.5 h-3.5" />
        Diagnostics {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {subScores.map(({ key, label, icon: Icon, score, max, color }) => {
            const pct = (score / max) * 100;
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                <Icon className="w-3.5 h-3.5 text-ink-500 shrink-0" />
                <span className="w-20 text-ink-700 shrink-0">{label}</span>
                <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-ink-500 text-xs shrink-0">{Math.round(score)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StackScoreWidget() {
  const { pathname } = useLocation();
  const allowed = STACK_ROUTES.has(pathname) || pathname.startsWith('/stacks/');
  const { stackScore, stack, userGoals } = useStack();
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!allowed) return null;
  if (!stack || stack.length === 0) return null;
  if (!stackScore) return null;

  const { headlineScores, synergy, coverage, balance, efficiency, tip, supplementCount, goalCount, dimensionTips } = stackScore;
  const { overall, sleep, energy, mind, dimensionQuals } = headlineScores;
  const maxedTips = dimensionTips || [];

  return (
    <>
      {/* Desktop-only: pinned bottom-LEFT so it doesn't compete with the
          StackDrawer/TabHandle on the right edge. Hidden on mobile because
          the mobile drawer pill lives at bottom-left and the drawer's
          score-mini already shows this data. */}
      <div className="hidden md:block fixed bottom-4 left-4 z-50 w-72 sm:w-80">
        <Card className="shadow-2 border-ink-200 overflow-hidden">
          {/* Header — always visible */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-3 bg-surface-card hover:bg-surface-sunk transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" style={{ stroke: 'var(--color-ink-200)' }} strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none"
                    style={{ stroke: `var(${overall >= 7 ? '--color-accent-500' : overall >= 4 ? '--color-primary-500' : '--color-ink-400'})` }}
                    strokeWidth="3"
                    strokeDasharray={`${(overall / 9.5) * 97.4} 97.4`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-ink-900">
                  {overall.toFixed(1)}
                </span>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-ink-900">Stack Score</div>
                <div className="text-xs text-ink-500">
                  {dimensionQuals.overall.label} &middot; E {energy.toFixed(1)} &middot; M {mind.toFixed(1)} &middot; S {sleep.toFixed(1)}
                </div>
              </div>
            </div>
            {expanded ? <ChevronDown className="w-4 h-4 text-ink-500" /> : <ChevronUp className="w-4 h-4 text-ink-500" />}
          </button>

          {/* Expanded content */}
          {expanded && (
            <div className="px-4 pb-4 pt-3 border-t space-y-3">
              {/* Overall dimension card */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-card border border-ink-200">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-050 text-primary-800 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-ink-900">Overall</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ink-900">{overall.toFixed(1)}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full border ${
                        QUAL_COLORS[dimensionQuals.overall.label].badge
                      }`}>
                        {dimensionQuals.overall.label}
                      </span>
                    </div>
                  </div>
                  <ScoreBar value={overall} qual={dimensionQuals.overall.label} />
                </div>
              </div>

              {/* Dimension cards */}
              {DIMENSION_CONFIG.map(config => (
                <DimensionCard
                  key={config.key}
                  config={config}
                  score={headlineScores[config.key]}
                  qual={dimensionQuals[config.key]?.label || 'Low'}
                />
              ))}

              {/* Maxed callouts */}
              {maxedTips.length > 0 && (
                <div className="space-y-2">
                  {maxedTips.map((tip, i) => (
                    <MaxedCallout
                      key={i}
                      dimension={tip.dimension.charAt(0).toUpperCase() + tip.dimension.slice(1)}
                      message={tip.message}
                    />
                  ))}
                </div>
              )}

              {/* Diagnostic sub-scores */}
              <DiagnosticsPanel synergy={synergy} coverage={coverage} balance={balance} efficiency={efficiency} />

              {/* Summary */}
              <div className="text-xs text-ink-500 flex items-center gap-1">
                {supplementCount} supplement{supplementCount !== 1 ? 's' : ''} &middot; {goalCount} goal{goalCount !== 1 ? 's' : ''}
              </div>

              {/* Optimization tip */}
              {tip && (
                <div className="flex items-start gap-2 p-2 bg-warn-100 border border-warn-500 rounded-md text-xs text-warn-700">
                  <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              )}

              {/* View Details */}
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

      <StackScoreDetails
        open={showDetails}
        onClose={() => setShowDetails(false)}
        stackScore={stackScore}
      />
    </>
  );
}
