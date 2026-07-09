import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStack } from '../contexts/StackContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { supplements } from '../data/supplements.js';
import { calculateItemContribution } from '../utils/stackAnalyzer.js';
import { SaveStackDialog } from './SaveStackDialog.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { resolveBuyUrl } from '@/lib/affiliate.js';
import { getCheapestVendor } from '../data/priceTable.js';
import { AffiliateDisclosureInline } from './AffiliateDisclosure.jsx';
import { track } from '../lib/analytics.js';
import { Button } from '@/components/ui/button.jsx';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from '@/components/ui/drawer.jsx';
import { ShipBuildSheet } from './ShipBuildSheet.jsx';
import { StackPosterButton } from './StackPosterButton.jsx';
import { TIMING_CONFIG, getSupplementTiming } from './StackProtocolBuilder.jsx';
import { suggestStackName } from '../contexts/StackContext.jsx';
import {
  Trash2, AlertTriangle, CheckCircle, XCircle,
  Save, ShoppingCart, ExternalLink, Share2, X, Layers,
  Moon, Zap, Brain, Activity, ChevronDown, ChevronUp, Truck,
  List, Clock
} from 'lucide-react';

const MONTHLY_COSTS = {
  'coq10': 22, 'ashwagandha': 18, 'l-theanine': 12, 'caffeine': 6,
  'lions-mane': 28, 'lion-mane': 28, 'lions-mane-mushroom': 28,
  'bacopa': 18, 'alpha-gpc': 25, 'alpha-gpc-choline': 25,
  'creatine': 14, 'magnesium': 16, 'magnesium-glycinate': 16,
  'vitamin-d': 8, 'vitamin-d3': 8, 'omega3': 22, 'fish-oil': 20,
  'rhodiola': 20, 'rhodiola-rosea': 20, 'citicoline': 24,
  'phosphatidylserine': 28, 'huperzine-a': 16, 'noopept': 18,
  'piracetam': 20, 'aniracetam': 24, 'phenylpiracetam': 28,
  'oxiracetam': 26, 'modafinil': 80, 'armodafinil': 90,
  'nad-precursors': 45, 'nmn': 45, 'nr': 40, 'resveratrol': 20,
  'curcumin': 18, 'turmeric': 12, 'zinc': 8, 'melatonin': 8,
  'b-complex': 10, 'tyrosine': 14, 'l-tyrosine': 14, 'taurine': 10,
  'cordyceps': 24, 'reishi': 20, 'lions-mane-extract': 28,
  'panax-ginseng': 18, 'mucuna-pruriens': 16, 'ginkgo': 12,
  'bacopa-monnieri': 18, 'collagen': 22, 'probiotics': 26,
  'vitamin-c': 8, 'mct-oil': 18, 'spirulina': 16,
  'green-tea-extract': 12, 'berberine': 18, 'alpha-lipoic-acid': 16,
  'kanna': 22, 'pramiracetam': 30, 'coluracetam': 32, 'fasoracetam': 28,
};

function getMonthlyStackCost(stack) {
  return stack.reduce((total, item) => {
    const cost = MONTHLY_COSTS[item.supplementId] || 20;
    return total + cost;
  }, 0);
}

const SCORE_COLORS = {
  Low: { bar: 'bg-ink-300', text: 'text-ink-500' },
  Moderate: { bar: 'bg-primary-600', text: 'text-primary-800' },
  Strong: { bar: 'bg-accent-500', text: 'text-accent-700' },
  Maxed: { bar: 'bg-warn-500', text: 'text-warn-700' },
};

function MiniScoreBar({ score, qual }) {
  const pct = Math.min(100, (score / 9.5) * 100);
  const colors = SCORE_COLORS[qual] || SCORE_COLORS.Low;
  return (
    <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// Per-dimension accent colors. Used in BOTH the StackScoreMini boxes
// (a dot under the label) and the per-supplement contribution chips
// (the leading colored dot) so a glance shows which dimension a row
// is contributing to.
const DIMENSION_ACCENT = {
  overall: 'var(--color-primary-500)',
  sleep:   'var(--color-info-500)',
  energy:  'var(--color-warn-500)',
  mind:    'var(--color-accent-500)',
};

function StackScoreMini({ stackScore }) {
  if (!stackScore?.headlineScores) return null;
  const { overall, sleep, energy, mind, dimensionQuals } = stackScore.headlineScores;
  const dimensions = [
    { key: 'overall', label: 'Overall', icon: Activity, score: overall, qual: dimensionQuals?.overall?.label || 'Low' },
    { key: 'sleep', label: 'Sleep', icon: Moon, score: sleep, qual: dimensionQuals?.sleep?.label || 'Low' },
    { key: 'energy', label: 'Energy', icon: Zap, score: energy, qual: dimensionQuals?.energy?.label || 'Low' },
    { key: 'mind', label: 'Mind', icon: Brain, score: mind, qual: dimensionQuals?.mind?.label || 'Low' },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {dimensions.map(d => {
        const colors = SCORE_COLORS[d.qual] || SCORE_COLORS.Low;
        return (
          <div key={d.key} className="flex flex-col items-center gap-1 p-2 rounded-md bg-surface-sunk">
            <d.icon className={`w-3.5 h-3.5 ${colors.text}`} />
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              <span
                aria-hidden
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: DIMENSION_ACCENT[d.key] }}
              />
              {d.label}
            </span>
            <span className={`text-sm font-semibold ${colors.text}`}>{d.score.toFixed(1)}</span>
            <MiniScoreBar score={d.score} qual={d.qual} />
          </div>
        );
      })}
    </div>
  );
}

// Per-supplement contribution chips. Mirrors the StackScoreMini up top
// (Overall / Sleep / Energy / Mind) using the same color tier so a
// glance shows "this row contributes to which dimension." Color-coded
// dot + score in tiny mono font.
function ContributionChips({ contribution, stackOverall }) {
  const dims = [
    { key: 'overall', label: 'O', score: contribution.overall, accent: 'var(--color-primary-500)' },
    { key: 'sleep',   label: 'S', score: contribution.sleep,   accent: 'var(--color-info-500)' },
    { key: 'energy',  label: 'E', score: contribution.energy,  accent: 'var(--color-warn-500)' },
    { key: 'mind',    label: 'M', score: contribution.mind,    accent: 'var(--color-accent-500)' },
  ];
  // % of stack this item contributes to overall — capped sensibly.
  const overallPct = stackOverall > 0
    ? Math.min(100, Math.round((contribution.overall / stackOverall) * 100))
    : 0;
  return (
    <div className="flex items-center gap-1.5 flex-wrap" aria-label="Contribution to stack score">
      {dims.map((d) => (
        <span
          key={d.key}
          title={`${d.label === 'O' ? 'Overall' : d.label === 'S' ? 'Sleep' : d.label === 'E' ? 'Energy' : 'Mind'} contribution ${d.score.toFixed(1)}/9.5`}
          className="inline-flex items-center gap-0.5 text-[9px] font-mono font-semibold text-ink-500"
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: d.accent, opacity: d.score >= 0.5 ? 1 : 0.25 }}
          />
          <span className="uppercase tracking-wider">{d.label}</span>
          <span className="tabular-nums text-ink-700">{d.score.toFixed(1)}</span>
        </span>
      ))}
      {overallPct > 0 && (
        <span className="ml-auto text-[9px] font-mono text-ink-500">
          ~<span className="tabular-nums text-ink-700 font-semibold">{overallPct}%</span> of stack
        </span>
      )}
    </div>
  );
}

function StackItemRow({ item, onRemove, onDosageChange, stackOverall, onClose }) {
  const supplement = supplements.find(s => s.id === item.supplementId);
  if (!supplement) return null;
  const contribution = calculateItemContribution(item);

  // Stop propagation so dose input + remove button don't trigger row navigation.
  const stop = (e) => e.stopPropagation();

  return (
    <div className="group relative rounded-md bg-surface-sunk hover:bg-surface-card transition-colors">
      {/* The whole row is a Link to the supplement's research page. The
          dose input and remove button stop propagation so they remain
          interactive without firing the navigation. */}
      <Link
        to={`/supplements/${supplement.id}`}
        onClick={() => {
          track('stack_item_research_open', { supplementId: supplement.id });
          if (typeof onClose === 'function') onClose();
        }}
        className="block p-3"
        aria-label={`Open research for ${supplement.name}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-ink-900 truncate group-hover:text-primary-800 transition-colors">
              {supplement.name}
            </div>
            <div className="text-[11px] text-ink-500 mt-0.5">
              {item.dosage} {supplement.dosage.unit} · {item.timing}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0" onClick={stop}>
            <input
              type="number"
              value={item.dosage}
              onChange={(e) => onDosageChange(item.supplementId, parseFloat(e.target.value))}
              min={supplement.dosage.min}
              max={supplement.dosage.max}
              step={supplement.dosage.unit === 'mcg' ? 10 : supplement.dosage.unit === 'mg' ? 50 : 1}
              className="w-14 px-1.5 py-0.5 text-[11px] border border-ink-200 rounded bg-surface-card text-ink-900"
              aria-label={`Dosage for ${supplement.name}`}
            />
            <button
              type="button"
              onClick={(e) => { stop(e); onRemove(item.supplementId); }}
              className="p-1 rounded-md text-ink-400 hover:text-danger-500 hover:bg-danger-100 transition-colors"
              aria-label={`Remove ${supplement.name}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="mt-2">
          <ContributionChips contribution={contribution} stackOverall={stackOverall} />
        </div>
      </Link>

      {/* Hover overlay — semi-transparent label that confirms the click
          action ("Open research →"). Pointer-events-none so it never
          blocks the underlying input/button. */}
      <div className="pointer-events-none absolute inset-0 rounded-md bg-primary-050/0 group-hover:bg-primary-050/40 transition-colors flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
        <span className="text-[10px] font-medium text-primary-800 bg-surface-card border border-primary-300 rounded px-1.5 py-0.5">
          Open research →
        </span>
      </div>
    </div>
  );
}

function StackWarnings({ safetyAnalysis }) {
  const [open, setOpen] = useState(true);
  if (!safetyAnalysis?.warnings?.length) return null;
  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-700 transition-colors"
      >
        <AlertTriangle className="w-3 h-3" />
        Safety warnings ({safetyAnalysis.warnings.length})
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="space-y-1.5">
          {safetyAnalysis.warnings.map((warning, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 p-2 rounded-md text-xs ${
                warning.severity === 'high'
                  ? 'bg-danger-100 border-l-2 border-danger-500 text-danger-700'
                  : warning.severity === 'medium'
                  ? 'bg-warn-100 border-l-2 border-warn-500 text-warn-700'
                  : 'bg-ink-100 border-l-2 border-ink-300 text-ink-500'
              }`}
            >
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
              <span>{warning.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StackShopLinks({ stack }) {
  if (stack.length === 0) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2 flex items-center gap-2">
        <ShoppingCart className="w-3 h-3" />
        Shop Your Stack
        <AffiliateDisclosureInline />
      </h4>
      <div className="space-y-1">
        {stack.map(item => {
          const links = AFFILIATE_LINKS[item.supplementId];
          const supplement = supplements.find(s => s.id === item.supplementId);
          if (!supplement) return null;
          const buyUrl = resolveBuyUrl(item.supplementId, supplement.name, links, {
            campaign: `stack-${item.supplementId}`,
            getCheapest: getCheapestVendor,
          });
          if (!buyUrl) return null;
          return (
            <a
              key={item.supplementId}
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded hover:bg-accent-050 text-xs group"
            >
              <span className="text-ink-700 group-hover:text-accent-700 truncate mr-2">{supplement.name}</span>
              <span className="text-accent-600 text-xs font-medium shrink-0 flex items-center gap-1">
                Buy <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function StackCost({ stack }) {
  if (stack.length === 0) return null;
  const monthly = getMonthlyStackCost(stack);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-xs text-ink-500">Estimated monthly cost</p>
        <p className="text-xl font-semibold text-ink-900">${monthly}/mo</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-ink-500">{stack.length} supplement{stack.length !== 1 ? 's' : ''}</p>
        <p className="text-xs text-ink-400">~${Math.round(monthly / 30)}/day</p>
      </div>
    </div>
  );
}

function ShareButton({ onShare, shareCopied }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onShare}
        className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
        aria-label="Share stack"
      >
        <Share2 className="w-4 h-4" />
      </button>
      {shareCopied && (
        <span className="text-[10px] text-success-700 font-medium whitespace-nowrap">Copied!</span>
      )}
    </div>
  );
}

function ScheduleView({ stack }) {
  const groups = { morning: [], prework: [], evening: [], bedtime: [] };
  stack.forEach((item) => {
    const supplement = supplements.find((s) => s.id === item.supplementId);
    if (!supplement) return;
    const timing = getSupplementTiming(item.supplementId);
    groups[timing].push({ supplement, item });
  });
  const active = Object.keys(groups).filter((k) => groups[k].length > 0);

  return (
    <div className="space-y-2">
      {active.map((timing) => {
        const config = TIMING_CONFIG[timing];
        const Icon = config.icon;
        return (
          <div key={timing} className={`p-2.5 rounded-md border ${config.bg} ${config.border}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              <span className="text-xs font-semibold text-ink-900">{config.label}</span>
              <span className="text-[10px] text-ink-500">{config.subtitle}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {groups[timing].map(({ supplement, item }) => (
                <span
                  key={supplement.id}
                  className="text-[11px] px-1.5 py-0.5 rounded bg-surface-card border border-ink-200 text-ink-700"
                >
                  {supplement.name}{' '}
                  <span className="text-ink-500">
                    {item.dosage}
                    {supplement.dosage.unit}
                  </span>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DrawerBody({ stack, stackName, safetyAnalysis, stackScore, user, onRemove, onDosageChange, onClear, onSave, showSaveDialog, setShowSaveDialog, onClose }) {
  const [shareCopied, setShareCopied] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'schedule'
  const shipBtnRef = useRef(null);

  // C2 mediation: at >=3 items, surface a tiny "Ready to ship?" text link
  // up top so committed users don't scroll past the list. The primary Ship
  // button stays below the list — review-mode is preserved for early stacks.
  const showShipAnchor = stack.length >= 3;
  const handleShipAnchorClick = () => {
    track('ship_anchor_click', { stack_size: stack.length });
    shipBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Brief pause so the user sees where they're being scrolled before opening
    setTimeout(() => setShipOpen(true), 350);
  };

  const handleShare = () => {
    const ids = stack.map(s => s.supplementId).join(',');
    const params = new URLSearchParams({ stack: ids });
    if (stackName) params.set('name', stackName);
    const url = `${window.location.origin}/build?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
    track('stack_share', { stack_size: stack.length, named: Boolean(stackName) });
  };

  if (stack.length === 0) {
    return (
      <div className="empty">
        <Layers className="w-8 h-8 text-ink-300" />
        <h3 className="empty__title">My Stack</h3>
        <p className="empty__body text-sm">Add supplements to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ShipBuildSheet open={shipOpen} onOpenChange={setShipOpen} stack={stack} />

      <StackScoreMini stackScore={stackScore} />

      {/* Ship anchor — only shows when the stack is large enough that the
          bottom Ship button would otherwise scroll out of reach. */}
      {showShipAnchor && (
        <button
          type="button"
          onClick={handleShipAnchorClick}
          className={`w-full inline-flex items-center justify-center gap-1.5 text-xs ${
            stack.length >= 7 ? 'font-medium' : ''
          } text-primary-800 hover:text-primary-700 hover:underline`}
        >
          <Truck className="w-3 h-3" />
          Ready to ship? Jump to checkout
        </button>
      )}

      <StackWarnings safetyAnalysis={safetyAnalysis} />

      <div className="flex items-center gap-1 p-0.5 rounded-md bg-surface-sunk text-xs">
        <button
          type="button"
          onClick={() => setView('list')}
          aria-pressed={view === 'list'}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1 rounded transition-colors ${
            view === 'list'
              ? 'bg-surface-card text-ink-900 font-medium shadow-1'
              : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <List className="w-3 h-3" /> List
        </button>
        <button
          type="button"
          onClick={() => setView('schedule')}
          aria-pressed={view === 'schedule'}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1 rounded transition-colors ${
            view === 'schedule'
              ? 'bg-surface-card text-ink-900 font-medium shadow-1'
              : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <Clock className="w-3 h-3" /> Schedule
        </button>
      </div>

      {view === 'list' ? (
        <div className="space-y-2">
          {stack.map(item => (
            <StackItemRow
              key={item.supplementId}
              item={item}
              onRemove={onRemove}
              onDosageChange={onDosageChange}
              stackOverall={stackScore?.headlineScores?.overall || 0}
              onClose={onClose}
            />
          ))}
        </div>
      ) : (
        <ScheduleView stack={stack} />
      )}
      <StackShopLinks stack={stack} />
      <div className="border-t border-ink-200" />
      <StackCost stack={stack} />

      {/* Primary "ship the whole build" CTA lives BELOW the list so the
          drawer answers "what's in my stack?" before "do you want to buy?".
          The top inline anchor (when stack.length >= 3) scrolls here. */}
      <button
        ref={shipBtnRef}
        type="button"
        onClick={() => setShipOpen(true)}
        className="w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-md text-sm font-medium bg-primary-050 hover:bg-primary-100 text-primary-800 border border-primary-300 hover:border-primary-500 transition-colors"
      >
        <Truck className="w-4 h-4" />
        Ship This Build
      </button>

      <div className="flex items-center gap-2 pt-2 flex-wrap">
        {user && (
          <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)} className="flex-1 text-xs">
            <Save className="w-3.5 h-3.5 mr-1" />
            Save
          </Button>
        )}
        <StackPosterButton stack={stack} stackScore={stackScore} stackName={stackName} />
        <Button
          variant="tertiary"
          size="sm"
          onClick={onClear}
          className="flex-1 text-danger-500 hover:text-danger-700 text-xs"
        >
          Clear
        </Button>
        <ShareButton onShare={handleShare} shareCopied={shareCopied} />
      </div>
    </div>
  );
}

/* =========== Desktop Drawer (fixed right-side panel) =========== */
function DesktopDrawer({ open, onClose, children }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`
          fixed top-16 right-0 bottom-0 z-[1000] w-64
          bg-surface-card border-l border-ink-200
          shadow-3
          transition-transform duration-300 ease-out
          overflow-y-auto
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal={open ? 'true' : undefined}
        aria-label="Stack drawer"
      >
        {open && children}
      </div>
    </>
  );
}

/* Editable header — replaces the static "My Stack" heading. The placeholder
 * is derived from the user's goals (e.g. "Focus & Energy Stack") so the
 * field never feels blank, and a real name they type ("Dad's Anti-Brain-Fog
 * Stack") is propagated everywhere we emit the stack identity (poster
 * title, share URL, returning-user welcome strip).
 */
function StackHeader({ stackName, setStackName, userGoals, itemCount }) {
  const suggested = suggestStackName(userGoals);
  const placeholder = suggested || 'Name your stack';
  return (
    <div className="min-w-0 flex-1">
      <input
        type="text"
        value={stackName}
        onChange={(e) => setStackName(e.target.value)}
        placeholder={placeholder}
        maxLength={80}
        aria-label="Stack name"
        className="w-full bg-transparent border-0 px-0 text-lg font-semibold text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-0"
        style={{ fontFamily: 'var(--font-display)' }}
      />
      {itemCount > 0 && (
        <p className="text-xs text-ink-500">
          {itemCount} supplement{itemCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

/* =========== StackDrawer (main) =========== */
export function StackDrawer() {
  const {
    stack, safetyAnalysis, stackScore,
    removeSupplement, updateDosage, clearStack,
    drawerOpen, openDrawer, closeDrawer, toggleDrawer,
    hasSupplement, itemCount,
    stackName, setStackName, userGoals,
  } = useStack();
  const { user } = useAuth();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleClear = () => {
    if (stack.length === 0) return;
    if (window.confirm('Clear your entire stack?')) {
      clearStack();
      closeDrawer();
    }
  };

  if (isMobile) {
    return (
      <>
        {stack.length > 0 && (
          <Drawer open={drawerOpen} onOpenChange={(open) => open ? openDrawer() : closeDrawer()}>
            <DrawerTrigger asChild>
              {/* bottom-24, not bottom-4 — clears the StackScoreWidget's
                  mobile sticky score bar (measured ~81px tall) that now
                  spans the viewport bottom on the same routes. */}
              <button
                className="fixed bottom-24 left-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-card border border-primary-300 text-primary-800 shadow-2 text-xs font-medium hover:border-primary-500 hover:bg-primary-050 transition-colors"
                aria-label="Toggle stack drawer"
              >
                <Layers className="w-4 h-4" />
                Stack
                <span className="ml-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-accent-500 text-ink-on-dark text-[10px] font-semibold">
                  {itemCount}
                </span>
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] pb-6">
              <div className="px-4 py-4 overflow-y-auto space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <StackHeader
                    stackName={stackName}
                    setStackName={setStackName}
                    userGoals={userGoals}
                    itemCount={stack.length}
                  />
                  <DrawerClose asChild>
                    <button
                      className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
                      aria-label="Close stack drawer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </DrawerClose>
                </div>
                <DrawerBody
                  stack={stack}
                  stackName={stackName}
                  safetyAnalysis={safetyAnalysis}
                  stackScore={stackScore}
                  user={user}
                  onRemove={removeSupplement}
                  onDosageChange={updateDosage}
                  onClear={handleClear}
                  onSave={() => setShowSaveDialog(true)}
                  showSaveDialog={showSaveDialog}
                  setShowSaveDialog={setShowSaveDialog}
                  onClose={closeDrawer}
                />
              </div>
            </DrawerContent>
          </Drawer>
        )}
        <SaveStackDialog open={showSaveDialog} onOpenChange={setShowSaveDialog} />
      </>
    );
  }

  return (
    <>
      {/* TabHandle removed — StackScoreWidget on the right edge now serves
          double-duty as the desktop drawer opener. */}
      <DesktopDrawer open={drawerOpen} onClose={closeDrawer}>
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b border-ink-200">
            <StackHeader
              stackName={stackName}
              setStackName={setStackName}
              userGoals={userGoals}
              itemCount={stack.length}
            />
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
              aria-label="Close stack drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <DrawerBody
              stack={stack}
              stackName={stackName}
              safetyAnalysis={safetyAnalysis}
              stackScore={stackScore}
              user={user}
              onRemove={removeSupplement}
              onDosageChange={updateDosage}
              onClear={handleClear}
              onSave={() => setShowSaveDialog(true)}
              showSaveDialog={showSaveDialog}
              setShowSaveDialog={setShowSaveDialog}
              onClose={closeDrawer}
            />
          </div>
        </div>
      </DesktopDrawer>
      <SaveStackDialog open={showSaveDialog} onOpenChange={setShowSaveDialog} />
    </>
  );
}
