import { useState, useEffect } from 'react';
import { SCENARIOS, RANKS } from '../../data/scenariosData';
import '../../styles/socialshield.css';

const POINTS_PER_FLAG = 30;

function EmailDisplay({ scenario, selected, phase, onFlagClick }) {
  const renderText = (text, flags) => {
    let result = [text];
    flags.forEach(flag => {
      result = result.flatMap(part => {
        if (typeof part !== 'string') return [part];
        const idx = part.indexOf(flag.trigger);
        if (idx < 0) return [part];
        const cls = phase === 'results'
          ? (selected.has(flag.id) ? 'correct' : 'missed')
          : (selected.has(flag.id) ? 'selected' : '');
        return [
          part.slice(0, idx),
          <span
            key={flag.id}
            className={`ss-flag-span ${cls}`}
            data-flag={flag.id}
            onClick={() => phase === 'playing' && onFlagClick(flag.id)}
          >{flag.trigger}</span>,
          part.slice(idx + flag.trigger.length)
        ];
      });
    });
    return result;
  };

  const e = scenario.email;
  const fromCls = phase === 'results'
    ? (selected.has('domain') ? 'correct' : (scenario.flags.some(f => f.id === 'domain') ? 'missed' : ''))
    : (selected.has('domain') ? 'selected' : '');

  return (
    <div className="ss-email-mock">
      <div className="ss-email-header">
        <div className="ss-email-meta-row">
          <span className="ss-email-meta-label">From</span>
          <span className="ss-email-meta-val">{e.from.display} &lt;
            <span
              className={`ss-flag-span ${fromCls}`}
              onClick={() => {
                if (phase !== 'playing') return;
                const df = scenario.flags.find(f => f.id === 'domain');
                if (df) onFlagClick(df.id);
              }}
            >{e.from.address}</span>&gt;
          </span>
        </div>
        <div className="ss-email-meta-row">
          <span className="ss-email-meta-label">Subject</span>
          <span className="ss-email-meta-val">{e.subject}</span>
        </div>
      </div>
      <div className="ss-email-body">
        {renderText(e.body, scenario.flags.filter(f => f.id !== 'domain'))}
      </div>
    </div>
  );
}

function SMSDisplay({ scenario, selected, phase, onFlagClick }) {
  const s = scenario.sms;
  const renderMsg = (text, flags) => {
    let result = [text];
    flags.forEach(flag => {
      result = result.flatMap(part => {
        if (typeof part !== 'string') return [part];
        const idx = part.indexOf(flag.trigger);
        if (idx < 0) return [part];
        const cls = phase === 'results'
          ? (selected.has(flag.id) ? 'correct' : 'missed')
          : (selected.has(flag.id) ? 'selected' : '');
        return [
          part.slice(0, idx),
          <span key={flag.id} className={`ss-flag-span ${cls}`}
            onClick={() => phase === 'playing' && onFlagClick(flag.id)}
          >{flag.trigger}</span>,
          part.slice(idx + flag.trigger.length)
        ];
      });
    });
    return result;
  };

  const fromFlag = scenario.flags.find(f => f.id === 'unknown');
  const fromCls = fromFlag
    ? (phase === 'results' ? (selected.has('unknown') ? 'correct' : 'missed') : (selected.has('unknown') ? 'selected' : ''))
    : '';

  return (
    <div className="ss-sms-phone">
      <div className="ss-sms-from">
        <span className={`ss-flag-span ${fromCls}`}
          onClick={() => phase === 'playing' && fromFlag && onFlagClick('unknown')}
        >{s.from}</span>
      </div>
      {s.messages.map((m, i) => (
        <div key={i} className="ss-sms-bubble">
          {renderMsg(m.text, scenario.flags.filter(f => f.id !== 'unknown'))}
        </div>
      ))}
    </div>
  );
}

function CallDisplay({ scenario, selected, phase, onFlagClick }) {
  const c = scenario.call;
  return (
    <div>
      <div className="ss-call-header">
        <div className="ss-call-number">{c.callerNumber}</div>
        <div className="ss-call-name">{c.callerName}</div>
      </div>
      {c.transcript.map((line, i) => {
        const flag = scenario.flags.find(f => line.text.includes(f.trigger));
        const isSpeakerCallerLine = line.speaker === 'Caller';
        const cls = flag
          ? (phase === 'results' ? (selected.has(flag.id) ? 'correct' : 'missed') : (selected.has(flag.id) ? 'selected' : ''))
          : '';
        return (
          <div key={i} className={`ss-transcript-line ${isSpeakerCallerLine ? 'ss-transcript-caller' : 'ss-transcript-you'}`}>
            <div className="ss-transcript-label">{line.speaker}</div>
            {flag ? (
              <span>
                {line.text.slice(0, line.text.indexOf(flag.trigger))}
                <span
                  className={`ss-flag-span ${cls}`}
                  onClick={() => phase === 'playing' && onFlagClick(flag.id)}
                >{flag.trigger}</span>
                {line.text.slice(line.text.indexOf(flag.trigger) + flag.trigger.length)}
              </span>
            ) : line.text}
          </div>
        );
      })}
    </div>
  );
}

export default function SocialShield({ onClose }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [phase, setPhase] = useState('playing'); // 'playing' | 'results' | 'final'
  const [totalScore, setTotalScore] = useState(0);
  const [scenarioScores, setScenarioScores] = useState([]);

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);

  const scenario = SCENARIOS[scenarioIndex];
  const progress = ((scenarioIndex) / SCENARIOS.length) * 100;

  const toggleFlag = (flagId) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(flagId) ? next.delete(flagId) : next.add(flagId);
      return next;
    });
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;
    const earned = selected.size * POINTS_PER_FLAG;
    setTotalScore(t => t + earned);
    setScenarioScores(sc => [...sc, { id: scenario.id, found: selected.size, total: scenario.flags.length, earned }]);
    setPhase('results');
  };

  const handleNext = () => {
    if (scenarioIndex + 1 >= SCENARIOS.length) {
      setPhase('final');
    } else {
      setScenarioIndex(i => i + 1);
      setSelected(new Set());
      setPhase('playing');
    }
  };

  const handleRestart = () => {
    setScenarioIndex(0);
    setSelected(new Set());
    setPhase('playing');
    setTotalScore(0);
    setScenarioScores([]);
  };

  const maxScore = SCENARIOS.length * 3 * POINTS_PER_FLAG;
  const pct = Math.round((totalScore / maxScore) * 100);
  const rank = RANKS.slice().reverse().find(r => totalScore >= r.min) || RANKS[0];

  const foundCount = selected.size;
  const totalFlags = scenario?.flags.length || 0;

  return (
    <div className="ss-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ss-modal">

        {/* Header */}
        <div className="ss-modal-header">
          <div>
            <div className="ss-modal-title">🛡 SocialShield Trainer</div>
            {phase !== 'final' && (
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                Scenario {scenarioIndex + 1} of {SCENARIOS.length} · {scenario.typeLabel} · {scenario.difficulty}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {phase !== 'final' && (
              <span className="ss-score-chip">{totalScore} pts</span>
            )}
            <button className="ss-modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Progress */}
        {phase !== 'final' && (
          <div className="ss-progress-bar">
            <div className="ss-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Content */}
        {phase === 'final' ? (
          <div className="ss-final">
            <div className="ss-final-emoji">{rank.emoji}</div>
            <div className="ss-final-rank">{rank.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>Final Score</div>
            <div className="ss-final-score">{totalScore} <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text-3)' }}>/ {maxScore}</span></div>
            <div className="ss-final-msg">{rank.message}</div>
            <div className="ss-final-bar-wrap">
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>0</span>
              <div className="ss-final-bar-track">
                <div className="ss-final-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{maxScore}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary ss-play-again" onClick={handleRestart}>Play Again</button>
              <button className="btn-outline ss-play-again" onClick={onClose}>Close</button>
            </div>
          </div>

        ) : phase === 'playing' ? (
          <>
            <div className="ss-scenario-wrap">
              <div className="ss-instruction">
                👆 Click on everything that looks suspicious. You can click multiple things.
              </div>
              <div className="ss-intro-text">{scenario.intro}</div>
              {scenario.type === 'email' && <EmailDisplay scenario={scenario} selected={selected} phase={phase} onFlagClick={toggleFlag} />}
              {scenario.type === 'sms'   && <SMSDisplay   scenario={scenario} selected={selected} phase={phase} onFlagClick={toggleFlag} />}
              {scenario.type === 'call'  && <CallDisplay  scenario={scenario} selected={selected} phase={phase} onFlagClick={toggleFlag} />}
            </div>
            <div className="ss-action-bar">
              <span className="ss-flag-count">
                {foundCount === 0 ? 'Nothing flagged yet' : `${foundCount} thing${foundCount > 1 ? 's' : ''} flagged`}
              </span>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={foundCount === 0}
                style={{ opacity: foundCount === 0 ? 0.4 : 1 }}
              >
                Submit →
              </button>
            </div>
          </>

        ) : ( // results
          <>
            <div className="ss-scenario-wrap">
              <div className="ss-intro-text">{scenario.intro}</div>
              {scenario.type === 'email' && <EmailDisplay scenario={scenario} selected={selected} phase={phase} onFlagClick={() => {}} />}
              {scenario.type === 'sms'   && <SMSDisplay   scenario={scenario} selected={selected} phase={phase} onFlagClick={() => {}} />}
              {scenario.type === 'call'  && <CallDisplay  scenario={scenario} selected={selected} phase={phase} onFlagClick={() => {}} />}
            </div>
            <div className="ss-result-panel">
              <div className={`ss-result-banner`} style={{
                borderColor: foundCount === totalFlags ? 'var(--green-border)' : foundCount > 0 ? 'var(--amber-border)' : 'var(--red-border)',
                background: foundCount === totalFlags ? 'var(--green-bg)' : foundCount > 0 ? 'var(--amber-bg)' : 'var(--red-bg)',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: foundCount === totalFlags ? 'var(--green-text)' : foundCount > 0 ? 'var(--amber-text)' : 'var(--red-text)' }}>
                    {foundCount === totalFlags ? `🎯 Perfect — all ${totalFlags} red flags found` : foundCount > 0 ? `👍 ${foundCount} of ${totalFlags} found` : `⚠️ No flags caught`}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                    +{foundCount * POINTS_PER_FLAG} points · Total: {totalScore}
                  </div>
                </div>
                <button className="btn-outline" onClick={handleNext} style={{ flexShrink: 0 }}>
                  {scenarioIndex + 1 >= SCENARIOS.length ? 'See Results →' : 'Next →'}
                </button>
              </div>

              {scenario.flags.map(flag => {
                const found = selected.has(flag.id);
                return (
                  <div key={flag.id} className="ss-flag-result-card"
                    style={{ borderColor: found ? 'var(--green-border)' : 'var(--red-border)', borderLeft: `3px solid ${found ? 'var(--green-text)' : 'var(--red-text)'}` }}>
                    <div className="ss-flag-result-header">
                      <span style={{ fontSize: 15, color: found ? 'var(--green-text)' : 'var(--red-text)' }}>{found ? '✓' : '✕'}</span>
                      <span style={{ color: found ? 'var(--green-text)' : 'var(--red-text)' }}>{flag.label}</span>
                      {!found && <span style={{ fontSize: 11, marginLeft: 'auto', color: 'var(--red-text)' }}>Missed</span>}
                    </div>
                    <div className="ss-flag-result-body">{flag.explanation}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
