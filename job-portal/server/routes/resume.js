const router = require('express').Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const pool = require('../config/db');
const { optionalAuth } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const SYSTEM_PROMPT = 'You are an ATS resume analyzer. Given resume text, return ONLY valid JSON, no markdown, no prose: {"score": number 0-100, "summary": string, "strengths": string[], "improvements": string[]}';

async function callOpenRouter(text) {
  let lastRes = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Coimbatore Jobs'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text }
        ],
        temperature: 0.2
      })
    });
    lastRes = res;
    if (res.status !== 429) return res;
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
  }
  return lastRes;
}

router.post('/analyze', optionalAuth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF is supported for text analysis. OCR for images is not implemented.' });
    }

    const parsed = await pdfParse(req.file.buffer);
    const text = (parsed.text || '').replace(/\s+/g, ' ').trim().slice(0, 3000);
    if (!text) return res.status(400).json({ error: 'Could not extract text from PDF' });

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not set in server/.env' });
    }

    let aiRes;
    try {
      aiRes = await callOpenRouter(text);
    } catch (networkErr) {
      return res.status(502).json({ error: `Could not reach OpenRouter: ${networkErr.message}` });
    }

    const data = await aiRes.json();

    if (!aiRes.ok) {
      console.error('OpenRouter error:', aiRes.status, JSON.stringify(data));
      if (aiRes.status === 429) {
        return res.status(429).json({ error: 'OpenRouter is rate-limited right now. Please wait a minute and try again.' });
      }
      return res.status(502).json({ error: `OpenRouter error (${aiRes.status}): ${data?.error?.message || 'Unknown error'}` });
    }

    const raw = data?.choices?.[0]?.message?.content || '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error('Could not parse AI content:', raw);
      return res.status(502).json({ error: 'AI returned an unparsable response. Please try again.' });
    }

    const score = Math.max(0, Math.min(100, Number(result.score) || 0));
    const summary = result.summary || '';
    const strengths = Array.isArray(result.strengths) ? result.strengths : [];
    const improvements = Array.isArray(result.improvements) ? result.improvements : [];

    await pool.query(
      'INSERT INTO resume_analyses (user_id, file_name, score, summary, strengths, improvements) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user?.id || null, req.file.originalname, score, summary, JSON.stringify(strengths), JSON.stringify(improvements)]
    );

    res.json({ file_name: req.file.originalname, score, summary, strengths, improvements });
  } catch (e) {
    console.error('Resume analyze error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;