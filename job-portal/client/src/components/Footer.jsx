export default function Footer() {
  return (
    <footer style={{ background: '#111827', color: '#d1d5db', padding: '32px 0', marginTop: 48 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div><strong style={{ color: '#fff' }}>Coimbatore Jobs</strong> — Connecting Talent with Job Opportunity</div>
        <div>© {new Date().getFullYear()} Coimbatorejobs.in. All rights reserved.</div>
      </div>
    </footer>
  );
}
