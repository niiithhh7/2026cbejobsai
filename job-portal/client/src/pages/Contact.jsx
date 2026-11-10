import { useState } from 'react';
import { api } from '../api';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ full_name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/contact', form);
      setStatus('Your message has been sent!');
      setForm({ full_name: '', email: '', subject: '', message: '' });
    } catch (e2) {
      setStatus(e2.message);
    }
  }

  return (
    <div className="container section">
      <iframe
        title="map"
        className="contact-map"
        src="https://maps.google.com/maps?q=Coimbatore,Tamil%20Nadu&t=&z=12&ie=UTF8&iwloc=&output=embed"
      />

      <div className="contact-cards">
        <div className="card contact-card"><span>📍</span><strong>Address</strong><p>TIDEL Park, Coimbatore, Tamil Nadu, India</p></div>
        <div className="card contact-card"><span>📞</span><strong>Call Us</strong><p>+91 422 123 4567</p></div>
        <div className="card contact-card"><span>✉️</span><strong>Email</strong><p>hello@coimbatorejobs.in</p></div>
      </div>

      <div className="card contact-form-wrap">
        <h2 className="section-title">Get in Touch</h2>
        <form onSubmit={submit} className="contact-form">
          <input required placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <input required type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <textarea required placeholder="Message" rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
        {status && <p className="joblist-message">{status}</p>}
      </div>
    </div>
  );
}
