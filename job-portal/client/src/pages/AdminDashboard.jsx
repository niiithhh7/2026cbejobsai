import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import './AdminDashboard.css';

const JOB_TYPES = ['Freelancer', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Temporary'];

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', location: '', salary_range: '', job_type: 'Full-time', industry: '', description: '' });
  const [error, setError] = useState('');

  function load() { api.get('/jobs').then(setJobs).catch(() => {}); }
  useEffect(load, []);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/jobs', form);
      setShowForm(false);
      setForm({ title: '', company: '', location: '', salary_range: '', job_type: 'Full-time', industry: '', description: '' });
      load();
    } catch (e2) { setError(e2.message); }
  }

  return (
    <div className="container section">
      <div className="admin-header">
        <h2 className="section-title">Admin Dashboard</h2>
        <button className="btn btn-accent" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close' : 'Post a Job'}</button>
      </div>

      {showForm && (
        <form className="card admin-form" onSubmit={submit}>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input required placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input placeholder="Salary Range" value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} />
          <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}>
            {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <textarea placeholder="Description" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn btn-primary" type="submit">Post Job</button>
          {error && <p className="auth-error">{error}</p>}
        </form>
      )}

      <table className="admin-table">
        <thead><tr><th>Title</th><th>Company</th><th>Location</th><th>Type</th><th>Applicants</th></tr></thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>{j.title}</td>
              <td>{j.company_name}</td>
              <td>{j.location}</td>
              <td>{j.job_type}</td>
              <td><Link to={`/admin/jobs/${j.id}/applicants`} className="btn btn-outline">View Applicants</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
