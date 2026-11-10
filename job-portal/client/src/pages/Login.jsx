import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setSession } from '../api';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api.post('/auth/login', form);
      setSession(data.token, data.user);
      navigate('/');
      window.location.reload();
    } catch (e2) { setError(e2.message); }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2>Log In</h2>
        <form className="auth-form" onSubmit={submit}>
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn btn-primary" type="submit">Log In</button>
        </form>
        {error && <p className="auth-error">{error}</p>}
        <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up</Link></p>
        <p className="auth-switch"><Link to="/admin/login">Admin login</Link></p>
      </div>
    </div>
  );
}
