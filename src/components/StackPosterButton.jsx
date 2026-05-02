import React, { useState, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Image, Download, Clipboard, Check } from 'lucide-react';
import { supplements } from '../data/supplements.js';
import { getEvidenceTier } from '../lib/evidenceTier.js';
import {
  renderStackPoster, downloadPoster, copyPosterToClipboard,
} from '../lib/stackPoster.js';
import { track } from '../lib/analytics.js';

const MONTHLY_COSTS = {
  'coq10': 22, 'ashwagandha': 18, 'l-theanine': 12, 'caffeine': 6,
  'lions-mane': 28, 'lion-mane': 28, 'lions-mane-mushroom': 28,
  'bacopa': 18, 'alpha-gpc': 25, 'creatine': 14, 'magnesium': 16,
  'magnesium-glycinate': 16, 'vitamin-d': 8, 'vitamin-d3': 8, 'omega3': 22,
  'fish-oil': 20, 'rhodiola': 20, 'citicoline': 24, 'phosphatidylserine': 28,
  'noopept': 18, 'piracetam': 20, 'phenylpiracetam': 28, 'huperzine-a': 16,
  'modafinil': 80, 'armodafinil': 90, 'b-complex': 10, 'tyrosine': 14,
  'l-tyrosine': 14, 'taurine': 10, 'cordyceps': 24, 'reishi': 20,
  'curcumin': 18, 'zinc': 8, 'melatonin': 8, 'glycine': 12,
};

function buildPosterPayload(stack, stackScore, stackName) {
  const overall = stackScore?.headlineScores?.overall;
  // Headline scores are 0-9.5; rescale to 0-100 for the poster.
  const score100 = overall != null ? Math.round((overall / 9.5) * 100) : null;
  const scoreLabel = stackScore?.headlineScores?.dimensionQuals?.overall?.label || '';

  const items = stack.map((entry) => {
    const supplement = supplements.find((s) => s.id === entry.supplementId);
    if (!supplement) return null;
    const tier = getEvidenceTier(supplement.id).key;
    const dosage = `${entry.dosage} ${supplement.dosage.unit} · ${supplement.dosage.timing}`;
    return { name: supplement.name, dosage, tier };
  }).filter(Boolean);

  const monthlyCost = stack.reduce(
    (sum, item) => sum + (MONTHLY_COSTS[item.supplementId] || 20),
    0
  );

  return {
    title: (stackName && stackName.trim()) || 'My Nootropic Stack',
    score: score100,
    scoreLabel,
    items,
    monthlyCost,
    shareUrl: 'nootropicstacker.com',
  };
}

export function StackPosterButton({ stack, stackScore, stackName }) {
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    setBusy(true);
    setCopied(false);
    track('stack_poster_open');
    try {
      const payload = buildPosterPayload(stack, stackScore, stackName);
      const { blob: b, dataUrl: u } = await renderStackPoster(payload);
      setDataUrl(u);
      setBlob(b);
    } catch (err) {
      console.error('Poster render failed', err);
    }
    setBusy(false);
  }, [stack, stackScore, stackName]);

  const handleDownload = () => {
    if (!blob) return;
    track('stack_poster_download');
    downloadPoster(blob, 'my-stack.png');
  };

  const handleCopy = async () => {
    if (!blob) return;
    try {
      track('stack_poster_copy');
      await copyPosterToClipboard(blob);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={handleOpen}
        disabled={!stack || stack.length === 0}
        className="text-xs"
      >
        <Image className="w-3.5 h-3.5 mr-1" />
        Poster
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image className="w-5 h-5 text-primary-800" />
              Your Stack Card
            </DialogTitle>
            <DialogDescription className="text-sm text-ink-700">
              Share your stack on Reddit, X, or Discord. PNG, 1200×630.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border border-ink-200 bg-surface-sunk aspect-[1200/630] flex items-center justify-center">
              {busy && <div className="text-ink-500 text-sm">Rendering…</div>}
              {!busy && dataUrl && (
                <img
                  src={dataUrl}
                  alt="Stack poster preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleDownload} disabled={!blob} className="flex-1">
                <Download className="w-4 h-4 mr-1" />
                Download PNG
              </Button>
              <Button onClick={handleCopy} disabled={!blob} variant="outline" className="flex-1">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-accent-700" />
                    Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="w-4 h-4 mr-1" />
                    Copy to clipboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
