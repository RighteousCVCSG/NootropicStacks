import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Zap, Target, Scale, Gauge, ArrowRight } from 'lucide-react';
import { INTERACTION_TYPES } from '../data/interactions.js';
import { supplements } from '../data/supplements.js';

function getSupplementName(id) {
  const supp = supplements.find(s => s.id === id);
  return supp ? supp.name : id;
}

const INTERACTION_BADGE_COLORS = {
  synergistic: 'bg-green-100 text-green-800',
  complementary: 'bg-blue-100 text-blue-800',
  redundant: 'bg-orange-100 text-orange-800',
  conflicting: 'bg-red-100 text-red-800',
};

function ScoreCircle({ value, max, label, icon: Icon, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
          <circle
            cx="18" cy="18" r="15.5" fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {Math.round(value)}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
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
        <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="truncate">{getSupplementName(interaction.supplements[1])}</span>
      </div>
      <Badge variant="outline" className={`shrink-0 ml-2 text-xs ${INTERACTION_BADGE_COLORS[interaction.type] || ''}`}>
        {typeInfo.symbol} {typeInfo.label}
      </Badge>
    </div>
  );
}

export function StackScoreDetails({ open, onClose, stackScore }) {
  if (!stackScore) return null;

  const { total, grade, gradeLabel, synergy, coverage, balance, efficiency } = stackScore;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Stack Score Breakdown</span>
            <span className="text-2xl font-bold">
              {total}/100
              <span className="ml-2 text-base font-medium text-gray-500">{grade}</span>
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Sub-score circles */}
        <div className="flex justify-around py-4">
          <ScoreCircle value={synergy.score} max={25} label="Synergy" icon={Zap} color="#a855f7" />
          <ScoreCircle value={coverage.score} max={25} label="Coverage" icon={Target} color="#3b82f6" />
          <ScoreCircle value={balance.score} max={25} label="Balance" icon={Scale} color="#22c55e" />
          <ScoreCircle value={efficiency.score} max={25} label="Efficiency" icon={Gauge} color="#f97316" />
        </div>

        <Separator />

        {/* Synergy details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-500" />
            Synergy — {synergy.details}
          </h3>
          {synergy.interactions && synergy.interactions.length > 0 ? (
            <div className="divide-y">
              {synergy.interactions.map((interaction, i) => (
                <InteractionRow key={i} interaction={interaction} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No known interactions in your current stack.</p>
          )}
        </div>

        <Separator />

        {/* Coverage details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            Coverage — {coverage.details}
          </h3>
          {coverage.goalCoverage && Object.entries(coverage.goalCoverage).length > 0 ? (
            <div className="space-y-1.5">
              {Object.entries(coverage.goalCoverage).map(([goal, value]) => (
                <div key={goal} className="flex items-center gap-2 text-sm">
                  <span className="w-20 capitalize text-gray-600">{goal}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${value > 6 ? 'bg-green-500' : value > 4 ? 'bg-blue-500' : 'bg-red-400'}`}
                      style={{ width: `${Math.min(100, (value / 9.5) * 100)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-gray-500">{value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Set goals to see coverage analysis.</p>
          )}
        </div>

        <Separator />

        {/* Balance details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Scale className="w-4 h-4 text-green-500" />
            Balance — {balance.details}
          </h3>
          {balance.penalties && balance.penalties.length > 0 ? (
            <ul className="space-y-1">
              {balance.penalties.map((penalty, i) => (
                <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                  <span className="text-orange-400 mt-1">-</span>
                  {penalty}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-600">No balance issues detected.</p>
          )}
          {balance.groupCounts && Object.keys(balance.groupCounts).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {Object.entries(balance.groupCounts).map(([groupId, { label, count }]) => (
                <Badge
                  key={groupId}
                  variant="outline"
                  className={`text-xs ${count >= 3 ? 'border-orange-300 text-orange-700' : 'border-gray-300 text-gray-600'}`}
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
            <Gauge className="w-4 h-4 text-orange-500" />
            Efficiency — {efficiency.details}
          </h3>
          <p className="text-sm text-gray-600">
            {efficiency.supplementCount} supplement{efficiency.supplementCount !== 1 ? 's' : ''} in stack
            {efficiency.deadWeight > 0 && (
              <span className="text-orange-600">
                {' '}({efficiency.deadWeight} not aligned with goals)
              </span>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
