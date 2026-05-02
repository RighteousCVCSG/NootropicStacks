import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ExternalLink, GitCompare, ArrowRight, AlertTriangle, CheckCircle, XCircle, Minus, TrendingUp, ShoppingCart, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { supplements } from '../data/supplements.js';
import { buildAmazonSearchLink, useAffiliateCampaign, withIherbRef } from '@/lib/affiliate.js';
import AffiliateDisclosure, { AffiliateDisclosureInline } from './AffiliateDisclosure.jsx';

// Effect labels with display names for the actual data schema
const EFFECT_LABELS = {
  energy: 'Energy',
  mood: 'Mood',
  balance: 'Calm / Balance',
  creativity: 'Creativity',
  socialness: 'Social / Confidence',
  learning: 'Learning',
  study: 'Study Focus',
};

const EFFECT_ICONS = {
  energy: '⚡',
  mood: '😊',
  balance: '🧘',
  creativity: '💡',
  socialness: '🤝',
  learning: '📖',
  study: '🎯',
};

function getEffectBarColor(value) {
  if (value >= 7) return 'bg-green-500';
  if (value >= 4) return 'bg-blue-500';
  if (value >= 1) return 'bg-gray-400';
  if (value < 0) return 'bg-red-400';
  return 'bg-gray-200';
}

function getCategoryColor(category) {
  const colors = {
    nootropic: 'bg-blue-100 text-blue-800',
    adaptogen: 'bg-green-100 text-green-800',
    stimulant: 'bg-orange-100 text-orange-800',
    energy: 'bg-yellow-100 text-yellow-800',
    mineral: 'bg-gray-100 text-gray-800',
    vitamin: 'bg-amber-100 text-amber-800',
    essential: 'bg-teal-100 text-teal-800',
    longevity: 'bg-purple-100 text-purple-800',
    performance: 'bg-emerald-100 text-emerald-800',
    sleep: 'bg-violet-100 text-violet-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

function trackClick(name, vendor) {
  fetch('/api/track/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supplement: name, vendor, page: 'compare' }),
  }).catch(() => {});
}

function AffiliateButtons({ supplement }) {
  const baseCampaign = useAffiliateCampaign();
  const campaign = `${baseCampaign}-${supplement.id}`;
  const amazonUrl = buildAmazonSearchLink(`${supplement.name} supplement`, { campaign });
  const iherbUrl = withIherbRef(`https://www.iherb.com/search?kw=${encodeURIComponent(supplement.name)}`);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackClick(supplement.name, 'amazon')}
          className="flex items-center gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md font-medium transition-colors"
        >
          <ShoppingCart className="w-3 h-3" />
          Amazon
        </a>
        <a
          href={iherbUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackClick(supplement.name, 'iherb')}
          className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md font-medium transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          iHerb
        </a>
      </div>
      <AffiliateDisclosureInline />
    </div>
  );
}

// Searchable dropdown for selecting a supplement
function SupplementSelect({ label, selected, onChange, exclude }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return supplements
      .filter(s => s.id !== exclude && s.name.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, exclude]);

  const handleSelect = (s) => {
    onChange(s);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between gap-2 px-3 py-2.5 border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:outline-none focus:border-blue-500 transition-colors"
      >
        <span className={selected ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {selected ? selected.name : 'Search supplements…'}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
          <div className="p-2 border-b">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-400">No results</li>
            )}
            {filtered.map(s => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between gap-2"
                >
                  <span className="font-medium text-gray-900">{s.name}</span>
                  <Badge className={`text-xs ${getCategoryColor(s.category)}`}>
                    {s.category}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Single effect bar row for comparison
function EffectRow({ effectKey, label, icon, valA, valB }) {
  const maxVal = 10;
  const aPercent = Math.max(0, valA) * 10;
  const bPercent = Math.max(0, valB) * 10;
  const diff = valA - valB;
  const winner = diff > 1 ? 'a' : diff < -1 ? 'b' : 'tie';

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      {/* Left supplement bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-1">
          <span className={`text-xs font-bold ${valA >= 7 ? 'text-green-600' : valA >= 4 ? 'text-blue-600' : 'text-gray-500'}`}>
            {valA > 0 ? '+' : ''}{valA}
          </span>
          {winner === 'a' && <span className="text-xs text-green-600 font-semibold">✓</span>}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getEffectBarColor(valA)}`}
            style={{ width: `${aPercent}%` }}
          />
        </div>
      </div>

      {/* Center label */}
      <div className="text-center w-28 flex-shrink-0">
        <div className="text-base mb-0.5">{icon}</div>
        <div className="text-xs font-medium text-gray-600 leading-tight">{label}</div>
      </div>

      {/* Right supplement bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-1">
          {winner === 'b' && <span className="text-xs text-green-600 font-semibold">✓</span>}
          <span className={`text-xs font-bold ml-auto ${valB >= 7 ? 'text-green-600' : valB >= 4 ? 'text-blue-600' : 'text-gray-500'}`}>
            {valB > 0 ? '+' : ''}{valB}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex justify-end">
          <div
            className={`h-full rounded-full transition-all ${getEffectBarColor(valB)}`}
            style={{ width: `${bPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Verdict section
function VerdictSection({ suppA, suppB }) {
  const effA = suppA.effects;
  const effB = suppB.effects;

  const verdicts = [
    {
      label: 'Best for Focus & Study',
      icon: '🎯',
      winner: (effA.study + effA.learning) >= (effB.study + effB.learning) ? suppA : suppB,
      reason: (effA.study + effA.learning) >= (effB.study + effB.learning)
        ? `${suppA.name} scores ${effA.study + effA.learning} combined on study + learning vs ${effB.study + effB.learning}`
        : `${suppB.name} scores ${effB.study + effB.learning} combined on study + learning vs ${effA.study + effA.learning}`,
    },
    {
      label: 'Best for Mood & Wellbeing',
      icon: '😊',
      winner: effA.mood >= effB.mood ? suppA : suppB,
      reason: effA.mood >= effB.mood
        ? `${suppA.name} has a higher mood score (${effA.mood} vs ${effB.mood})`
        : `${suppB.name} has a higher mood score (${effB.mood} vs ${effA.mood})`,
    },
    {
      label: 'Best for Beginners',
      icon: '🌱',
      winner: (() => {
        const warnA = suppA.warnings.length;
        const warnB = suppB.warnings.length;
        if (warnA < warnB) return suppA;
        if (warnB < warnA) return suppB;
        // tie-break on balance (tolerability)
        return effA.balance >= effB.balance ? suppA : suppB;
      })(),
      reason: (() => {
        const warnA = suppA.warnings.length;
        const warnB = suppB.warnings.length;
        if (warnA < warnB) return `${suppA.name} has fewer safety warnings and better tolerability`;
        if (warnB < warnA) return `${suppB.name} has fewer safety warnings and better tolerability`;
        return `Similar safety profiles — ${effA.balance >= effB.balance ? suppA.name : suppB.name} edges ahead on calm/balance score`;
      })(),
    },
    {
      label: 'Best All-Around Value',
      icon: '💰',
      winner: (() => {
        const totalA = Object.values(effA).reduce((sum, v) => sum + Math.max(0, v), 0);
        const totalB = Object.values(effB).reduce((sum, v) => sum + Math.max(0, v), 0);
        return totalA >= totalB ? suppA : suppB;
      })(),
      reason: (() => {
        const totalA = Object.values(effA).reduce((sum, v) => sum + Math.max(0, v), 0);
        const totalB = Object.values(effB).reduce((sum, v) => sum + Math.max(0, v), 0);
        const winner = totalA >= totalB ? suppA : suppB;
        return `${winner.name} has the higher combined effects total score across all dimensions`;
      })(),
    },
  ];

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <TrendingUp className="w-5 h-5" />
          Head-to-Head Verdict
        </CardTitle>
        <p className="text-sm text-blue-700">Based on effects data analysis</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {verdicts.map(v => (
            <div key={v.label} className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{v.icon}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{v.label}</span>
              </div>
              <div className="font-bold text-gray-900 text-sm mb-1">{v.winner.name}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{v.reason}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Key differences summary
function KeyDifferences({ suppA, effA, suppB, effB }) {
  const diffs = Object.keys(EFFECT_LABELS).map(key => ({
    key,
    label: EFFECT_LABELS[key],
    diff: (effA[key] || 0) - (effB[key] || 0),
  })).filter(d => Math.abs(d.diff) >= 2).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0, 4);

  if (diffs.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        These supplements have very similar effect profiles.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {diffs.map(d => {
        const winner = d.diff > 0 ? suppA : suppB;
        const loser = d.diff > 0 ? suppB : suppA;
        return (
          <li key={d.key} className="flex items-start gap-2 text-sm">
            <span className="text-base leading-tight">{EFFECT_ICONS[d.key]}</span>
            <span className="text-gray-700">
              <strong>{winner.name}</strong> is notably stronger on <strong>{d.label}</strong> (
              +{Math.abs(d.diff)} pts ahead of {loser.name})
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function ComparisonPage() {
  const [searchParams] = useSearchParams();

  // Pre-select from URL params if provided (e.g. /compare-supplements?a=caffeine&b=l-theanine)
  const initA = searchParams.get('a');
  const initB = searchParams.get('b');

  const [suppA, setSuppA] = useState(() => initA ? supplements.find(s => s.id === initA) || null : null);
  const [suppB, setSuppB] = useState(() => initB ? supplements.find(s => s.id === initB) || null : null);

  const bothSelected = suppA && suppB;

  const effA = suppA?.effects || {};
  const effB = suppB?.effects || {};

  // Shared synergies: find supplements that interact with both (using interactions array as proxy)
  const sharedInteractions = useMemo(() => {
    if (!bothSelected) return [];
    const setA = new Set(suppA.interactions || []);
    return (suppB.interactions || []).filter(i => setA.has(i));
  }, [suppA, suppB, bothSelected]);

  const stackUrl = bothSelected ? `/?stack=${suppA.id},${suppB.id}` : '/';

  const pageTitle = bothSelected
    ? `${suppA.name} vs ${suppB.name}: Head-to-Head Comparison | NootropicStacker`
    : 'Compare Nootropics Side-by-Side | NootropicStacker';

  const pageDesc = bothSelected
    ? `Compare ${suppA.name} vs ${suppB.name} — effects, dosage, safety, and which wins for focus, mood, and beginners.`
    : 'Compare any two nootropics side-by-side. Effects, dosage, safety, synergies, and a data-driven verdict.';

  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle={pageTitle}
        customDescription={pageDesc}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <GitCompare className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Nootropic Comparison</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Select two supplements to compare their effects, dosage, safety profile, and synergies side-by-side. Get a data-driven verdict on which is right for your goals.
          </p>
        </div>

        {/* Supplement selectors */}
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SupplementSelect
                label="Supplement A"
                selected={suppA}
                onChange={setSuppA}
                exclude={suppB?.id}
              />
              <SupplementSelect
                label="Supplement B"
                selected={suppB}
                onChange={setSuppB}
                exclude={suppA?.id}
              />
            </div>

            {!bothSelected && (
              <div className="mt-4 text-center text-sm text-gray-400">
                Select two supplements above to start comparing
              </div>
            )}
          </CardContent>
        </Card>

        {bothSelected && (
          <>
            {/* Supplement headers with buy buttons */}
            <div className="grid grid-cols-2 gap-4">
              {[suppA, suppB].map((s, i) => (
                <Card key={s.id} className={`border-2 ${i === 0 ? 'border-blue-200' : 'border-purple-200'}`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="space-y-2">
                      <Badge className={getCategoryColor(s.category)}>{s.category}</Badge>
                      <h2 className="font-bold text-gray-900 text-base leading-snug">{s.name}</h2>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{s.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="font-medium">Dose:</span>
                        <span>{s.dosage.min}–{s.dosage.max}{s.dosage.unit}</span>
                      </div>
                      <AffiliateButtons supplement={s} />
                      <Link
                        to={`/supplements/${s.id}`}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                      >
                        Full profile <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Effects comparison */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Effects Profile Comparison</CardTitle>
                <div className="grid grid-cols-[1fr_auto_1fr] text-xs font-semibold text-gray-400 mt-1 px-0 gap-3">
                  <span className="text-blue-700 truncate">{suppA.name}</span>
                  <span className="w-28 text-center">Dimension</span>
                  <span className="text-purple-700 text-right truncate">{suppB.name}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {Object.entries(EFFECT_LABELS).map(([key, label]) => (
                  <EffectRow
                    key={key}
                    effectKey={key}
                    label={label}
                    icon={EFFECT_ICONS[key]}
                    valA={effA[key] ?? 0}
                    valB={effB[key] ?? 0}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Two-column info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dosage */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-700">Dosage & Timing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[suppA, suppB].map((s, i) => (
                    <div key={s.id} className="flex gap-3">
                      <div className={`w-2 rounded-full flex-shrink-0 mt-1 ${i === 0 ? 'bg-blue-400' : 'bg-purple-400'}`} style={{ minHeight: 40 }} />
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{s.name}</div>
                        <div className="text-xs text-gray-600">
                          {s.dosage.min}–{s.dosage.max} {s.dosage.unit}
                        </div>
                        <div className="text-xs text-gray-400">{s.dosage.timing}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Category & Benefits */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-700">Category & Key Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[suppA, suppB].map((s, i) => (
                    <div key={s.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? 'bg-blue-400' : 'bg-purple-400'}`} />
                        <span className="font-semibold text-sm">{s.name}</span>
                        <Badge className={`text-xs ${getCategoryColor(s.category)}`}>{s.category}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 ml-4">
                        {(s.benefits || []).slice(0, 3).map(b => (
                          <span key={b} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{b}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Safety */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    Safety & Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[suppA, suppB].map((s, i) => (
                    <div key={s.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? 'bg-blue-400' : 'bg-purple-400'}`} />
                        <span className="font-semibold text-sm">{s.name}</span>
                        {(s.warnings?.length === 0 || (s.warnings?.length === 1 && s.warnings[0].toLowerCase().includes('well tolerated'))) && (
                          <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
                            <CheckCircle className="w-3 h-3" /> Generally safe
                          </span>
                        )}
                      </div>
                      {s.warnings?.length > 0 && (
                        <ul className="ml-4 space-y-0.5">
                          {s.warnings.map((w, wi) => (
                            <li key={wi} className="text-xs text-gray-600 flex items-start gap-1">
                              <Minus className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      )}
                      {s.interactions?.length > 0 && (
                        <div className="ml-4 mt-1 text-xs text-gray-400">
                          Interactions: {s.interactions.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Synergies / Interactions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-700 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Synergies & Compatibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sharedInteractions.length > 0 ? (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-orange-700 mb-1">Shared interactions — use caution:</p>
                      <div className="flex flex-wrap gap-1">
                        {sharedInteractions.map(i => (
                          <span key={i} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{i}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-3 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      No known shared interaction risks
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mb-2">Supplements commonly paired with each:</p>
                  {[suppA, suppB].map((s, i) => (
                    <div key={s.id} className="mb-2 last:mb-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-purple-400'}`} />
                        <span className="text-xs font-medium text-gray-700">{s.name}</span>
                      </div>
                      {s.interactions?.length > 0 ? (
                        <div className="ml-3 flex flex-wrap gap-1">
                          {s.interactions.slice(0, 3).map(int => (
                            <span key={int} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{int}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="ml-3 text-xs text-gray-400">No listed interactions</span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Key differences */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Key Differences</CardTitle>
              </CardHeader>
              <CardContent>
                <KeyDifferences suppA={suppA} effA={effA} suppB={suppB} effB={effB} />
              </CardContent>
            </Card>

            {/* Verdict */}
            <VerdictSection suppA={suppA} suppB={suppB} />

            {/* Stack Together CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white text-center">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <h2 className="text-xl font-bold mb-2">Stack These Together</h2>
              <p className="text-blue-100 text-sm mb-4 max-w-md mx-auto">
                Load both {suppA.name} and {suppB.name} into the Stack Builder to check synergies, get your Stack Score, and build a complete protocol.
              </p>
              <Link
                to={stackUrl}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Layers className="w-4 h-4" />
                Open in Stack Builder
              </Link>
            </div>

            <AffiliateDisclosure variant="compare" />
          </>
        )}

        {/* Suggested comparisons when nothing selected */}
        {!bothSelected && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Popular Comparisons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { a: 'caffeine', b: 'l-theanine', label: 'Caffeine vs L-Theanine' },
                { a: 'ashwagandha', b: 'rhodiola', label: 'Ashwagandha vs Rhodiola' },
                { a: 'lions-mane', b: 'bacopa', label: "Lion's Mane vs Bacopa" },
                { a: 'creatine', b: 'omega3', label: 'Creatine vs Omega-3' },
              ].map(({ a, b, label }) => {
                const sA = supplements.find(s => s.id === a);
                const sB = supplements.find(s => s.id === b);
                if (!sA || !sB) return null;
                return (
                  <button
                    key={`${a}-${b}`}
                    type="button"
                    onClick={() => { setSuppA(sA); setSuppB(sB); }}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                  >
                    <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
