import './JobCard.css';

function daysAgo(dateStr) {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return d <= 0 ? 'Today' : `${d} day${d > 1 ? 's' : ''} ago`;
}

export default function JobCard({ job, onApply }) {
  return (
    <div className="job-card card">
      <span className="badge badge-blue job-type-badge">{job.job_type}</span>
      <span className="bookmark">🔖</span>
      <div className="job-card-top">
        <div className="job-logo">{job.logo_url ? <img src={job.logo_url} alt="" /> : '🏢'}</div>
        <div>
          <div className="job-company">{job.company_name || 'Confidential'}</div>
          <div className="job-title">{job.title}</div>
        </div>
      </div>
      <div className="job-meta">📍 {job.location} &nbsp;|&nbsp; 💰 {job.salary_range}</div>
      <div className="job-posted">Posted: {daysAgo(job.posted_at)}</div>
      <button className="btn btn-primary job-apply" onClick={() => onApply?.(job)}>Apply Now</button>
    </div>
  );
}
