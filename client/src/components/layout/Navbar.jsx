import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

function Navbar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');
  const activeTool = searchParams.get('tool') || 'privacylens';

  return (
    <nav style={{
      height: '60px',
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0L0 2.66667V6.66667C0 10.3667 2.56667 13.8 6 14C9.43333 13.8 12 10.3667 12 6.66667V2.66667L6 0Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>PrivaGuard</span>
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }} className="nav-tools">
            <button 
              onClick={() => navigate('/dashboard?tool=privacylens')}
              className={`nav-tool-btn ${isDashboard && activeTool === 'privacylens' ? 'active' : ''}`}
            >PrivacyLens</button>
            <button 
              onClick={() => navigate('/dashboard?tool=breachwatch')}
              className={`nav-tool-btn ${isDashboard && activeTool === 'breachwatch' ? 'active' : ''}`}
            >BreachWatch</button>
            <button 
              onClick={() => navigate('/dashboard?tool=shieldcheck')}
              className={`nav-tool-btn ${isDashboard && activeTool === 'shieldcheck' ? 'active' : ''}`}
            >ShieldCheck</button>
            <button 
              onClick={() => navigate('/dashboard?tool=metacleaner')}
              className={`nav-tool-btn ${isDashboard && activeTool === 'metacleaner' ? 'active' : ''}`}
            >MetaCleaner</button>
            <button 
              onClick={() => navigate('/dashboard?tool=cookiecheck')}
              className={`nav-tool-btn ${isDashboard && activeTool === 'cookiecheck' ? 'active' : ''}`}
            >CookieCheck</button>
          </div>
          <ThemeToggle />
          <Link to="/dashboard" className="btn-primary" style={{ padding: '6px 14px' }}>Dashboard</Link>
        </div>
      </div>
      <style>{`
        .nav-tool-btn {
          font-size: 14px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: var(--r-full);
          background: transparent;
          color: var(--text-2);
          border: 1px solid transparent;
          transition: var(--ease);
        }
        .nav-tool-btn:hover {
          background: var(--bg-3);
          border-color: var(--border);
        }
        .nav-tool-btn.active {
          background: var(--accent);
          color: var(--accent-inverse);
          border-color: var(--accent);
        }
        @media (max-width: 768px) {
          .nav-tools { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
