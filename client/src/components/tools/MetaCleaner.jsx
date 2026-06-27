import { useState, useRef } from 'react';
import '../../styles/metacleaner.css';
import MetaCleanerResults from '../results/MetaCleanerResults';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

export default function MetaCleaner() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef();

  const ACCEPT = '.jpg,.jpeg,.png,.tiff,.tif,.webp,.heic,.pdf';

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/metacleaner/extract`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extraction failed.');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const reset = () => { setFile(null); setResult(null); setError(null); };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>MetaCleaner</h2>
      <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>
        Upload a photo or PDF to see its hidden metadata — then download a clean version with all of it stripped.
      </p>

      {error && <ErrorMessage message={error} />}

      {!result && !loading && (
        <>
          <div
            className={`meta-upload-zone ${dragover ? 'dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <span className="meta-upload-icon">📎</span>
            <div className="meta-upload-label">Drop your file here or click to browse</div>
            <div className="meta-upload-sub" style={{ marginTop: 6 }}>JPEG · PNG · TIFF · WEBP · HEIC · PDF — max 15 MB</div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 10, textAlign: 'center' }}>
            🔒 Your file is processed on our server and never stored or logged.
          </p>
        </>
      )}

      {loading && <LoadingSpinner message={`Scanning ${file?.name || 'file'} for hidden metadata...`} />}

      {result && (
        <MetaCleanerResults
          data={result}
          file={file}
          onBack={reset}
        />
      )}
    </div>
  );
}
