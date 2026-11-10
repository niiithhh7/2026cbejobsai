const router = require('express').Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { keyword, location, industry } = req.query;
    let sql = `SELECT e.*, (SELECT COUNT(*) FROM jobs j WHERE j.employer_id = e.id) as open_jobs FROM employers e WHERE 1=1`;
    const params = [];
    if (keyword) { sql += ' AND e.company_name LIKE ?'; params.push(`%${keyword}%`); }
    if (location) { sql += ' AND e.location LIKE ?'; params.push(`%${location}%`); }
    if (industry) { sql += ' AND e.industry = ?'; params.push(industry); }
    sql += ' ORDER BY e.created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employers WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Employer not found' });
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE employer_id = ? ORDER BY posted_at DESC', [req.params.id]);
    res.json({ ...rows[0], jobs });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
