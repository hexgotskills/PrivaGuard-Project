import { useState, useEffect } from 'react';

function BreachCard({ breach }) {
  const [expanded, setExpanded] = useState(false);

  // Determine severity for dot
  let severityColor = 'var(--green-text)';
  if (breach.severity === 'high') severityColor = 'var(--red-text)';
  else if (breach.severity === 'medium') severityColor = 'var(--amber-text)';

  return (
    <div style={{ position: 'relative', marginBottom: '16px' }}>
      <div style={{
        position: 'absolute', left: '-25px', top: '16px', width: '10px', height: '10px',
        borderRadius: '50%', background: severityColor, border: '2px solid var(--bg)',
        zIndex: 2
      }}></div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg)', overflow: 'hidden' }}>
        <div
          onClick={() => setExpanded(!expanded)}
          style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 500 }}>{breach.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>{breach.breachDate}</span>
              <span style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'var(--ease)', color: 'var(--text-3)' }}>↓</span>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>
            {breach.recordCount.toLocaleString()} accounts exposed
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
            <div style={{
              fontSize: '11px', padding: '2px 8px', borderRadius: 'var(--r-full)',
              background: breach.severity === 'high' ? 'var(--red-bg)' : breach.severity === 'medium' ? 'var(--amber-bg)' : 'var(--green-bg)',
              color: breach.severity === 'high' ? 'var(--red-text)' : breach.severity === 'medium' ? 'var(--amber-text)' : 'var(--green-text)'
            }}>
              {breach.severity}
            </div>

            {breach.dataTypes && breach.dataTypes.slice(0, 5).map((type, i) => (
              <div key={i} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--bg-3)', color: 'var(--text-2)' }}>
                {type}
              </div>
            ))}
            {breach.dataTypes && breach.dataTypes.length > 5 && (
              <div style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 'var(--r-full)', background: 'var(--bg-3)', color: 'var(--text-2)' }}>
                +{breach.dataTypes.length - 5} more
              </div>
            )}
          </div>
        </div>

        {expanded && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '16px', background: 'var(--bg-2)' }}>
            <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.6, marginBottom: '16px' }}>
              {breach.description}
            </p>

            {breach.passwordRiskLabel && (
              <div style={{
                display: 'inline-block', marginBottom: '16px', fontSize: '12px', padding: '4px 10px', borderRadius: 'var(--r-full)',
                background: breach.severity === 'high' ? 'var(--red-bg)' : 'var(--amber-bg)',
                color: breach.severity === 'high' ? 'var(--red-text)' : 'var(--amber-text)',
                border: `1px solid ${breach.severity === 'high' ? 'var(--red-border)' : 'var(--amber-border)'}`
              }}>
                {breach.passwordRiskLabel}
              </div>
            )}

            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Remediation steps</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {breach.remediationSteps && breach.remediationSteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', background: 'var(--text)', color: 'var(--bg)',
                    fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BreachWatchResults({ data, email, onBack }) {
  const [checklist, setChecklist] = useState({
    item1: false, item2: false, item3: false, item4: false
  });

  useEffect(() => {
    try {
      const key = `pb_checklist_${btoa(email).slice(0, 12)}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
    } catch (e) {
      // ignore base64 errors
    }
  }, [email]);

  const toggleChecklist = (id) => {
    const next = { ...checklist, [id]: !checklist[id] };
    setChecklist(next);
    try {
      const key = `pb_checklist_${btoa(email).slice(0, 12)}`;
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const checklistItems = [
    { id: 'item1', label: 'Enable two-factor authentication on your email account' },
    { id: 'item2', label: 'Use a unique password for every website (consider a password manager)' },
    { id: 'item3', label: 'Set up breach monitoring alerts on xposedornot.com' },
    { id: 'item4', label: 'Check if you reused passwords across the breached accounts above' }
  ];

  if (data.totalBreaches === 0) {
    return (
      <div>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', color: 'var(--text-2)',
            fontSize: '13px', cursor: 'pointer', marginBottom: '24px',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.target.style.textDecoration = 'none'}
        >
          ← Check another email
        </button>

        <div style={{
          border: '1px solid var(--green-border)', background: 'var(--green-bg)',
          borderRadius: 'var(--r-lg)', padding: '32px', textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--green-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--green-text)', marginBottom: '8px' }}>
            No breaches found
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>{data.message}</p>
        </div>
      </div>
    );
  }

  // Determine risk banner colors
  let bannerStyle = {};
  if (data.riskLevel === 'Critical') bannerStyle = { background: 'var(--red-bg)', color: 'var(--red-text)', borderColor: 'var(--red-border)' };
  else if (data.riskLevel === 'Elevated') bannerStyle = { background: 'var(--amber-bg)', color: 'var(--amber-text)', borderColor: 'var(--amber-border)' };
  else bannerStyle = { background: 'var(--green-bg)', color: 'var(--green-text)', borderColor: 'var(--green-border)' };

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', color: 'var(--text-2)',
          fontSize: '13px', cursor: 'pointer', marginBottom: '24px',
          textDecoration: 'none'
        }}
        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
      >
        ← Check another email
      </button>

      <div style={{
        border: '1px solid', borderColor: bannerStyle.borderColor, background: bannerStyle.background,
        borderRadius: 'var(--r-md)', padding: '16px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <div style={{
          background: bannerStyle.color, color: 'white', padding: '4px 10px', borderRadius: 'var(--r-full)', fontSize: '12px', fontWeight: 600
        }}>
          {data.riskLevel}
        </div>
        <div style={{ fontSize: '14px', color: bannerStyle.color }}>
          {data.message}
        </div>
      </div>

      <div style={{ paddingLeft: '20px', borderLeft: '2px solid var(--bg-3)', marginLeft: '10px' }}>
        {data.breaches && data.breaches.map((breach, i) => (
          <BreachCard key={i} breach={breach} />
        ))}
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>General security checklist</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {checklistItems.map(item => (
          <div
            key={item.id}
            onClick={() => toggleChecklist(item.id)}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{
              width: '16px', height: '16px', border: '1px solid', borderColor: checklist[item.id] ? 'var(--text)' : 'var(--border-2)',
              borderRadius: '4px', background: checklist[item.id] ? 'var(--text)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', transition: 'var(--ease)'
            }}>
              {checklist[item.id] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-2)' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BreachWatchResults;
