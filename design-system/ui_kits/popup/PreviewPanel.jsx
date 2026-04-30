// SnapCSV preview panel
function PreviewPanel({ table, onBack, onExport, onLimit, canExport }) {
  const handleExport = () => {
    if (!canExport) { onLimit(); return; }
    const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    onExport(`snapcsv-export-${new Date().toISOString().slice(0,10)}-${ts.slice(8,14)}.csv`);
  };

  const headers = table.data.headers;
  const rows = table.data.rows.slice(0, 3);

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <button className="back-btn" type="button" onClick={onBack}>← Back</button>
        <span className="preview-title" title={table.name}>{table.name}</span>
      </div>
      {!table.hasHeaders && (
        <div className="no-headers-notice" role="status">⚠ No headers detected — first row is data</div>
      )}
      <div className="preview-table-wrap">
        <table className="preview-table">
          <caption className="sr-only">Preview of first 3 rows of {table.name}</caption>
          <thead>
            <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="export-area">
        <button className="btn-primary" type="button" onClick={handleExport}>Export CSV</button>
      </div>
    </div>
  );
}

Object.assign(window, { PreviewPanel });
