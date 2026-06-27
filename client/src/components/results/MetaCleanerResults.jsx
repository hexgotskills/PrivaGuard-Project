import { useState } from 'react';
import '../../styles/metacleaner.css';

export default function MetaCleanerResults({ data, file, onBack }) {
  const [cleaning, setCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  const handleClean = async () => {
    setCleaning(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/metacleaner/clean`,
        {
          method: 'POST',
          body: fd,
        }
      );
      if (!res.ok) throw new Error('Cleaning failed.');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clean_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      setCleaned(true);
    } catch (e) {
      alert(e.message);
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        style={{ fontSize: 13, color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}
      >
        ← Scan another file
      </button>

      {/* Summary row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{data.filename}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{data.filesize} · {data.totalFieldsFound} metadata fields found</div>
        </div>
        <button
          className="btn-primary"
          onClick={handleClean}
          disabled={cleaning || cleaned}
          style={{ flexShrink: 0 }}
        >
          {cleaning ? '⏳ Cleaning...' : cleaned ? '✓ Downloaded' : '🗑 Remove Metadata & Download'}
        </button>
      </div>

      {/* GPS warning */}
      {data.hasGPS && (
        <div className="meta-gps-warning">
          <span style={{ fontSize: 18 }}>📍</span>
          <div className="meta-gps-warning-text">
            <strong>Location data detected.</strong> This file contains GPS coordinates revealing exactly where it was taken. Remove metadata before sharing publicly.
          </div>
        </div>
      )}

      {/* Metadata groups */}
      {data.groups.length === 0 ? (
        <div className="meta-no-meta">
          ✓ No metadata found in this file. It is already clean.
        </div>
      ) : (
        data.groups.map((group) => (
          <div key={group.label} className="meta-group">
            <div className="meta-group-header">
              <span className="meta-group-icon">{group.icon}</span>
              {group.label}
            </div>
            {group.fields.map((field) => (
              <div key={field.key} className="meta-field-row">
                <span className="meta-field-key">{field.key}</span>
                <span className="meta-field-val">{field.value}</span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
