import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearSession } from '../api';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = getUser();
  const navigate = useNavigate();

  function logout() {
    clearSession();
    navigate('/');
    window.location.reload();
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏢</span> Coimbatore Jobs
        </Link>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/job-list">Jobs</Link>
          <Link to="/employers-list">Employers</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="navbar-actions">
          <span className="bell-icon" title="Notifications">🔔</span>
          {user ? (
            <div className="avatar-wrap" onClick={() => setOpen(!open)}>
              <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
              <span className="avatar-name">{user.name}</span>
              {open && (
                <div className="dropdown">
                  {user.role === 'admin' && <Link to="/admin/dashboard">Dashboard</Link>}
                  {user.role === 'user' && <Link to="/my-applications">My Applications</Link>}
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
