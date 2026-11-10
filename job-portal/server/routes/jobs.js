const router = require('express').Router();
const pool = require('../config/db');
const { auth, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { keyword, location, industry, job_type, sort } = req.query;
    let sql = `SELECT j.*, e.company_name, e.logo_url FROM jobs j LEFT JOIN employers e ON j.employer_id = e.id WHERE 1=1`;
    const params = [];
    if (keyword) { sql += ' AND (j.title LIKE ? OR j.description LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (location) { sql += ' AND j.location LIKE ?'; params.push(`%${location}%`); }
    if (industry) { sql += ' AND j.industry = ?'; params.push(industry); }
    if (job_type) { sql += ' AND j.job_type = ?'; params.push(job_type); }
    sql += sort === 'oldest' ? ' ORDER BY j.posted_at ASC' : ' ORDER BY j.posted_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/stats', async (req, res) => {
  try {
    const [[{ jobCount }]] = await pool.query('SELECT COUNT(*) as jobCount FROM jobs');
    const [[{ companyCount }]] = await pool.query('SELECT COUNT(*) as companyCount FROM employers');
    res.json({ jobCount, companyCount });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT j.*, e.company_name, e.logo_url FROM jobs j LEFT JOIN employers e ON j.employer_id = e.id WHERE j.id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { title, company, location, salary_range, job_type, industry, description } = req.body;
    let employer_id = null;
    if (company) {
      const [existing] = await pool.query('SELECT id FROM employers WHERE company_name = ?', [company]);
      if (existing.length) employer_id = existing[0].id;
      else {
        const [result] = await pool.query('INSERT INTO employers (company_name, industry, location) VALUES (?, ?, ?)', [company, industry, location]);
        employer_id = result.insertId;
      }
    }
    const [result] = await pool.query(
      'INSERT INTO jobs (employer_id, title, location, salary_range, job_type, industry, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [employer_id, title, location, salary_range, job_type, industry, description]
    );
    res.json({ id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id/applicants', auth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.status, a.applied_at, a.resume_url, u.name, u.email
       FROM applications a JOIN users u ON a.user_id = u.id WHERE a.job_id = ? ORDER BY a.applied_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
