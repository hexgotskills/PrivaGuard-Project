import { useState } from 'react';

function PrivacyLensResults({ data, onBack }) {
  const [activeTab, setActiveTab] = useState('collected');
  
  const getRiskColor = (level) => {
    switch(level) {
      case 'Low Risk': return 'var(--green-text)';
      case 'Medium Risk': return 'var(--amber-text)';
      case 'High Risk': return 'var(--red-text)';
      case 'Very High Risk': return '#7B0000';
      default: return 'var(--text)';
    }
  };

  const tabs = [
    { id: 'collected', label: 'Data Collected' },
    { id: 'sharing', label: 'Sharing & Retention' },
    { id: 'rights', label: 'Your Rights' },
    { id: 'flags', label: 'Red Flags' }
  ];

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
        ← Analyze another policy
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ flex: 1, marginRight: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>{data.companyName || 'Privacy Policy'}</h2>
          
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-3)', borderRadius: 'var(--r-full)', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{
              height: '100%',
              width: `${data.riskScore}%`,
              background: getRiskColor(data.riskLevel)
            }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-3)' }}>
            <span>Lower risk</span>
            <span>Higher risk</span>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '28px', fontWeight: 600, color: getRiskColor(data.riskLevel) }}>
            {data.riskScore}<span style={{ fontSize: '16px', color: 'var(--text-3)' }}>/100</span>
          </div>
          <div style={{
            display: 'inline-block',
            background: 'var(--bg-3)',
            padding: '4px 10px',
            borderRadius: 'var(--r-full)',
            fontSize: '12px',
            fontWeight: 500,
            marginTop: '4px'
          }}>
            {data.riskLevel}
          </div>
        </div>
      </div>
      
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)', padding: '16px', margin: '20px 0'
      }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.05em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Plain English Summary
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7 }}>
          {data.summary}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '24px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--text)' : '2px solid transparent',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-2)',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {activeTab === 'collected' && (
        <div>
          {data.dataCollected && ['high', 'medium', 'low'].map(severity => {
            const items = data.dataCollected[severity] || [];
            if (!items.length) return null;
            
            let chipStyle = {};
            if (severity === 'high') { chipStyle = { background: 'var(--red-bg)', color: 'var(--red-text)', borderColor: 'var(--red-border)' }; }
            else if (severity === 'medium') { chipStyle = { background: 'var(--amber-bg)', color: 'var(--amber-text)', borderColor: 'var(--amber-border)' }; }
            else { chipStyle = { background: 'var(--green-bg)', color: 'var(--green-text)', borderColor: 'var(--green-border)' }; }
            
            return (
              <div key={severity} style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-2)', marginBottom: '8px', textTransform: 'capitalize' }}>
                  {severity} sensitivity
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {items.map((item, i) => (
                    <div key={i} style={{
                      fontSize: '12px', padding: '4px 10px', borderRadius: 'var(--r-full)', border: '1px solid',
                      ...chipStyle
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {activeTab === 'sharing' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Who they share your data with</h3>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: '24px' }}>
            {data.dataSharing && data.dataSharing.map((item, i) => (
              <div key={i} style={{
                display: 'flex', padding: '16px', borderBottom: i < data.dataSharing.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'flex-start'
              }}>
                <div style={{ marginRight: '16px', marginTop: '2px' }}>
                  {item.severity === 'high' && <span style={{ color: 'var(--red-text)' }}>⊗</span>}
                  {item.severity === 'medium' && <span style={{ color: 'var(--amber-text)' }}>△</span>}
                  {item.severity === 'low' && <span style={{ color: 'var(--green-text)' }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.recipient}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px' }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>How long they keep it</h3>
          <div style={{ background: 'var(--bg-2)', borderRadius: 'var(--r-md)', padding: '16px' }}>
            {data.retention && data.retention.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < data.retention.length - 1 ? '12px' : 0, fontSize: '14px' }}>
                <span style={{ color: 'var(--text-2)' }}>{item.scenario}</span>
                <span style={{ fontWeight: 500 }}>{item.period}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'rights' && (
        <div>
          {data.userRights && data.userRights.map((right, i) => (
            <div key={i} style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: '12px', marginTop: '4px',
                background: right.available === true ? 'var(--green-text)' : right.available === null ? 'var(--amber-text)' : 'var(--red-text)',
                color: 'white', fontSize: '10px'
              }}>
                {right.available === true ? '✓' : right.available === null ? '-' : '✕'}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>{right.right}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px' }}>{right.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'flags' && (
        <div>
          {!data.redFlags || data.redFlags.length === 0 ? (
            <div style={{ color: 'var(--text-3)', fontSize: '14px', textAlign: 'center', padding: '32px' }}>
              No major red flags detected.
            </div>
          ) : data.redFlags.map((flag, i) => {
            const color = flag.severity === 'high' ? 'var(--red-border)' : 'var(--amber-border)';
            const labelColor = flag.severity === 'high' ? 'var(--red-text)' : 'var(--amber-text)';
            return (
              <div key={i} style={{
                border: '1px solid', borderColor: color, borderLeft: `3px solid ${color}`,
                borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: '12px'
              }}>
                <div style={{ background: 'var(--bg-2)', padding: '12px 16px', borderBottom: `1px solid var(--border)` }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>What they wrote</div>
                  <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-2)' }}>"{flag.original}"</div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: '11px', color: labelColor, marginBottom: '4px', fontWeight: 600 }}>What it means</div>
                  <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.6 }}>{flag.plain}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PrivacyLensResults;
