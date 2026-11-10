const router = require('express').Router();
const pool = require('../config/db');

router.post('/', async (req, res) => {
  try {
    const { full_name, email, subject, message } = req.body;
    if (!full_name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
    await pool.query('INSERT INTO contact_messages (full_name, email, subject, message) VALUES (?, ?, ?, ?)', [full_name, email, subject, message]);
    res.json({ message: 'Message sent' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
