import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
app.use((req, res, next) => {
  if (req.path !== req.path.toLowerCase() && req.method === 'GET') {
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
app.use(express.static(join(__dirname, 'dist'), {
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
// SPA FALLBACK — must be last
// ============================================================
app.get('/{*path}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`NootropicStacker running on port ${PORT}`);
});
