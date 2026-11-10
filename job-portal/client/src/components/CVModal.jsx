import { useState } from 'react';
import { api } from '../api';
import './CVModal.css';

export default function CVModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState('strengths');

  async function handleFile(f) {
    setFile(f);
    setError('');
    setResult(null);
    if (!f) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', f);
      const data = await api.upload('/resume/analyze', formData);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const scoreLabel = result ? (result.score >= 70 ? 'Strong Resume' : result.score < 50 ? 'Needs Improvement' : 'Good') : '';
  const scoreColor = result ? (result.score >= 70 ? '#16794f' : result.score < 50 ? '#dc2626' : '#f59e0b') : '';

  return (
    <div className="cv-modal-overlay" onClick={onClose}>
      <div className="cv-modal card" onClick={(e) => e.stopPropagation()}>
        <button className="cv-modal-close" onClick={onClose}>✕</button>
        <h2>Upload Your CV</h2>
        <p className="cv-modal-subtitle">Get your ATS score & analysis</p>

        <label className="cv-dropzone">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={(e) => handleFile(e.target.files[0])} />
          {file ? <span>{file.name}</span> : <span>Drop your resume here or click to browse (PDF, JPG, PNG)</span>}
        </label>

        {loading && <p className="cv-status">Analyzing your resume…</p>}
        {error && <p className="cv-status cv-error">{error}</p>}

        {result && (
          <div className="cv-result">
            <div className="cv-score-row">
              <div className="cv-score-number" style={{ color: scoreColor }}>{result.score}</div>
              <div>
                <div className="cv-score-label" style={{ color: scoreColor }}>{scoreLabel}</div>
                <div className="cv-score-bar-bg">
                  <div className="cv-score-bar-fill" style={{ width: `${result.score}%`, background: scoreColor }} />
                </div>
              </div>
            </div>

            <h4>Summary</h4>
            <p className="cv-summary">{result.summary}</p>

            <div className="cv-tabs">
              <button className={tab === 'strengths' ? 'active' : ''} onClick={() => setTab('strengths')}>✅ Strengths</button>
              <button className={tab === 'improvements' ? 'active' : ''} onClick={() => setTab('improvements')}>⚠️ Areas to Improve</button>
            </div>
            <ul className="cv-list">
              {(tab === 'strengths' ? result.strengths : result.improvements).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
