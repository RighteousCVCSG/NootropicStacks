import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ShoppingCart, ExternalLink, AlertCircle, Truck } from 'lucide-react';
import { supplements } from '../data/supplements.js';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { withAffiliateUtms } from '@/lib/affiliate.js';
import { AffiliateDisclosureInline } from './AffiliateDisclosure.jsx';
import { track } from '../lib/analytics.js';
import { getCheapestVendor, hasTrackedPrices } from '../data/priceTable.js';

// Per-vendor display order (matches existing buy-button preference).
const VENDOR_ORDER = ['nootropicsdepot', 'amazon', 'iherb', 'nordicnaturals', 'buymodafinilonline'];
const VENDOR_LABEL = {
  nootropicsdepot: 'Nootropics Depot',
  amazon: 'Amazon',
  iherb: 'iHerb',
  nordicnaturals: 'Nordic Naturals',
  buymodafinilonline: 'Modafinil Online',
};

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

function pickPreferredVendor(supplementId, links) {
  // If we have tracked prices, prefer the cheapest vendor that ALSO has an
  // affiliate link wired up. This is the multi-vendor moat in action.
  if (hasTrackedPrices(supplementId)) {
    const cheapest = getCheapestVendor(supplementId);
    if (cheapest && links?.[cheapest.vendor]) return cheapest.vendor;
  }
  if (!links) return null;
  for (const v of VENDOR_ORDER) {
    if (links[v]) return v;
  }
  return Object.keys(links).find((k) => k !== 'commission' && typeof links[k] === 'string') || null;
}

function vendorUrl(supplementId, vendor, links) {
  const url = links?.[vendor];
  if (!url) return null;
  if (vendor === 'amazon') return withAffiliateUtms(url, { campaign: `ship-${supplementId}` });
  return url;
}

function ShipRow({ item, supplement, vendor, links, onVendorChange }) {
  const monthly = MONTHLY_COSTS[item.supplementId] || 20;
  const availableVendors = links
    ? Object.keys(links).filter((k) => k !== 'commission' && typeof links[k] === 'string')
    : [];

  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-surface-sunk border border-ink-200">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-ink-900 truncate">{supplement.name}</div>
        <div className="text-xs text-ink-500 mt-0.5">
          {item.dosage} {supplement.dosage.unit} · ~${monthly}/mo
        </div>
      </div>

      {availableVendors.length > 0 ? (
        <div className="shrink-0 flex items-center gap-2">
          {availableVendors.length > 1 ? (
            <select
              value={vendor || ''}
              onChange={(e) => onVendorChange(item.supplementId, e.target.value)}
              className="text-xs bg-surface-card border border-ink-200 rounded px-2 py-1 text-ink-900"
              aria-label={`Vendor for ${supplement.name}`}
            >
              {availableVendors.map((v) => (
                <option key={v} value={v}>
                  {VENDOR_LABEL[v] || v}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-ink-500">{VENDOR_LABEL[availableVendors[0]] || availableVendors[0]}</span>
          )}
        </div>
      ) : (
        <span className="text-xs text-ink-500 inline-flex items-center gap-1 shrink-0">
          <AlertCircle className="w-3 h-3" /> No link
        </span>
      )}
    </div>
  );
}

export function ShipBuildSheet({ open, onOpenChange, stack }) {
  // Track per-supplement vendor override; defaults to the preferred vendor.
  const [overrides, setOverrides] = useState({});

  const rows = useMemo(() => {
    return stack.map((item) => {
      const supplement = supplements.find((s) => s.id === item.supplementId);
      const links = AFFILIATE_LINKS[item.supplementId];
      const defaultVendor = pickPreferredVendor(item.supplementId, links);
      const vendor = overrides[item.supplementId] || defaultVendor;
      return { item, supplement, links, vendor };
    }).filter((r) => r.supplement);
  }, [stack, overrides]);

  const totalMonthly = rows.reduce(
    (sum, r) => sum + (MONTHLY_COSTS[r.item.supplementId] || 20),
    0
  );

  const shippableRows = rows.filter((r) => r.vendor && r.links);
  const noLinkCount = rows.length - shippableRows.length;

  const handleVendorChange = (id, vendor) => {
    setOverrides((prev) => ({ ...prev, [id]: vendor }));
  };

  const handleOpenAll = () => {
    track('ship_build_open_all', {
      stack_size: stack.length,
      shippable: shippableRows.length,
    });
    // Open in user gesture; spread tabs out very slightly so popup blockers
    // are less likely to choke. Browsers tolerate ~2-3 window.opens per click.
    shippableRows.forEach(({ item, vendor, links }, idx) => {
      const url = vendorUrl(item.supplementId, vendor, links);
      if (!url) return;
      // Stagger by zero — synchronous in a click handler is the only reliable
      // way to open multiple tabs. Per-tab tracking is fire-and-forget.
      track('ship_build_open_tab', { supplement_id: item.supplementId, vendor, position: idx });
      try {
        window.open(url, `_ship_${item.supplementId}`);
      } catch {
        /* popup blocker — surface a hint? */
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary-800" />
            Ship This Build
          </DialogTitle>
          <DialogDescription className="text-sm text-ink-700">
            Pick a vendor per supplement. We'll open a tab for each so you can complete the
            checkouts in one go.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {rows.length === 0 ? (
            <p className="text-sm text-ink-500 italic">Your stack is empty.</p>
          ) : (
            rows.map((row) => (
              <ShipRow
                key={row.item.supplementId}
                item={row.item}
                supplement={row.supplement}
                vendor={row.vendor}
                links={row.links}
                onVendorChange={handleVendorChange}
              />
            ))
          )}
        </div>

        <div className="border-t border-ink-200 pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-ink-500">Estimated monthly cost</div>
              <div className="text-lg font-bold text-ink-900">${totalMonthly}/mo</div>
            </div>
            <div className="text-right text-xs text-ink-500">
              {shippableRows.length} ready ·{' '}
              {noLinkCount > 0 ? (
                <span className="text-warn-700">{noLinkCount} no link</span>
              ) : (
                <span>0 missing</span>
              )}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleOpenAll}
            disabled={shippableRows.length === 0}
            className="w-full bg-primary-800 hover:bg-primary-700 text-ink-on-dark"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Open all carts ({shippableRows.length}{' '}
            {shippableRows.length === 1 ? 'tab' : 'tabs'})
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>

          <div className="text-center">
            <AffiliateDisclosureInline />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
