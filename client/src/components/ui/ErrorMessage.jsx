function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: 'var(--red-bg)',
      border: '1px solid var(--red-border)',
      borderRadius: 'var(--r-md)',
      padding: '14px 16px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14.4C4.47 14.4 1.6 11.53 1.6 8C1.6 4.47 4.47 1.6 8 1.6C11.53 1.6 14.4 4.47 14.4 8C14.4 11.53 11.53 14.4 8 14.4ZM7.2 4.8H8.8V8.8H7.2V4.8ZM7.2 10.4H8.8V12H7.2V10.4Z" fill="var(--red-text)"/>
      </svg>
      <span style={{ fontSize: '14px', color: 'var(--red-text)' }}>{message}</span>
    </div>
  );
}

export default ErrorMessage;
