import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Clock, Sun, Coffee, Moon } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { supplements } from '../data/supplements.js';

const TIMING_MAP = {
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

function getSupplementTiming(supplementId) {
  if (TIMING_MAP.bedtime.includes(supplementId)) return 'bedtime';
  if (TIMING_MAP.prework.includes(supplementId)) return 'prework';
  if (TIMING_MAP.evening.includes(supplementId)) return 'evening';
  return 'morning'; // default to morning
}

const TIMING_CONFIG = {
  morning: { label: 'Morning', subtitle: 'With breakfast', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  prework: { label: 'Pre-Work', subtitle: '30 min before focus session', icon: Coffee, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  evening: { label: 'Evening', subtitle: 'With dinner', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  bedtime: { label: 'Bedtime', subtitle: '30-60 min before sleep', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
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
          <p className="text-sm text-gray-500 text-center py-4">Add supplements to your stack to see your daily dosing protocol.</p>
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
        <p className="text-xs text-gray-500">Optimal timing based on your stack</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeTimes.map(timing => {
          const config = TIMING_CONFIG[timing];
          const Icon = config.icon;
          return (
            <div key={timing} className={`p-3 rounded-lg border ${config.bg} ${config.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm font-semibold text-gray-800">{config.label}</span>
                <span className="text-xs text-gray-500">{config.subtitle}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {protocol[timing].map(sup => (
                  <Badge key={sup.id} variant="outline" className="text-xs bg-white">
                    {sup.name}
                    {sup.dosage && <span className="ml-1 text-gray-400">{sup.dosage.min}{sup.dosage.unit}</span>}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
        <p className="text-xs text-gray-400 pt-1">
          * Timing suggestions are general guidelines. Take fat-soluble supplements with food. Stimulants before 2pm to protect sleep.
        </p>
      </CardContent>
    </Card>
  );
}
