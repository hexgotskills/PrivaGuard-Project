import { useState, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import ShieldCheckResults from '../results/ShieldCheckResults';

function ShieldCheck() {
  const [url, setUrl] = useState('https://');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'ShieldCheck — PrivaGuard';
    
    return () => {
      setUrl('https://');
      setResult(null);
      setError(null);
    };
  }, []);

  const handleCheck = async () => {
    if (!url || url.length < 5 || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/shieldcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check headers');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Auditing security headers..." />;
  }

  if (result) {
    let domain = 'website';
    try {
      domain = new URL(url).hostname;
    } catch (e) {
      // Ignore
    }
    return <ShieldCheckResults data={result} domain={domain} onBack={() => setResult(null)} />;
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>ShieldCheck</h2>
      <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>Audit any website's HTTP security headers</p>
      
      <ErrorMessage message={error} />
      
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://"
        onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        style={{
          width: '100%',
          height: '44px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: '0 16px',
          fontSize: '15px',
          outline: 'none',
          transition: 'var(--ease)'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--border-2)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
      />
      
      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '8px' }}>
        We make one public HTTP request to fetch response headers. No authentication, cookies, or user data are transmitted.
      </div>
      
      <button 
        onClick={handleCheck}
        className="btn-primary btn-full"
        style={{ marginTop: '16px' }}
      >
        Audit Security Headers →
      </button>
    </div>
  );
}

export default ShieldCheck;
