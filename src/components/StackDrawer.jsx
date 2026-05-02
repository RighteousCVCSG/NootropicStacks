import React, { useState, useEffect } from 'react';
import { useStack } from '../contexts/StackContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { supplements } from '../data/supplements.js';
import { SaveStackDialog } from './SaveStackDialog.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateUtms } from '@/lib/affiliate.js';
import { AffiliateDisclosureInline } from './AffiliateDisclosure.jsx';
import { track } from '../lib/analytics.js';
import { Button } from '@/components/ui/button.jsx';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from '@/components/ui/drawer.jsx';
import { ShipBuildSheet } from './ShipBuildSheet.jsx';
import { TIMING_CONFIG, getSupplementTiming } from './StackProtocolBuilder.jsx';
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
          <div key={d.key} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-sunk">
            <d.icon className={`w-3.5 h-3.5 ${colors.text}`} />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{d.label}</span>
            <span className={`text-sm font-bold ${colors.text}`}>{d.score.toFixed(1)}</span>
            <MiniScoreBar score={d.score} qual={d.qual} />
          </div>
        );
      })}
    </div>
  );
}

function StackItemRow({ item, onRemove, onDosageChange }) {
  const supplement = supplements.find(s => s.id === item.supplementId);
  if (!supplement) return null;
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-sunk">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-ink-900 truncate">{supplement.name}</div>
        <div className="text-xs text-ink-500">
          {item.dosage} {supplement.dosage.unit} &bull; {item.timing}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <input
          type="number"
          value={item.dosage}
          onChange={(e) => onDosageChange(item.supplementId, parseFloat(e.target.value))}
          min={supplement.dosage.min}
          max={supplement.dosage.max}
          step={supplement.dosage.unit === 'mcg' ? 10 : supplement.dosage.unit === 'mg' ? 50 : 1}
          className="w-16 px-2 py-1 text-xs border border-ink-200 rounded bg-surface-card text-ink-900"
        />
        <button
          onClick={() => onRemove(item.supplementId)}
          className="p-1.5 rounded-md text-ink-400 hover:text-danger-500 hover:bg-danger-100 transition-colors"
          aria-label={`Remove ${supplement.name}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
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
  const stackWithLinks = stack.filter(item => AFFILIATE_LINKS[item.supplementId]);
  if (stackWithLinks.length === 0) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2 flex items-center gap-2">
        <ShoppingCart className="w-3 h-3" />
        Shop Your Stack
        <AffiliateDisclosureInline />
      </h4>
      <div className="space-y-1">
        {stackWithLinks.slice(0, 5).map(item => {
          const links = AFFILIATE_LINKS[item.supplementId];
          const supplement = supplements.find(s => s.id === item.supplementId);
          const buyUrl = links.nootropicsdepot || (
            links.amazon ? withAffiliateUtms(links.amazon, { campaign: `stack-${item.supplementId}` }) : (
              links.iherb || Object.values(links).find(v => typeof v === 'string')
            )
          );
          if (!supplement || !buyUrl) return null;
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
      {stackWithLinks.length > 5 && (
        <p className="text-xs text-ink-400 mt-1">+{stackWithLinks.length - 5} more in your stack</p>
      )}
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
        <p className="text-xl font-bold text-ink-900">${monthly}/mo</p>
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
          <div key={timing} className={`p-2.5 rounded-lg border ${config.bg} ${config.border}`}>
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

function DrawerBody({ stack, safetyAnalysis, stackScore, user, onRemove, onDosageChange, onClear, onSave, showSaveDialog, setShowSaveDialog }) {
  const [shareCopied, setShareCopied] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'schedule'

  const handleShare = () => {
    const ids = stack.map(s => s.supplementId).join(',');
    const url = `${window.location.origin}/?stack=${encodeURIComponent(ids)}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
    track('stack_share', { stack_size: stack.length, supplement_ids: ids });
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
      <Button
        size="sm"
        onClick={() => setShipOpen(true)}
        className="w-full bg-primary-800 hover:bg-primary-700 text-ink-on-dark"
      >
        <Truck className="w-4 h-4 mr-1.5" />
        Ship This Build
      </Button>
      <ShipBuildSheet open={shipOpen} onOpenChange={setShipOpen} stack={stack} />

      <StackScoreMini stackScore={stackScore} />
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
            />
          ))}
        </div>
      ) : (
        <ScheduleView stack={stack} />
      )}
      <StackShopLinks stack={stack} />
      <div className="border-t border-ink-200" />
      <StackCost stack={stack} />
      <div className="flex items-center gap-2 pt-2">
        {user && (
          <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)} className="flex-1 text-xs">
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Stack
          </Button>
        )}
        <Button
          variant="tertiary"
          size="sm"
          onClick={onClear}
          className="flex-1 text-danger-500 hover:text-danger-700 text-xs"
        >
          Clear Stack
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
          fixed top-16 right-0 bottom-0 z-[1000] w-80
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

/* =========== Desktop tab handle =========== */
function TabHandle({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[900] w-10 h-10 flex items-center justify-center rounded-l-lg bg-primary-800 text-ink-on-dark shadow-2 hover:bg-primary-700 transition-colors"
      aria-label="Toggle stack drawer"
      aria-expanded={false}
    >
      <Layers className="w-4 h-4" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-accent-500 text-ink-on-dark text-[9px] font-bold" aria-live="polite">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

/* =========== StackDrawer (main) =========== */
export function StackDrawer() {
  const {
    stack, safetyAnalysis, stackScore,
    removeSupplement, updateDosage, clearStack,
    drawerOpen, openDrawer, closeDrawer, toggleDrawer,
    hasSupplement, itemCount
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
              <button
                className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary-800 text-ink-on-dark shadow-2 text-xs font-medium hover:bg-primary-700 transition-colors"
                aria-label="Toggle stack drawer"
              >
                <Layers className="w-4 h-4" />
                Stack
                <span className="ml-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-accent-500 text-ink-on-dark text-[10px] font-bold">
                  {itemCount}
                </span>
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] pb-6">
              <div className="px-4 py-4 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-ink-900" style={{ fontFamily: 'var(--font-display)' }}>
                      My Stack
                    </h2>
                    {stack.length > 0 && (
                      <p className="text-xs text-ink-500">{stack.length} supplement{stack.length !== 1 ? 's' : ''}</p>
                    )}
                  </div>
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
                  safetyAnalysis={safetyAnalysis}
                  stackScore={stackScore}
                  user={user}
                  onRemove={removeSupplement}
                  onDosageChange={updateDosage}
                  onClear={handleClear}
                  onSave={() => setShowSaveDialog(true)}
                  showSaveDialog={showSaveDialog}
                  setShowSaveDialog={setShowSaveDialog}
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
      <TabHandle count={itemCount} onClick={toggleDrawer} />
      <DesktopDrawer open={drawerOpen} onClose={closeDrawer}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-ink-200">
            <div>
              <h2 className="text-lg font-semibold text-ink-900" style={{ fontFamily: 'var(--font-display)' }}>
                My Stack
              </h2>
              {stack.length > 0 && (
                <p className="text-xs text-ink-500">{stack.length} supplement{stack.length !== 1 ? 's' : ''}</p>
              )}
            </div>
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
              safetyAnalysis={safetyAnalysis}
              stackScore={stackScore}
              user={user}
              onRemove={removeSupplement}
              onDosageChange={updateDosage}
              onClear={handleClear}
              onSave={() => setShowSaveDialog(true)}
              showSaveDialog={showSaveDialog}
              setShowSaveDialog={setShowSaveDialog}
            />
          </div>
        </div>
      </DesktopDrawer>
      <SaveStackDialog open={showSaveDialog} onOpenChange={setShowSaveDialog} />
    </>
  );
}
