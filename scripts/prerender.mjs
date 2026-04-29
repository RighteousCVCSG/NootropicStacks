import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { createReadStream, statSync } from 'fs';
import { extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const SRC = join(ROOT, 'src');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain',
  '.xml': 'text/xml',
};

function serveDir(baseDir) {
  return createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let filePath = join(baseDir, url.pathname === '/' ? '' : url.pathname);

    // If path doesn't exist, try index.html
    if (!existsSync(filePath)) {
      filePath = join(baseDir, 'index.html');
    }

    // If path is a directory, serve index.html from it
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html');
    }

    if (!existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  });
}

function parseBlogArticles() {
  const content = readFileSync(join(SRC, 'data', 'blogArticlesIndex.js'), 'utf8');
  const slugs = [];
  const regex = /"slug":\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

function parseSupplementIds() {
  const content = readFileSync(join(SRC, 'data', 'supplements.js'), 'utf8');
  const ids = [];
  const regex = /id:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

const STATIC_ROUTES = [
  '/',
  '/quiz',
  '/supplements',
  '/families',
  '/blog',
  '/news',
  '/faq',
  '/glossary',
  '/contact',
  '/best-nootropics',
  '/best-stacks',
  '/reviews',
  '/compare-supplements',
  '/nootropics-for-focus',
  '/nootropics-for-anxiety',
  '/start-here',
  '/downloads/10-stacks',
  '/downloads/10-stacks-v1',
  '/stacks',
  '/celebrity-stacks',
  '/videos',
  '/research-library',
  '/brand-kit',
];

function buildRoutes() {
  const routes = new Set(STATIC_ROUTES);

  const slugs = parseBlogArticles();
  for (const slug of slugs) {
    routes.add(`/blog/${slug}`);
  }

  const ids = parseSupplementIds();
  for (const id of ids) {
    routes.add(`/supplements/${id}`);
  }

  return [...routes].sort();
}

async function prerender() {
  console.log('=== Prerender ===\n');

  if (!existsSync(DIST)) {
    console.error('ERROR: dist/ directory not found. Run vite build first.');
    process.exit(1);
  }

  // Graceful skip if puppeteer-core is not installed (e.g., Railway build)
  try {
    await import('puppeteer-core');
  } catch {
    console.warn('WARNING: puppeteer-core not installed. Skipping prerender.');
    console.warn('Install with: pnpm add -D puppeteer-core');
    process.exit(0);
  }

  const envChrome = process.env.CHROME_PATH;
  const chromePaths = [
    ...(envChrome ? [envChrome] : []),
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
    '/home/chris/.agent-browser/browsers/chrome-148.0.7778.56/chrome',
  ].filter(Boolean);

  let executablePath = null;
  for (const p of chromePaths) {
    if (existsSync(p)) {
      executablePath = p;
      break;
    }
  }

  if (!executablePath) {
    console.log('Chrome/Chromium not found — attempting to download via @puppeteer/browsers...');
    try {
      const { install, resolveBuildId, detectBrowserPlatform } = await import('@puppeteer/browsers');
      const cacheDir = join(ROOT, '.browser-cache');
      mkdirSync(cacheDir, { recursive: true });
      const platform = detectBrowserPlatform();
      if (!platform) throw new Error('Could not detect platform');
      const buildId = await resolveBuildId('chrome', platform, 'latest');
      console.log(`  Resolved Chrome build: ${buildId} (${platform})`);
      const DOWNLOAD_HOST = process.env.CHROME_DOWNLOAD_HOST || 'https://storage.googleapis.com/chrome-for-testing-public';
      const installed = await install({
        browser: 'chrome',
        buildId,
        platform,
        cacheDir,
        detectDownloadHost: () => DOWNLOAD_HOST,
      });
      executablePath = installed.executablePath;
      console.log(`  Downloaded Chrome to: ${executablePath}`);
    } catch (downloadErr) {
      console.warn(`WARNING: Could not download Chrome (${downloadErr.message}). Skipping prerender.`);
      process.exit(0);
    }
  }

  // Install missing system libraries needed by downloaded Chrome
  try {
    const { execSync } = await import('child_process');
    execSync(
      'apt-get update -qq 2>/dev/null; apt-get install -y -qq --no-install-recommends libglib2.0-0 libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 > /dev/null 2>&1',
      { timeout: 120000 }
    );
    console.log('  System libraries installed for Chrome.');
  } catch (libErr) {
    console.warn(`Warning: could not install system libs (${libErr.message}) — Chrome may fail to launch.`);
  }

  const routes = buildRoutes();
  console.log(`Routes to prerender: ${routes.length}`);
  const blogCount = routes.filter(r => r.startsWith('/blog/') && r !== '/blog').length;
  const suppCount = routes.filter(r => r.startsWith('/supplements/') && r !== '/supplements').length;
  const staticCount = routes.length - blogCount - suppCount;
  console.log(`  Static pages: ${staticCount}`);
  console.log(`  Blog articles: ${blogCount}`);
  console.log(`  Supplement pages: ${suppCount}\n`);

  const server = serveDir(DIST);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Server started on ${baseUrl}\n`);

  let browser;
  try {
    const { launch } = await import('puppeteer-core');

    browser = await launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process'],
    });

    let page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (compatible; NootropicStacker-Prerender/1.0; +https://nootropicstacker.com)');

    let rendered = 0;
    let failed = 0;

    for (const route of routes) {
      const url = `${baseUrl}${route}`;
      const destDir = join(DIST, route === '/' ? '' : route);
      const destFile = join(destDir, 'index.html');

      let lastErr;
      for (let attempt = 0; attempt < 2; attempt++) {
        if (attempt > 0) {
          try { await page.close(); } catch {}
          page = await browser.newPage();
          await page.setViewport({ width: 1440, height: 900 });
          await page.setUserAgent('Mozilla/5.0 (compatible; NootropicStacker-Prerender/1.0; +https://nootropicstacker.com)');
        }
        try {
          await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

          if (route.startsWith('/blog/') && route !== '/blog') {
            await new Promise(r => setTimeout(r, 1500));
          }

          const html = await page.content();

          mkdirSync(destDir, { recursive: true });
          writeFileSync(destFile, html, 'utf8');

          rendered++;
          if (rendered % 25 === 0) {
            console.log(`  Progress: ${rendered}/${routes.length}`);
          }
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
        }
      }

      if (lastErr) {
        failed++;
        console.error(`  FAIL: ${route} — ${lastErr.message}`);
      }
    }

    console.log(`\nDone: ${rendered} rendered, ${failed} failed out of ${routes.length} routes`);
    return { rendered, failed, total: routes.length };
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

prerender().then(result => {
  process.exit(result && result.failed > 0 && result.rendered === 0 ? 1 : 0);
}).catch(err => {
  console.error('Prerender fatal error:', err);
  process.exit(0);
});
