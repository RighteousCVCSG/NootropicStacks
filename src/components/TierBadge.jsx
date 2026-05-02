import React from 'react';
import { getEvidenceTier } from '../lib/evidenceTier.js';

// Compact evidence-tier chip for supplement cards. Resolves color via
// CSS vars so dark/light theme cascades for free.
export function TierBadge({ supplementId, size = 'sm', showShort = true }) {
  const tier = getEvidenceTier(supplementId);
  const padX = size === 'xs' ? 'px-1.5' : 'px-2';
  const padY = size === 'xs' ? 'py-0' : 'py-0.5';
  const text = size === 'xs' ? 'text-[10px]' : 'text-xs';

  return (
    <span
      title={tier.description}
      className={`inline-flex items-center gap-1 rounded-full border ${padX} ${padY} ${text} font-semibold uppercase tracking-wider`}
      style={{
        background: `var(${tier.cssVarBg})`,
        color: `var(${tier.cssVarFg})`,
        borderColor: `var(${tier.cssVarRule})`,
      }}
    >
      <span
        aria-hidden
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: `var(${tier.cssVarRule})` }}
      />
      {showShort ? tier.short : tier.label}
    </span>
  );
}
