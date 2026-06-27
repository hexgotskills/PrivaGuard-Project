import { useState, useEffect, useRef } from 'react';

const MESSAGES = [
  "Privacy. Built Better.",
  "Security Without Complexity.",
  "Decode. Detect. Defend.",
  "Minimal Design. Maximum Trust.",
  "Built for People. Powered by Privacy."
];

function Footer() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        .footer-animated-text {
          animation: fadeSlideUp 2.5s infinite;
        }
        
        .footer-link {
          color: var(--text-2);
          text-decoration: none;
          transition: opacity 250ms ease, transform 250ms ease;
          display: inline-block;
        }
        
        .footer-link:hover {
          color: var(--text);
          text-decoration: underline;
          transform: translateY(-2px);
          opacity: 0.8;
        }
        
        .footer-container {
          transition: opacity 700ms ease, transform 700ms ease;
        }

        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }

        .about-dev-btn {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--r-full);
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-2);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: var(--font);
          margin: 0 auto;
        }
        .about-dev-btn:hover {
          color: var(--text);
          background: var(--bg-3);
          border-color: var(--border-2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .about-dev-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 28px;
          width: 420px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10;
        }
        [data-theme="dark"] .about-dev-dropdown {
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .about-dev-dropdown.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        @keyframes shimmerSweepLight {
          0%   { background-position: 0% center; }
          100% { background-position: 280% center; }
        }

        .brand-name-light {
          background: linear-gradient(
            90deg,
            #111 0%,
            #555 15%,
            #000 30%,
            #888 45%,
            #000 55%,
            #555 70%,
            #111 85%,
            #444 100%
          );
          background-size: 280% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: shimmerSweepLight 4.5s linear infinite;
          transition: letter-spacing 0.35s ease;
          cursor: default;
        }

        .brand-name-light:hover {
          animation: shimmerSweepLight 1.2s linear infinite;
          letter-spacing: 0.04em;
        }

        .brand-line {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border));
        }

        .brand-line.right {
          background: linear-gradient(90deg, var(--border), transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-animated-text {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .footer-link {
            transition: none !important;
          }
          .footer-link:hover {
            transform: none !important;
          }
          .footer-container {
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
      
      <footer 
        ref={footerRef}
        className="footer-container"
        style={{
          borderTop: '1px solid var(--border)',
          padding: '80px 20px 60px',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(20px)' : 'translateY(40px)', // base transform slightly down
        }}
      >
        {/* We use a container that resets the transform when visible so the inline style handles state but css handles transition */}
        <div style={{
          width: '100%',
          transform: isVisible ? 'translateY(-20px)' : 'translateY(0)', // Move up by 20px from initial when visible
          transition: 'transform 700ms ease'
        }}>
          <div style={{ marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '12px', fontWeight: 600 }}>CRAFTED BY</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <span className="brand-line" />
              <div className="brand-name-light" style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em' }}>DrvLabs</div>
              <span className="brand-line right" />
            </div>

            <div style={{ position: 'relative', marginTop: '12px' }}>
              <button 
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="about-dev-btn"
              >
                About Me
                <span style={{ fontSize: '10px', opacity: 0.7, transform: isAboutOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>▼</span>
              </button>
              <div className={`about-dev-dropdown ${isAboutOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: '1px solid var(--border)', overflow: 'hidden'
                  }}>
                    <img src="/images/profile.jpg" alt="Dhrup Dalvi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.5 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>Dhrup Dalvi</h4>
                    <div style={{ fontSize: '13.5px', color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span>Information & Communication Technology Engineer</span>
                      <span>Developer</span>
                      <span>Student at GTU</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: '24px', position: 'relative', width: '100%', marginBottom: '64px' }}>
            <div 
              key={messageIndex}
              className="footer-animated-text"
              style={{
                position: 'absolute',
                left: 0, right: 0,
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-2)'
              }}
            >
              {MESSAGES[messageIndex]}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '32px', fontSize: '14px' }}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
              <a href="mailto:hello@example.com" className="footer-link">Contact</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-3)' }}>
              <div>© 2026 PrivaGuard • Crafted with passion for privacy and cybersecurity.</div>
              <div>Powered by XposedOrNot</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
