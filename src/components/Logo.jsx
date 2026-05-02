import React from 'react';

/**
 * NootropicStacker logo mark.
 *
 * Three rounded bars, stacked vertically, with slight horizontal offsets
 * and varying widths. Reads as "a stack" at first glance and stays
 * legible at 16–24px. Uses currentColor so the same component works on
 * light and dark surfaces (the parent sets the color).
 *
 * Typical usage:
 *   <div className="w-6 h-6 bg-primary-800 rounded-md flex items-center justify-center">
 *     <Logo className="w-3.5 h-3.5 text-ink-on-dark" />
 *   </div>
 */
export function Logo({ className = 'w-4 h-4', title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      {/* Top bar — narrowest, slight right offset */}
      <rect x="7" y="5" width="11" height="3" rx="1.5" fill="currentColor" />
      {/* Middle bar — widest, full span */}
      <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="currentColor" />
      {/* Bottom bar — medium, slight left offset */}
      <rect x="6" y="16" width="12" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}
