import { Link } from 'react-router-dom';
import './EmployerCard.css';

export default function EmployerCard({ employer }) {
  return (
    <div className="employer-card card">
      <div className="employer-logo">{employer.logo_url ? <img src={employer.logo_url} alt="" /> : '🏢'}</div>
      <div className="employer-name">{employer.company_name}</div>
      <div className="employer-location">📍 {employer.location}</div>
      {employer.industry && <span className="badge badge-green">🏭 {employer.industry}</span>}
      <div className="employer-openjobs badge badge-orange">Open Jobs — {employer.open_jobs}</div>
      <Link to={`/employers-single/${employer.id}`} className="btn btn-outline employer-view">View Profile</Link>
    </div>
  );
}
