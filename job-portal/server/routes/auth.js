const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

function makeToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, "user")', [name, email, hash]);
    const user = { id: result.insertId, name, email, role: 'user' };
    res.json({ token: makeToken(user), user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND role = "user"', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const user = { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role };
    res.json({ token: makeToken(user), user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const user = { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role };
    res.json({ token: makeToken(user), user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// one-time helper: creates a default admin if none exists (email: admin@coimbatorejobs.in / password: admin123)
router.post('/admin/bootstrap', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE role = "admin"');
    if (rows.length) return res.json({ message: 'Admin already exists' });
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, "admin")', ['Admin', 'admin@coimbatorejobs.in', hash]);
    res.json({ message: 'Admin created: admin@coimbatorejobs.in / admin123' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
