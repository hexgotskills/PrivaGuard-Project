import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PrivacyLens from '../components/tools/PrivacyLens';
import BreachWatch from '../components/tools/BreachWatch';
import ShieldCheck from '../components/tools/ShieldCheck';
import MetaCleaner from '../components/tools/MetaCleaner';
import CookieInspector from '../components/tools/CookieInspector';
function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTool = searchParams.get('tool') || 'privacylens';

  return (
    <div>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {activeTool === 'privacylens' && <PrivacyLens />}
        {activeTool === 'breachwatch' && <BreachWatch />}
        {activeTool === 'shieldcheck' && <ShieldCheck />}
        {activeTool === 'metacleaner' && <MetaCleaner />}
        {activeTool === 'cookiecheck' && <CookieInspector />}
      </div>
    </div>
  );
}

export default Dashboard;
