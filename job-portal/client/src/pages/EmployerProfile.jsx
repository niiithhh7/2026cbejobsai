import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, getUser } from '../api';
import JobCard from '../components/JobCard';
import './EmployerProfile.css';

export default function EmployerProfile() {
  const { id } = useParams();
  const [employer, setEmployer] = useState(null);
  const [message, setMessage] = useState('');
  const user = getUser();

  useEffect(() => { api.get(`/employers/${id}`).then(setEmployer).catch(() => {}); }, [id]);

  async function apply(job) {
    if (!user) return setMessage('Please log in as a job seeker to apply.');
    try {
      await api.post('/applications', { job_id: job.id });
      setMessage(`Applied to ${job.title} successfully!`);
    } catch (e) { setMessage(e.message); }
  }

  if (!employer) return <div className="container section">Loading…</div>;
  const social = employer.social_links || {};

  return (
    <div>
      <div className="employer-banner">
        <div className="employer-banner-logo">{employer.logo_url ? <img src={employer.logo_url} alt="" /> : '🏢'}</div>
        <h1>{employer.company_name}</h1>
        {employer.industry && <span className="badge badge-green">{employer.industry}</span>}
      </div>

      <div className="container section employer-profile-grid">
        <aside className="employer-info-card card">
          <p><strong>Primary industry:</strong> {employer.industry}</p>
          <p><strong>Company size:</strong> {employer.company_size}</p>
          <p><strong>Founded in:</strong> {employer.founded_year}</p>
          <p><strong>Phone:</strong> {employer.phone}</p>
          <p><strong>Email:</strong> {employer.email}</p>
          <p><strong>Location:</strong> {employer.location}</p>
          <div className="social-icons">
            {social.facebook && <a href={social.facebook}>FB</a>}
            {social.twitter && <a href={social.twitter}>TW</a>}
            {social.instagram && <a href={social.instagram}>IG</a>}
            {social.linkedin && <a href={social.linkedin}>IN</a>}
          </div>
          {employer.website && <a href={employer.website} className="btn btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 12 }}>Visit Website</a>}
        </aside>

        <div>
          <h3>About Company</h3>
          <p>{employer.about}</p>
          <h3>Active Jobs at {employer.company_name}</h3>
          <p className="section-subtitle">Company has {employer.jobs?.length || 0} open positions</p>
          {message && <p className="joblist-message">{message}</p>}
          <div className="grid-2">
            {employer.jobs?.map((j) => <JobCard key={j.id} job={{ ...j, company_name: employer.company_name }} onApply={apply} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
