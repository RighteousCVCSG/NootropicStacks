import React from 'react';
import { Sparkles, Plus, TrendingUp } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';

/**
 * Recommendations rail. Replaces the previous blue-gradient Card stack
 * (off-palette, chubby) with a tight section + single-row rec items that
 * match the rest of the workspace. Each item: name + 1-line description
 * + reasoning chips, with an inline match-score bar and a small Add
 * button on the right.
 */
export function RecommendationPanel() {
  const { recommendations, addSupplement, userGoals } = useStack();

  const empty = !recommendations || recommendations.length === 0;
  const emptyMessage = userGoals.length === 0
    ? 'Pick a goal above to see personalized recommendations.'
    : 'Add a supplement to see synergistic next picks.';

  return (
    <section className="rounded-md bg-surface-card border border-ink-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-ink-900 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-800" />
          Recommended
          {!empty && (
            <span className="text-[10px] font-mono text-ink-500">({recommendations.length})</span>
          )}
        </h2>
        {!empty && (
          <span className="text-[10px] text-ink-500">Based on goals + current stack</span>
        )}
      </div>

      {empty && (
        <p className="text-xs text-ink-500 py-1">{emptyMessage}</p>
      )}

      {!empty && (
        <ul className="space-y-1.5">
          {recommendations.map((rec, index) => {
            const supplement = rec.supplement;
            const matchPct = Math.min(Math.round(rec.score * 2), 100);
            return (
              <li
                key={supplement.id}
                className="flex items-start gap-3 p-2 rounded-md border border-ink-100 hover:border-primary-300 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-primary-050 text-primary-800 inline-flex items-center justify-center text-[10px] font-semibold font-mono shrink-0 mt-0.5">
                  {index + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-ink-900 truncate">
                      {supplement.name}
                    </h3>
                    <span className="text-[10px] font-mono text-ink-500">
                      {supplement.dosage.min}–{supplement.dosage.max} {supplement.dosage.unit}
                    </span>
                  </div>
                  <p className="text-xs text-ink-500 line-clamp-1 leading-snug mt-0.5">
                    {supplement.description}
                  </p>

                  {rec.reasoning && rec.reasoning.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.reasoning.slice(0, 3).map((reason, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] text-primary-800 bg-primary-050 px-1.5 py-0.5 rounded"
                        >
                          <TrendingUp className="w-2.5 h-2.5" />
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        style={{ width: `${matchPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-ink-700 w-8 text-right">
                      {matchPct}%
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addSupplement(supplement)}
                  className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-xs font-medium bg-primary-800 hover:bg-primary-700 text-ink-on-dark transition-colors shrink-0"
                  aria-label={`Add ${supplement.name} to stack`}
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
