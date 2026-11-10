import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import './AdminDashboard.css';

export default function ApplicantsView() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);

  function load() { api.get(`/jobs/${id}/applicants`).then(setApplicants).catch(() => {}); }
  useEffect(load, [id]);

  async function updateStatus(appId, status) {
    await api.put(`/applications/${appId}/status`, { status });
    load();
  }

  return (
    <div className="container section">
      <h2 className="section-title">Applicants</h2>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Resume</th><th>Applied</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {applicants.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.resume_url ? <a href={a.resume_url} target="_blank" rel="noreferrer">View</a> : '—'}</td>
              <td>{new Date(a.applied_at).toLocaleDateString()}</td>
              <td><span className={`badge badge-${a.status === 'accepted' ? 'green' : a.status === 'rejected' ? 'orange' : 'blue'}`}>{a.status}</span></td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={() => updateStatus(a.id, 'accepted')}>Accept</button>
                <button className="btn btn-outline" onClick={() => updateStatus(a.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
          {!applicants.length && <tr><td colSpan="6">No applicants yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
