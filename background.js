// SnapCSV — background.js (Service Worker)

import { sendEvent } from './analytics.js';

const LEMONSQUEEZY_API = 'https://api.lemonsqueezy.com/v1/licenses';
const FREE_DAILY_LIMIT = 10;

// ─── Shared Helpers ───────────────────────────────────────────────────────────

// Single shared pad helper — used by buildFilename() and todayString()
const pad = (n) => String(n).padStart(2, '0');

// ─── CSV Generation ───────────────────────────────────────────────────────────

function escapeCell(cell) {
  const str = String(cell == null ? '' : cell).trim();
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function tableToCSV(tableData) {
  const lines = [];
  // Only add a header row if headers were detected — don't invent them
  if (tableData.headers && tableData.headers.length > 0) {
    lines.push(tableData.headers.map(escapeCell).join(','));
  }
  for (const row of tableData.rows) {
    lines.push(row.map(escapeCell).join(','));
  }
  return lines.join('\n');
}

function buildFilename() {
  const now = new Date();
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `snapcsv-export-${date}-${time}.csv`;
}

// ─── Storage Helpers ──────────────────────────────────────────────────────────

function getStorage(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

function setStorage(data) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

function todayString() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// ─── License Validation ───────────────────────────────────────────────────────

async function validateStoredLicense() {
  const data = await getStorage(['licenseKey', 'licenseInstanceId', 'licenseValidatedAt']);
  const { licenseKey, licenseInstanceId, licenseValidatedAt } = data;

  if (!licenseKey || !licenseInstanceId) return { valid: false };

  // Cache: skip network call if validated within the last 24 hours
  if (licenseValidatedAt) {
    const ageMs = Date.now() - new Date(licenseValidatedAt).getTime();
    if (ageMs < 24 * 60 * 60 * 1000) return { valid: true, cached: true };
  }

  try {
    const res = await fetch(`${LEMONSQUEEZY_API}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ license_key: licenseKey, instance_id: licenseInstanceId }),
    });
    const json = await res.json();
    if (json.valid) {
      await setStorage({ licenseValidatedAt: new Date().toISOString() });
      return { valid: true };
    }
    return { valid: false };
  } catch {
    // Network error — if key is stored, assume valid to avoid blocking offline users
    return { valid: true, offline: true };
  }
}

async function activateLicense(licenseKey) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${LEMONSQUEEZY_API}/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ license_key: licenseKey, instance_name: 'SnapCSV' }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const json = await res.json();

    if (json.activated && json.instance) {
      await setStorage({
        licenseKey: licenseKey,
        licenseInstanceId: json.instance.id,
        licenseValidatedAt: new Date().toISOString(),
      });
      return { success: true };
    }

    const errorMsg = json.error || 'Invalid license key.';
    return { success: false, error: errorMsg };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { success: false, error: 'Request timed out. Check your connection and try again.' };
    }
    return { success: false, error: 'Network error. Please check your connection.' };
  }
}

// ─── Usage Gate + Export ──────────────────────────────────────────────────────

async function checkUsageAndExport(tableData) {
  // Guard: validate tableData structure before processing
  if (!tableData || !Array.isArray(tableData.rows)) {
    return { success: false, error: 'Invalid table data.' };
  }

  // 1. Check license first
  const licenseStatus = await validateStoredLicense();
  if (licenseStatus.valid) {
    return triggerDownload(tableData);
  }

  // 2. Check daily usage
  const today = todayString();
  const data = await getStorage(['exportCount', 'exportDate']);
  let { exportCount = 0, exportDate = today } = data;

  if (exportDate !== today) {
    exportCount = 0;
    exportDate = today;
  }

  if (exportCount >= FREE_DAILY_LIMIT) {
    return { blocked: true, exportCount, limit: FREE_DAILY_LIMIT };
  }

  // 3. Allowed — export and increment counter (with error handling)
  const result = await triggerDownload(tableData);

  try {
    await setStorage({ exportCount: exportCount + 1, exportDate });
  } catch (err) {
    console.warn('SnapCSV: failed to persist export count', err);
  }

  return { ...result, exportCount: exportCount + 1, remaining: FREE_DAILY_LIMIT - exportCount - 1 };
}

async function triggerDownload(tableData) {
  const csvContent = tableToCSV(tableData);
  const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
  const filename = buildFilename();

  return new Promise((resolve) => {
    chrome.downloads.download({ url: dataUrl, filename, saveAs: false }, (downloadId) => {
      if (chrome.runtime.lastError) {
        resolve({ success: false, error: chrome.runtime.lastError.message });
      } else {
        resolve({ success: true, filename, downloadId });
      }
    });
  });
}

async function getUsageStatus() {
  const today = todayString();
  const data = await getStorage(['exportCount', 'exportDate', 'licenseKey', 'licenseInstanceId']);
  let { exportCount = 0, exportDate = today, licenseKey, licenseInstanceId } = data;

  if (exportDate !== today) {
    exportCount = 0;
  }

  const licensed = !!(licenseKey && licenseInstanceId);
  const remaining = Math.max(0, FREE_DAILY_LIMIT - exportCount);

  return { exportCount, exportDate, licensed, remaining, limit: FREE_DAILY_LIMIT };
}

// ─── Message Listener ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action } = message;

  if (action === 'export') {
    checkUsageAndExport(message.tableData).then(sendResponse);
    return true; // keep channel open for async response
  }

  if (action === 'activateLicense') {
    activateLicense(message.licenseKey).then(sendResponse);
    return true;
  }

  if (action === 'getUsageStatus') {
    getUsageStatus().then(sendResponse);
    return true;
  }
});

// ─── Error Tracking ───────────────────────────────────────────────────────────
// Catch unhandled promise rejections in the service worker.
// Stack traces are stripped before sending to avoid leaking personal data.

addEventListener('unhandledrejection', async (event) => {
  const error = event.reason;
  await sendEvent('extension_error', {
    message: error?.message?.substring(0, 100) ?? 'unknown',
  });
});
