import express from 'express';
import { fileURLToPath } from 'url';
import { basename, dirname, join, resolve } from 'path';
import { existsSync } from 'fs';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

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

// --- Serve static files ---
app.use(express.static(staticDir, {
  maxAge: '1d',
  etag: true
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

// Get current user
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, email, name, is_premium, created_at FROM users WHERE id = ?', [req.userId]);
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
const LEAD_MAGNET_PDF_PATH = '/downloads/10-stacks-v1.pdf';

if (BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID) {
  console.log(`Beehiiv configured (pub: ${BEEHIIV_PUBLICATION_ID}, double-opt-in: ${BEEHIIV_DOUBLE_OPT_IN})`);
} else {
  console.warn('Beehiiv NOT configured — set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID for email capture.');
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
// SPA FALLBACK — must be last
// ============================================================
app.get('/{*path}', (req, res) => {
  res.sendFile(join(staticDir, 'index.html'));
});

if (isDirectRun) {
  app.listen(PORT, async () => {
    console.log(`NootropicStacker running on port ${PORT}`);
    await runMigrations();
  });
}
