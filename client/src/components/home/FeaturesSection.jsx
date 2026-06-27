import { Link } from 'react-router-dom';
import { useState } from 'react';

function FeaturesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      id: 'privacylens',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      tag: 'AI-Powered',
      title: 'PrivacyLens',
      description: "Paste any privacy policy and get a plain-English breakdown: what's collected, who it's shared with, your legal rights, and the red flags buried in the legalese.",
      linkText: 'Try PrivacyLens →',
      linkTo: '/dashboard?tool=privacylens'
    },
    {
      id: 'breachwatch',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      ),
      tag: 'Live API Data',
      title: 'BreachWatch',
      description: "Enter your email to see every data breach it's appeared in. Get a visual timeline of exposure, what data was leaked, and exact remediation steps for each breach.",
      linkText: 'Check Your Email →',
      linkTo: '/dashboard?tool=breachwatch'
    },
    {
      id: 'shieldcheck',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M9 12l2 2 4-4"></path>
        </svg>
      ),
      tag: 'For Developers',
      title: 'ShieldCheck',
      description: "Paste any website URL to audit its HTTP security headers. See which defences are missing, what attacks they leave open, and copy the exact server config to fix each one.",
      linkText: 'Audit a Website →',
      linkTo: '/dashboard?tool=shieldcheck'
    },
    {
      id: 'metacleaner',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      ),
      tag: 'Privacy Protection',
      title: 'MetaCleaner',
      description: "Upload any photo or PDF and instantly see its hidden metadata — GPS location, device info, timestamps, and more. Then download a clean version with all of it stripped.",
      linkText: 'Try MetaCleaner →',
      linkTo: '/dashboard?tool=metacleaner'
    },
    {
      id: 'cookiecheck',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      tag: 'Tracker Detection',
      title: 'CookieCheck',
      description: "Enter any website URL to see exactly which cookies it sets, what they're doing, who they belong to, and whether they're tracking your behaviour for advertising.",
      linkText: 'Inspect Cookies →',
      linkTo: '/dashboard?tool=cookiecheck'
    }
  ];

  const nextSlide = () => setCurrentIndex(i => (i + 1) % features.length);
  const prevSlide = () => setCurrentIndex(i => (i - 1 + features.length) % features.length);

  return (
    <section style={{ padding: '80px 0', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, textAlign: 'center', marginBottom: '48px' }}>
          Five tools. Complete protection.
        </h2>
        
        <div className="carousel-wrapper">
          <button className="nav-btn prev-btn" onClick={prevSlide} aria-label="Previous tool">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <div className="carousel-viewport">
            <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {features.map(f => (
                <div key={f.id} className="carousel-slide">
                  <div className="feature-card">
                    <div className="feature-icon">
                      {f.icon}
                    </div>
                    <div className="feature-tag">
                      {f.tag}
                    </div>
                    <h3 className="feature-title">{f.title}</h3>
                    <p className="feature-desc">
                      {f.description}
                    </p>
                    <Link to={f.linkTo} className="feature-btn">
                      {f.linkText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="nav-btn next-btn" onClick={nextSlide} aria-label="Next tool">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        
        <div className="carousel-dots">
          {features.map((_, i) => (
            <button 
              key={i} 
              className={`dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <style>{`
        .carousel-wrapper {
          display: flex;
          align-items: center;
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }
        .carousel-viewport {
          overflow: hidden;
          flex-grow: 1;
          margin: 0 24px;
          border-radius: var(--r-lg);
        }
        .carousel-track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform;
        }
        .carousel-slide {
          min-width: 100%;
          box-sizing: border-box;
          padding: 10px;
        }
        .feature-card {
          --fc-bg: var(--bg-2);
          --fc-text: var(--text);
          --fc-text-2: var(--text-2);
          --fc-border: var(--border);
          --fc-tag-bg: var(--bg-3);
          --fc-btn-border: var(--border-2);
          --fc-btn-bg: transparent;

          background: var(--fc-bg);
          border: 1px solid var(--fc-border);
          color: var(--fc-text);
          border-radius: var(--r-lg);
          padding: 48px;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 380px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.4s ease, border-color 0.4s ease, color 0.4s ease;
        }

        .feature-card:hover {
          --fc-bg: var(--accent);
          --fc-text: var(--accent-inverse);
          --fc-text-2: var(--bg-2);
          --fc-border: var(--accent);
          --fc-tag-bg: rgba(255, 255, 255, 0.15);
          --fc-btn-border: rgba(255, 255, 255, 0.3);
          --fc-btn-bg: rgba(255, 255, 255, 0.05);

          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
        }

        [data-theme="dark"] .feature-card:hover {
          --fc-tag-bg: rgba(0, 0, 0, 0.2);
          --fc-btn-border: rgba(0, 0, 0, 0.3);
          --fc-btn-bg: rgba(0, 0, 0, 0.1);
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
        }

        .feature-icon {
          margin-bottom: 16px;
          color: var(--fc-text);
          transition: color 0.4s ease;
        }

        .feature-tag {
          display: inline-block;
          background: var(--fc-tag-bg);
          color: var(--fc-text);
          padding: 4px 10px;
          border-radius: var(--r-full);
          font-size: 11px;
          font-weight: 600;
          align-self: flex-start;
          margin-bottom: 12px;
          transition: background 0.4s ease, color 0.4s ease;
        }

        .feature-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--fc-text);
          transition: color 0.4s ease;
        }

        .feature-desc {
          font-size: 16px;
          color: var(--fc-text-2);
          flex-grow: 1;
          margin-bottom: 32px;
          line-height: 1.6;
          transition: color 0.4s ease;
        }

        .feature-btn {
          align-self: flex-start;
          padding: 10px 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--fc-btn-bg);
          color: var(--fc-text);
          border: 1px solid var(--fc-btn-border);
          border-radius: var(--r-md);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.4s ease;
          cursor: pointer;
        }
        
        .feature-btn:hover {
          background: var(--bg-2);
          color: var(--text);
        }
        .nav-btn {
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--ease);
          z-index: 2;
          flex-shrink: 0;
        }
        .nav-btn:hover {
          background: var(--bg-3);
          transform: scale(1.05);
        }
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 40px;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: var(--border-2);
          border: none;
          cursor: pointer;
          transition: width 0.3s ease, background 0.3s ease;
          padding: 0;
        }
        .dot:hover {
          background: var(--text-3);
        }
        .dot.active {
          width: 32px;
          background: var(--text);
        }
        @media (max-width: 768px) {
          .nav-btn { display: none; }
          .carousel-viewport { margin: 0; }
          .feature-card { padding: 32px 24px; min-height: auto; }
        }
      `}</style>
    </section>
  );
}

export default FeaturesSection;
