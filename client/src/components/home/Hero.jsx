import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero-section" style={{ padding: '100px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Background Animations */}
      <div className="hero-bg-animations">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
        <div className="hero-blob blob-3"></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-block',
          border: '1px solid var(--border-2)',
          borderRadius: 'var(--r-full)',
          padding: '4px 14px',
          fontSize: '12px',
          fontWeight: 500,
          marginBottom: '24px'
        }}>
          Cybersecurity for Everyone
        </div>

        <h1 style={{
          fontSize: '56px',
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-1.5px',
          marginBottom: '20px'
        }} className="hero-headline">
          Your Privacy, Decoded.
        </h1>

        <p style={{
          fontSize: '20px',
          color: 'var(--text-2)',
          maxWidth: '560px',
          margin: '0 auto 36px'
        }}>
          Analyze privacy policies in plain English, track email breach exposure, and audit website security headers — all in one place, completely free.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/dashboard?tool=privacylens" className="btn-primary">
            Analyze a Policy →
          </Link>
          <Link to="/dashboard?tool=breachwatch" className="btn-outline">
            Check for Breaches
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap' }}>
          {['10M+ breaches in our database', 'AI-powered policy analysis', 'Free · No account needed'].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-full)',
              padding: '6px 14px',
              fontSize: '13px',
              color: 'var(--text-2)'
            }}>
              {stat}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .hero-bg-animations {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }
        .hero-blob {
          position: absolute;
          filter: blur(60px);
          background: var(--text);
          opacity: 0.12;
          border-radius: 50%;
          animation: float-blob 15s infinite alternate ease-in-out;
        }
        [data-theme="dark"] .hero-blob {
          opacity: 0.1;
        }
        .blob-1 {
          width: 400px;
          height: 400px;
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }
        .blob-2 {
          width: 500px;
          height: 500px;
          top: 30%;
          right: -150px;
          animation-delay: -5s;
          animation-direction: alternate-reverse;
        }
        .blob-3 {
          width: 350px;
          height: 350px;
          bottom: -100px;
          left: 30%;
          animation-delay: -10s;
        }
        @keyframes float-blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, 80px) scale(1.1); }
          66% { transform: translate(-80px, 150px) scale(0.9); }
          100% { transform: translate(-40px, -60px) scale(1.2); }
        }
        @media (max-width: 768px) {
          .hero-headline { font-size: 36px !important; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
