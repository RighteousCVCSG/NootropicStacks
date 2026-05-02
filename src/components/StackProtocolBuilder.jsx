import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Clock, Sun, Coffee, Moon } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { supplements } from '../data/supplements.js';

export const TIMING_MAP = {
  // Morning (with breakfast)
  morning: ['lions-mane', 'lion-mane', 'ashwagandha', 'vitamin-d', 'vitamin-d3', 'omega3',
            'fish-oil', 'coq10', 'creatine', 'bacopa', 'phosphatidylserine', 'alpha-gpc',
            'citicoline', 'rhodiola', 'b-complex', 'zinc', 'collagen', 'probiotics',
            'nad-precursors', 'nmn', 'nr', 'curcumin', 'spirulina'],
  // Pre-work / 30min before focus
  prework: ['caffeine', 'l-theanine', 'tyrosine', 'l-tyrosine', 'phenylpiracetam',
            'modafinil', 'armodafinil', 'noopept', 'piracetam', 'aniracetam',
            'oxiracetam', 'pramiracetam', 'huperzine-a', 'alpha-lipoic-acid'],
  // Evening (with dinner)
  evening: ['magnesium', 'magnesium-glycinate', 'lions-mane', 'lion-mane', 'bacopa',
            'ashwagandha', 'reishi', 'cordyceps', 'phosphatidylserine', 'coq10'],
  // Before bed
  bedtime: ['melatonin', 'magnesium', 'magnesium-glycinate', 'glycine', 'l-theanine'],
};

export function getSupplementTiming(supplementId) {
  if (TIMING_MAP.bedtime.includes(supplementId)) return 'bedtime';
  if (TIMING_MAP.prework.includes(supplementId)) return 'prework';
  if (TIMING_MAP.evening.includes(supplementId)) return 'evening';
  return 'morning'; // default to morning
}

// Token-driven (Cognitive Lab) palette so the schedule view tracks
// dark/light theme. Each phase maps to one of the brand accents:
//   morning  → warn (amber sun)
// prework  → primary (navy focus)
//   evening  → accent (cyan calm)
// bedtime  → primary-soft (deep navy)
export const TIMING_CONFIG = {
  morning: { label: 'Morning',  subtitle: 'With breakfast',            icon: Sun,    color: 'text-warn-500',    bg: 'bg-warn-100',    border: 'border-warn-500' },
  prework: { label: 'Pre-Work', subtitle: '30 min before focus',       icon: Coffee, color: 'text-primary-800', bg: 'bg-primary-050', border: 'border-primary-300' },
  evening: { label: 'Evening',  subtitle: 'With dinner',               icon: Clock,  color: 'text-accent-700',  bg: 'bg-accent-050',  border: 'border-accent-500' },
  bedtime: { label: 'Bedtime',  subtitle: '30-60 min before sleep',    icon: Moon,   color: 'text-primary-900', bg: 'bg-primary-050', border: 'border-primary-800' },
};

export function StackProtocolBuilder() {
  const { stack } = useStack();

  if (stack.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="w-4 h-4" />
            Daily Protocol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink-500 text-center py-4">Add supplements to your stack to see your daily dosing protocol.</p>
        </CardContent>
      </Card>
    );
  }

  // Group stack items by timing
  const protocol = { morning: [], prework: [], evening: [], bedtime: [] };
  stack.forEach(item => {
    const timing = getSupplementTiming(item.supplementId);
    const supplement = supplements.find(s => s.id === item.supplementId);
    if (supplement) {
      protocol[timing].push(supplement);
    }
  });

  const activeTimes = Object.keys(protocol).filter(t => protocol[t].length > 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-4 h-4" />
          Daily Protocol
        </CardTitle>
        <p className="text-xs text-ink-500">Optimal timing based on your stack</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeTimes.map(timing => {
          const config = TIMING_CONFIG[timing];
          const Icon = config.icon;
          return (
            <div key={timing} className={`p-3 rounded-md border ${config.bg} ${config.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm font-semibold text-ink-900">{config.label}</span>
                <span className="text-xs text-ink-500">{config.subtitle}</span>
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
        <p className="text-xs text-ink-500 pt-1">
          * Timing suggestions are general guidelines. Take fat-soluble supplements with food. Stimulants before 2pm to protect sleep.
        </p>
      </CardContent>
    </Card>
  );
}
