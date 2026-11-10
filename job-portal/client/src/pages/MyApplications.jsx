import { useEffect, useState } from 'react';
import { api } from '../api';
import './AdminDashboard.css';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  useEffect(() => { api.get('/applications/mine').then(setApps).catch(() => {}); }, []);

  return (
    <div className="container section">
      <h2 className="section-title">My Applications</h2>
      <table className="admin-table">
        <thead><tr><th>Job Title</th><th>Company</th><th>Location</th><th>Applied</th><th>Status</th></tr></thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.company_name}</td>
              <td>{a.location}</td>
              <td>{new Date(a.applied_at).toLocaleDateString()}</td>
              <td><span className={`badge badge-${a.status === 'accepted' ? 'green' : a.status === 'rejected' ? 'orange' : 'blue'}`}>{a.status}</span></td>
            </tr>
          ))}
          {!apps.length && <tr><td colSpan="5">You haven't applied to any jobs yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
