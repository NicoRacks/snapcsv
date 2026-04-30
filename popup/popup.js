// SnapCSV — popup.js

import { sendEvent } from '../analytics.js';

// ─── State ────────────────────────────────────────────────────────────────────

let tables = [];
let selectedTable = null;
let pendingExportTable = null; // held while upgrade prompt is shown

// ─── DOM Refs ─────────────────────────────────────────────────────────────────

const $ = (id) => document.getElementById(id);

const panels = {
  scanning:       $('scanning'),
  empty:          $('empty-state'),
  tableList:      $('table-list-panel'),
  preview:        $('preview-panel'),
  upgrade:        $('upgrade-prompt'),
  licenseInput:   $('license-input-panel'),
  success:        $('success-state'),
};

// ─── Panel Switching ──────────────────────────────────────────────────────────

function showPanel(name) {
  Object.values(panels).forEach(el => el.classList.add('hidden'));
  if (panels[name]) panels[name].classList.remove('hidden');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  showPanel('scanning');

  // Restore any pending export that survived a popup close
  chrome.storage.local.get(['pendingExportData'], (data) => {
    if (data.pendingExportData) {
      try {
        pendingExportTable = JSON.parse(data.pendingExportData);
      } catch {
        chrome.storage.local.remove('pendingExportData');
      }
    }
  });

  // Single getUsageStatus call — result used for both PRO badge and footer nudge
  chrome.runtime.sendMessage({ action: 'getUsageStatus' }, (status) => {
    if (chrome.runtime.lastError || !status) return;
    if (status.licensed) {
      $('pro-badge').classList.remove('hidden');
    }
    // Store status for use after scan completes
    window._usageStatus = status;
  });

  sendEvent('page_view', {
    page_title: document.title,
    page_location: document.location.href,
  });

  await scanTables();
  setupListeners();
});

// ─── Table Scanning ───────────────────────────────────────────────────────────

async function scanTables() {
  let tab;
  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  } catch {
    showEmpty();
    return;
  }

  if (!tab || !tab.id) {
    showEmpty(
      'Unable to scan this page.',
      'This page type restricts script injection. Try a regular website.'
    );
    return;
  }

  let results;
  try {
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scanTablesOnPage,
    });
  } catch (err) {
    showEmpty(
      'Unable to scan this page.',
      'This page type restricts script injection. Try a regular website.'
    );
    return;
  }

  tables = results?.[0]?.result ?? [];

  if (tables.length === 0) {
    sendEvent('no_tables_found');
    showEmpty();
    return;
  }

  sendEvent('tables_found', { table_count: tables.length });
  renderTableList();
  showPanel('tableList');

  // Apply soft nudge using the status fetched during init (avoid a second round-trip)
  const status = window._usageStatus;
  if (status && !status.licensed && status.remaining <= 3) {
    showFooterNudge(status.remaining);
  }
}

// ─── Injected function (runs in page context) ─────────────────────────────────

function scanTablesOnPage() {
  const tables = document.querySelectorAll('table');

  return Array.from(tables).map((table, index) => {

    // ── 1. Collect all non-empty rows ──────────────────────────────────────
    const allTrs = Array.from(table.querySelectorAll('tr'))
      .filter(r => r.querySelectorAll('td,th').length > 0);
    if (allTrs.length === 0) return null;

    // ── 2. Compute modal (most common) cell count ──────────────────────────
    //    This is the table's true column width, immune to anomalous wide rows.
    const countFreq = {};
    allTrs.forEach(r => {
      const n = r.querySelectorAll('td,th').length;
      countFreq[n] = (countFreq[n] || 0) + 1;
    });
    const modalCount = Number(
      Object.keys(countFreq).reduce((a, b) => countFreq[a] > countFreq[b] ? a : b)
    );

    // ── 3. Classify rows: section headers vs content rows ──────────────────
    //    A row is a section header if it has fewer cells than the modal AND
    //    is either a single cell or has a colspan covering the full width.
    //    Section label text is preserved for CSV separator rows.
    const contentRows = [];
    const sectionLabels = new Map();
    let pendingSection = null;

    allTrs.forEach(r => {
      const cells = r.querySelectorAll('td,th');
      const cellCount = cells.length;
      const firstCellColspan = cellCount === 1
        ? (parseInt(cells[0].getAttribute('colspan') || '1', 10))
        : 1;
      const isSectionHeader =
        cellCount < modalCount && (cellCount === 1 || firstCellColspan >= modalCount);

      if (isSectionHeader) {
        pendingSection = cells[0].textContent.trim().replace(/\s+/g, ' ');
      } else {
        if (pendingSection !== null) {
          sectionLabels.set(contentRows.length, pendingSection);
          pendingSection = null;
        }
        contentRows.push(r);
      }
    });

    if (contentRows.length === 0) return null;

    // ── 4. Detect headers (priority: thead → all-th row → generic fallback)
    const thead = table.querySelector('thead');
    let headers;
    let dataRows;

    if (thead) {
      const theadThs = thead.querySelectorAll('th');
      if (theadThs.length > 0) {
        headers = Array.from(theadThs).map((c, i) =>
          c.textContent.trim().replace(/\s+/g, ' ') || `Column ${i + 1}`);
        dataRows = contentRows.filter(r => !thead.contains(r));
      }
    }

    if (!headers) {
      const firstRow = contentRows[0];
      const firstCells = firstRow.querySelectorAll('td,th');
      const allTh = Array.from(firstCells).every(c => c.tagName === 'TH');

      if (allTh) {
        headers = Array.from(firstCells).map((c, i) =>
          c.textContent.trim().replace(/\s+/g, ' ') || `Column ${i + 1}`);
        dataRows = contentRows.slice(1);
      } else if (sectionLabels.size > 0) {
        // Has section labels (e.g. Yahoo Finance key-value tables) — Metric/Value is accurate
        headers = modalCount === 2
          ? ['Metric', 'Value']
          : Array.from({ length: modalCount }, (_, i) => `Column ${i + 1}`);
        dataRows = contentRows;
      } else {
        // Truly headerless — no th, no section labels — don't invent headers
        headers = [];
        dataRows = contentRows;
      }
    }

    // ── 5. Extract rows, embedding section labels as CSV separator rows ─────
    const extractedRows = [];
    dataRows.forEach(r => {
      const idx = contentRows.indexOf(r);
      if (sectionLabels.has(idx)) {
        const sep = Array(headers.length).fill('');
        sep[0] = `── ${sectionLabels.get(idx)} ──`;
        extractedRows.push(sep);
      }
      extractedRows.push(
        Array.from(r.querySelectorAll('td,th')).map(c =>
          c.textContent.trim().replace(/\s+/g, ' ')
        )
      );
    });

    const colCount = Math.max(...extractedRows.map(r => r.length), headers.length);

    return {
      index,
      rowCount: extractedRows.length,
      colCount,
      headers,
      previewRows: extractedRows.slice(0, 3),
      rows: extractedRows,
    };

  }).filter(Boolean);
}

// ─── Render Table List ────────────────────────────────────────────────────────

function renderTableList() {
  const list = $('table-list');
  list.innerHTML = '';

  tables.forEach((table) => {
    const li = document.createElement('li');
    li.className = 'table-item';
    li.dataset.index = table.index;

    const idx = document.createElement('span');
    idx.className = 'table-item-index';
    idx.textContent = table.index + 1;

    const info = document.createElement('div');
    info.className = 'table-item-info';

    const name = document.createElement('div');
    name.className = 'table-item-name';
    name.textContent = `Table ${table.index + 1}`;

    const meta = document.createElement('div');
    meta.className = 'table-item-meta';
    meta.textContent = `${table.rowCount} rows · ${table.colCount} columns`;

    const arrow = document.createElement('span');
    arrow.className = 'table-item-arrow';
    arrow.textContent = '›';

    info.appendChild(name);
    info.appendChild(meta);
    li.appendChild(idx);
    li.appendChild(info);
    li.appendChild(arrow);

    // Keyboard accessibility — table items act as buttons
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.addEventListener('click', () => selectTable(table));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectTable(table);
      }
    });
    list.appendChild(li);
  });
}

function showEmpty(msg, sub) {
  if (msg) $('empty-state').querySelector('.state-label').textContent = msg;
  if (sub) $('empty-state').querySelector('.state-sub').textContent = sub;
  showPanel('empty');
}

// ─── Select Table & Preview ───────────────────────────────────────────────────

function selectTable(table) {
  selectedTable = table;

  sendEvent('table_selected', {
    table_index: table.index,
    row_count: table.rowCount,
    col_count: table.colCount,
    has_headers: table.headers && table.headers.length > 0,
  });

  // Highlight selected item
  document.querySelectorAll('.table-item').forEach(el => el.classList.remove('selected'));
  const item = document.querySelector(`.table-item[data-index="${table.index}"]`);
  if (item) item.classList.add('selected');

  renderPreview(table);
  showPanel('preview');
}

function renderPreview(table) {
  $('preview-title').textContent = `Table ${table.index + 1} · ${table.rowCount} rows · ${table.colCount} cols`;

  // Show/hide no-headers notice
  const notice = $('no-headers-notice');
  if (!table.headers || table.headers.length === 0) {
    notice.classList.remove('hidden');
  } else {
    notice.classList.add('hidden');
  }

  const t = $('preview-table');
  t.innerHTML = '';

  // Accessible caption — announced by screen readers when table receives focus
  const caption = document.createElement('caption');
  caption.className = 'sr-only';
  caption.textContent = `Table ${table.index + 1}: ${table.rowCount} rows, ${table.colCount} columns`;
  t.appendChild(caption);

  const effectiveHeaders = (table.headers && table.headers.length > 0) ? table.headers : null;

  // Header row (only if headers exist)
  if (effectiveHeaders) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    effectiveHeaders.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      th.title = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    t.appendChild(thead);
  }

  // Data rows (up to 3)
  const tbody = document.createElement('tbody');
  (table.previewRows || []).forEach(row => {
    const tr = document.createElement('tr');
    // Pad row to header length (or actual column count for headerless)
    const cells = [...row];
    const targetLen = effectiveHeaders ? effectiveHeaders.length : table.colCount;
    while (cells.length < targetLen) cells.push('');
    cells.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      td.title = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  t.appendChild(tbody);
}

// ─── Export ───────────────────────────────────────────────────────────────────

async function handleExport(table) {
  const exportBtn = $('export-btn');
  exportBtn.disabled = true;
  exportBtn.textContent = 'Exporting…';

  chrome.runtime.sendMessage(
    { action: 'export', tableData: table },
    (response) => {
      exportBtn.disabled = false;
      exportBtn.textContent = 'Export CSV';

      if (!response) {
        showExportError('Extension error. Try reloading the popup.');
        return;
      }

      if (response.blocked) {
        pendingExportTable = table;
        chrome.storage.local.set({ pendingExportData: JSON.stringify(table) });
        sendEvent('export_blocked', { export_count: response.exportCount });
        sendEvent('upgrade_prompt_shown');
        showPanel('upgrade');
        return;
      }

      if (response.success) {
        sendEvent('export_success', {
          remaining: response.remaining ?? 'unlimited',
          is_licensed: response.remaining === undefined,
        });
        showSuccess(response.filename);
        // Update nudge if still on free tier
        if (response.remaining !== undefined && response.remaining <= 3 && response.remaining >= 0) {
          showFooterNudge(response.remaining);
        } else {
          hideFooterNudge();
        }
      } else {
        showExportError(response.error || 'Export failed.');
      }
    }
  );
}

function showExportError(msg) {
  const exportArea = $('export-area');
  let err = exportArea.querySelector('.export-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'license-error export-error';
    err.setAttribute('role', 'alert'); // announced immediately by screen readers
    exportArea.appendChild(err);
  }
  err.textContent = msg;
  err.classList.remove('hidden');
}

// ─── Success State ────────────────────────────────────────────────────────────

function showSuccess(filename) {
  $('success-filename').textContent = filename;
  showPanel('success');
  setTimeout(() => {
    if (tables.length > 0) {
      showPanel('tableList');
    }
  }, 3000);
}

// ─── Footer Nudge ─────────────────────────────────────────────────────────────

function showFooterNudge(remaining) {
  const nudge = $('footer-nudge');
  const text = $('nudge-text');
  if (remaining === 0) {
    text.textContent = 'No free exports left today.';
  } else {
    text.textContent = `${remaining} free export${remaining === 1 ? '' : 's'} left today.`;
  }
  nudge.classList.remove('hidden');
}

function hideFooterNudge() {
  $('footer-nudge').classList.add('hidden');
}

// ─── License Activation ───────────────────────────────────────────────────────

function handleActivate() {
  const key = $('license-key-input').value.trim();
  const errorEl = $('license-error');
  const activateBtn = $('activate-btn');
  const slowWarning = $('license-slow-warning');

  errorEl.classList.add('hidden');
  slowWarning.classList.add('hidden');

  if (!key) {
    errorEl.textContent = 'Please paste your license key.';
    errorEl.classList.remove('hidden');
    return;
  }

  activateBtn.disabled = true;
  activateBtn.textContent = 'Activating…';

  // Show "taking longer than expected" warning after 8 seconds
  const slowTimer = setTimeout(() => {
    slowWarning.classList.remove('hidden');
  }, 8000);

  chrome.runtime.sendMessage({ action: 'activateLicense', licenseKey: key }, (response) => {
    clearTimeout(slowTimer);
    activateBtn.disabled = false;
    activateBtn.textContent = 'Activate';
    slowWarning.classList.add('hidden');

    if (!response || !response.success) {
      errorEl.textContent = response?.error || 'Activation failed. Check your key and try again.';
      errorEl.classList.remove('hidden');
      sendEvent('license_activation_failed');
      return;
    }

    sendEvent('license_activated');
    // Pro activated!
    showProActivated();

    // If there's a pending export, run it now
    if (pendingExportTable) {
      const table = pendingExportTable;
      pendingExportTable = null;
      chrome.storage.local.remove('pendingExportData');
      setTimeout(() => handleExport(table), 300);
    }
  });
}

function showProActivated() {
  // Show PRO badge in header
  $('pro-badge').classList.remove('hidden');
  hideFooterNudge();

  // Show success briefly then return to list/preview
  $('success-filename').textContent = 'Pro activated — unlimited exports!';
  $('success-state').querySelector('.success-title').textContent = 'Pro Activated ✓';
  showPanel('success');

  setTimeout(() => {
    if (selectedTable) {
      showPanel('preview');
    } else if (tables.length > 0) {
      showPanel('tableList');
    }
    // Reset success title for future use
    $('success-state').querySelector('.success-title').textContent = 'Exported!';
  }, 2500);
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

function setupListeners() {
  // Back button (preview → table list)
  $('back-btn').addEventListener('click', () => {
    showPanel('tableList');
  });

  // Dismiss upgrade prompt — both ← Back and "Maybe later" use the same logic
  $('dismiss-upgrade-btn').addEventListener('click', dismissUpgrade);
  $('maybe-later-btn').addEventListener('click', dismissUpgrade);

  // Export button
  $('export-btn').addEventListener('click', () => {
    if (selectedTable) handleExport(selectedTable);
  });

  // Track upgrade link click
  $('upgrade-link').addEventListener('click', () => {
    sendEvent('upgrade_clicked');
  });

  // Upgrade prompt: show license input
  $('show-license-btn').addEventListener('click', () => {
    $('license-key-input').value = '';
    $('license-error').classList.add('hidden');
    $('license-slow-warning').classList.add('hidden');
    showPanel('licenseInput');
  });

  // Activate license
  $('activate-btn').addEventListener('click', handleActivate);

  // Allow Enter key in license input
  $('license-key-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleActivate();
  });

  // Cancel license input
  $('cancel-license-btn').addEventListener('click', cancelLicenseInput);

  // Escape key closes license panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('license-input-panel').classList.contains('hidden')) {
      cancelLicenseInput();
    }
  });
}

function dismissUpgrade() {
  if (selectedTable) {
    showPanel('preview');
  } else {
    showPanel('tableList');
  }
}

function cancelLicenseInput() {
  if (pendingExportTable) {
    showPanel('upgrade');
  } else if (selectedTable) {
    showPanel('preview');
  } else {
    // No pending export — clear stored pending data too
    chrome.storage.local.remove('pendingExportData');
    showPanel('tableList');
  }
}
