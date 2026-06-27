function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Paste or Enter',
      desc: 'Drop in your policy text, email address, or URL.'
    },
    {
      num: '2',
      title: 'Instant Analysis',
      desc: 'Checked against live databases and AI models in seconds.'
    },
    {
      num: '3',
      title: 'Understand & Act',
      desc: "A clear report shows exactly what's happening and what to do next."
    }
  ];

  return (
    <section style={{
      background: 'var(--bg-2)',
      padding: '80px 0',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container">
        <h2 style={{ fontSize: '32px', fontWeight: 600, textAlign: 'center', marginBottom: '48px' }}>
          Simple. Fast. Free.
        </h2>
        <div className="how-it-works-flex">
          {steps.map(step => (
            <div key={step.num} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: 'var(--text)',
                color: 'var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600,
                marginBottom: '16px'
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .how-it-works-flex {
          display: flex;
          flex-direction: row;
          gap: 32px;
        }
        @media (max-width: 768px) {
          .how-it-works-flex { flex-direction: column; gap: 40px; }
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;
