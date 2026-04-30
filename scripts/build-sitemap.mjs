// Build public/sitemap.xml for NootropicStacker
// - Includes all known static routes
// - Adds every supplement detail (/supplements/:id)
// - Adds every blog article (/blog/:slug)
// - Adds image:image entries when supplement/article images are available

import { writeFileSync, existsSync } from 'fs';
import { supplements } from '../src/data/supplements.js';
import { blogArticles } from '../src/data/blogArticles.js';

const SITE_URL = 'https://nootropicstacker.com';
const today = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/supplements', priority: 0.9, changefreq: 'weekly' },
  { path: '/quiz', priority: 0.8, changefreq: 'monthly' },
  { path: '/stacks', priority: 0.8, changefreq: 'weekly' },
  { path: '/best-stacks', priority: 0.9, changefreq: 'monthly' },
  { path: '/best-nootropics', priority: 0.9, changefreq: 'monthly' },
  { path: '/celebrity-stacks', priority: 0.8, changefreq: 'monthly' },
  { path: '/blog', priority: 0.9, changefreq: 'weekly' },
  { path: '/families', priority: 0.7, changefreq: 'monthly' },
  { path: '/news', priority: 0.7, changefreq: 'weekly' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },
  { path: '/glossary', priority: 0.6, changefreq: 'monthly' },
  { path: '/research-library', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact', priority: 0.4, changefreq: 'monthly' },
  { path: '/start-here', priority: 0.8, changefreq: 'monthly' },
  { path: '/learn', priority: 0.7, changefreq: 'monthly' },
  { path: '/compare-supplements', priority: 0.8, changefreq: 'weekly' },
  { path: '/nootropics-for-focus', priority: 0.8, changefreq: 'monthly' },
  { path: '/nootropics-for-anxiety', priority: 0.8, changefreq: 'monthly' },
  { path: '/reviews', priority: 0.7, changefreq: 'monthly' },
  { path: '/videos', priority: 0.6, changefreq: 'monthly' },
  { path: '/affiliate-disclosure', priority: 0.3, changefreq: 'yearly' },
  { path: '/downloads/10-stacks', priority: 0.6, changefreq: 'monthly' },
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry({ loc, lastmod, changefreq, priority, image }) {
  const parts = [
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority != null ? `    <priority>${priority.toFixed(1)}</priority>` : '',
    image
      ? `    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`
      : '',
  ].filter(Boolean);
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

const entries = [];

// Static routes
for (const r of STATIC_ROUTES) {
  entries.push(
    urlEntry({
      loc: `${SITE_URL}${r.path === '/' ? '/' : r.path}`,
      lastmod: today,
      changefreq: r.changefreq,
      priority: r.priority,
    })
  );
}

// Supplement detail pages
for (const s of supplements) {
  // Only include image if it's a real public asset (skip placeholder /supplements/*.jpg paths
  // that don't exist on disk)
  let image = null;
  if (s.image && s.image.startsWith('http')) {
    image = s.image;
  }
  entries.push(
    urlEntry({
      loc: `${SITE_URL}/supplements/${s.id}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
      image,
    })
  );
}

// Blog articles
for (const a of blogArticles) {
  let image = null;
  if (a.heroImage && /^https?:\/\//.test(a.heroImage)) {
    image = a.heroImage;
  } else if (a.image && /^https?:\/\//.test(a.image)) {
    image = a.image;
  }
  entries.push(
    urlEntry({
      loc: `${SITE_URL}/blog/${a.slug}`,
      lastmod: a.publishedDate || today,
      changefreq: 'monthly',
      priority: 0.8,
      image,
    })
  );
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;

writeFileSync('./public/sitemap.xml', xml);
console.log(
  `[sitemap] Wrote public/sitemap.xml: ${entries.length} URLs (${STATIC_ROUTES.length} static + ${supplements.length} supplements + ${blogArticles.length} articles)`
);
