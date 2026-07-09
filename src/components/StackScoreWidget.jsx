import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
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
  const overallLabel = stackScore.headlineScores?.dimensionQuals?.overall?.label;

  // Tier the ring color the same way the drawer's score-mini does.
  const ringVar =
    overall >= 7 ? '--color-accent-500'
    : overall >= 4 ? '--color-primary-500'
    : '--color-ink-400';
  const dash = (overall / 9.5) * 97.4;

  return (
    <>
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

      {/* Mobile sticky bottom bar — the desktop right-edge widget above is
          `hidden md:flex`, so mobile had no persistent score readout at
          all on pages like /build that run ~11,000px tall. Keeps the
          Stack Score + a buy action visible while scrolling. */}
      <div
        className="md:hidden fixed bottom-0 inset-x-0 z-[890] flex items-center gap-2.5 px-3 py-2 bg-surface-card border-t border-ink-200 shadow-3"
        role="status"
        aria-label={`Stack Score ${overall.toFixed(1)}, ${stack.length} supplement${stack.length === 1 ? '' : 's'}`}
      >
        <button
          type="button"
          onClick={openDrawer}
          aria-label="Open stack drawer"
          className="relative w-8 h-8 shrink-0"
        >
          <svg className="w-8 h-8 -rotate-90 absolute inset-0" viewBox="0 0 36 36">
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
        </button>
        <button
          type="button"
          onClick={openDrawer}
          className="flex-1 min-w-0 text-left text-xs text-ink-700"
        >
          <span className="font-semibold text-ink-900">
            {stack.length} supplement{stack.length === 1 ? '' : 's'}
          </span>
          {overallLabel && <span className="text-ink-500"> · {overallLabel}</span>}
        </button>
        <button
          type="button"
          onClick={openDrawer}
          className="shrink-0 inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-medium bg-primary-700 hover:bg-primary-800 text-white transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Buy stack
        </button>
      </div>
    </>
  );
}
