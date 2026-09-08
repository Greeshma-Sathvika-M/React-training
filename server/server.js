const path    = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const pool     = require('./db');

const app    = express();
const PORT   = process.env.PORT   || 5000;
const SECRET = process.env.JWT_SECRET || 'gmart_secret';

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── JWT auth middleware ───────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }
  try {
    req.user = jwt.verify(header.slice(7), SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// ── Helper: build safe user object (no password) ─────────────────────────────
function safeUser(row) {
  const { password, ...u } = row;
  // Parse JSON fields stored as TEXT
  u.orders  = typeof u.orders  === 'string' ? JSON.parse(u.orders  || '[]') : (u.orders  || []);
  u.address = u.address || '';
  return u;
}

// ════════════════════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ════════════════════════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, phone, address, city, state, zip, country, orders, created_at)
       VALUES (?, ?, ?, '', '', '', '', '', 'US', '[]', NOW())`,
      [name.trim(), email.toLowerCase(), hashed]
    );
    const userId = result.insertId;
    const [newRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = safeUser(newRows[0]);
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const row  = rows[0];
    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });
    const user  = safeUser(row);
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me  — verify token & return fresh user
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: safeUser(rows[0]) });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  PROFILE ROUTES
// ════════════════════════════════════════════════════════════════════════════

// PUT /api/profile  — update profile fields
app.put('/api/profile', authenticate, async (req, res) => {
  const allowed = ['name', 'phone', 'address', 'city', 'state', 'zip', 'country'];
  const fields  = [];
  const values  = [];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }
  if (fields.length === 0) return res.status(400).json({ error: 'No valid fields to update.' });
  values.push(req.user.id);
  try {
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    res.json({ user: safeUser(rows[0]) });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/profile/password  — change password
app.put('/api/profile/password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both currentPassword and newPassword are required.' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) return res.status(401).json({ error: 'Current password is incorrect.' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  ORDERS ROUTES
// ════════════════════════════════════════════════════════════════════════════

// POST /api/orders  — place a new order
app.post('/api/orders', authenticate, async (req, res) => {
  const { items, total, shipping, paymentMethod, paymentDetails } = req.body;
  if (!items || !total) {
    return res.status(400).json({ error: 'items and total are required.' });
  }
  const order = {
    id            : 'ORD-' + Date.now().toString(36).toUpperCase(),
    date          : new Date().toISOString(),
    status        : paymentMethod === 'cod' ? 'Confirmed (Cash on Delivery)' : 'Processing',
    total,
    paymentMethod : paymentMethod || 'card',
    paymentDetails: paymentDetails || {},
    items         : items.length,
    itemDetails   : items.map(i => ({
      id       : i.id,
      title    : i.title,
      thumbnail: i.thumbnail,
      price    : i.price,
      qty      : i.qty,
    })),
    shipping,
  };
  try {
    // Store order in orders table
    await pool.query(
      `INSERT INTO orders (order_id, user_id, status, total, payment_method, payment_details, items_count, item_details, shipping, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        order.id,
        req.user.id,
        order.status,
        order.total,
        order.paymentMethod,
        JSON.stringify(order.paymentDetails),
        order.items,
        JSON.stringify(order.itemDetails),
        JSON.stringify(order.shipping),
      ]
    );
    res.status(201).json({ order });
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ error: 'Server error placing order.' });
  }
});

// GET /api/orders  — get orders for logged-in user
app.get('/api/orders', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    const orders = rows.map(r => ({
      id            : r.order_id,
      date          : r.created_at,
      status        : r.status,
      total         : parseFloat(r.total),
      paymentMethod : r.payment_method,
      paymentDetails: JSON.parse(r.payment_details || '{}'),
      items         : r.items_count,
      itemDetails   : JSON.parse(r.item_details   || '[]'),
      shipping      : JSON.parse(r.shipping        || '{}'),
    }));
    res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  WISHLIST ROUTES
// ════════════════════════════════════════════════════════════════════════════

// GET /api/wishlist
app.get('/api/wishlist', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM wishlist WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );
    const items = rows.map(r => JSON.parse(r.product_data));
    res.json({ items });
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/wishlist  — add item
app.post('/api/wishlist', authenticate, async (req, res) => {
  const { product } = req.body;
  if (!product || !product.id) return res.status(400).json({ error: 'product is required.' });
  try {
    await pool.query(
      `INSERT INTO wishlist (user_id, product_id, product_data, added_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE product_data = VALUES(product_data)`,
      [req.user.id, product.id, JSON.stringify(product)]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Add wishlist error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/wishlist/:productId  — remove item
app.delete('/api/wishlist/:productId', authenticate, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Remove wishlist error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  G-Mart API server running on http://localhost:${PORT}`);
  console.log(`    Health check: http://localhost:${PORT}/api/health`);
});
