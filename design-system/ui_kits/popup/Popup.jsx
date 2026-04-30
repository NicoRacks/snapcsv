// SnapCSV popup — root state machine + chrome
function Popup({ state, setState, sub, setSub, exportsToday, isPro }) {
  const remaining = Math.max(0, 10 - exportsToday);
  const showFooterNudge = !isPro && state === 'list' && remaining <= 3;
  const showProBadge = isPro;

  return (
    <div className="popup">
      <header className="header">
        <div className="header-logo">
          <img className="logo-mark" src="../../assets/logo-128.png?v2-1777549362726" width="20" height="20" alt="" aria-hidden="true" />
          <span className="logo-text">SnapCSV</span>
        </div>
        {showProBadge && <div className="pro-badge">PRO</div>}
      </header>

      {state === 'scanning' && <ScanningPanel />}
      {state === 'empty' && <EmptyPanel />}
      {state === 'list' && <TableList tables={MOCK_TABLES} onSelect={(t) => { setState('preview'); setSub(t); }} />}
      {state === 'preview' && <PreviewPanel table={sub} onBack={() => setState('list')} onExport={(filename) => { setState('success'); setSub(filename); }} onLimit={() => setState('upgrade')} canExport={isPro || remaining > 0} />}
      {state === 'success' && <SuccessState filename={sub} />}
      {state === 'upgrade' && <UpgradePanel onBack={() => setState('list')} onLicense={() => setState('license')} onLater={() => setState('list')} />}
      {state === 'license' && <LicensePanel variant={sub} onCancel={() => setState('upgrade')} onActivated={() => setState('list')} />}

      {showFooterNudge && (
        <div className="footer-nudge" aria-live="polite" aria-atomic="true">
          <span>{remaining === 0 ? 'No free exports left today.' : `${remaining} free exports left today.`}</span>
          <a className="nudge-link" href="#" target="_blank" rel="noopener noreferrer" aria-label="Go Pro, opens in new tab">Go Pro →</a>
        </div>
      )}
      {isPro && state === 'list' && (
        <div className="footer-nudge licensed">
          <span>Unlimited exports · Pro</span>
        </div>
      )}
    </div>
  );
}

function ScanningPanel() {
  return (
    <div className="state-panel" aria-live="polite" role="status">
      <div className="spinner" aria-hidden="true"></div>
      <p className="state-label">Scanning page…</p>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="state-panel">
      <p className="empty-icon" aria-hidden="true">⊘</p>
      <p className="state-label">No tables found on this page.</p>
      <p className="state-sub">Try a page with HTML &lt;table&gt; elements.</p>
    </div>
  );
}

const MOCK_TABLES = [
  { id: 1, name: 'Table 1', rows: 24, cols: 6, hasHeaders: true, data: { headers: ['Quarter', 'Revenue', 'Growth', 'Region', 'Owner', 'Status'], rows: [['Q1 2026', '$4.2M', '+18%', 'NA', 'A. Park', 'Closed'], ['Q2 2026', '$5.1M', '+22%', 'EU', 'L. Vega', 'Closed'], ['Q3 2026', '$5.8M', '+14%', 'APAC', 'M. Tan', 'Open']] } },
  { id: 2, name: 'Quarterly results', rows: 128, cols: 9, hasHeaders: false, data: { headers: ['col 1', 'col 2', 'col 3', 'col 4'], rows: [['2026-01-01', 'open', '142.50', '0.034'], ['2026-01-02', 'open', '143.10', '0.012'], ['2026-01-03', 'closed', '141.80', '-0.018']] } },
  { id: 3, name: 'Holdings', rows: 42, cols: 5, hasHeaders: true, data: { headers: ['Ticker', 'Shares', 'Avg cost', 'Value', 'P/L'], rows: [['AAPL', '120', '$172.40', '$24,408', '+18.2%'], ['MSFT', '85', '$310.20', '$33,830', '+24.6%'], ['NVDA', '40', '$502.10', '$45,920', '+128.4%']] } },
  { id: 4, name: 'Operating expenses', rows: 16, cols: 4, hasHeaders: true, data: { headers: ['Category', 'Q1', 'Q2', 'Q3'], rows: [['Salaries', '$840k', '$890k', '$920k'], ['Cloud', '$112k', '$128k', '$141k'], ['Marketing', '$220k', '$310k', '$285k']] } },
];

Object.assign(window, { Popup });
