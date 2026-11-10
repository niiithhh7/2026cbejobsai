import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, getUser } from '../api';
import JobCard from '../components/JobCard';
import './JobList.css';

const JOB_TYPES = ['Freelancer', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Temporary'];

export default function JobList() {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: params.get('keyword') || '',
    location: params.get('location') || '',
    industry: params.get('industry') || '',
    job_type: ''
  });
  const [sort, setSort] = useState('newest');
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const user = getUser();

  async function load() {
    const query = new URLSearchParams({ ...filters, sort }).toString();
    const data = await api.get(`/jobs?${query}`).catch(() => []);
    setJobs(data);
  }

  useEffect(() => { load(); }, [sort]);

  function clearAll() {
    setFilters({ keyword: '', location: '', industry: '', job_type: '' });
  }

  async function apply(job) {
    if (!user) return setMessage('Please log in as a job seeker to apply.');
    try {
      await api.post('/applications', { job_id: job.id });
      setMessage(`Applied to ${job.title} successfully!`);
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <div className="container section joblist-layout">
      <aside className="joblist-sidebar card">
        <div className="sidebar-header">
          <button className="btn btn-primary" onClick={load}>Apply All Filters</button>
          <button className="btn btn-outline" onClick={clearAll}>Clear All</button>
        </div>
        <label>Search by Keywords</label>
        <input value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} placeholder="e.g. Developer" />
        <label>Location</label>
        <input value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="e.g. Peelamedu" />
        <label>Industry</label>
        <select value={filters.industry} onChange={(e) => setFilters({ ...filters, industry: e.target.value })}>
          <option value="">All Industries</option>
          <option>IT & ITES</option>
          <option>Textiles</option>
          <option>Engineering</option>
          <option>Healthcare</option>
        </select>
        <label>Job Type</label>
        {JOB_TYPES.map((t) => (
          <div key={t} className="checkbox-row">
            <input type="checkbox" checked={filters.job_type === t} onChange={() => setFilters({ ...filters, job_type: filters.job_type === t ? '' : t })} />
            <span>{t}</span>
          </div>
        ))}
        <label>Date Posted</label>
        <select>
          <option>Anytime</option>
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </aside>

      <main className="joblist-main">
        <div className="joblist-toolbar">
          <span>Show {jobs.length} jobs</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <select value={filters.job_type} onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}>
            <option value="">All Job Types</option>
            {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        {message && <p className="joblist-message">{message}</p>}
        <div className="grid-2">
          {jobs.map((j) => <JobCard key={j.id} job={j} onApply={apply} />)}
        </div>
      </main>
    </div>
  );
}
