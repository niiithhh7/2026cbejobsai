import { useEffect, useState } from 'react';
import { api } from '../api';
import EmployerCard from '../components/EmployerCard';
import './EmployersList.css';

export default function EmployersList() {
  const [form, setForm] = useState({ keyword: '', location: '', industry: '' });
  const [employers, setEmployers] = useState([]);

  async function load() {
    const query = new URLSearchParams(form).toString();
    const data = await api.get(`/employers?${query}`).catch(() => []);
    setEmployers(data);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container section">
      <div className="employer-search-bar card">
        <input placeholder="Company name or keyword" value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} />
        <input placeholder="City or postcode" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
          <option value="">All Categories</option>
          <option>IT & ITES</option>
          <option>Textiles</option>
          <option>Engineering</option>
          <option>Healthcare</option>
        </select>
        <button className="btn btn-primary" onClick={load}>Search Employer</button>
      </div>

      <div className="employer-toolbar">
        <span>{employers.length} jobs</span>
        <select><option>Sort: Newest</option></select>
        <select><option>Filter: All</option></select>
      </div>

      <div className="grid-4">
        {employers.map((e) => <EmployerCard key={e.id} employer={e} />)}
      </div>
    </div>
  );
}
