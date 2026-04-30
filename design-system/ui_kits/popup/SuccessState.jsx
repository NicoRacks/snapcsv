// SnapCSV success state — auto-dismisses after 3s in the real product
function SuccessState({ filename }) {
  return (
    <div className="success-state" aria-live="polite" role="status">
      <div className="success-box">
        <span className="success-icon" aria-hidden="true">✓</span>
        <div>
          <p className="success-title">Exported!</p>
          <p className="success-filename">{filename}</p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SuccessState });
