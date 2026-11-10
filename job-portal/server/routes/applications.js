const router = require('express').Router();
const pool = require('../config/db');
const { auth, requireAdmin } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { job_id, resume_url } = req.body;
    const [existing] = await pool.query('SELECT id FROM applications WHERE job_id = ? AND user_id = ?', [job_id, req.user.id]);
    if (existing.length) return res.status(409).json({ error: 'Already applied to this job' });
    const [result] = await pool.query('INSERT INTO applications (job_id, user_id, resume_url) VALUES (?, ?, ?)', [job_id, req.user.id, resume_url || null]);
    res.json({ id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/mine', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, j.title, j.location, e.company_name FROM applications a
       JOIN jobs j ON a.job_id = j.id LEFT JOIN employers e ON j.employer_id = e.id
       WHERE a.user_id = ? ORDER BY a.applied_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
