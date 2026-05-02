import React from 'react';
import { useLocation } from 'react-router-dom';
import { useStack } from '../contexts/StackContext.jsx';

// Route allow-list: pill shows only on stack-relevant routes.
const STACK_ROUTES = new Set([
  '/', '/build', '/quiz', '/stacks', '/celebrity-stacks', '/best-stacks',
]);

/**
 * Compact persistent score pill. Replaces the previous full-size card
 * that duplicated everything the StackDrawer already shows. Renders only
 * when there's a stack to score and we're on a stack-relevant route.
 *
 * Tap → opens the drawer where the full breakdown lives.
 * Hidden on mobile (the mobile drawer pill already lives at bottom-left
 * and shows the same item count).
 */
export function StackScoreWidget() {
  const { pathname } = useLocation();
  const allowed = STACK_ROUTES.has(pathname) || pathname.startsWith('/stacks/');
  const { stackScore, stack, openDrawer } = useStack();

  if (!allowed) return null;
  if (!stack || stack.length === 0) return null;
  if (!stackScore) return null;

  const overall = stackScore.headlineScores?.overall;
  if (overall == null) return null;

  // Tier the ring color the same way the drawer's score-mini does.
  const ringVar =
    overall >= 7 ? '--color-accent-500'
    : overall >= 4 ? '--color-primary-500'
    : '--color-ink-400';
  const dash = (overall / 9.5) * 97.4;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Stack Score ${overall.toFixed(1)} — open stack drawer`}
      className="hidden md:inline-flex fixed bottom-4 left-4 z-50 items-center gap-2 h-9 pl-1.5 pr-3 rounded-full bg-surface-card border border-ink-200 text-ink-900 shadow-2 hover:border-primary-300 transition-colors"
    >
      <span className="relative w-6 h-6 shrink-0">
        <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" style={{ stroke: 'var(--color-ink-200)' }} strokeWidth="4" />
          <circle
            cx="18" cy="18" r="15.5" fill="none"
            style={{ stroke: `var(${ringVar})`, transition: 'stroke-dasharray 0.7s' }}
            strokeWidth="4"
            strokeDasharray={`${dash} 97.4`}
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="font-mono text-xs font-semibold tabular-nums">
        {overall.toFixed(1)}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-ink-500 font-medium">
        Stack
      </span>
    </button>
  );
}
