import { useState, useEffect } from 'react';

export default function DevNoteLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // For animation
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setMounted(false), 300); // Wait for transition
  };

  return (
    <>
      <button 
        className="devnote-launcher-btn"
        onClick={() => setOpen(true)}
      >
        <span style={{ fontSize: '16px' }}>👋</span> Hey, the Dev left you a note
      </button>

      {mounted && (
        <div className={`devnote-overlay ${open ? 'open' : ''}`} onClick={handleClose}>
          <div className={`devnote-modal ${open ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="devnote-close" onClick={handleClose}>×</button>
            <div className="devnote-content">
              <h3>Hello, Dear Visitor! 👋</h3>
              <p>My name is Dhrup Dalvi, and I am an Information and Communication Engineering student at Gujarat University. I hope you're doing well.</p>
              <p>I have always been curious and passionate about cybersecurity, and that passion inspired me to create something that could genuinely help people understand and protect their digital privacy. That idea eventually became PrivaGuard—a platform designed to help you better understand your privacy and make you more aware about it.</p>
              <p>Although this project is currently in its demo/preview phase, all of the core tools are fully functional. I plan to continue improving PrivaGuard by refining the existing features and introducing many more in the future.</p>
              <p>If you have any suggestions, feedback, or ideas that could help improve this project, I would truly appreciate hearing from you. Feel free to reach out through my <a href="https://github.com/hexgotskills" target="_blank" rel="noopener noreferrer" className="devnote-link-btn">GitHub</a> or <a href="https://www.linkedin.com/in/dhrup-dalvi-1b67b6391?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="devnote-link-btn">LinkedIn</a>.</p>
              <p>Thank you from the bottom of my heart for visiting, testing, and supporting my project. I sincerely hope you find PrivaGuard useful, and I would greatly appreciate your valuable feedback.</p>
              <p>Stay safe. Have a wonderful day!</p>
              <div className="devnote-signature">
                — Dhrup Dalvi<br />
                <span>Developer, DrvLabs</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .devnote-launcher-btn {
          position: fixed;
          bottom: 24px;
          left: 24px;
          background: var(--text);
          color: var(--bg);
          border: none;
          padding: 10px 18px;
          border-radius: var(--r-full);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(0,0,0,0.25);
          z-index: 90;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-family: var(--font);
        }
        [data-theme="dark"] .devnote-launcher-btn {
          box-shadow: 0 0 16px rgba(255,255,255,0.2);
        }
        .devnote-launcher-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 24px rgba(0,0,0,0.35);
        }
        [data-theme="dark"] .devnote-launcher-btn:hover {
          box-shadow: 0 0 24px rgba(255,255,255,0.3);
        }
        .devnote-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .devnote-overlay.open {
          opacity: 1;
        }
        .devnote-modal {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          width: 90%;
          max-width: 540px;
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
          padding: 48px;
          transform: translateY(20px) scale(0.98);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        [data-theme="dark"] .devnote-modal {
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .devnote-modal.open {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        .devnote-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: var(--bg-2);
          border: 1px solid var(--border);
          color: var(--text-2);
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: var(--ease);
        }
        .devnote-close:hover {
          background: var(--bg-3);
          color: var(--text);
        }
        .devnote-content h3 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 24px;
          color: var(--text);
        }
        .devnote-content p {
          font-size: 15px;
          color: var(--text-2);
          margin-bottom: 16px;
          line-height: 1.7;
        }
        .devnote-signature {
          margin-top: 32px;
          font-weight: 600;
          color: var(--text);
          font-size: 16px;
        }
        .devnote-signature span {
          font-weight: 400;
          color: var(--text-3);
          font-size: 14px;
        }
        @media (max-width: 768px) {
          .devnote-launcher-btn {
            left: 50%;
            transform: translateX(-50%);
            bottom: 20px;
            white-space: nowrap;
          }
          .devnote-launcher-btn:hover {
            transform: translate(-50%, -2px);
          }
          .devnote-modal { padding: 32px 24px; }
        }
        .devnote-link-btn {
          display: inline-block;
          background: var(--bg-2);
          border: 1px solid var(--border);
          color: var(--text);
          text-decoration: none;
          padding: 4px 12px;
          border-radius: var(--r-full);
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
          margin: 0 4px;
        }
        .devnote-link-btn:hover {
          background: var(--bg-3);
          border-color: var(--border-2);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
