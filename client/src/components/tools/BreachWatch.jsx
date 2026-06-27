import { useState, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import BreachWatchResults from '../results/BreachWatchResults';

function BreachWatch() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'BreachWatch — PrivaGuard';

    return () => {
      setEmail('');
      setResult(null);
      setError(null);
    };
  }, []);

  const handleCheck = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL} /api/breachwatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check breaches');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Scanning breach databases..." />;
  }

  if (result) {
    return <BreachWatchResults data={result} email={email} onBack={() => setResult(null)} />;
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>BreachWatch</h2>
      <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>Check if your email has appeared in a data breach</p>

      <ErrorMessage message={error} />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
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
        🔒 Your email is sent only to the XposedOrNot public API. We never store, log, or retain it.
      </div>

      <button
        onClick={handleCheck}
        className="btn-primary btn-full"
        style={{ marginTop: '16px' }}
      >
        Check for Breaches →
      </button>
    </div>
  );
}

export default BreachWatch;
