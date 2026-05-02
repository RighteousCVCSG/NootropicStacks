import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Moon, Zap, Brain, Activity, Zap as ZapIcon, Target, Scale, Gauge, ArrowRight } from 'lucide-react';
import { INTERACTION_TYPES } from '../data/interactions.js';
import { supplements } from '../data/supplements.js';

function getSupplementName(id) {
  const supp = supplements.find(s => s.id === id);
  return supp ? supp.name : id;
}

const INTERACTION_BADGE_COLORS = {
  synergistic: 'bg-accent-100 text-accent-700',
  complementary: 'bg-primary-100 text-primary-800',
  redundant: 'bg-warn-100 text-warn-700',
  conflicting: 'bg-danger-100 text-danger-700',
};

const QUAL_COLORS = {
  Low: 'bg-surface-sunk text-ink-700 border-ink-200',
  Moderate: 'bg-primary-050 text-primary-800 border-primary-300',
  Strong: 'bg-accent-050 text-accent-700 border-accent-300',
  Maxed: 'bg-warn-100 text-warn-700 border-amber-300',
};

// Brand-token-driven dimension colors (Cognitive Lab palette).
// Resolved via getComputedStyle so we react to dark/light theme switches.
const DIMENSION_DETAILS = [
  { key: 'sleep',  label: 'Sleep',  icon: Moon,  cssVar: '--color-accent-500',  desc: 'Rest, recovery & sleep readiness' },
  { key: 'energy', label: 'Energy', icon: Zap,   cssVar: '--color-warn-500',    desc: 'Physical & mental drive' },
  { key: 'mind',   label: 'Mind',   icon: Brain, cssVar: '--color-primary-500', desc: 'Cognition, focus & mood' },
];

function DimensionCircle({ value, qual, config }) {
  const pct = (value / 9.5) * 100;
  const stroke = `var(${config.cssVar})`;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" style={{ stroke: 'var(--color-ink-200)' }} strokeWidth="2.5" />
          <circle
            cx="18" cy="18" r="15.5" fill="none"
            style={{ stroke }}
            strokeWidth="2.5"
            strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink-900">
          {value.toFixed(1)}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-ink-700">
        <config.icon className="w-3 h-3" />
        {config.label}
      </div>
      <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded-full border ${QUAL_COLORS[qual] || QUAL_COLORS.Low}`}>
        {qual}
      </span>
    </div>
  );
}

function SubScoreCircle({ value, max, label, icon: Icon, cssVar }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const stroke = `var(${cssVar})`;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" style={{ stroke: 'var(--color-ink-200)' }} strokeWidth="2.5" />
          <circle
            cx="18" cy="18" r="15.5" fill="none"
            style={{ stroke }}
            strokeWidth="2.5"
            strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink-900">
          {Math.round(value)}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-ink-700">
        <Icon className="w-3 h-3" />
        {label}
      </div>
    </div>
  );
}

function InteractionRow({ interaction }) {
  const typeInfo = INTERACTION_TYPES[interaction.type.toUpperCase()];
  if (!typeInfo) return null;

  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        <span className="truncate">{getSupplementName(interaction.supplements[0])}</span>
        <ArrowRight className="w-3 h-3 text-ink-400 shrink-0" />
        <span className="truncate">{getSupplementName(interaction.supplements[1])}</span>
      </div>
      <Badge variant="outline" className={`shrink-0 ml-2 text-xs ${INTERACTION_BADGE_COLORS[interaction.type] || ''}`}>
        {typeInfo.symbol} {typeInfo.label}
      </Badge>
    </div>
  );
}

function MaxedDetailCallout({ dimension, message }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-warn-100 border-l-2 border-amber-500 rounded-r-md text-xs text-warn-700">
      <span className="font-semibold text-warn-700 shrink-0">{dimension}:</span>
      <span>{message}</span>
    </div>
  );
}

export function StackScoreDetails({ open, onClose, stackScore }) {
  if (!stackScore) return null;

  const { total, grade, gradeLabel, headlineScores, dimensionTips, synergy, coverage, balance, efficiency } = stackScore;
  const { overall, dimensionQuals } = headlineScores;
  const maxedTips = dimensionTips || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Stack Score Breakdown</span>
            <span className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-ink-900">{overall.toFixed(1)}</span>
              <span className="text-sm font-medium text-ink-500">{dimensionQuals.overall.label}</span>
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Headline dimension circles */}
        <div className="flex justify-around py-4">
          <DimensionCircle
            value={headlineScores.sleep}
            qual={dimensionQuals.sleep.label}
            config={DIMENSION_DETAILS[0]}
          />
          <DimensionCircle
            value={headlineScores.energy}
            qual={dimensionQuals.energy.label}
            config={DIMENSION_DETAILS[1]}
          />
          <DimensionCircle
            value={headlineScores.mind}
            qual={dimensionQuals.mind.label}
            config={DIMENSION_DETAILS[2]}
          />
        </div>

        {/* Maxed callouts */}
        {maxedTips.length > 0 && (
          <div className="space-y-2 mb-3">
            {maxedTips.map((tip, i) => (
              <MaxedDetailCallout
                key={i}
                dimension={tip.dimension.charAt(0).toUpperCase() + tip.dimension.slice(1)}
                message={tip.message}
              />
            ))}
          </div>
        )}

        {/* Original sub-score circles */}
        <Separator />
        <div className="flex justify-around py-4">
          <SubScoreCircle value={synergy.score} max={25} label="Synergy" icon={ZapIcon} cssVar="--color-primary-500" />
          <SubScoreCircle value={coverage.score} max={25} label="Coverage" icon={Target} cssVar="--color-accent-500" />
          <SubScoreCircle value={balance.score} max={25} label="Balance" icon={Scale} cssVar="--color-success-500" />
          <SubScoreCircle value={efficiency.score} max={25} label="Efficiency" icon={Gauge} cssVar="--color-warn-500" />
        </div>

        <Separator />

        {/* Synergy details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <ZapIcon className="w-4 h-4 text-primary-500" />
            Synergy — {synergy.details}
          </h3>
          {synergy.interactions && synergy.interactions.length > 0 ? (
            <div className="divide-y">
              {synergy.interactions.map((interaction, i) => (
                <InteractionRow key={i} interaction={interaction} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500">No known interactions in your current stack.</p>
          )}
        </div>

        <Separator />

        {/* Coverage details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary-500" />
            Coverage — {coverage.details}
          </h3>
          {coverage.goalCoverage && Object.entries(coverage.goalCoverage).length > 0 ? (
            <div className="space-y-1.5">
              {Object.entries(coverage.goalCoverage).map(([goal, value]) => (
                <div key={goal} className="flex items-center gap-2 text-sm">
                  <span className="w-20 capitalize text-ink-700">{goal}</span>
                  <div className="flex-1 h-2 bg-ink-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${value > 6 ? 'bg-accent-500' : value > 4 ? 'bg-primary-500' : 'bg-danger-500'}`}
                      style={{ width: `${Math.min(100, (value / 9.5) * 100)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-ink-500">{value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500">Set goals to see coverage analysis.</p>
          )}
        </div>

        <Separator />

        {/* Balance details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Scale className="w-4 h-4 text-accent-500" />
            Balance — {balance.details}
          </h3>
          {balance.penalties && balance.penalties.length > 0 ? (
            <ul className="space-y-1">
              {balance.penalties.map((penalty, i) => (
                <li key={i} className="text-sm text-warn-700 flex items-start gap-2">
                  <span className="text-warn-500 mt-1">-</span>
                  {penalty}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-accent-700">No balance issues detected.</p>
          )}
          {balance.groupCounts && Object.keys(balance.groupCounts).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {Object.entries(balance.groupCounts).map(([groupId, { label, count }]) => (
                <Badge
                  key={groupId}
                  variant="outline"
                  className={`text-xs ${count >= 3 ? 'border-orange-300 text-warn-700' : 'border-ink-300 text-ink-700'}`}
                >
                  {label}: {count}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Efficiency details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Gauge className="w-4 h-4 text-warn-500" />
            Efficiency — {efficiency.details}
          </h3>
          <p className="text-sm text-ink-700">
            {efficiency.supplementCount} supplement{efficiency.supplementCount !== 1 ? 's' : ''} in stack
            {efficiency.deadWeight > 0 && (
              <span className="text-warn-700">
                {' '}({efficiency.deadWeight} not aligned with goals)
              </span>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
