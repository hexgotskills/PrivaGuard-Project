import { useState, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import PrivacyLensResults from '../results/PrivacyLensResults';

function PrivacyLens() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'PrivacyLens — PrivaGuard';

    // Clear state when unmounted
    return () => {
      setInputText('');
      setResult(null);
      setError(null);
    };
  }, []);

  const handleAnalyze = async () => {
    if (inputText.length < 100) {
      setError('Please provide at least 100 characters of a privacy policy.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL} /api/privacylens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze policy');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Analyzing privacy policy with AI..." />;
  }

  if (result) {
    return <PrivacyLensResults data={result} onBack={() => setResult(null)} />;
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>PrivacyLens</h2>
      <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>Decode any privacy policy into plain English</p>

      <ErrorMessage message={error} />

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste any privacy policy text here — go to a website's Privacy Policy page, select all (Ctrl+A or Cmd+A), copy, and paste it here..."
        style={{
          minHeight: '260px',
          width: '100%',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: '16px',
          fontSize: '14px',
          fontFamily: 'var(--font)',
          resize: 'vertical',
          outline: 'none',
          transition: 'var(--ease)'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--border-2)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>
          Tip: Longer policies give more accurate results. Minimum 100 characters.
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>
          {inputText.length.toLocaleString()} characters
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        className="btn-primary btn-full"
        style={{ marginTop: '16px' }}
      >
        Analyze Policy →
      </button>
    </div>
  );
}

export default PrivacyLens;
