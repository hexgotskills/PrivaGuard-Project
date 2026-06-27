function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 0'
    }}>
      <div className="spinner"></div>
      <div style={{ fontSize: '14px', color: 'var(--text-2)', marginTop: '16px' }}>{message}</div>
      <style>{`
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--bg-3);
          border-top-color: var(--text);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
