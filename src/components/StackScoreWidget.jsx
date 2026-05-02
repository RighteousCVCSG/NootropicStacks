import React from 'react';
import { useLocation } from 'react-router-dom';
import { useStack } from '../contexts/StackContext.jsx';

// Route allow-list: pill shows only on stack-relevant routes. Landing
// page (/) is intentionally excluded — it's a marketing surface, not a
// workspace, and the floating widget would be noise there.
const STACK_ROUTES = new Set([
  '/build', '/quiz', '/stacks', '/celebrity-stacks', '/best-stacks',
]);

/**
 * Compact persistent score widget. Lives on the right edge (vertical),
 * mid-height — same affordance the previous TabHandle occupied — so it
 * doubles as the desktop drawer opener.
 *
 * Layout: small score ring with the number inside, "Stack" label
 * underneath. Tap → opens the drawer.
 *
 * Hidden on mobile; the mobile drawer pill at bottom-left handles the
 * same role on small screens.
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
      className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-[900] flex-col items-center gap-0.5 px-2 py-2 rounded-l-md bg-surface-card border border-r-0 border-ink-200 hover:border-primary-300 text-ink-900 shadow-2 transition-colors"
    >
      <span className="relative w-7 h-7">
        <svg className="w-7 h-7 -rotate-90 absolute inset-0" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" style={{ stroke: 'var(--color-ink-100)' }} strokeWidth="4" />
          <circle
            cx="18" cy="18" r="15.5" fill="none"
            style={{ stroke: `var(${ringVar})`, transition: 'stroke-dasharray 0.7s' }}
            strokeWidth="4"
            strokeDasharray={`${dash} 97.4`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold tabular-nums text-ink-900">
          {overall.toFixed(1)}
        </span>
      </span>
      <span className="text-[9px] uppercase tracking-widest text-ink-500 font-medium">
        Stack
      </span>
    </button>
  );
}
