import express from 'express';
import { fileURLToPath } from 'url';
import { basename, dirname, extname, join, resolve } from 'path';
import { existsSync, statSync, readFileSync, mkdirSync } from 'fs';
import { appendFile as appendFileAsync } from 'fs/promises';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { supplements } from './src/data/supplements.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDirectRun = process.argv[1] ? basename(resolve(process.argv[1])) === basename(__filename) : false;

export function resolveStaticDir(baseDir) {
  const hasBuiltIndex = existsSync(join(baseDir, 'index.html'));
  const hasBuiltAssets = existsSync(join(baseDir, 'assets'));
  if (hasBuiltIndex && hasBuiltAssets) {
    return baseDir;
  }
  return join(baseDir, 'dist');
}

const staticDir = resolveStaticDir(__dirname);

// ============================================================
// PER-ROUTE SEO META INJECTION
// ============================================================
// Railway's Chromium prerender step no-ops in production, so every route
// was serving the homepage's title/description/canonical/JSON-LD verbatim
// to non-JS clients (search + AI crawlers). This section loads dist/index.html
// once as a template, splits it around the static JSON-LD block, and
// generates a route-specific head for every request based on a static
// route table plus dynamic lookups for /supplements/:id and /blog/:slug.
const SITE_URL = 'https://nootropicstacker.com';
const JSONLD_MARKER = '<!-- Static JSON-LD fallback for non-JS crawlers.';

let INDEX_TEMPLATE = '';
try {
  INDEX_TEMPLATE = readFileSync(join(staticDir, 'index.html'), 'utf-8');
} catch (err) {
  console.error('Could not read index.html template for SEO injection:', err.message);
}

let TEMPLATE_HEAD_PREFIX = INDEX_TEMPLATE;
let TEMPLATE_AFTER_HEAD = '';
{
  const headEndIdx = INDEX_TEMPLATE.indexOf('</head>');
  if (headEndIdx !== -1) {
    const jsonLdIdx = INDEX_TEMPLATE.indexOf(JSONLD_MARKER);
    const splitIdx = jsonLdIdx !== -1 && jsonLdIdx < headEndIdx ? jsonLdIdx : headEndIdx;
    TEMPLATE_HEAD_PREFIX = INDEX_TEMPLATE.slice(0, splitIdx);
    TEMPLATE_AFTER_HEAD = INDEX_TEMPLATE.slice(headEndIdx);
  }
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Swaps title/description/canonical/OG/Twitter tags in the pre-JSON-LD head
// slice. Every tag it targets exists exactly once in the template, so a
// single regex replace per tag is safe and cheap.
function injectHead(headHtml, { title, description, canonical, ogType, robots }) {
  let out = headHtml;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);

  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`);
  out = out.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${safeDesc}" />`);

  if (canonical) {
    const safeCanonical = escapeHtml(canonical);
    out = out.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${safeCanonical}" />`);
    out = out.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${safeCanonical}" />`);
  } else {
    out = out.replace(/\s*<link rel="canonical" href="[^"]*" \/>\n?/, '\n');
  }

  out = out.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${safeTitle}" />`);
  out = out.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${safeDesc}" />`);
  out = out.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${safeTitle}" />`);
  out = out.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${safeDesc}" />`);

  if (ogType) {
    out = out.replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${escapeHtml(ogType)}" />`);
  }
  out = out.replace(/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${escapeHtml(robots || 'index, follow')}" />`);

  return out;
}

function renderPage({ title, description, canonical, ogType, robots, jsonLd }) {
  if (!TEMPLATE_AFTER_HEAD) return INDEX_TEMPLATE; // template failed to load; fall back untouched
  const head = injectHead(TEMPLATE_HEAD_PREFIX, { title, description, canonical, ogType, robots });
  const scripts = (jsonLd || [])
    .filter(Boolean)
    .map((obj) => `    <script type="application/ld+json">\n    ${JSON.stringify(obj)}\n    </script>`)
    .join('\n');
  return `${head}${scripts ? scripts + '\n' : ''}  ${TEMPLATE_AFTER_HEAD}`;
}

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NootropicStacker',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: ['https://twitter.com/nootropicstacker'],
};

function buildBreadcrumbJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

// Mirrors SEOOptimizer.jsx's generateSupplementStructuredData so server- and
// client-rendered schema for the same supplement stay in sync.
function buildSupplementJsonLd(supplement) {
  const slug = supplement.id;
  const url = `${SITE_URL}/supplements/${encodeURIComponent(slug)}`;
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: supplement.name,
    description: supplement.description,
    category: supplement.category,
    brand: { '@type': 'Brand', name: 'Various Manufacturers' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '10',
      highPrice: '200',
      availability: 'https://schema.org/InStock',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Dosage Range', value: `${supplement.dosage.min}-${supplement.dosage.max} ${supplement.dosage.unit}` },
      { '@type': 'PropertyValue', name: 'Timing', value: supplement.dosage.timing },
    ],
  };
  const medicalWebPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: `${supplement.name} — Effects, Dosage & Safety`,
    description: supplement.description,
    url,
    about: {
      '@type': 'DietarySupplement',
      name: supplement.name,
      description: supplement.description,
      maximumIntake: `${supplement.dosage.max} ${supplement.dosage.unit}`,
      recommendedIntake: {
        '@type': 'RecommendedDoseSchedule',
        doseUnit: supplement.dosage.unit,
        doseValue: `${supplement.dosage.min}-${supplement.dosage.max}`,
      },
    },
    publisher: { '@type': 'Organization', name: 'NootropicStacker', url: SITE_URL },
    breadcrumb: buildBreadcrumbJsonLd([
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Supplements', url: `${SITE_URL}/supplements` },
      { name: supplement.name, url },
    ]),
  };
  return [ORGANIZATION_JSONLD, productSchema, medicalWebPageSchema];
}

// Mirrors lib/schema/builders.js buildArticleSchema/buildBreadcrumbSchema
// (used client-side in BlogArticlePage.jsx) without importing that module,
// since it pulls in priceTable/evidenceTier data server.js doesn't need.
function buildArticleJsonLd(article) {
  const url = `${SITE_URL}/blog/${article.slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.description || '',
    image: `${SITE_URL}/og-image.png`,
    datePublished: article.publishedDate,
    dateModified: article.dateModified || article.publishedDate,
    author: { '@type': 'Organization', name: 'NootropicStacker' },
    publisher: {
      '@type': 'Organization',
      name: 'NootropicStacker',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Blog', url: `${SITE_URL}/blog` },
    { name: article.title, url },
  ]);
  return [ORGANIZATION_JSONLD, articleSchema, breadcrumbSchema];
}

// Hand-written per-route titles/descriptions mirroring the strings each page
// sets client-side via <SEOOptimizer customTitle=.../> (see src/App.jsx and
// each page component) — kept in sync manually since there's no shared
// source of truth between the SPA and this server-rendered head.
const STATIC_ROUTES = {
  '/build': {
    title: 'Stack Builder — Pick Goals, Add Supplements, Score the Stack',
    description: 'Free interactive nootropic stack builder. Choose goals, browse 195 supplements, get a Stack Score across four 0–25 dimensions, and see interaction warnings live.',
  },
  '/quiz': {
    title: 'Stack Quiz — Get a Personalized Nootropic Starting Point',
    description: 'Five quick questions and you get a starter nootropic stack matched to your goals — focus, sleep, energy, mood, or memory.',
  },
  '/supplements': {
    title: 'Supplement Library — 195 Nootropics with Effects & Dosages',
    description: 'Search 195 nootropic and biohacking supplements by goal, evidence tier, or category. Effect profiles, dosage ranges, interaction warnings, every claim cited.',
  },
  '/stacks': {
    title: 'Predefined Nootropic Stacks — Ready-Made Combinations | NootropicStacker',
    description: 'Browse ready-made nootropic stacks for focus, memory, energy, and more — from beginner to advanced, with full supplement lists and dosing.',
  },
  '/best-stacks': {
    title: 'Best Nootropic Stacks 2026: 8 Expert-Curated Combinations | NootropicStacker',
    description: 'The 8 best nootropic stacks in 2026, curated by goal: focus, memory, energy, stress, sleep, longevity, and budget. Includes exact dosing, cost, and buy links.',
  },
  '/best-nootropics': {
    title: 'Best Nootropics 2026: Top 10 Ranked by Evidence | NootropicStacker',
    description: 'The 10 best nootropics in 2026, ranked by clinical evidence, safety, and real-world results. Includes dosing, timing, and where to buy quality-tested supplements.',
  },
  '/compare-supplements': {
    title: 'Compare Nootropics Side-by-Side | NootropicStacker',
    description: 'Compare any two nootropics side-by-side. Effects, dosage, safety, synergies, and a data-driven verdict.',
  },
  '/blog': {
    title: 'Nootropic Blog — Research, Stacks & Trends | NootropicStacker',
    description: "Deep dives into nootropic research, stack guides, and what's trending in the biohacking world.",
  },
  '/start-here': {
    title: 'Nootropics Guide for Beginners 2026 — How to Start Safely | NootropicStacker',
    description: "Complete beginner's guide to nootropics: how to start, which supplements to choose, safe stacking principles, and the 5 steps to your first stack. Free stack builder included.",
  },
  '/learn': {
    title: 'Learn — NootropicStacker',
    description: "Your hub for nootropic learning: blog, research library, glossary, family guides, FAQ, news, videos, reviews, and a beginner's start-here guide.",
  },
  '/faq': {
    title: 'FAQ — Nootropic Stacking Questions Answered | NootropicStacker',
    description: 'Answers to common questions about nootropic stacking, supplement safety, cycling, and how to use NootropicStacker.',
  },
  '/contact': {
    title: 'Contact NootropicStacker',
    description: 'Get in touch with the NootropicStacker team.',
  },
  '/nootropics-for-focus': {
    title: 'Best Nootropics for Focus 2026 — Ranked by Evidence | NootropicStacker',
    description: 'The 8 best nootropics for focus in 2026, ranked by clinical evidence. Includes dosage ranges (100mg–3000mg), timing, mechanisms, and a free focus stack builder. Find your optimal focus supplement stack.',
  },
  '/nootropics-for-anxiety': {
    title: 'Best Nootropics for Anxiety 2026 — Evidence-Based Guide | NootropicStacker',
    description: 'The 8 best natural supplements for anxiety in 2026, ranked by clinical evidence. Includes mechanisms, dosing, anxiety type matching, and safety guidance.',
  },
  '/reviews': {
    title: 'Best Nootropic Supplements Reviewed 2026 — Mind Lab Pro, Alpha Brain & More | NootropicStacker',
    description: 'Honest reviews of the best nootropic supplements in 2026. Mind Lab Pro, Alpha Brain, Qualia Mind compared on ingredients, dosing, and value.',
  },
  '/families': {
    title: 'Supplement Family Guides | NootropicStacker',
    description: 'Learn about supplement families including racetams, cholinergics, adaptogens, stimulants, and vitamins.',
  },
  '/news': {
    title: 'Nootropic News & Research | NootropicStacker',
    description: 'Latest nootropic supplement news, research updates, and industry trends.',
  },
  '/research-library': {
    title: 'Nootropics Research Library — Peer-Reviewed Studies | NootropicStacker',
    description: 'Plain-English summaries of peer-reviewed nootropic research. Every study includes PubMed links, evidence quality ratings, and actionable supplementation takeaways.',
  },
  '/glossary': {
    title: 'Nootropics Glossary — Key Terms & Concepts | NootropicStacker',
    description: 'Plain-English definitions of nootropic terms, compounds, and concepts. From acetylcholine to withanolides.',
  },
  '/downloads/10-stacks': {
    title: '10 Evidence-Backed Nootropic Stacks — Free PDF | NootropicStacker',
    description: 'Download a free PDF guide to 10 nootropic stacks. Every claim cites PubMed. Written by Vera Huang, CMO.',
  },
  '/celebrity-stacks': {
    title: 'Celebrity Supplement Stacks — What Experts Actually Take | NootropicStacker',
    description: 'We traced every supplement Huberman, Bryan Johnson, Peter Attia, Rhonda Patrick, and 4 others actually take back to the exact podcast episode or book page.',
  },
  '/videos': {
    title: 'Nootropics Video Library — Curated Educational Videos | NootropicStacker',
    description: 'Curated educational videos on supplements, stacking strategies, and the neuroscience behind cognitive enhancement — from top researchers and educators.',
  },
  '/affiliate-disclosure': {
    title: 'Affiliate Disclosure Policy | NootropicStacker',
    description: 'Learn about how NootropicStacker earns commissions through affiliate partnerships while maintaining editorial independence.',
  },
  '/admin': {
    title: 'Admin | NootropicStacker',
    description: 'NootropicStacker admin console.',
    robots: 'noindex, nofollow',
  },
  '/brand-kit': {
    title: 'Brand Kit | NootropicStacker',
    description: 'Internal brand kit smoke test page.',
    robots: 'noindex, nofollow',
  },
};

// Cache rendered HTML per path — the route table + supplement/article data
// are static for the life of the process, so there's no reason to
// re-run the regex replacements on every request.
const renderCache = new Map();

function renderStaticRoute(pathname) {
  if (renderCache.has(pathname)) return renderCache.get(pathname);
  const entry = STATIC_ROUTES[pathname];
  if (!entry) return null;
  const canonical = `${SITE_URL}${pathname}`;
  const label = entry.title.split(/ — | \| /)[0];
  const html = renderPage({
    title: entry.title,
    description: entry.description,
    canonical: entry.robots?.startsWith('noindex') ? null : canonical,
    robots: entry.robots,
    jsonLd: [ORGANIZATION_JSONLD, buildBreadcrumbJsonLd([
      { name: 'Home', url: `${SITE_URL}/` },
      { name: label, url: canonical },
    ])],
  });
  renderCache.set(pathname, html);
  return html;
}

const supplementById = new Map(supplements.map((s) => [s.id, s]));

function renderSupplementRoute(id) {
  const cacheKey = `/supplements/${id}`;
  if (renderCache.has(cacheKey)) return renderCache.get(cacheKey);
  const supplement = supplementById.get(id);
  if (!supplement) return null;
  const canonical = `${SITE_URL}/supplements/${encodeURIComponent(supplement.id)}`;
  const description = (supplement.description || '').slice(0, 155);
  const html = renderPage({
    title: `${supplement.name} — Effects, Dosage & Safety | NootropicStacker`,
    description,
    canonical,
    jsonLd: buildSupplementJsonLd(supplement),
  });
  renderCache.set(cacheKey, html);
  return html;
}

const articleJsonCache = new Map();

function loadArticle(slug) {
  if (articleJsonCache.has(slug)) return articleJsonCache.get(slug);
  let article = null;
  try {
    const raw = readFileSync(join(staticDir, 'articles', `${slug}.json`), 'utf-8');
    article = JSON.parse(raw);
  } catch {
    article = null;
  }
  articleJsonCache.set(slug, article);
  return article;
}

function renderBlogRoute(slug) {
  const cacheKey = `/blog/${slug}`;
  if (renderCache.has(cacheKey)) return renderCache.get(cacheKey);
  const article = loadArticle(slug);
  if (!article) return null;
  const canonical = `${SITE_URL}/blog/${encodeURIComponent(article.slug)}`;
  const description = (article.excerpt || article.description || '').slice(0, 155);
  const html = renderPage({
    title: `${article.title} | NootropicStacker`,
    description,
    canonical,
    ogType: 'article',
    jsonLd: buildArticleJsonLd(article),
  });
  renderCache.set(cacheKey, html);
  return html;
}

function renderNotFound() {
  if (renderCache.has('__404__')) return renderCache.get('__404__');
  const html = renderPage({
    title: 'Page Not Found | NootropicStacker',
    description: "The page you're looking for doesn't exist. Explore the stack builder, supplement library, or blog instead.",
    canonical: null,
    robots: 'noindex, follow',
    jsonLd: [ORGANIZATION_JSONLD],
  });
  renderCache.set('__404__', html);
  return html;
}

// Routes that render dynamically but aren't worth per-slug titles yet
// (comparison pairs, legacy guide redirects) — still get a self-referencing
// canonical instead of silently inheriting the homepage's.
const GENERIC_DYNAMIC_PREFIXES = {
  '/compare/': { title: 'Compare Nootropics Side-by-Side | NootropicStacker', description: 'Compare any two nootropics side-by-side. Effects, dosage, safety, synergies, and a data-driven verdict.' },
};

function renderGenericDynamicRoute(pathname, meta) {
  if (renderCache.has(pathname)) return renderCache.get(pathname);
  const html = renderPage({
    title: meta.title,
    description: meta.description,
    canonical: `${SITE_URL}${pathname}`,
    jsonLd: [ORGANIZATION_JSONLD],
  });
  renderCache.set(pathname, html);
  return html;
}

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('WARNING: JWT_SECRET not set. Using random secret (sessions will not persist across restarts).');
  return crypto.randomBytes(32).toString('hex');
})();
const COOKIE_NAME = 'ns_session';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

// Force lowercase URLs for SEO consistency (redirect mixed-case paths)
// Exclude /assets/ — Vite generates mixed-case hashes that must be served as-is
app.use((req, res, next) => {
  if (!req.path.startsWith('/assets/') && req.path !== req.path.toLowerCase() && req.method === 'GET') {
    const lowercaseUrl = req.path.toLowerCase() + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
    return res.redirect(301, lowercaseUrl);
  }
  next();
});

// --- Database connection pool ---
const DATABASE_URL = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL;
let pool = null;

if (DATABASE_URL) {
  pool = mysql.createPool({
    uri: DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('MySQL pool created.');
} else {
  console.warn('WARNING: DATABASE_URL not set. Auth and stack saving will not work.');
}

// Auto-run migrations on startup to create any missing tables
async function runMigrations() {
  if (!pool) return;
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        is_premium TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS saved_stacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        supplements JSON NOT NULL,
        user_goals JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        source VARCHAR(50) DEFAULT 'homepage_banner',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Migrations complete.');
  } catch (err) {
    console.error('Migration error (non-fatal):', err.message);
  }
}

// --- Auth middleware ---
function verifyToken(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.clearCookie(COOKIE_NAME);
    return res.status(401).json({ error: 'Invalid session' });
  }
}

function setCookieAndRespond(res, userId, user) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  });
  res.json({ user: { id: user.id, email: user.email, name: user.name } });
}

// Homepage — registered ahead of express.static so it always wins the
// route match, rather than depending on serve-static's index/directory
// fallthrough behavior (which does not reliably skip "/" even with
// `index: false` — it emits a 'directory' redirect event whose outcome
// depends on send/serve-static internals). The template already ships
// correct meta + full JSON-LD for home, so it's served unmodified aside
// from the shared HTML cache header.
app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.type('html').send(INDEX_TEMPLATE);
});

// --- Serve static files ---
// Content-hashed build assets can cache forever; everything else (favicon,
// robots.txt, downloads, etc.) keeps the previous 1-day default.
app.use('/assets', express.static(join(staticDir, 'assets'), {
  maxAge: '1y',
  immutable: true,
  etag: true,
}));
app.use(express.static(staticDir, {
  maxAge: '1d',
  etag: true,
  // Don't auto-serve dist/index.html for directory-style requests (i.e. "/")
  // — that would bypass the catch-all below and its per-route meta
  // injection + Cache-Control override for HTML responses.
  index: false,
}));

// ============================================================
// AUTH ROUTES
// ============================================================

// Register
app.post('/api/auth/register', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not configured' });

  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email format' });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email.toLowerCase().trim(), passwordHash, name || null]
    );
    const user = { id: result.insertId, email: email.toLowerCase().trim(), name: name || null };
    setCookieAndRespond(res, user.id, user);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not configured' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    setCookieAndRespond(res, user.id, user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

// Get current user. Anonymous visitors (no session cookie) are NOT an error
// condition — this fires on every page load, so it returns 200 {user:null}
// instead of 401 to avoid a console error on every anonymous pageview.
// 401 is reserved for a present-but-invalid/expired token.
app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.json({ user: null });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    res.clearCookie(COOKIE_NAME);
    return res.status(401).json({ error: 'Invalid session' });
  }

  if (!pool) return res.json({ user: null });

  try {
    const [rows] = await pool.execute('SELECT id, email, name, is_premium, created_at FROM users WHERE id = ?', [decoded.userId]);
    if (rows.length === 0) return res.status(401).json({ error: 'User not found' });
    const user = rows[0];
    res.json({ user: { id: user.id, email: user.email, name: user.name, isPremium: !!user.is_premium } });
  } catch (err) {
    console.error('Auth/me error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============================================================
// STACK ROUTES
// ============================================================

// Save a stack
app.post('/api/stacks', verifyToken, async (req, res) => {
  const { name, supplements, userGoals } = req.body;
  if (!name || !supplements || !Array.isArray(supplements)) {
    return res.status(400).json({ error: 'Stack name and supplements are required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO saved_stacks (user_id, name, supplements, user_goals) VALUES (?, ?, ?, ?)',
      [req.userId, name, JSON.stringify(supplements), JSON.stringify(userGoals || [])]
    );
    res.json({
      id: result.insertId,
      name,
      supplements,
      userGoals: userGoals || [],
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Save stack error:', err);
    res.status(500).json({ error: 'Failed to save stack' });
  }
});

// List user's saved stacks
app.get('/api/stacks', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, supplements, user_goals, created_at, updated_at FROM saved_stacks WHERE user_id = ? ORDER BY updated_at DESC',
      [req.userId]
    );
    const stacks = rows.map(row => ({
      id: row.id,
      name: row.name,
      supplements: typeof row.supplements === 'string' ? JSON.parse(row.supplements) : row.supplements,
      userGoals: row.user_goals ? (typeof row.user_goals === 'string' ? JSON.parse(row.user_goals) : row.user_goals) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    res.json({ stacks });
  } catch (err) {
    console.error('List stacks error:', err);
    res.status(500).json({ error: 'Failed to load stacks' });
  }
});

// Delete a saved stack
app.delete('/api/stacks/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM saved_stacks WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Stack not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete stack error:', err);
    res.status(500).json({ error: 'Failed to delete stack' });
  }
});

// ============================================================
// NEWSLETTER ROUTES
// ============================================================

app.post('/api/newsletter', async (req, res) => {
  const { email, source = 'homepage_banner' } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  // Try Beehiiv first if configured
  if (BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID) {
    const result = await subscribeToBeehiiv({
      email, source, leadMagnet: '', articleSlug: '',
      referringSite: req.headers['referer'] || 'https://nootropicstacker.com',
      utmParams: { utm_source: 'website', utm_medium: 'newsletter', utm_campaign: 'footer' },
    });
    if (result.success) {
      if (pool) {
        try {
          await pool.execute(
            'INSERT IGNORE INTO newsletter_subscribers (email, source) VALUES (?, ?)',
            [email.toLowerCase().trim(), source]
          );
        } catch { /* non-fatal */ }
      }
      return res.json({ ok: true, message: 'Subscribed!' });
    }
  }
  // Fallback: MySQL-only
  if (pool) {
    try {
      await pool.execute(
        'INSERT IGNORE INTO newsletter_subscribers (email, source) VALUES (?, ?)',
        [email.toLowerCase().trim(), source]
      );
    } catch (err) {
      console.error('Newsletter error:', err);
      return res.status(500).json({ error: 'Failed to subscribe' });
    }
  }
  res.json({ ok: true, message: 'Subscribed!' });
});

// ============================================================
// LEAD MAGNET EMAIL CAPTURE — Beehiiv + MySQL fallback
// ============================================================

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
const BEEHIIV_DOUBLE_OPT_IN = process.env.BEEHIIV_DOUBLE_OPT_IN !== 'false';
const BEEHIIV_API_BASE = process.env.BEEHIIV_API_BASE || 'https://api.beehiiv.com/v2';
const LEAD_MAGNET_PDF_PATH = '/lead-magnet-v2.pdf';

if (BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID) {
  console.log(`Beehiiv configured (pub: ${BEEHIIV_PUBLICATION_ID}, double-opt-in: ${BEEHIIV_DOUBLE_OPT_IN})`);
} else {
  console.warn('Beehiiv NOT configured — set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID for email capture.');
}

// Local JSONL lead queue — a last-resort backstop so subscribers are never
// silently dropped when neither Beehiiv nor MySQL is configured (e.g. local
// dev, or a misconfigured deploy). One JSON object per line.
const LEADS_DIR = join(__dirname, 'data');
const LEADS_JSONL_PATH = join(LEADS_DIR, 'subscribers.jsonl');
try {
  mkdirSync(LEADS_DIR, { recursive: true });
} catch (err) {
  console.error('Could not create data/ dir for lead queue:', err.message);
}

async function queueLeadToJsonl({ email, source, leadMagnet, articleSlug }) {
  const line = JSON.stringify({
    email: email.toLowerCase().trim(),
    source: source || 'website',
    leadMagnet: leadMagnet || null,
    articleSlug: articleSlug || null,
    capturedAt: new Date().toISOString(),
  });
  try {
    await appendFileAsync(LEADS_JSONL_PATH, line + '\n', 'utf-8');
  } catch (err) {
    console.error('Lead JSONL queue error:', err.message);
  }
}

// Simple in-memory rate limiter (per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_MS = 5000;

function checkRateLimit(ip) {
  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last && now - last < RATE_LIMIT_MS) {
    return false;
  }
  rateLimitMap.set(ip, now);
  return true;
}

/**
 * Subscribe an email via Beehiiv v2 API.
 * Returns { success: boolean, message: string, beehiivId?: string }.
 */
async function subscribeToBeehiiv({ email, source, leadMagnet, articleSlug, referringSite, utmParams }) {
  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
    return { success: false, message: 'Beehiiv not configured' };
  }

  const url = `${BEEHIIV_API_BASE}/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`;

  const body = {
    email: email.toLowerCase().trim(),
    send_welcome_email: true,
    utm_source: utmParams?.utm_source || 'nootropicstacker',
    utm_medium: utmParams?.utm_medium || 'website',
    utm_campaign: utmParams?.utm_campaign || 'lead_magnet',
    referring_site: referringSite || 'https://nootropicstacker.com',
    custom_fields: {
      signup_source: source || 'website',
      lead_magnet: leadMagnet || '',
      article_slug: articleSlug || '',
    },
  };

  if (!BEEHIIV_DOUBLE_OPT_IN) {
    body.preferences = { double_opt_in: false };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: 'Check your inbox for the confirmation email!', beehiivId: data?.data?.id };
    }

    // Beehiiv returns 400 for duplicate — treat as success
    if (response.status === 400 && data?.errors?.some(e => e?.includes?.('already'))) {
      return { success: true, message: 'You\'re already subscribed! Check your inbox.' };
    }

    console.error('Beehiiv subscription error:', response.status, JSON.stringify(data));
    return { success: false, message: 'Subscription failed. Please try again.' };
  } catch (err) {
    console.error('Beehiiv API error:', err.message);
    return { success: false, message: 'Network error. Please try again.' };
  }
}

app.post('/api/email/subscribe', async (req, res) => {
  const { email, source = 'lead_magnet', leadMagnet, articleSlug, hp_field } = req.body;

  // Honeypot: if robot filled hidden field, silently accept
  if (hp_field) {
    return res.json({ ok: true, message: 'Subscribed!' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // Rate limit
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too fast. Please wait a moment.' });
  }

  const utmParams = {
    utm_source: source === 'lead_magnet' ? 'lead_magnet' : 'website',
    utm_medium: 'email_capture',
    utm_campaign: leadMagnet || articleSlug || 'general',
  };

  // Try Beehiiv first
  if (BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID) {
    const beehiivResult = await subscribeToBeehiiv({
      email, source, leadMagnet, articleSlug,
      referringSite: req.headers['referer'] || 'https://nootropicstacker.com',
      utmParams,
    });

    if (beehiivResult.success) {
      // Also save to MySQL as backup
      if (pool) {
        try {
          await pool.execute(
            'INSERT IGNORE INTO newsletter_subscribers (email, source) VALUES (?, ?)',
            [email.toLowerCase().trim(), source]
          );
        } catch { /* non-fatal */ }
      }

      return res.json({
        ok: true,
        message: beehiivResult.message,
        downloadUrl: leadMagnet ? LEAD_MAGNET_PDF_PATH : null,
      });
    }
  }

  // Fallback: MySQL-only (direct download if lead magnet)
  if (pool) {
    try {
      await pool.execute(
        'INSERT IGNORE INTO newsletter_subscribers (email, source) VALUES (?, ?)',
        [email.toLowerCase().trim(), source]
      );
    } catch (err) {
      console.error('Email subscribe MySQL error:', err.message);
    }
  }

  // Neither Beehiiv nor MySQL configured — queue to disk so the lead isn't
  // silently dropped server-side.
  if (!BEEHIIV_API_KEY && !pool) {
    await queueLeadToJsonl({ email, source, leadMagnet, articleSlug });
  }

  res.json({
    ok: true,
    message: BEEHIIV_API_KEY
      ? 'Subscribed! (Check your inbox.)'
      : 'Subscribed! Download your guide below.',
    downloadUrl: leadMagnet ? LEAD_MAGNET_PDF_PATH : null,
  });
});

// ============================================================
// CONTACT ROUTES
// ============================================================

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!pool) {
    return res.json({ ok: true });
  }
  try {
    await pool.execute(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name.slice(0, 100), email.toLowerCase().trim(), message.slice(0, 2000)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// ============================================================
// CLICK TRACKING (privacy-friendly, no PII stored)
// ============================================================

app.post('/api/track/click', async (req, res) => {
  const { supplementId, vendor, page } = req.body;
  if (!supplementId || !vendor) return res.json({ ok: true }); // fail silently
  if (!pool) return res.json({ ok: true });
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS affiliate_clicks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        supplement_id VARCHAR(100) NOT NULL,
        vendor VARCHAR(50) NOT NULL,
        page VARCHAR(100),
        clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_supplement (supplement_id),
        INDEX idx_vendor (vendor)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await pool.execute(
      'INSERT INTO affiliate_clicks (supplement_id, vendor, page) VALUES (?, ?, ?)',
      [supplementId.slice(0, 100), vendor.slice(0, 50), (page || 'unknown').slice(0, 100)]
    );
  } catch { /* non-fatal */ }
  res.json({ ok: true });
});

// ============================================================
// ADMIN AUTH — single-owner, no external OAuth dependency
// Env var: ADMIN_SECRET (long random string set on Railway)
// ============================================================

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const ADMIN_COOKIE = 'ns_admin';

function verifyAdmin(req, res, next) {
  const token = req.cookies[ADMIN_COOKIE];
  if (!token) return res.status(401).json({ error: 'Admin auth required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.admin) return res.status(401).json({ error: 'Not an admin session' });
    next();
  } catch {
    res.clearCookie(ADMIN_COOKIE);
    return res.status(401).json({ error: 'Invalid admin session' });
  }
}

app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_SECRET) return res.status(503).json({ error: 'Admin auth not configured (ADMIN_SECRET missing)' });
  const { secret } = req.body;
  if (!secret || secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Invalid secret' });
  }
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
  res.json({ ok: true });
});

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie(ADMIN_COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/me', verifyAdmin, (_req, res) => {
  res.json({ admin: true });
});

app.get('/api/admin/stats', verifyAdmin, async (_req, res) => {
  if (!pool) return res.json({ subscribers: 0, users: 0, clicks: 0, messages: 0 });
  try {
    const [[{ subscribers }]] = await pool.execute('SELECT COUNT(*) AS subscribers FROM newsletter_subscribers');
    const [[{ users }]] = await pool.execute('SELECT COUNT(*) AS users FROM users');
    const [[{ messages }]] = await pool.execute('SELECT COUNT(*) AS messages FROM contact_messages');
    let clicks = 0;
    try {
      const [[row]] = await pool.execute('SELECT COUNT(*) AS clicks FROM affiliate_clicks');
      clicks = row.clicks;
    } catch { /* table may not exist yet */ }
    res.json({ subscribers, users, clicks, messages });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

app.get('/api/admin/leads', verifyAdmin, async (_req, res) => {
  if (!pool) return res.json({ leads: [] });
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, source, created_at FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 1000'
    );
    res.json({ leads: rows });
  } catch (err) {
    console.error('Admin leads error:', err);
    res.status(500).json({ error: 'Failed to load leads' });
  }
});

app.get('/api/admin/users', verifyAdmin, async (_req, res) => {
  if (!pool) return res.json({ users: [] });
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, name, is_premium, created_at FROM users ORDER BY created_at DESC LIMIT 1000'
    );
    res.json({ users: rows });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

app.get('/api/admin/clicks', verifyAdmin, async (_req, res) => {
  if (!pool) return res.json({ clicks: [] });
  try {
    const [rows] = await pool.execute(
      'SELECT supplement_id, vendor, page, COUNT(*) AS count FROM affiliate_clicks GROUP BY supplement_id, vendor, page ORDER BY count DESC LIMIT 200'
    ).catch(() => [[]]);
    res.json({ clicks: rows });
  } catch {
    res.json({ clicks: [] });
  }
});



// ============================================================
// PRERENDERED PAGE ROUTING — serve static HTML for SEO
// ============================================================
function findPrerenderedFile(cleanPath) {
  const candidate = join(staticDir, cleanPath, 'index.html');
  if (existsSync(candidate)) return candidate;

  // Check without trailing index.html (direct file reference)
  if (!cleanPath.endsWith('/index.html') && !extname(cleanPath)) {
    const alt = join(staticDir, cleanPath);
    if (existsSync(alt) && statSync(alt).isFile()) return alt;
  }

  return null;
}

// File extensions we never want to fall through to the SPA shell — if the
// asset is missing, return 404 instead of HTML so og-image.png and friends
// don't masquerade as text/html when absent.
const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico',
  '.pdf', '.zip', '.txt', '.xml', '.json',
  '.woff', '.woff2', '.ttf', '.otf',
  '.mp4', '.webm', '.mp3',
  '.css', '.js', '.map',
]);

const HTML_CACHE_CONTROL = 'public, max-age=300';

app.get('/{*path}', (req, res) => {
  const cleanPath = req.path === '/' ? '' : req.path.replace(/\/$/, '');
  const ext = extname(cleanPath).toLowerCase();

  // For known asset extensions, never fall through to SPA shell.
  if (ext && BINARY_EXTENSIONS.has(ext)) {
    return res.status(404).type('text/plain').send('Not found');
  }

  // Try prerendered HTML file for this path (legacy path; prerender no-ops
  // in production today, but this stays as a no-cost fallback in case a
  // future build produces real per-route files again).
  const prerendered = findPrerenderedFile(cleanPath);
  if (prerendered) {
    return res.sendFile(prerendered);
  }

  const pathname = req.path === '' ? '/' : req.path;
  res.set('Cache-Control', HTML_CACHE_CONTROL);

  // Homepage — template already ships correct meta + full JSON-LD, serve as-is.
  if (pathname === '/') {
    return res.type('html').send(INDEX_TEMPLATE);
  }

  // Static route table.
  const staticHtml = renderStaticRoute(pathname);
  if (staticHtml) {
    return res.type('html').send(staticHtml);
  }

  // /supplements/:id
  const supplementMatch = pathname.match(/^\/supplements\/([^/]+)$/);
  if (supplementMatch) {
    const html = renderSupplementRoute(decodeURIComponent(supplementMatch[1]));
    if (html) return res.type('html').send(html);
    return res.status(404).type('html').send(renderNotFound());
  }

  // /blog/:slug
  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const html = renderBlogRoute(decodeURIComponent(blogMatch[1]));
    if (html) return res.type('html').send(html);
    return res.status(404).type('html').send(renderNotFound());
  }

  // /guides/:slug is a legacy alias the client redirects to /blog/:slug via
  // <Navigate> — do that server-side too so non-JS crawlers get a real 301
  // instead of an empty SPA shell.
  const guideMatch = pathname.match(/^\/guides\/([^/]+)$/);
  if (guideMatch) {
    return res.redirect(301, `/blog/${encodeURIComponent(guideMatch[1])}`);
  }

  // Generic dynamic routes (compare pairs, legacy guide redirects) — real
  // content but not worth per-slug titles yet; still get a self-canonical.
  for (const [prefix, meta] of Object.entries(GENERIC_DYNAMIC_PREFIXES)) {
    if (pathname.startsWith(prefix) && pathname.length > prefix.length) {
      return res.type('html').send(renderGenericDynamicRoute(pathname, meta));
    }
  }

  // Unknown route — 404 status, SPA shell so the client can render its own
  // not-found UI, generic not-found meta, no canonical.
  res.status(404).type('html').send(renderNotFound());
});

if (isDirectRun) {
  app.listen(PORT, async () => {
    console.log(`NootropicStacker running on port ${PORT}`);
    await runMigrations();
  });
}
