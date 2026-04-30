// SnapCSV license panel
function LicensePanel({ variant, onCancel, onActivated }) {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(null);
  const [slow, setSlow] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const errorId = 'license-error';

  // Demo variant: pre-fill error or slow state
  React.useEffect(() => {
    if (variant === 'error') { setValue('WRONG-KEY-123'); setError('Invalid license key.'); }
    else if (variant === 'slow') { setValue('A1B2C3D4-E5F6-G7H8'); setSlow(true); }
  }, [variant]);

  const handleActivate = () => {
    setError(null); setSlow(false);
    if (!value || value.length < 8) { setError('Invalid license key.'); return; }
    setWorking(true);
    const slowTimer = setTimeout(() => setSlow(true), 1500);
    setTimeout(() => {
      clearTimeout(slowTimer);
      setWorking(false);
      // valid keys start with VALID
      if (value.toUpperCase().startsWith('VALID')) onActivated();
      else setError('Invalid license key.');
    }, 800);
  };

  return (
    <div className="license-panel">
      <div className="license-box">
        <label htmlFor="license-key" className="panel-title" style={{ padding: '0 0 2px' }}>Activate Pro License</label>
        <input
          id="license-key"
          className={`license-input ${error ? 'error' : ''}`}
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          placeholder="Paste your license key…"
          autoComplete="off"
          spellCheck={false}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
        />
        <div className="license-actions">
          <button className="btn-primary" type="button" onClick={handleActivate} disabled={working}>{working ? 'Activating…' : 'Activate'}</button>
          <button className="btn-ghost" type="button" onClick={onCancel}>Cancel</button>
        </div>
        {error && <p id={errorId} className="license-error" role="alert">{error}</p>}
        {slow && !error && <p className="license-slow">Taking longer than expected — check your connection.</p>}
      </div>
    </div>
  );
}

Object.assign(window, { LicensePanel });
