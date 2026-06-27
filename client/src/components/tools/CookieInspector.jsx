import { useState } from 'react';
import CookieInspectorResults from '../results/CookieInspectorResults';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

export default function CookieInspector() {
  const [url, setUrl] = useState('https://');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!url || url === 'https://') return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cookieinspector`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Inspection failed.');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setError(null); setUrl('https://'); };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>CookieCheck</h2>
      <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>
        Enter a website URL to see exactly which cookies it sets, what they do, and whether they track you.
      </p>

      {error && <ErrorMessage message={error} />}

      {!result && !loading && (
        <>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="https://example.com"
            style={{
              width: '100%', height: 44, padding: '0 14px',
              border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
              fontSize: 15, background: 'var(--bg)', color: 'var(--text)',
              fontFamily: 'var(--font)', marginBottom: 8
            }}
          />
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
            We fetch HTTP headers and scan for tracking scripts. JavaScript-set cookies may not appear. No data is stored.
          </p>
          <button className="btn-primary btn-full" onClick={handleSubmit}>
            Inspect Cookies →
          </button>
        </>
      )}

      {loading && <LoadingSpinner message="Fetching cookies and scanning for trackers..." />}
      {result && <CookieInspectorResults data={result} onBack={reset} />}
    </div>
  );
}
