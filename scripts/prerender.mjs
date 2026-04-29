#!/usr/bin/env node
// Build-time SEO prerender for nootropicstacker.com (NOO-24).
//
// Reads dist/index.html (post-vite-build shell with the hashed bundle path)
// plus the static data files in src/data, then writes one
// dist/<route>/index.html per sitemap entry with route-specific title, meta,
// OG/Twitter card, schema.org JSON-LD, H1, and body copy embedded directly in
// the initial HTML response.
//
// The Vite-built JS bundle still loads on top and renders the interactive
// React app (createRoot will replace the prerendered content inside #root on
// hydration), but crawlers and JS-disabled clients see a fully populated page
// with real <a href> internal links and substantive body copy.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');
const dataDir = path.join(repoRoot, 'src/data');
const publicDir = path.join(repoRoot, 'public');

const ORIGIN = 'https://nootropicstacker.com';

// ---------- Load data (plain ESM) ----------
const dataUrl = (file) => pathToFileURL(path.join(dataDir, file)).href;
const { supplements } = await import(dataUrl('supplements.js'));
const { blogArticles } = await import(dataUrl('blogArticles.js'));
const { supplementFamilies } = await import(dataUrl('supplementFamilies.js'));
const { faqData } = await import(dataUrl('faqData.js'));
const { glossaryTerms } = await import(dataUrl('glossaryTerms.js'));

// ---------- Helpers ----------
const HTML_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => HTML_ESC[c]);
const safeJson = (obj) => JSON.stringify(obj).replace(/<\/(script)/gi, '<\\/$1');
const titleCase = (s) =>
  String(s ?? '').replace(/(^|[\s-])\w/g, (m) => m.toUpperCase());

const supplementUrl = (id) => `/supplements/${id}`;
const blogUrl = (slug) => `/blog/${slug}`;

// ---------- Read shell ----------
// Use dist/index.html as the base template so the hashed asset paths injected
// by Vite are preserved. If dist/ has not been built yet, prefer public/.
let shellHtml;
try {
  shellHtml = await fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
} catch {
  console.warn('prerender: dist/index.html not found, falling back to public/index.html');
  shellHtml = await fs.readFile(path.join(repoRoot, 'index.html'), 'utf-8');
}

// ---------- Per-route shell renderer ----------
function renderShell({ url, title, description, jsonLd, bodyHtml }) {
  const canonical = `${ORIGIN}${url === '/' ? '/' : url}`;
  let html = shellHtml;

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(title)}</title>`
  );
  html = html.replace(
    /<meta name="description"[^>]*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<link rel="canonical"[^>]*\/?>/,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`
  );
  html = html.replace(
    /<meta property="og:title"[^>]*\/?>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta property="og:description"[^>]*\/?>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta property="og:url"[^>]*\/?>/,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`
  );
  html = html.replace(
    /<meta name="twitter:title"[^>]*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description"[^>]*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );

  if (jsonLd && jsonLd.length > 0) {
    const ldHtml = jsonLd
      .map((o) => `    <script type="application/ld+json">${safeJson(o)}</script>`)
      .join('\n');
    html = html.replace('</head>', `${ldHtml}\n  </head>`);
  }

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyHtml}</div>`
  );

  return html;
}

// ---------- Reusable HTML fragments ----------
const headerHtml = `
<header style="border-bottom:1px solid #e5e7eb;padding:12px 16px;background:#fff">
  <div style="max-width:1120px;margin:0 auto;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
    <a href="/" style="font-weight:700;color:#111;text-decoration:none">NootropicStacker</a>
    <nav style="display:flex;gap:12px;flex-wrap:wrap;font-size:14px">
      <a href="/" style="color:#374151;text-decoration:none">Stack Builder</a>
      <a href="/quiz" style="color:#374151;text-decoration:none">Quiz</a>
      <a href="/supplements" style="color:#374151;text-decoration:none">Supplement Library</a>
      <a href="/families" style="color:#374151;text-decoration:none">Families</a>
      <a href="/blog" style="color:#374151;text-decoration:none">Blog</a>
      <a href="/best-nootropics" style="color:#374151;text-decoration:none">Best Nootropics</a>
      <a href="/best-stacks" style="color:#374151;text-decoration:none">Best Stacks</a>
      <a href="/reviews" style="color:#374151;text-decoration:none">Reviews</a>
      <a href="/compare-supplements" style="color:#374151;text-decoration:none">Compare</a>
      <a href="/start-here" style="color:#374151;text-decoration:none">Start Here</a>
      <a href="/faq" style="color:#374151;text-decoration:none">FAQ</a>
      <a href="/glossary" style="color:#374151;text-decoration:none">Glossary</a>
    </nav>
  </div>
</header>`;

const footerHtml = `
<footer style="border-top:1px solid #e5e7eb;padding:24px 16px;margin-top:32px;background:#fff">
  <div style="max-width:1120px;margin:0 auto;font-size:13px;color:#6b7280;text-align:center">
    <p><strong>NootropicStacker</strong> — Build smart supplement stacks with the Stack Score system.</p>
    <p style="margin-top:8px">
      <a href="/supplements" style="color:#374151">195 Supplements</a> ·
      <a href="/blog" style="color:#374151">Blog</a> ·
      <a href="/families" style="color:#374151">Family Guides</a> ·
      <a href="/best-nootropics" style="color:#374151">Best Nootropics</a> ·
      <a href="/best-stacks" style="color:#374151">Best Stacks</a> ·
      <a href="/reviews" style="color:#374151">Reviews</a> ·
      <a href="/faq" style="color:#374151">FAQ</a> ·
      <a href="/glossary" style="color:#374151">Glossary</a> ·
      <a href="/contact" style="color:#374151">Contact</a>
    </p>
    <p style="margin-top:8px">Educational information only. Always consult a healthcare professional before starting supplements. Affiliate Disclosure: NootropicStacker participates in the Amazon Associates program and other affiliate programs and earns commissions from qualifying purchases at no extra cost to you.</p>
  </div>
</footer>`;

const wrap = (mainHtml) => `${headerHtml}
<main style="max-width:1120px;margin:0 auto;padding:24px 16px">
${mainHtml}
</main>
${footerHtml}`;

// ---------- Page generators ----------

function renderHome() {
  const featuredArticleSlugs = [
    'caffeine-l-theanine-stack-the-ultimate-guide',
    'best-nootropic-stack-for-focus-2026',
    'lions-mane-mushroom-benefits-dosage-complete-guide',
    'beginners-guide-to-nootropics-2026',
    'ashwagandha-benefits-dosage-complete-guide',
    'best-nootropics-for-students-study-stack-2026'
  ];
  const featuredArticles = featuredArticleSlugs
    .map((slug) => blogArticles.find((a) => a.slug === slug))
    .filter(Boolean);
  const featuredSupplements = supplements.slice(0, 24);

  const featuredSupplementsHtml = featuredSupplements
    .map(
      (s) =>
        `<li><a href="${supplementUrl(s.id)}"><strong>${escapeHtml(
          s.name
        )}</strong></a> — ${escapeHtml(s.description)}</li>`
    )
    .join('\n');

  const featuredArticlesHtml = featuredArticles
    .map(
      (a) =>
        `<li><a href="${blogUrl(a.slug)}"><strong>${escapeHtml(
          a.title
        )}</strong></a> — ${escapeHtml(a.excerpt || '')}</li>`
    )
    .join('\n');

  const familyLinksHtml = Object.values(supplementFamilies)
    .map(
      (f) =>
        `<li><strong>${escapeHtml(f.name)}</strong> — ${escapeHtml(
          f.summary || f.description || ''
        )}</li>`
    )
    .join('\n');

  const faqSummary = faqData
    .flatMap((cat) => cat.questions)
    .slice(0, 6)
    .map(
      (q) =>
        `<details><summary><strong>${escapeHtml(
          q.q
        )}</strong></summary><p>${escapeHtml(q.a)}</p></details>`
    )
    .join('\n');

  const body = wrap(`
<h1>Build Your Perfect Nootropic Stack</h1>
<p><strong>Free to use. No account required.</strong> NootropicStacker is the PCPartPicker for nootropics — pick your goals, build a supplement stack from 195 compounds, and let the Stack Score system rate it across synergy, coverage, balance, and efficiency.</p>

<h2>How It Works</h2>
<ol>
  <li><strong>Set your goals.</strong> Pick what you want to optimize — focus, energy, mood, memory, or creativity.</li>
  <li><strong>Build your stack.</strong> Add supplements from a database of 195 compounds with effect ratings, dosage ranges, and interaction warnings.</li>
  <li><strong>Optimize with Stack Score.</strong> Get a 0-100 rating across synergy, coverage, balance, and efficiency, with specific tips to improve.</li>
</ol>

<h2>Pillar Guides</h2>
<ul>
  <li><a href="/start-here">Start Here</a> — the orientation guide if you're new to nootropics.</li>
  <li><a href="/best-nootropics">Best Nootropics 2026</a> — top compounds ranked by evidence.</li>
  <li><a href="/best-stacks">Best Stacks</a> — curated stacks for focus, sleep, energy, mood, and more.</li>
  <li><a href="/reviews">Reviews</a> — branded supplement reviews with quality scoring.</li>
  <li><a href="/compare-supplements">Compare Supplements</a> — side-by-side comparisons.</li>
  <li><a href="/nootropics-for-focus">Nootropics for Focus</a> — focus-specific picks and stacks.</li>
  <li><a href="/nootropics-for-anxiety">Nootropics for Anxiety</a> — anxiety-specific picks and stacks.</li>
</ul>

<h2>Featured Supplements</h2>
<ul>
${featuredSupplementsHtml}
</ul>
<p><a href="/supplements">Browse all 195 supplements →</a></p>

<h2>Supplement Families</h2>
<ul>
${familyLinksHtml}
</ul>
<p><a href="/families">All family guides →</a></p>

<h2>Popular Articles</h2>
<ul>
${featuredArticlesHtml}
</ul>
<p><a href="/blog">All ${blogArticles.length} blog articles →</a></p>

<h2>Frequently Asked Questions</h2>
${faqSummary}
<p><a href="/faq">See all FAQs →</a></p>

<h2>Why Stack Score?</h2>
<p>Unlike simple supplement databases, NootropicStacker evaluates how your chosen compounds work <em>together</em>. The Stack Score system rates your combination across four dimensions: <strong>Synergy</strong> (do these supplements enhance each other?), <strong>Coverage</strong> (does the stack address your goals?), <strong>Balance</strong> (is there unnecessary overlap?), and <strong>Efficiency</strong> (is the stack lean and purposeful?). Each dimension scores 0-25, combining into an overall 0-100 rating with a letter grade.</p>
<p>Whether you're a first-time stacker looking for a focus and energy combo or an experienced biohacker fine-tuning a complex protocol, the tools here help you make informed decisions. Set your goals, add supplements, and let the scoring system show you where your stack is strong and where it can improve.</p>
`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData
        .flatMap((cat) => cat.questions)
        .map((q) => ({
          '@type': 'Question',
          name: q.q,
          acceptedAnswer: { '@type': 'Answer', text: q.a }
        }))
    }
  ];

  return renderShell({
    url: '/',
    title:
      'NootropicStacker — Build Your Perfect Nootropic Stack | 195 Supplements',
    description:
      'Free nootropic stack builder with 195 supplements, the Stack Score rating system, synergy and interaction analysis, comparison tools, and a 5-question quiz. Built for biohackers.',
    jsonLd,
    bodyHtml: body
  });
}

function renderSupplementLibrary() {
  const byCategory = new Map();
  for (const s of supplements) {
    if (!byCategory.has(s.category)) byCategory.set(s.category, []);
    byCategory.get(s.category).push(s);
  }
  const categoryOrder = [...byCategory.keys()].sort();

  const categoriesHtml = categoryOrder
    .map((cat) => {
      const items = byCategory
        .get(cat)
        .map(
          (s) =>
            `<li><a href="${supplementUrl(s.id)}"><strong>${escapeHtml(
              s.name
            )}</strong></a> — ${escapeHtml(s.description)}</li>`
        )
        .join('\n');
      return `<section><h2>${escapeHtml(
        titleCase(cat.replace(/-/g, ' '))
      )}</h2><ul>${items}</ul></section>`;
    })
    .join('\n');

  const body = wrap(`
<h1>Supplement Library</h1>
<p>Comprehensive database of <strong>${
    supplements.length
  } biohacking supplements</strong> — including nootropics, adaptogens, vitamins, minerals, racetams, choline sources, and performance compounds. Each entry includes a description, key benefits, effect ratings (0-10) across seven categories, dosage ranges, optimal timing, interaction warnings, and a safety profile.</p>
<p>Use the live search and filters in the interactive library on the right, or browse by category below.</p>
${categoriesHtml}
`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Supplement Library',
      url: `${ORIGIN}/supplements`,
      description:
        'Database of 195 biohacking supplements with effect profiles, dosage ranges, and safety information.',
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: supplements.length,
        itemListElement: supplements.slice(0, 100).map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.name,
          url: `${ORIGIN}${supplementUrl(s.id)}`
        }))
      }
    }
  ];

  return renderShell({
    url: '/supplements',
    title:
      'Supplement Database — 195 Biohacking Supplements with Effects & Dosages',
    description:
      'Comprehensive database of 195 biohacking supplements: nootropics, adaptogens, vitamins, minerals, and performance enhancers. Effect ratings, dosage recommendations, and safety warnings.',
    jsonLd,
    bodyHtml: body
  });
}

function renderSupplementPage(s) {
  const effectsHtml = Object.entries(s.effects || {})
    .map(
      ([k, v]) =>
        `<li><strong>${escapeHtml(titleCase(k))}:</strong> ${
          v > 0 ? '+' : ''
        }${escapeHtml(String(v))}/10</li>`
    )
    .join('\n');
  const benefitsHtml = (s.benefits || [])
    .map((b) => `<li>${escapeHtml(b)}</li>`)
    .join('\n');
  const warningsHtml = (s.warnings || [])
    .map((w) => `<li>${escapeHtml(w)}</li>`)
    .join('\n');
  const interactionsHtml = (s.interactions || [])
    .map((i) => `<li>${escapeHtml(i.replace(/-/g, ' '))}</li>`)
    .join('\n');

  const related = supplements
    .filter((r) => r.category === s.category && r.id !== s.id)
    .slice(0, 6);
  const relatedHtml = related
    .map(
      (r) =>
        `<li><a href="${supplementUrl(r.id)}"><strong>${escapeHtml(
          r.name
        )}</strong></a> — ${escapeHtml(r.description)}</li>`
    )
    .join('\n');

  const dose = s.dosage || {};
  const doseLine = `${dose.min ?? ''}${dose.max ? `–${dose.max}` : ''} ${escapeHtml(
    dose.unit || ''
  )}`.trim();

  const body = wrap(`
<nav aria-label="breadcrumb" style="font-size:13px;color:#6b7280;margin-bottom:8px">
  <a href="/" style="color:#6b7280">Home</a> ›
  <a href="/supplements" style="color:#6b7280">Supplements</a> ›
  <span>${escapeHtml(s.name)}</span>
</nav>

<h1>${escapeHtml(s.name)}</h1>
<p style="font-size:13px;color:#6b7280;margin-top:0">
  Category: <strong>${escapeHtml(
    titleCase(String(s.category).replace(/-/g, ' '))
  )}</strong> · Recommended dose: <strong>${doseLine}</strong>
</p>

<h2>What is ${escapeHtml(s.name)}?</h2>
<p>${escapeHtml(s.description)}</p>
<p>${escapeHtml(s.name)} is a ${escapeHtml(
    String(s.category).replace(/-/g, ' ')
  )} compound used by biohackers and researchers studying cognitive enhancement, longevity, and supplement stacking. The information below summarizes the typical use case, dosage range, effect profile, safety considerations, and how this compound fits into a stack.</p>

<h2>Key Benefits</h2>
<ul>
${benefitsHtml || '<li>See effects profile below.</li>'}
</ul>

<h2>Effects Profile</h2>
<p>${escapeHtml(
    s.name
  )} is rated across seven cognitive and physiological dimensions on a 0-10 scale (negative scores indicate the compound depresses that dimension):</p>
<ul>
${effectsHtml}
</ul>

<h2>Dosage &amp; Timing</h2>
<p><strong>Recommended daily dose:</strong> ${doseLine}.</p>
<p><strong>Best timing:</strong> ${escapeHtml(
    dose.timing || 'See product directions.'
  )}</p>
<p>Always start at the lower end of the dosage range to assess individual tolerance. Effects from cumulative compounds (such as adaptogens or nootropics that act on neuroplasticity) may take 4-12 weeks of consistent use to materialize.</p>

${
  warningsHtml || interactionsHtml
    ? `<h2>Safety Information</h2>
${warningsHtml ? `<h3>Warnings</h3><ul>${warningsHtml}</ul>` : ''}
${interactionsHtml ? `<h3>Potential interactions</h3><ul>${interactionsHtml}</ul>` : ''}`
    : ''
}

<h2>How ${escapeHtml(s.name)} Fits in a Stack</h2>
<p>Effective stacking combines compounds with complementary mechanisms while avoiding redundancy. ${escapeHtml(
    s.name
  )} pairs naturally with other ${escapeHtml(
    String(s.category).replace(/-/g, ' ')
  )} compounds and with supplements that target adjacent pathways. Use the <a href="/">Stack Builder</a> to evaluate synergy, coverage, balance, and efficiency in real time, or take the <a href="/quiz">5-question Stack Quiz</a> for a starting recommendation.</p>

${
  related.length
    ? `<h2>Related Supplements</h2>
<ul>
${relatedHtml}
</ul>`
    : ''
}

<h2>Where to Buy</h2>
<p>Quality matters. Look for products that report bioactive content (e.g. "standardized to 5% withanolides" rather than just "10:1 extract"), ideally tested by HPLC. The interactive page below includes vetted Amazon, iHerb, and Nootropics Depot links where available.</p>

<p><strong>Medical disclaimer:</strong> This information is for educational purposes only and is not intended as medical advice. Always consult a healthcare professional before starting any new supplement regimen.</p>
`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Supplements',
          item: `${ORIGIN}/supplements`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: s.name,
          item: `${ORIGIN}${supplementUrl(s.id)}`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: s.name,
      description: s.description,
      category: s.category,
      url: `${ORIGIN}${supplementUrl(s.id)}`,
      brand: { '@type': 'Brand', name: 'Various Manufacturers' },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Dosage Range',
          value: `${dose.min ?? ''}-${dose.max ?? ''} ${dose.unit ?? ''}`.trim()
        },
        {
          '@type': 'PropertyValue',
          name: 'Timing',
          value: dose.timing || ''
        }
      ]
    }
  ];

  return renderShell({
    url: supplementUrl(s.id),
    title: `${s.name} — Effects, Dosage & Safety | NootropicStacker`,
    description: `Complete guide to ${s.name}: ${s.description} Optimal dosage ${doseLine}, effect profile, interactions, and how it fits in a nootropic stack.`,
    jsonLd,
    bodyHtml: body
  });
}

function renderBlogIndex() {
  const items = [...blogArticles]
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .map(
      (a) => `
<article style="border-bottom:1px solid #e5e7eb;padding:16px 0">
  <h2 style="margin:0 0 4px"><a href="${blogUrl(a.slug)}">${escapeHtml(
    a.title
  )}</a></h2>
  <p style="margin:0;font-size:13px;color:#6b7280">${escapeHtml(
    new Date(a.publishedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  )} · ${a.readTime || ''} min read · ${(a.tags || [])
        .map((t) => escapeHtml(t))
        .join(', ')}</p>
  <p>${escapeHtml(a.excerpt || '')}</p>
</article>`
    )
    .join('\n');

  const body = wrap(`
<h1>NootropicStacker Blog — ${blogArticles.length} Articles</h1>
<p>Long-form articles on nootropic research, supplement stacking, the gut-brain axis, supplement quality, and what biohackers should pay attention to.</p>
${items}
`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'NootropicStacker Blog',
      url: `${ORIGIN}/blog`,
      blogPost: blogArticles.map((a) => ({
        '@type': 'BlogPosting',
        headline: a.title,
        url: `${ORIGIN}${blogUrl(a.slug)}`,
        datePublished: a.publishedDate
      }))
    }
  ];

  return renderShell({
    url: '/blog',
    title: `Nootropic Blog — ${blogArticles.length} Research-Backed Guides | NootropicStacker`,
    description: `${blogArticles.length} long-form articles on nootropic research, supplement stacking, the gut-brain axis, supplement quality, and biohacking trends.`,
    jsonLd,
    bodyHtml: body
  });
}

function renderBlogPost(a) {
  const sectionsHtml = (a.sections || [])
    .map(
      (sec) =>
        (sec.heading ? `<h2>${escapeHtml(sec.heading)}</h2>` : '') +
        (sec.paragraphs || [])
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join('\n')
    )
    .join('\n');

  const related = blogArticles
    .filter((x) => x.slug !== a.slug)
    .slice(0, 5)
    .map(
      (r) =>
        `<li><a href="${blogUrl(r.slug)}"><strong>${escapeHtml(
          r.title
        )}</strong></a> — ${escapeHtml(r.excerpt || '')}</li>`
    )
    .join('\n');

  const body = wrap(`
<nav aria-label="breadcrumb" style="font-size:13px;color:#6b7280;margin-bottom:8px">
  <a href="/" style="color:#6b7280">Home</a> ›
  <a href="/blog" style="color:#6b7280">Blog</a> ›
  <span>${escapeHtml(a.title)}</span>
</nav>

<article>
  <h1>${escapeHtml(a.title)}</h1>
  <p style="font-size:13px;color:#6b7280;margin-top:0">${escapeHtml(
    new Date(a.publishedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  )} · ${a.readTime || ''} min read · Tags: ${(a.tags || [])
    .map((t) => escapeHtml(t))
    .join(', ')}</p>
  <p><em>${escapeHtml(a.excerpt || '')}</em></p>
  ${sectionsHtml}
  ${
    a.bottomLine
      ? `<aside style="background:#eff6ff;border-left:4px solid #2563eb;padding:12px 16px;margin-top:16px"><h3 style="margin-top:0">The Bottom Line</h3><p>${escapeHtml(
          a.bottomLine
        )}</p></aside>`
      : ''
  }
</article>

<h2>More Articles</h2>
<ul>
${related}
</ul>
`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${ORIGIN}/blog` },
        {
          '@type': 'ListItem',
          position: 3,
          name: a.title,
          item: `${ORIGIN}${blogUrl(a.slug)}`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.title,
      datePublished: a.publishedDate,
      dateModified: a.publishedDate,
      author: { '@type': 'Organization', name: 'NootropicStacker' },
      publisher: {
        '@type': 'Organization',
        name: 'NootropicStacker',
        logo: { '@type': 'ImageObject', url: `${ORIGIN}/favicon.ico` }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${ORIGIN}${blogUrl(a.slug)}`
      },
      description: a.excerpt || '',
      keywords: (a.tags || []).join(', ')
    }
  ];

  return renderShell({
    url: blogUrl(a.slug),
    title: `${a.title} | NootropicStacker Blog`,
    description: a.excerpt || a.title,
    jsonLd,
    bodyHtml: body
  });
}

function renderFamiliesPage() {
  const familiesHtml = Object.values(supplementFamilies)
    .map((f) => {
      const memberLinks = (f.supplements || [])
        .map((id) => {
          const supp = supplements.find((s) => s.id === id);
          if (!supp) return '';
          return `<a href="${supplementUrl(id)}">${escapeHtml(supp.name)}</a>`;
        })
        .filter(Boolean)
        .join(', ');
      return `<section style="border-bottom:1px solid #e5e7eb;padding:16px 0">
  <h2 id="${escapeHtml(f.id)}">${escapeHtml(f.name)}</h2>
  <p>${escapeHtml(f.summary || f.description || '')}</p>
  <p><strong>Method of action:</strong> ${escapeHtml(f.methodOfAction || '')}</p>
  <p><strong>Typical usage:</strong> ${escapeHtml(f.typicalUsage || '')}</p>
  ${memberLinks ? `<p><strong>Members:</strong> ${memberLinks}</p>` : ''}
</section>`;
    })
    .join('\n');

  const body = wrap(`
<h1>Supplement Family Guides</h1>
<p>Compounds in the same family share mechanisms — racetams enhance acetylcholine and AMPA signaling, adaptogens modulate the HPA axis, cholinergics provide acetylcholine precursors, and so on. Building a smart stack means understanding family-level mechanisms so you can mix and match without unnecessary redundancy.</p>
${familiesHtml}
`);

  return renderShell({
    url: '/families',
    title:
      'Supplement Family Guides — Racetams, Adaptogens, Cholinergics | NootropicStacker',
    description:
      'Family-level guides to nootropic supplements: racetams, cholinergics, adaptogens, stimulants, and more. How each family works, typical use cases, and member compounds.',
    jsonLd: [],
    bodyHtml: body
  });
}

function renderFAQPage() {
  const sectionsHtml = faqData
    .map(
      (cat) => `
<section>
  <h2>${escapeHtml(cat.category)}</h2>
  ${cat.questions
    .map(
      (q) => `
  <details>
    <summary><strong>${escapeHtml(q.q)}</strong></summary>
    <p>${escapeHtml(q.a)}</p>
  </details>`
    )
    .join('\n')}
</section>`
    )
    .join('\n');

  const body = wrap(`
<h1>Frequently Asked Questions</h1>
<p>Everything you need to know about nootropic stacking, supplement safety, and using NootropicStacker.</p>
${sectionsHtml}
`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData
        .flatMap((c) => c.questions)
        .map((q) => ({
          '@type': 'Question',
          name: q.q,
          acceptedAnswer: { '@type': 'Answer', text: q.a }
        }))
    }
  ];

  return renderShell({
    url: '/faq',
    title: 'FAQ — Nootropic Stacking Questions Answered | NootropicStacker',
    description:
      'Answers to common questions about nootropic stacking, supplement safety, cycling, racetams and choline sources, and how to use NootropicStacker.',
    jsonLd,
    bodyHtml: body
  });
}

function renderGlossaryPage() {
  const sorted = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));
  const grouped = new Map();
  for (const t of sorted) {
    const letter = t.term[0].toUpperCase();
    if (!grouped.has(letter)) grouped.set(letter, []);
    grouped.get(letter).push(t);
  }
  const sectionsHtml = [...grouped.entries()]
    .map(
      ([letter, terms]) => `
<section>
  <h2 id="glossary-${letter}">${letter}</h2>
  <dl>
${terms
  .map(
    (t) =>
      `    <dt><strong>${escapeHtml(t.term)}</strong></dt>\n    <dd>${escapeHtml(
        t.definition
      )}</dd>`
  )
  .join('\n')}
  </dl>
</section>`
    )
    .join('\n');

  const body = wrap(`
<h1>Nootropics Glossary</h1>
<p>Plain-English definitions of key terms, compounds, and concepts in nootropic stacking — from acetylcholine to withanolides.</p>
${sectionsHtml}
`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: 'NootropicStacker Glossary',
      hasDefinedTerm: glossaryTerms.map((t) => ({
        '@type': 'DefinedTerm',
        name: t.term,
        description: t.definition
      }))
    }
  ];

  return renderShell({
    url: '/glossary',
    title: 'Nootropics Glossary — Key Terms & Concepts | NootropicStacker',
    description:
      'Plain-English definitions of nootropic terms, compounds, and concepts: acetylcholine, racetams, adaptogens, withanolides, neuroplasticity, and more.',
    jsonLd,
    bodyHtml: body
  });
}

// ---------- Pillar / static pages ----------

function renderStaticShell({ url, title, description, h1, intro, extras = '', jsonLd = [] }) {
  const popularSupplementsHtml = supplements
    .slice(0, 12)
    .map(
      (s) =>
        `<li><a href="${supplementUrl(s.id)}">${escapeHtml(s.name)}</a></li>`
    )
    .join('\n');
  const recentArticlesHtml = blogArticles
    .slice(0, 8)
    .map(
      (a) =>
        `<li><a href="${blogUrl(a.slug)}">${escapeHtml(a.title)}</a></li>`
    )
    .join('\n');

  const body = wrap(`
<h1>${escapeHtml(h1)}</h1>
${intro}
${extras}

<h2>Popular Supplements</h2>
<ul>
${popularSupplementsHtml}
</ul>

<h2>Recent Articles</h2>
<ul>
${recentArticlesHtml}
</ul>

<p><a href="/">Open the Stack Builder →</a> · <a href="/quiz">Take the Stack Quiz →</a></p>
`);
  return renderShell({ url, title, description, jsonLd, bodyHtml: body });
}

function renderQuizPage() {
  return renderStaticShell({
    url: '/quiz',
    title:
      'Stack Quiz — 5-Question Personalized Nootropic Recommendation | NootropicStacker',
    description:
      'Take the 5-question Stack Quiz for a personalized nootropic supplement stack based on your goals, experience level, and preferences.',
    h1: 'Stack Quiz — Find Your Starting Stack in 5 Questions',
    intro: `<p>Not sure where to start? The Stack Quiz asks five questions about your goals, experience level, and preferences, then recommends a personalized starting stack you can tune from there.</p>
<ul>
  <li>Your primary goals (focus, energy, mood, memory, creativity, sleep, stress, longevity)</li>
  <li>Experience level (beginner, intermediate, advanced)</li>
  <li>Preferences for synthetic vs. natural compounds</li>
  <li>Budget and timing constraints</li>
  <li>Existing supplements you're already taking</li>
</ul>
<p>Already know what you want? Skip the quiz and start with the <a href="/">Stack Builder</a>, or browse the <a href="/supplements">supplement library</a>.</p>`
  });
}

function renderStacksPage() {
  return renderStaticShell({
    url: '/stacks',
    title:
      'Pre-Built Nootropic Stacks — Focus, Energy, Mood, Sleep | NootropicStacker',
    description:
      'Curated supplement stacks for common goals — focus, sustained energy, study, mood, sleep, and creativity. Copy and customize in the Stack Builder.',
    h1: 'Pre-Built Nootropic Stacks',
    intro: `<p>Curated supplement stacks for common goals — focus, sustained energy, study, mood, sleep, and creativity. Each stack is built from compounds with complementary mechanisms and minimal redundancy.</p>
<p>You can copy a pre-built stack into the <a href="/">Stack Builder</a> and customize from there. Use these as starting points, not prescriptions.</p>`
  });
}

function renderNewsPage() {
  return renderStaticShell({
    url: '/news',
    title: 'Nootropic News & Research | NootropicStacker',
    description:
      'Latest nootropic supplement news, research updates, and industry trends from NootropicStacker.',
    h1: 'Nootropic News & Research',
    intro: `<p>Latest research findings, supplement industry news, and biohacking trends. For long-form analysis, see the <a href="/blog">${blogArticles.length}-article Blog</a>.</p>`
  });
}

function renderContactPage() {
  return renderStaticShell({
    url: '/contact',
    title: 'Contact NootropicStacker',
    description:
      'Get in touch with NootropicStacker — feedback, partnerships, content corrections, and press inquiries.',
    h1: 'Contact NootropicStacker',
    intro: `<p>Questions, feedback, partnership inquiries, or content corrections? We're a small team and we read every email.</p>`
  });
}

function renderStartHerePage() {
  return renderStaticShell({
    url: '/start-here',
    title: 'Start Here — Your First Nootropic Stack in 7 Steps | NootropicStacker',
    description:
      'New to nootropics? Start here. A 7-step orientation that covers what nootropics are, how stacking works, what to take first, and how to track your progress.',
    h1: 'Start Here — Your First Nootropic Stack',
    intro: `<p>If you're new to nootropics, the volume of information online can be overwhelming. This page is the orientation: read it once and you'll know what nootropics are, how stacking works, what to start with, and how to evaluate whether something is actually working for you.</p>`,
    extras: `<h2>The 7 Steps</h2>
<ol>
  <li><strong>Understand the goal.</strong> Nootropics aim to support cognitive function — focus, memory, mood, motivation — with minimal side effects. They are not a substitute for sleep, exercise, or nutrition.</li>
  <li><strong>Pick one goal.</strong> "Cognitive enhancement" is too vague. Are you optimizing for focus during deep work? Studying? Stress resilience? Sleep? Different goals need different compounds.</li>
  <li><strong>Start with foundations.</strong> Caffeine + L-theanine for acute focus, omega-3 DHA for long-term brain health, creatine for cognitive baseline. Most people benefit from these before adding anything exotic.</li>
  <li><strong>Add one compound at a time.</strong> Give each new addition at least two weeks before judging it or layering on something else.</li>
  <li><strong>Match mechanisms to goals.</strong> Don't stack three stimulants. Diversify pathways instead — see the <a href="/families">family guides</a>.</li>
  <li><strong>Track your results.</strong> Subjective journaling is fine to start. For more rigor, use reaction-time tests or daily 1-10 ratings on energy, focus, and mood.</li>
  <li><strong>Cycle when you should.</strong> Stimulants and dopaminergics need breaks. Foundational compounds usually don't. See the <a href="/glossary#glossary-C">Cycling</a> entry in the glossary.</li>
</ol>`
  });
}

function renderBestNootropicsPage() {
  const top = supplements.slice(0, 12);
  const topHtml = top
    .map(
      (s) =>
        `<li><a href="${supplementUrl(s.id)}"><strong>${escapeHtml(
          s.name
        )}</strong></a> — ${escapeHtml(s.description)}</li>`
    )
    .join('\n');
  return renderStaticShell({
    url: '/best-nootropics',
    title: 'Best Nootropics 2026 — Top Compounds Ranked by Evidence | NootropicStacker',
    description:
      'The best nootropics in 2026, ranked by evidence and real-world results. Caffeine, L-theanine, creatine, lion\'s mane, bacopa, ashwagandha, alpha-GPC, modafinil and more.',
    h1: 'Best Nootropics 2026',
    intro: `<p>The best nootropic for you depends on your goal, but a small group of compounds have consistently strong evidence and clean safety profiles. These are the compounds most experienced biohackers come back to after experimenting with everything else.</p>`,
    extras: `<h2>The Short List</h2>
<ul>
${topHtml}
</ul>
<p><a href="/supplements">See all 195 supplements with effect ratings →</a></p>`
  });
}

function renderBestStacksPage() {
  return renderStaticShell({
    url: '/best-stacks',
    title:
      'Best Nootropic Stacks 2026 — Curated Stacks for Focus, Sleep, Energy | NootropicStacker',
    description:
      'The best nootropic stacks in 2026 for focus, study, sleep, energy, mood, and longevity. Curated combinations with synergy analysis and evidence-backed compounds.',
    h1: 'Best Nootropic Stacks 2026',
    intro: `<p>Curated stacks for the most common goals — focus, study, sleep, energy, mood, longevity, and creativity. Each stack uses compounds with complementary mechanisms and minimal redundancy. Use them as starting points and customize in the <a href="/">Stack Builder</a>.</p>
<ul>
  <li><strong>Focus stack:</strong> caffeine + L-theanine + creatine.</li>
  <li><strong>Study stack:</strong> bacopa + lion's mane + alpha-GPC.</li>
  <li><strong>Sleep stack:</strong> magnesium glycinate + L-theanine + glycine.</li>
  <li><strong>Energy stack:</strong> rhodiola + tyrosine + caffeine.</li>
  <li><strong>Mood / stress stack:</strong> ashwagandha (KSM-66) + rhodiola + omega-3 DHA.</li>
  <li><strong>Longevity stack:</strong> NMN + omega-3 DHA + curcumin (Longvida) + CoQ10.</li>
  <li><strong>Creativity stack:</strong> aniracetam + alpha-GPC + microdosed caffeine.</li>
</ul>`
  });
}

function renderReviewsPage() {
  return renderStaticShell({
    url: '/reviews',
    title: 'Supplement Reviews — Branded Nootropic Reviews | NootropicStacker',
    description:
      'Branded supplement reviews with quality scoring: Alpha Brain, Onnit, Mind Lab Pro, Nootropics Depot, KSM-66 ashwagandha, Suntheanine, Longvida curcumin, and more.',
    h1: 'Supplement Reviews',
    intro: `<p>Reviews of branded nootropic and supplement products with quality scoring across formulation, dosing, third-party testing, and price-per-dose. We look at active compound content (not just extract ratios), verified Certificate of Analysis presence, and whether the dose matches what was actually used in clinical research.</p>`
  });
}

function renderComparePage() {
  return renderStaticShell({
    url: '/compare-supplements',
    title:
      'Compare Supplements Side by Side | NootropicStacker',
    description:
      'Pick two supplements and see them side by side: effects, dosages, safety profiles, mechanisms of action, and stack synergy.',
    h1: 'Compare Supplements',
    intro: `<p>Pick any two supplements from our database and see them side by side: effect ratings, recommended doses, optimal timing, safety profile, mechanism of action, and how they interact in a stack. Useful when choosing between similar compounds — for example, Alpha-GPC vs. Citicoline as your choline source.</p>`
  });
}

function renderNootropicsForFocus() {
  return renderStaticShell({
    url: '/nootropics-for-focus',
    title: 'Nootropics for Focus — Best Compounds & Stacks 2026 | NootropicStacker',
    description:
      'The best nootropics for focus in 2026: caffeine + L-theanine, alpha-GPC, modafinil, phenylpiracetam, and the stacks that combine them.',
    h1: 'Nootropics for Focus',
    intro: `<p>For focused work, the most reliable starting point is caffeine + L-theanine — the combination delivers the alertness of caffeine without the anxiety. Add a choline source for sustained sessions, and consider a modafinil alternative if you need a longer-acting option.</p>
<ul>
  <li><strong>First stack:</strong> caffeine 100mg + L-theanine 200mg.</li>
  <li><strong>Add choline:</strong> alpha-GPC 300mg or citicoline 250mg for longer sessions.</li>
  <li><strong>For depth:</strong> phenylpiracetam (cycle strictly) or modafinil/armodafinil with prescription.</li>
</ul>`
  });
}

function renderNootropicsForAnxiety() {
  return renderStaticShell({
    url: '/nootropics-for-anxiety',
    title: 'Nootropics for Anxiety — Calm Without Sedation 2026 | NootropicStacker',
    description:
      'The best nootropics for anxiety in 2026: ashwagandha, L-theanine, magnesium glycinate, rhodiola, and the stacks that smooth the edges.',
    h1: 'Nootropics for Anxiety',
    intro: `<p>For anxiety, the goal is to lower physiological arousal and HPA-axis activation without sedating yourself. Ashwagandha reliably reduces cortisol; L-theanine takes the edge off acute stress; magnesium glycinate supports baseline calm.</p>
<ul>
  <li><strong>Foundational:</strong> ashwagandha (KSM-66) 600mg/day.</li>
  <li><strong>Acute support:</strong> L-theanine 200-400mg as needed.</li>
  <li><strong>Sleep / overnight:</strong> magnesium glycinate 200-400mg before bed.</li>
  <li><strong>Stress resilience:</strong> rhodiola rosea 200-400mg morning, before stressful events.</li>
</ul>`
  });
}

function renderSupplementGoalLanding(goalSlug) {
  const goalLabel = titleCase(goalSlug.replace(/-/g, ' '));
  const top = [...supplements]
    .filter((s) => (s.effects || {})[goalSlug] !== undefined)
    .sort((a, b) => (b.effects?.[goalSlug] || 0) - (a.effects?.[goalSlug] || 0))
    .slice(0, 12);
  if (top.length === 0) return null;
  const topHtml = top
    .map(
      (s) =>
        `<li><a href="${supplementUrl(s.id)}"><strong>${escapeHtml(
          s.name
        )}</strong></a> — ${escapeHtml(s.description)} <em>(${
          goalLabel
        } score: ${escapeHtml(String(s.effects[goalSlug]))}/10)</em></li>`
    )
    .join('\n');

  const body = wrap(`
<nav aria-label="breadcrumb" style="font-size:13px;color:#6b7280;margin-bottom:8px">
  <a href="/" style="color:#6b7280">Home</a> ›
  <a href="/supplements" style="color:#6b7280">Supplements</a> ›
  <span>By goal: ${escapeHtml(goalLabel)}</span>
</nav>

<h1>Best Supplements for ${escapeHtml(goalLabel)}</h1>
<p>Top supplements ranked by their NootropicStacker effect score for ${escapeHtml(
    goalLabel
  )}. Higher scores indicate stronger evidence and reported effects in this dimension.</p>
<ul>
${topHtml}
</ul>
<p><a href="/">Build a custom stack →</a> · <a href="/supplements">Browse all 195 supplements →</a></p>
`);
  return renderShell({
    url: `/supplements/${goalSlug}`,
    title: `Best Supplements for ${goalLabel} | NootropicStacker`,
    description: `Top supplements for ${goalLabel.toLowerCase()}, ranked by NootropicStacker effect score across our database of 195 compounds.`,
    jsonLd: [],
    bodyHtml: body
  });
}

function renderCompareSlugPair(slugPair) {
  const parts = slugPair.split('-vs-');
  const a = supplements.find((s) => s.id === parts[0]);
  const b = supplements.find((s) => s.id === parts[1]);
  if (!a || !b) {
    const body = wrap(`
<h1>Compare Supplements</h1>
<p>Pick two supplements and see them side by side. Effects, dosages, safety profiles, mechanisms, and stack notes.</p>
<p><a href="/supplements">Browse the library →</a> · <a href="/compare-supplements">Open the comparison tool →</a></p>
`);
    return renderShell({
      url: `/compare/${slugPair}`,
      title: 'Supplement Comparison | NootropicStacker',
      description:
        'Side-by-side comparison of nootropic supplements: effects, dosages, safety profiles, and stack notes.',
      jsonLd: [],
      bodyHtml: body
    });
  }

  const body = wrap(`
<nav aria-label="breadcrumb" style="font-size:13px;color:#6b7280;margin-bottom:8px">
  <a href="/" style="color:#6b7280">Home</a> ›
  <a href="/supplements" style="color:#6b7280">Supplements</a> ›
  <span>${escapeHtml(a.name)} vs ${escapeHtml(b.name)}</span>
</nav>

<h1>${escapeHtml(a.name)} vs ${escapeHtml(b.name)}</h1>
<p>Side-by-side comparison of <a href="${supplementUrl(a.id)}">${escapeHtml(
    a.name
  )}</a> and <a href="${supplementUrl(b.id)}">${escapeHtml(b.name)}</a> — effects, dosages, mechanisms, and how each fits in a nootropic stack.</p>

<section>
  <h2>${escapeHtml(a.name)}</h2>
  <p>${escapeHtml(a.description)}</p>
  <p><strong>Dosage:</strong> ${a.dosage?.min ?? ''}-${
    a.dosage?.max ?? ''
  } ${escapeHtml(a.dosage?.unit || '')} · <strong>Timing:</strong> ${escapeHtml(
    a.dosage?.timing || ''
  )}</p>
  <p><a href="${supplementUrl(a.id)}">Full ${escapeHtml(a.name)} guide →</a></p>
</section>

<section>
  <h2>${escapeHtml(b.name)}</h2>
  <p>${escapeHtml(b.description)}</p>
  <p><strong>Dosage:</strong> ${b.dosage?.min ?? ''}-${
    b.dosage?.max ?? ''
  } ${escapeHtml(b.dosage?.unit || '')} · <strong>Timing:</strong> ${escapeHtml(
    b.dosage?.timing || ''
  )}</p>
  <p><a href="${supplementUrl(b.id)}">Full ${escapeHtml(b.name)} guide →</a></p>
</section>

<p>For an interactive side-by-side breakdown of effect ratings, safety profile, and stack synergy, use the <a href="/">Stack Builder</a> or the <a href="/compare-supplements">comparison tool</a>.</p>
`);

  return renderShell({
    url: `/compare/${slugPair}`,
    title: `${a.name} vs ${b.name} — Side-by-side Comparison | NootropicStacker`,
    description: `Compare ${a.name} and ${b.name}: effects, dosage ranges, timing, safety profile, and how each fits in a nootropic stack.`,
    jsonLd: [],
    bodyHtml: body
  });
}

// ---------- Sitemap-driven page list ----------

async function readSitemapUrls() {
  const candidates = [
    path.join(distDir, 'sitemap.xml'),
    path.join(publicDir, 'sitemap.xml')
  ];
  let xml = null;
  for (const p of candidates) {
    try {
      xml = await fs.readFile(p, 'utf-8');
      break;
    } catch {
      /* try next */
    }
  }
  if (!xml) return [];
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    .map((u) => u.replace(/^https?:\/\/[^/]+/, ''))
    .map((p) => (p === '' ? '/' : p));
}

async function writePage(routePath, html) {
  let outFile;
  if (routePath === '/' || routePath === '') {
    outFile = path.join(distDir, 'index.html');
  } else {
    const clean = routePath.replace(/^\/+|\/+$/g, '');
    outFile = path.join(distDir, clean, 'index.html');
  }
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, html, 'utf-8');
}

// ---------- Main ----------

async function main() {
  await fs.mkdir(distDir, { recursive: true });
  const urls = await readSitemapUrls();

  const goalSlugs = new Set(['energy', 'mood', 'balance', 'creativity', 'socialness', 'learning', 'study']);
  const canonicalRoutes = new Set([
    '/',
    '/supplements',
    '/blog',
    '/faq',
    '/glossary',
    '/families',
    '/quiz',
    '/news',
    '/stacks',
    '/contact',
    '/start-here',
    '/best-nootropics',
    '/best-stacks',
    '/reviews',
    '/compare-supplements',
    '/nootropics-for-focus',
    '/nootropics-for-anxiety'
  ]);

  // Always render every supplement page (195) and every blog page from data,
  // regardless of whether they are in the sitemap. The sitemap is curated; we
  // want SEO content for everything we have data for.
  const allRoutes = new Set([
    ...urls,
    ...canonicalRoutes,
    ...supplements.map((s) => supplementUrl(s.id)),
    ...blogArticles.map((a) => blogUrl(a.slug))
  ]);

  let written = 0;
  let skipped = 0;
  const skippedRoutes = [];

  for (const route of allRoutes) {
    let html = null;
    try {
      if (route === '/') html = renderHome();
      else if (route === '/supplements') html = renderSupplementLibrary();
      else if (route === '/blog') html = renderBlogIndex();
      else if (route === '/faq') html = renderFAQPage();
      else if (route === '/glossary') html = renderGlossaryPage();
      else if (route === '/families') html = renderFamiliesPage();
      else if (route === '/quiz') html = renderQuizPage();
      else if (route === '/stacks') html = renderStacksPage();
      else if (route === '/news') html = renderNewsPage();
      else if (route === '/contact') html = renderContactPage();
      else if (route === '/start-here') html = renderStartHerePage();
      else if (route === '/best-nootropics') html = renderBestNootropicsPage();
      else if (route === '/best-stacks') html = renderBestStacksPage();
      else if (route === '/reviews') html = renderReviewsPage();
      else if (route === '/compare-supplements') html = renderComparePage();
      else if (route === '/nootropics-for-focus') html = renderNootropicsForFocus();
      else if (route === '/nootropics-for-anxiety') html = renderNootropicsForAnxiety();
      else if (route.startsWith('/supplements/')) {
        const id = route.slice('/supplements/'.length);
        const s = supplements.find((x) => x.id === id);
        if (s) html = renderSupplementPage(s);
        else if (goalSlugs.has(id)) html = renderSupplementGoalLanding(id);
      } else if (route.startsWith('/blog/')) {
        const slug = route.slice('/blog/'.length);
        const a = blogArticles.find((x) => x.slug === slug);
        if (a) html = renderBlogPost(a);
      } else if (route.startsWith('/compare/')) {
        const pair = route.slice('/compare/'.length);
        html = renderCompareSlugPair(pair);
      } else if (route.startsWith('/guides/')) {
        // /guides/:slug redirects to /blog/:slug at the React layer; skip
        // server-rendering since the SPA handles the redirect.
        skipped++;
        skippedRoutes.push(route);
        continue;
      }

      if (!html) {
        skipped++;
        skippedRoutes.push(route);
        continue;
      }

      await writePage(route, html);
      written++;
    } catch (err) {
      console.error(`prerender: failed for ${route}:`, err.message);
      throw err;
    }
  }

  console.log(
    `prerender: wrote ${written} pages; skipped ${skipped}; sitemap had ${urls.length} entries`
  );
  if (skippedRoutes.length > 0 && skippedRoutes.length <= 20) {
    console.log(`prerender: skipped routes:`, skippedRoutes);
  }
}

await main();
