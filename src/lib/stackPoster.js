// Stack Card poster generator — paints a 1200x630 OG-style image of the
// current stack onto a canvas using the Cognitive Lab palette. Returns
// a Blob suitable for download / share / copy-to-clipboard.
//
// We use plain canvas (no html2canvas) so this stays small and fast.
// Brand-token colors are hard-coded to the Cognitive Lab dark palette
// (matching tokens.css) since posters render in their own context, not
// inside the app DOM.

const PALETTE = {
  bgFrom:    '#0B0F1A',
  bgTo:      '#1B2030',
  card:      '#141926',
  border:    '#2A3046',
  ink900:    '#FFFFFF',
  ink700:    '#C8CDD9',
  ink500:    '#8990A3',
  primary:   '#5B8BFF',
  secondary: '#22D3EE',
  warn:      '#FFC53D',
  danger:    '#FF5A8C',
};

const TIER_COLOR = {
  1: PALETTE.primary,
  2: PALETTE.secondary,
  3: PALETTE.warn,
  rx: PALETTE.danger,
};

const W = 1200;
const H = 630;

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

function drawScoreRing(ctx, cx, cy, radius, score, ringColor) {
  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.lineWidth = 16;
  ctx.strokeStyle = PALETTE.border;
  ctx.stroke();

  // Score arc — 12-o'clock start, clockwise.
  const fraction = Math.max(0, Math.min(1, score / 100));
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * fraction);
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.strokeStyle = ringColor;
  ctx.stroke();

  // Number in center
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = 'bold 96px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(Math.round(score)), cx, cy - 6);

  // Caption
  ctx.fillStyle = PALETTE.ink500;
  ctx.font = '600 18px sans-serif';
  ctx.fillText('STACK SCORE', cx, cy + 60);
}

/**
 * Renders the stack poster onto an offscreen canvas.
 * @param {object} payload
 * @param {string} payload.title
 * @param {number|null} payload.score 0-100 overall headline score
 * @param {string} payload.scoreLabel (e.g. "Strong")
 * @param {Array<{name: string, dosage: string, tier: 1|2|3|'rx'}>} payload.items top items
 * @param {number} payload.monthlyCost
 * @param {string} payload.shareUrl
 * @returns {Promise<{ blob: Blob, dataUrl: string }>}
 */
export async function renderStackPoster({
  title = 'My Nootropic Stack',
  score = null,
  scoreLabel = '',
  items = [],
  monthlyCost = null,
  shareUrl = 'nootropicstacker.com',
}) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, PALETTE.bgFrom);
  bg.addColorStop(1, PALETTE.bgTo);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle accent rule along the top
  ctx.fillStyle = PALETTE.primary;
  ctx.fillRect(0, 0, W, 4);

  // Brand wordmark (top-left)
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = 'bold 32px serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('NootropicStacker', 60, 50);

  ctx.fillStyle = PALETTE.ink500;
  ctx.font = '500 18px sans-serif';
  ctx.fillText('The PCPartPicker for nootropics', 60, 92);

  // Title
  ctx.fillStyle = PALETTE.ink900;
  ctx.font = 'bold 56px serif';
  ctx.textAlign = 'left';
  // Truncate title to ~22 chars to fit beside ring
  const safeTitle = title.length > 26 ? title.slice(0, 25) + '…' : title;
  ctx.fillText(safeTitle, 60, 170);

  // Score label
  if (scoreLabel) {
    ctx.fillStyle = PALETTE.secondary;
    ctx.font = '600 22px sans-serif';
    ctx.fillText(scoreLabel.toUpperCase(), 60, 240);
  }

  // Score ring (right side)
  if (score != null) {
    const ringColor =
      score >= 80 ? PALETTE.secondary : score >= 60 ? PALETTE.primary : PALETTE.ink500;
    drawScoreRing(ctx, W - 220, 240, 110, score, ringColor);
  }

  // Items list
  const startY = 320;
  const rowH = 44;
  const maxItems = 5;
  const shown = items.slice(0, maxItems);
  shown.forEach((it, i) => {
    const y = startY + i * rowH;

    // Tier dot
    ctx.beginPath();
    ctx.fillStyle = TIER_COLOR[it.tier] || PALETTE.ink500;
    ctx.arc(75, y + 14, 6, 0, Math.PI * 2);
    ctx.fill();

    // Name + dose
    ctx.fillStyle = PALETTE.ink900;
    ctx.font = '600 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(it.name, 100, y);

    if (it.dosage) {
      ctx.fillStyle = PALETTE.ink500;
      ctx.font = '500 18px sans-serif';
      ctx.fillText(it.dosage, 100, y + 24);
    }
  });

  if (items.length > maxItems) {
    ctx.fillStyle = PALETTE.ink500;
    ctx.font = 'italic 18px sans-serif';
    ctx.fillText(`+${items.length - maxItems} more`, 100, startY + maxItems * rowH + 4);
  }

  // Footer rule
  ctx.fillStyle = PALETTE.border;
  ctx.fillRect(60, H - 80, W - 120, 1);

  // Footer left: monthly cost
  if (monthlyCost != null) {
    ctx.fillStyle = PALETTE.ink700;
    ctx.font = '500 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`~$${monthlyCost}/mo`, 60, H - 50);
  }

  // Footer right: URL
  ctx.fillStyle = PALETTE.ink700;
  ctx.font = '500 18px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(shareUrl, W - 60, H - 50);

  // Top-right tier legend (small)
  ctx.textAlign = 'left';
  ctx.font = '500 12px sans-serif';
  const legendX = W - 280;
  const legendY = 65;
  ctx.fillStyle = PALETTE.ink500;
  ctx.fillText('EVIDENCE', legendX, legendY);
  [
    { c: PALETTE.primary,   l: 'Tier 1 — Strong' },
    { c: PALETTE.secondary, l: 'Tier 2 — Moderate' },
    { c: PALETTE.warn,      l: 'Tier 3 — Preliminary' },
  ].forEach((row, i) => {
    const yy = legendY + 18 + i * 18;
    ctx.beginPath();
    ctx.fillStyle = row.c;
    ctx.arc(legendX + 6, yy + 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PALETTE.ink700;
    ctx.fillText(row.l, legendX + 18, yy - 4);
  });

  const blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png', 0.92)
  );
  const dataUrl = canvas.toDataURL('image/png', 0.92);
  return { blob, dataUrl };
}

/** Triggers a browser download of the rendered poster. */
export function downloadPoster(blob, filename = 'my-stack.png') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Copies the rendered poster to the clipboard as image/png. */
export async function copyPosterToClipboard(blob) {
  if (!navigator.clipboard?.write) throw new Error('Clipboard API not available');
  const item = new ClipboardItem({ 'image/png': blob });
  await navigator.clipboard.write([item]);
}
