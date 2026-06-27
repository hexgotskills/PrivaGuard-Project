import { useState } from 'react';
import '../../styles/cookieinspector.css';

const CAT_CLASS = {
  Essential: 'cat-essential', Analytics: 'cat-analytics',
  Advertising: 'cat-advertising', Functional: 'cat-functional', Unknown: 'cat-unknown'
};

const SCORE_COLOR = (s) => s >= 75 ? 'var(--green-text)' : s >= 50 ? 'var(--amber-text)' : 'var(--red-text)';

export default function CookieInspectorResults({ data, onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const { privacyScore, cookies, summary, verdict, note, domain } = data;

  const toggle = (name) => setOpenCard(openCard === name ? null : name);

  return (
    <div>
      <button onClick={onBack} style={{ fontSize: 13, color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}>
        ← Inspect another URL
      </button>

      {/* Score + summary row */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20, padding: '16px 20px', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-2)', flexWrap: 'wrap' }}>
        {privacyScore !== null && (
          <div className="ci-score-ring">
            <span className="ci-score-number" style={{ color: SCORE_COLOR(privacyScore) }}>{privacyScore}</span>
            <span className="ci-score-label">Privacy Score</span>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{domain}</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{verdict}</div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="ci-stat-grid">
        {[
          { label: 'Essential',   val: summary.essential },
          { label: 'Analytics',   val: summary.analytics },
          { label: 'Advertising', val: summary.advertising },
          { label: 'Functional',  val: summary.functional },
          { label: 'Third-party', val: summary.thirdParty },
          { label: 'Long-lived',  val: summary.longLived }
        ].map(s => (
          <div key={s.label} className="ci-stat-card">
            <div className="ci-stat-number">{s.val}</div>
            <div className="ci-stat-name">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cookie detail cards */}
      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 10 }}>
        {cookies.length} {cookies.length === 1 ? 'cookie' : 'cookies'} detected — click any to expand
      </p>

      {cookies.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-2)' }}>
          No cookies detected in HTTP headers or known tracking scripts for this URL.
        </div>
      ) : (
        cookies.map((c) => (
          <div key={c.name} className="cookie-detail-card">
            <div
              className={`cookie-detail-header ${openCard === c.name ? 'open' : ''}`}
              onClick={() => toggle(c.name)}
            >
              <span className="cookie-name-cell">{c.name}</span>
              <span className={`cookie-cat-badge ${CAT_CLASS[c.category] || 'cat-unknown'}`}>{c.category}</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 'auto', flexShrink: 0 }}>
                {c.duration || '—'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{openCard === c.name ? '▲' : '▼'}</span>
            </div>
            <div className={`cookie-detail-body ${openCard === c.name ? 'open' : ''}`}>
              {c.company && <div style={{ marginBottom: 6 }}><strong>Company:</strong> {c.company}</div>}
              <div style={{ marginBottom: 6 }}><strong>Purpose:</strong> {c.purpose}</div>
              <div style={{ marginBottom: 6 }}><strong>Duration:</strong> {c.duration}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {c.thirdParty && <span className={`cookie-cat-badge cat-advertising`}>Third-party</span>}
                {c.httpOnly && <span className={`cookie-cat-badge cat-essential`}>HttpOnly</span>}
                {c.secure && <span className={`cookie-cat-badge cat-essential`}>Secure</span>}
                {c.source === 'script' && <span className={`cookie-cat-badge cat-unknown`}>Detected via script</span>}
              </div>
            </div>
          </div>
        ))
      )}

      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 14, lineHeight: 1.5 }}>⚠️ {note}</p>
    </div>
  );
}
