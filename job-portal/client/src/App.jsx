import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { getUser } from './api';

import Home from './pages/Home';
import JobList from './pages/JobList';
import EmployersList from './pages/EmployersList';
import EmployerProfile from './pages/EmployerProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ApplicantsView from './pages/ApplicantsView';
import MyApplications from './pages/MyApplications';

function RequireAdmin({ children }) {
  const user = getUser();
  return user?.role === 'admin' ? children : <Navigate to="/admin/login" />;
}

function RequireUser({ children }) {
  const user = getUser();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job-list" element={<JobList />} />
        <Route path="/employers-list" element={<EmployersList />} />
        <Route path="/employers-single/:id" element={<EmployerProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/my-applications" element={<RequireUser><MyApplications /></RequireUser>} />
        <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/jobs/:id/applicants" element={<RequireAdmin><ApplicantsView /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}
