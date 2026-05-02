import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Target, Moon, Heart, Zap, BookOpen, Sparkles, Award, ChevronDown } from 'lucide-react';
import { SupplementCard } from './SupplementCard.jsx';
import { supplements } from '../data/supplements.js';
import { getEvidenceTier } from '../lib/evidenceTier.js';

// /supplements is the catalog index. With 195 supplements we deliberately
// avoid dumping the whole list — most users land here with an intent
// (a goal, a single name they heard about, or a tier filter), so the
// page surfaces information progressively:
//
//   1. Search-first hero. If the user types, search is the only thing
//      visible — everything else collapses.
//   2. Tier 1 strip. The 16 best-evidence compounds, surfaced as the
//      editorial recommendation row.
//   3. Goal rows. Six intent-driven curated rows of 4–6 cards each
//      (Focus / Sleep / Stress / Energy / Memory / Mood).
//   4. Browse by category. A-Z and category browse stay reachable but
//      don't dominate the default view.
//
// Pattern reference: Apple App Store front page (curated rows >
// catalog), MDN docs (search-first), Examine.com (goal-anchored),
// Spotify "Made for you" rows.

// Goal definitions: label, accent token, intro copy, and the ranking
// function that picks top supplements for that intent. Ranking pulls
// straight from the supplement.effects raw scores (no headline math)
// so the choices stay legible in the catalog context.
const GOAL_ROWS = [
  {
    id: 'focus',
    label: 'Focus & Productivity',
    description: 'Sharp attention, sustained concentration, fewer task-switches.',
    icon: Target,
    accent: 'var(--color-primary-500)',
    rank: (s) => (s.effects?.study ?? 0) * 1.1 + (s.effects?.learning ?? 0) * 0.7,
  },
  {
    id: 'sleep',
    label: 'Sleep & Recovery',
    description: 'Fall asleep, stay asleep, wake up rested.',
    icon: Moon,
    accent: 'var(--color-info-500)',
    rank: (s) => (s.effects?.balance ?? 0) * 0.45 + (s.effects?.mood ?? 0) * 0.25
      + Math.max(0, 9.5 - (s.effects?.energy ?? 0)) * 0.30,
  },
  {
    id: 'stress',
    label: 'Stress & Calm',
    description: 'Lower baseline anxiety, dampen the cortisol curve.',
    icon: Heart,
    accent: 'var(--color-accent-500)',
    rank: (s) => (s.effects?.balance ?? 0) * 1.0 + (s.effects?.mood ?? 0) * 0.4,
  },
  {
    id: 'energy',
    label: 'Energy & Drive',
    description: 'Cellular energy and sustained alertness without crashes.',
    icon: Zap,
    accent: 'var(--color-warn-500)',
    rank: (s) => (s.effects?.energy ?? 0) * 1.0,
  },
  {
    id: 'memory',
    label: 'Memory & Learning',
    description: 'Encode, retain, and recall what you study.',
    icon: BookOpen,
    accent: 'var(--color-accent-500)',
    rank: (s) => (s.effects?.learning ?? 0) * 1.0 + (s.effects?.study ?? 0) * 0.5,
  },
  {
    id: 'mood',
    label: 'Mood & Outlook',
    description: 'Lift mood, support social ease, smooth emotional baseline.',
    icon: Sparkles,
    accent: 'var(--color-primary-500)',
    rank: (s) => (s.effects?.mood ?? 0) * 1.0 + (s.effects?.socialness ?? 0) * 0.5
      + (s.effects?.creativity ?? 0) * 0.3,
  },
];

// Friendly bucketing of the 21 raw categories so the browse UI doesn't
// dump 21 chips of jargon. Each bucket maps to a label and the raw
// category ids that feed it.
const CATEGORY_BUCKETS = [
  { id: 'cognitive', label: 'Cognitive', cats: ['nootropic', 'amino-acid'] },
  { id: 'energy', label: 'Energy & Focus', cats: ['stimulant', 'energy', 'performance'] },
  { id: 'sleep-stress', label: 'Sleep & Stress', cats: ['sleep', 'adaptogen'] },
  { id: 'foundational', label: 'Foundational', cats: ['vitamin', 'mineral', 'essential', 'fat', 'protein'] },
  { id: 'healthspan', label: 'Healthspan', cats: ['antioxidant', 'anti-inflammatory', 'immune', 'longevity', 'hormone', 'gut-health', 'metabolic', 'superfood'] },
  { id: 'rx', label: 'Prescription', cats: ['prescription'] },
];

function topByGoal(rankFn, n = 5) {
  return supplements
    .filter(s => s.category !== 'prescription')
    .map(s => ({ s, score: rankFn(s) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map(x => x.s);
}

function GoalRow({ goal, items }) {
  const Icon = goal.icon;
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={`goal-${goal.id}`} className="space-y-2">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-6 h-6 rounded-md"
            style={{ background: `color-mix(in oklab, ${goal.accent} 14%, transparent)`, color: goal.accent }}
          >
            <Icon className="w-3.5 h-3.5" />
          </span>
          <h2 id={`goal-${goal.id}`} className="text-sm font-semibold text-ink-900">
            {goal.label}
          </h2>
          <span className="text-[11px] text-ink-500 hidden sm:inline">{goal.description}</span>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {items.map(s => (
          <SupplementCard key={s.id} supplement={s} />
        ))}
      </div>
    </section>
  );
}

export function SupplementLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bucket, setBucket] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const searchRef = useRef(null);

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return null;
    return supplements.filter(s =>
      s.name.toLowerCase().includes(q)
      || (s.description || '').toLowerCase().includes(q)
      || (s.benefits || []).some(b => b.toLowerCase().includes(q))
      || s.category.toLowerCase().includes(q)
      || s.id.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  // Tier 1 list (best evidence) — up to 8 cards visible
  const tier1 = useMemo(() => {
    return supplements
      .filter(s => getEvidenceTier(s.id).key === 1)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Per-goal precomputed rankings
  const goalItems = useMemo(() => {
    const map = {};
    GOAL_ROWS.forEach(g => { map[g.id] = topByGoal(g.rank, 5); });
    return map;
  }, []);

  // Bucket filter results
  const bucketResults = useMemo(() => {
    if (!bucket) return null;
    const def = CATEGORY_BUCKETS.find(b => b.id === bucket);
    if (!def) return null;
    return supplements
      .filter(s => def.cats.includes(s.category))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [bucket]);

  // A-Z list, only when expanded
  const alphaList = useMemo(() => {
    if (!showAll) return null;
    return [...supplements].sort((a, b) => a.name.localeCompare(b.name));
  }, [showAll]);

  // Auto-focus search on mount (familiar library-site UX)
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus({ preventScroll: true });
    }
  }, []);

  const isSearching = searchResults !== null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Hero */}
      <header className="space-y-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 tracking-tight">
            Supplement library
          </h1>
          <span className="text-xs text-ink-500">
            {supplements.length} compounds · {tier1.length} with strong evidence
          </span>
        </div>
        <p className="text-sm text-ink-700 max-w-2xl">
          Search by name, benefit, or category — or browse the curated rows below.
          Every supplement links to a research page with PubMed citations, dosage ranges, and known interactions.
        </p>

        {/* Search input — focal */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <input
            ref={searchRef}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search 195 supplements — try “bacopa”, “sleep”, “focus”…"
            className="w-full h-9 pl-9 pr-9 rounded-md bg-surface-card border border-ink-200 focus:border-primary-500 focus:outline-none text-sm text-ink-900 placeholder:text-ink-400 transition-colors"
            aria-label="Search supplements"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); searchRef.current?.focus(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-6 h-6 rounded-md text-ink-500 hover:text-ink-900 hover:bg-surface-sunk"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Search results take over the page when active */}
      {isSearching ? (
        <section aria-labelledby="search-results" className="space-y-3">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2 id="search-results" className="text-sm font-semibold text-ink-900">
              {searchResults.length === 0 ? 'No matches' : `${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`}
              <span className="text-ink-500 font-normal"> for “{searchTerm}”</span>
            </h2>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-xs text-ink-500 hover:text-ink-900 underline-offset-2 hover:underline"
            >
              Clear search
            </button>
          </div>
          {searchResults.length === 0 ? (
            <div className="rounded-md border border-ink-200 bg-surface-card p-6 text-center">
              <p className="text-sm text-ink-700 mb-1">Nothing matched “{searchTerm}”.</p>
              <p className="text-xs text-ink-500">Try a goal name (focus, sleep, energy) or a generic category like “mineral”.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map(s => <SupplementCard key={s.id} supplement={s} />)}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Tier 1 strip — best evidence editorial row */}
          <section aria-labelledby="tier1" className="space-y-2">
            <header className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md" style={{ background: 'var(--color-tier-1-bg)', color: 'var(--color-tier-1-fg)' }}>
                  <Award className="w-3.5 h-3.5" />
                </span>
                <h2 id="tier1" className="text-sm font-semibold text-ink-900">Strong evidence (Tier 1)</h2>
                <span className="text-[11px] text-ink-500 hidden sm:inline">
                  Multiple human RCTs or meta-analyses — the safest places to start.
                </span>
              </div>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {tier1.slice(0, 8).map(s => <SupplementCard key={s.id} supplement={s} />)}
            </div>
          </section>

          {/* Goal rows */}
          {GOAL_ROWS.map(goal => (
            <GoalRow key={goal.id} goal={goal} items={goalItems[goal.id]} />
          ))}

          {/* Browse by category bucket */}
          <section aria-labelledby="browse" className="space-y-3 pt-2 border-t border-ink-200">
            <header className="flex items-center justify-between gap-3 flex-wrap pt-4">
              <h2 id="browse" className="text-sm font-semibold text-ink-900">Browse by category</h2>
              <Link to="/families" className="text-xs text-primary-700 hover:text-primary-800 inline-flex items-center gap-1">
                Or browse by family <ArrowRight className="w-3 h-3" />
              </Link>
            </header>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_BUCKETS.map(b => {
                const count = supplements.filter(s => b.cats.includes(s.category)).length;
                const active = bucket === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBucket(active ? null : b.id)}
                    className={`h-7 px-2.5 rounded-md text-xs font-medium border transition-colors ${
                      active
                        ? 'bg-primary-700 text-white border-primary-700'
                        : 'bg-surface-card text-ink-700 border-ink-200 hover:border-primary-300 hover:text-ink-900'
                    }`}
                    aria-pressed={active}
                  >
                    {b.label} <span className={active ? 'text-primary-100' : 'text-ink-500'}>· {count}</span>
                  </button>
                );
              })}
            </div>
            {bucketResults && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {bucketResults.map(s => <SupplementCard key={s.id} supplement={s} />)}
              </div>
            )}
          </section>

          {/* A-Z disclosure */}
          <section className="pt-2 border-t border-ink-200">
            <button
              type="button"
              onClick={() => setShowAll(v => !v)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold text-ink-700 hover:text-ink-900 bg-surface-card border border-ink-200 hover:border-primary-300 transition-colors"
              aria-expanded={showAll}
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
              {showAll ? 'Hide A–Z list' : `Show all ${supplements.length} alphabetically`}
            </button>
            {alphaList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                {alphaList.map(s => <SupplementCard key={s.id} supplement={s} />)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
