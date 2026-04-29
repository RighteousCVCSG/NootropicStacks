#!/usr/bin/env node
/**
 * Regenerate self-hosted brand fonts (NOO-46).
 *
 * Pulls the latest variable WOFF2 files for Fraunces, Inter, and JetBrains
 * Mono from the Google Fonts CSS2 endpoint, writes them to public/fonts/,
 * and rewrites src/brand-kit/fonts.css to point at /fonts/* so all font
 * traffic flows through our own origin (no third-party CDN at runtime —
 * CEO decision on NOO-41).
 *
 * Run when:
 *   - bumping a Google Fonts version,
 *   - adding a new weight/style,
 *   - fonts.css has drifted from public/fonts/.
 *
 * Usage: node scripts/build-self-hosted-fonts.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC_FONTS = resolve(ROOT, "public/fonts");
const OUT_CSS = resolve(ROOT, "src/brand-kit/fonts.css");

const FAMILIES = [
  "Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900",
  "Inter:wght@300..700",
  "JetBrains+Mono:wght@400..700",
];
const CSS_URL = `https://fonts.googleapis.com/css2?family=${FAMILIES.join("&family=")}&display=swap`;
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

mkdirSync(PUBLIC_FONTS, { recursive: true });

console.log(`Fetching ${CSS_URL}`);
const cssRes = await fetch(CSS_URL, { headers: { "User-Agent": UA } });
if (!cssRes.ok) throw new Error(`Google Fonts CSS fetch failed: ${cssRes.status}`);
const css = await cssRes.text();

const blocks = [];
const re = /\/\*\s*([^*]+?)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g;
let m;
while ((m = re.exec(css))) {
  const subset = m[1].trim();
  const body = m[2];
  const family = body.match(/font-family:\s*['"]([^'"]+)['"]/)[1];
  const style = body.match(/font-style:\s*([^;]+);/)[1].trim();
  const weight = body.match(/font-weight:\s*([^;]+);/)[1].trim();
  const url = body.match(/url\(([^)]+)\)/)[1];
  const unicodeRange = body.match(/unicode-range:\s*([^;]+);/)[1].trim();
  blocks.push({ subset, family, style, weight, url, unicodeRange });
}
console.log(`Parsed ${blocks.length} @font-face blocks`);

const downloaded = [];
for (const b of blocks) {
  const slug = `${b.family.toLowerCase().replace(/\s+/g, "-")}-${b.style}-${b.subset.replace(/[^a-z0-9]/gi, "")}.woff2`;
  const localPath = `${PUBLIC_FONTS}/${slug}`;
  if (!existsSync(localPath)) {
    const res = await fetch(b.url);
    if (!res.ok) throw new Error(`Failed: ${b.url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(localPath, buf);
    console.log(`  ↳ ${slug} (${(buf.length / 1024).toFixed(1)} KB)`);
  }
  downloaded.push({ ...b, localUrl: `/fonts/${slug}` });
}

const header = `/* =============================================================
 * NootropicStacker self-hosted webfonts (NOO-46)
 *
 * Source: Google Fonts CSS2 endpoint (Fraunces / Inter / JetBrains Mono).
 * Files: public/fonts/*.woff2 (committed to repo, served from our origin
 *        by the Express static middleware — no third-party CDN at runtime).
 * Update: regenerate with scripts/build-self-hosted-fonts.mjs.
 *
 * font-display: swap (CEO decision on NOO-41) — the layered system
 * fallbacks (Georgia / system-ui / SF Mono / Menlo) ship via tokens.css
 * --font-display / --font-body / --font-mono.
 * ============================================================= */

`;
const blocksOut = downloaded
  .map(
    (b) => `/* ${b.subset} */
@font-face {
  font-family: '${b.family}';
  font-style: ${b.style};
  font-weight: ${b.weight};
  font-display: swap;
  src: url(${b.localUrl}) format('woff2');
  unicode-range: ${b.unicodeRange};
}
`,
  )
  .join("\n");

writeFileSync(OUT_CSS, header + blocksOut);
console.log(`\nWrote ${OUT_CSS}`);
console.log(`Wrote ${downloaded.length} fonts to ${PUBLIC_FONTS}/`);
