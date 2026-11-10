import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import JobCard from '../components/JobCard';
import CVModal from '../components/CVModal';
import './Home.css';

const TESTIMONIALS = [
  { name: 'Priya R.', quote: 'Found my dream developer role in Coimbatore within two weeks of signing up!' },
  { name: 'Arun K.', quote: 'The AI resume analyzer helped me fix my CV before I even applied. Huge help.' },
  { name: 'Divya S.', quote: 'Great local jobs, easy to filter by industry and location. Highly recommend.' }
];

export default function Home() {
  const [stats, setStats] = useState({ jobCount: 113, companyCount: 68 });
  const [jobs, setJobs] = useState([]);
  const [showCV, setShowCV] = useState(false);
  const [tIndex, setTIndex] = useState(0);
  const [form, setForm] = useState({ keyword: '', location: '', industry: '' });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/stats').then(setStats).catch(() => {});
    api.get('/jobs').then((data) => setJobs(data.slice(0, 4))).catch(() => {});
  }, []);

  function search() {
    const params = new URLSearchParams(form).toString();
    navigate(`/job-list?${params}`);
  }

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Find Your Dream Jobs in Coimbatore – Jobs Search Made Easy</h1>
            <p>Connecting Talent with Job Opportunity</p>

            <div className="search-bar card">
              <input placeholder="Job title, keywords" value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} />
              <input placeholder="City or town" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                <option value="">Choose an industry</option>
                <option>IT & ITES</option>
                <option>Textiles</option>
                <option>Engineering</option>
                <option>Healthcare</option>
                <option>Manufacturing</option>
                <option>Education</option>
              </select>
              <button className="btn btn-primary" onClick={search}>Search Jobs</button>
            </div>

            <p className="popular-searches">Popular Searches: Designer, Developer, Web, iOS, PHP, Senior, Engineer</p>
            <button className="btn btn-accent" onClick={() => setShowCV(true)}>Upload your CV</button>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80" alt="Handshake" />
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-inner">
          <div><strong>{stats.jobCount}+</strong> Active Jobs</div>
          <div><strong>{stats.companyCount}+</strong> Companies</div>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">Latest Opportunities</h2>
        <p className="section-subtitle">Fresh job openings across Coimbatore</p>
        <div className="grid-2">
          {jobs.map((j) => <JobCard key={j.id} job={j} onApply={() => navigate('/job-list')} />)}
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>What Our Customers Are Saying</h2>
          <div className="testimonial-card card">
            <p className="testimonial-quote">“{TESTIMONIALS[tIndex].quote}”</p>
            <p className="testimonial-name">— {TESTIMONIALS[tIndex].name}</p>
          </div>
          <div className="dots">
            {TESTIMONIALS.map((_, i) => (
              <span key={i} className={i === tIndex ? 'dot active' : 'dot'} onClick={() => setTIndex(i)} />
            ))}
          </div>
        </div>
      </section>

      {showCV && <CVModal onClose={() => setShowCV(false)} />}
    </div>
  );
}
