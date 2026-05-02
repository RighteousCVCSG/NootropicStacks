import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sun, Coffee, Moon } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { supplements } from '../data/supplements.js';

// Timing buckets. The resolver below returns the FIRST matching bucket
// for a supplement (bedtime → prework → evening → morning), so each
// supplement should appear in at most one bucket. Items previously
// listed in both morning and evening were silently resolving to morning.
export const TIMING_MAP = {
  morning: ['lions-mane', 'lion-mane', 'ashwagandha', 'vitamin-d', 'vitamin-d3', 'omega3',
            'fish-oil', 'coq10', 'creatine', 'bacopa', 'phosphatidylserine', 'alpha-gpc',
            'citicoline', 'rhodiola', 'b-complex', 'zinc', 'collagen', 'probiotics',
            'nad-precursors', 'nmn', 'nr', 'curcumin', 'spirulina'],
  prework: ['caffeine', 'l-theanine', 'tyrosine', 'l-tyrosine', 'phenylpiracetam',
            'modafinil', 'armodafinil', 'noopept', 'piracetam', 'aniracetam',
            'oxiracetam', 'pramiracetam', 'huperzine-a', 'alpha-lipoic-acid'],
  evening: ['reishi', 'cordyceps'],
  bedtime: ['melatonin', 'magnesium', 'magnesium-glycinate', 'glycine'],
};

export function getSupplementTiming(supplementId) {
  if (TIMING_MAP.bedtime.includes(supplementId)) return 'bedtime';
  if (TIMING_MAP.prework.includes(supplementId)) return 'prework';
  if (TIMING_MAP.evening.includes(supplementId)) return 'evening';
  return 'morning';
}

// Token-driven palette so the schedule view tracks dark/light theme.
// Borders held at the -300 tier so the row reads as a tonal phase
// chip, not a saturated alert.
export const TIMING_CONFIG = {
  morning: { label: 'Morning',  subtitle: 'With breakfast',         icon: Sun,    color: 'text-warn-500',    bg: 'bg-warn-100',    border: 'border-warn-300' },
  prework: { label: 'Pre-work', subtitle: '30 min before focus',    icon: Coffee, color: 'text-primary-700', bg: 'bg-primary-050', border: 'border-primary-300' },
  evening: { label: 'Evening',  subtitle: 'With dinner',            icon: Clock,  color: 'text-accent-700',  bg: 'bg-accent-050',  border: 'border-accent-300' },
  bedtime: { label: 'Bedtime',  subtitle: '30–60 min before sleep', icon: Moon,   color: 'text-primary-800', bg: 'bg-primary-050', border: 'border-primary-300' },
};

export function StackProtocolBuilder() {
  const { stack } = useStack();

  if (stack.length === 0) {
    return (
      <section className="rounded-md bg-surface-card border border-ink-200 p-3">
        <header className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-ink-500" />
          <h2 className="text-sm font-semibold text-ink-900">Daily protocol</h2>
        </header>
        <p className="text-xs text-ink-500 py-2 text-center">
          Add supplements to your stack to see a timing-based dosing protocol.
        </p>
      </section>
    );
  }

  const protocol = { morning: [], prework: [], evening: [], bedtime: [] };
  stack.forEach(item => {
    const timing = getSupplementTiming(item.supplementId);
    const supplement = supplements.find(s => s.id === item.supplementId);
    if (supplement) protocol[timing].push(supplement);
  });

  const activeTimes = Object.keys(protocol).filter(t => protocol[t].length > 0);

  return (
    <section className="rounded-md bg-surface-card border border-ink-200 p-3">
      <header className="mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ink-500" />
          <h2 className="text-sm font-semibold text-ink-900">Daily protocol</h2>
        </div>
        <p className="text-[11px] text-ink-500">Optimal timing based on your stack.</p>
      </header>

      <div className="space-y-2">
        {activeTimes.map(timing => {
          const config = TIMING_CONFIG[timing];
          const Icon = config.icon;
          return (
            <div key={timing} className={`p-3 rounded-md border ${config.bg} ${config.border}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                <span className="text-xs font-semibold text-ink-900">{config.label}</span>
                <span className="text-[11px] text-ink-500">{config.subtitle}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {protocol[timing].map(sup => (
                  <Link
                    key={sup.id}
                    to={`/supplements/${sup.id}`}
                    className="inline-flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-medium bg-surface-card border border-ink-200 text-ink-700 hover:border-primary-500 hover:text-primary-800 transition-colors"
                  >
                    <span>{sup.name}</span>
                    {sup.dosage && (
                      <span className="text-ink-500 font-mono">
                        {sup.dosage.min}{sup.dosage.unit}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-ink-500 pt-2 leading-snug">
        Timing suggestions are general guidelines. Take fat-soluble supplements with food, and stimulants before 2pm to protect sleep.
      </p>
    </section>
  );
}
