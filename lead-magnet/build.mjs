#!/usr/bin/env node
// lead-magnet/build.mjs
//
// Render `lead-magnet/source.md` → `lead-magnet/dist/10-stacks-v1.pdf`
// and copy to `public/downloads/10-stacks-v1.pdf` so the site serves it
// at https://nootropicstacker.com/downloads/10-stacks-v1.pdf.
//
// Run:  node lead-magnet/build.mjs
// or:   pnpm run pdf
//
// Toolchain: marked (MD→HTML) + puppeteer-core (HTML→PDF, drives the
// system Chrome at /opt/google/chrome/chrome — no Chromium download).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot  = path.resolve(__dirname, '..');

const SOURCE_MD   = path.join(__dirname, 'source.md');
const STYLES_CSS  = path.join(__dirname, 'template', 'styles.css');
const OUT_DIR     = path.join(__dirname, 'dist');
const OUT_PDF     = path.join(OUT_DIR, '10-stacks-v1.pdf');
const PUBLIC_PDF  = path.join(repoRoot, 'public', 'downloads', '10-stacks-v1.pdf');
const DEBUG_HTML  = path.join(OUT_DIR, '10-stacks-v1.debug.html');

const CHROME_BIN =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  '/opt/google/chrome/chrome';

const REVISION_DATE = '2026-04-29';

// ---------- Markdown → semantic HTML ----------

const md = await fs.readFile(SOURCE_MD, 'utf8');
const css = await fs.readFile(STYLES_CSS, 'utf8');

// Strip the H1 and the leading source-info paragraph before rendering body
// — those become the cover instead. The preamble is two lines:
//   **Source markdown for the Nootropicstacker lead-magnet PDF.**
//   Revision date: 2026-04-29 · Author: Vera Huang, CMO · Issue: NOO-30
const stripped = md
  .replace(/^# .*\n/, '')
  .replace(/^\*\*Source markdown[^\n]*\*\*\s*\n[^\n]*Issue:\s*NOO-30\s*\n/m, '')
  .trim();

// Split on `---` to get sections.
const sections = stripped
  .split(/\n---\n/)
  .map(s => s.trim())
  .filter(Boolean);

// Section classifier
function classify(section) {
  if (/^## How we chose these stacks/m.test(section)) return 'intro';
  if (/^## Stack \d+ —/m.test(section))               return 'stack';
  if (/^## How to actually use this PDF/m.test(section)) return 'outro-howto';
  if (/^## What we deliberately left off/m.test(section)) return 'outro-leftoff';
  if (/^## Sources & disclosure/m.test(section))      return 'outro-sources';
  return 'unknown';
}

function stackHTML(rawMd) {
  // Pull stack number + name from "## Stack N — Title (Subtitle)"
  const headMatch = rawMd.match(/^## Stack (\d+) — (.+)$/m);
  const stackNum  = headMatch ? headMatch[1] : '';
  const stackName = headMatch ? headMatch[2] : '';
  const body = rawMd.replace(/^## Stack \d+ — .+$/m, '').trim();

  // Pull "Target outcome" line
  const targetMatch = body.match(/^\*\*Target outcome:\*\*\s*(.+)$/m);
  const target = targetMatch ? targetMatch[1] : '';
  const restMd = body.replace(/^\*\*Target outcome:\*\*\s*.+$/m, '').trim();

  // Render the rest with marked, then post-process the
  // "Who this is for / NOT for" pair into a 2-col grid, and
  // the **Buy:** line into a styled callout.
  let restHtml = marked.parse(restMd);

  // Buy callout: a paragraph that begins with "Buy:" → wrap in stack-buy
  restHtml = restHtml.replace(
    /<p><strong>Buy:<\/strong>\s*([\s\S]+?)<\/p>/,
    (_m, inner) => `<div class="stack-buy">${inner}</div>`
  );

  // Audience grid: pull the consecutive "Who this is for" / NOT for paragraphs
  restHtml = restHtml.replace(
    /<p><strong>Who this is for:<\/strong>\s*([\s\S]+?)<\/p>\s*<p><strong>Who this is NOT for:<\/strong>\s*([\s\S]+?)<\/p>/,
    (_m, pos, neg) =>
      `<div class="audience-grid">
         <div class="pos"><h4>Who this is for</h4>${pos}</div>
         <div class="neg"><h4>Who this is <strong>not</strong> for</h4>${neg}</div>
       </div>`
  );

  // Section labels — wrap the canonical bold headings as <h3>
  const labels = [
    'Ingredients & doses (per serving):',
    'Ingredients & doses (per day):',
    'Ingredients & doses (per dose):',
    'Evidence summary:',
    'Honest framing:',
    'Hedge:',
  ];
  for (const l of labels) {
    const safe = l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    restHtml = restHtml.replace(
      new RegExp(`<p><strong>${safe}<\\/strong>([\\s\\S]*?)<\\/p>`, 'g'),
      (_m, after) => `<h3>${l.replace(/:$/, '')}</h3><p>${after.trim()}</p>`
    );
    // For "Honest framing — Tier 2..." variants
    restHtml = restHtml.replace(
      new RegExp(`<p><strong>Honest framing — ([^<]+)<\\/strong>([\\s\\S]*?)<\\/p>`, 'g'),
      (_m, suffix, after) => `<h3>Honest framing — ${suffix}</h3><p>${after.trim()}</p>`
    );
  }

  return `
    <section class="stack-page">
      <div class="stack-num">Stack ${stackNum}</div>
      <h2 class="stack-title">${stackName}</h2>
      <div class="stack-target">${target}</div>
      <div class="stack-rule"></div>
      <div class="stack-section">${restHtml}</div>
    </section>
  `;
}

function introHTML(rawMd) {
  const html = marked.parse(rawMd.replace(/^## How we chose these stacks\s*/m, '').trim());
  return `<section class="intro">
    <h2>How we chose these stacks</h2>
    ${html}
  </section>`;
}

function outroHTML(rawMd, kind) {
  const html = marked.parse(rawMd.replace(/^##\s.+\n/, '').trim());
  const title = rawMd.match(/^##\s(.+)$/m)?.[1] ?? '';
  return `<section class="outro outro-${kind}">
    <h2>${title}</h2>
    ${html}
  </section>`;
}

const cover = `
  <section class="cover">
    <header>
      <div class="cover-rule"></div>
      <div class="cover-badge">Nootropicstacker · Lead Magnet · v1</div>
      <h1 class="cover-title">10 Evidence-Backed Nootropic Stacks</h1>
      <p class="cover-subtitle">A short, citation-first guide to ten stacks with the strongest human evidence — what works, what is hyped, and what to skip.</p>
    </header>

    <div>
      <dl class="cover-meta">
        <div>
          <dt>Author</dt>
          <dd>Vera Huang, CMO · Nootropicstacker</dd>
        </div>
        <div>
          <dt>Revision</dt>
          <dd>${REVISION_DATE} · v1</dd>
        </div>
        <div>
          <dt>Read time</dt>
          <dd>~12 minutes · 12 pages</dd>
        </div>
        <div>
          <dt>Next review</dt>
          <dd>2026-07-29 (quarterly)</dd>
        </div>
      </dl>

      <div class="cover-disclosure">
        <strong>Affiliate disclosure</strong>
        Some links in this PDF are Amazon affiliate links (tag <code>nootropicstk-20</code>). If you buy through them we earn a small commission at no extra cost to you. We do not accept payment from any supplement brand. Recommendations are based on the published evidence, not the affiliate payout. Nothing in this PDF is medical advice.
      </div>
    </div>
  </section>
`;

const body = sections.map(s => {
  const kind = classify(s);
  if (kind === 'intro') return introHTML(s);
  if (kind === 'stack') return stackHTML(s);
  if (kind === 'outro-howto')   return outroHTML(s, 'howto');
  if (kind === 'outro-leftoff') return outroHTML(s, 'leftoff');
  if (kind === 'outro-sources') return outroHTML(s, 'sources');
  return `<section class="outro">${marked.parse(s)}</section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>10 Evidence-Backed Nootropic Stacks · Nootropicstacker</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
${cover}
${body}
</body>
</html>
`;

// ---------- Render with puppeteer-core ----------

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.writeFile(DEBUG_HTML, html, 'utf8');
await fs.mkdir(path.dirname(PUBLIC_PDF), { recursive: true });

console.log(`[pdf] launching chrome at ${CHROME_BIN}`);
const browser = await puppeteer.launch({
  executablePath: CHROME_BIN,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
});
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.pdf({
    path: OUT_PDF,
    format: 'letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    displayHeaderFooter: false,
  });
  console.log(`[pdf] wrote ${OUT_PDF}`);

  await fs.copyFile(OUT_PDF, PUBLIC_PDF);
  console.log(`[pdf] copied to ${PUBLIC_PDF}`);
} finally {
  await browser.close();
}

const stat = await fs.stat(OUT_PDF);
console.log(`[pdf] size: ${(stat.size / 1024).toFixed(1)} KB`);
