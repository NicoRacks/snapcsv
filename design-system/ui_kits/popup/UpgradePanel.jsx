// SnapCSV upgrade panel
function UpgradePanel({ onBack, onLicense, onLater }) {
  return (
    <div className="upgrade-panel">
      <div className="upgrade-nav">
        <button className="back-btn" type="button" onClick={onBack}>← Back</button>
      </div>
      <div className="upgrade-box">
        <p className="upgrade-title">Daily limit reached</p>
        <p className="upgrade-body">You've exported 10 tables today.<br/>Upgrade to SnapCSV Pro for unlimited exports.</p>
        <div className="upgrade-actions">
          <a className="btn-upgrade" href="#" target="_blank" rel="noopener noreferrer" aria-label="Upgrade for $19 one-time, opens in new tab">Upgrade — $19 one-time</a>
          <button className="btn-secondary" type="button" onClick={onLicense}>Activate license key</button>
          <button className="btn-ghost" type="button" onClick={onLater}>Maybe later</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { UpgradePanel });
