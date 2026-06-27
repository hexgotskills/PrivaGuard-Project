import { useState } from 'react';

function HeaderCard({ header }) {
  const [expanded, setExpanded] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('nginx');
  const [copied, setCopied] = useState(false);

  const isMissing = !header.present;
  const cardBorderColor = isMissing ? 'var(--red-border)' : 'var(--green-border)';

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${cardBorderColor}`,
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
      marginBottom: '16px'
    }}>
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: 'var(--bg)'
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 500 }}>{header.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {header.present ? (
            <div style={{ background: 'var(--green-bg)', color: 'var(--green-text)', padding: '2px 8px', borderRadius: 'var(--r-full)', fontSize: '11px', fontWeight: 600 }}>✓ Present</div>
          ) : header.required ? (
            <div style={{ background: 'var(--amber-bg)', color: 'var(--amber-text)', padding: '2px 8px', borderRadius: 'var(--r-full)', fontSize: '11px', fontWeight: 600 }}>⚠ Required</div>
          ) : (
            <div style={{ background: 'var(--red-bg)', color: 'var(--red-text)', padding: '2px 8px', borderRadius: 'var(--r-full)', fontSize: '11px', fontWeight: 600 }}>✗ Missing</div>
          )}
          <span style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'var(--ease)', color: 'var(--text-3)' }}>→</span>
        </div>
      </div>
      
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)', padding: '16px' }}>
          {header.present && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Current value</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', background: 'var(--bg-3)', padding: '4px 8px', borderRadius: 'var(--r-sm)', wordBreak: 'break-all' }}>
                {header.value}
              </div>
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Risk without this header</div>
            <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>{header.risk}</div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Prevents</div>
            <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>{header.whatItPrevents}</div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Recommended value</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', background: 'var(--bg-3)', padding: '4px 8px', borderRadius: 'var(--r-sm)', wordBreak: 'break-all', flex: 1 }}>
                {header.recommended}
              </div>
              <button 
                onClick={() => handleCopy(header.recommended)}
                className="btn-outline" 
                style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}
              >
                Copy
              </button>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px' }}>Fix it</div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              {['nginx', 'apache', 'express'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    background: activeCodeTab === tab ? 'var(--text)' : 'transparent',
                    color: activeCodeTab === tab ? 'var(--bg)' : 'var(--text-2)',
                    border: '1px solid',
                    borderColor: activeCodeTab === tab ? 'var(--text)' : 'var(--border-2)',
                    borderRadius: 'var(--r-full)',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'express' ? 'Express.js' : tab}
                </button>
              ))}
            </div>
            
            <div style={{ position: 'relative' }}>
              <pre style={{
                background: '#1A1A1A',
                color: '#E8E8E8',
                padding: '12px 16px',
                borderRadius: 'var(--r-md)',
                overflowX: 'auto',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)'
              }}>
                {header.code?.[activeCodeTab]}
              </pre>
              <button
                onClick={() => handleCopy(header.code?.[activeCodeTab])}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShieldCheckResults({ data, domain, onBack }) {
  let gradeColor = 'var(--text)';
  if (data.grade === 'A+' || data.grade === 'A') gradeColor = 'var(--green-text)';
  else if (data.grade === 'B') gradeColor = 'var(--blue-text)';
  else if (data.grade === 'C') gradeColor = 'var(--amber-text)';
  else gradeColor = 'var(--red-text)';

  const sortedHeaders = [...(data.headers || [])].sort((a, b) => {
    if (a.required && !b.required) return -1;
    if (!a.required && b.required) return 1;
    return 0;
  });

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
        ← Audit another URL
      </button>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '72px', fontWeight: 700, color: gradeColor, lineHeight: 1 }}>
          {data.grade}
        </div>
        <div style={{ fontSize: '16px', color: 'var(--text-2)', marginTop: '8px' }}>
          Security grade for {domain || 'this website'}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-full)', padding: '5px 14px', fontSize: '13px' }}>
            {data.headersPresent} / 10 headers present
          </div>
          <div style={{ 
            border: '1px solid var(--border)', borderRadius: 'var(--r-full)', padding: '5px 14px', fontSize: '13px',
            color: data.ssl ? 'var(--green-text)' : 'var(--red-text)'
          }}>
            {data.ssl ? 'SSL ✓ Active' : 'SSL ✗ Missing'}
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-full)', padding: '5px 14px', fontSize: '13px' }}>
            HTTP {data.httpStatus}
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)', padding: '16px', marginBottom: '32px'
      }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.05em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Plain English Summary
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7 }}>
          {data.summary}
        </p>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Header Analysis</h3>
      
      <div>
        {sortedHeaders.map((header, i) => (
          <HeaderCard key={i} header={header} />
        ))}
      </div>
    </div>
  );
}

export default ShieldCheckResults;
