// SnapCSV — analytics.js
// Google Analytics 4 via Measurement Protocol (MV3 compliant — no remote code)
// Docs: https://developer.chrome.com/docs/extensions/how-to/integrate/google-analytics-4

import { MEASUREMENT_ID, API_SECRET } from './ga-config.js';

const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const SESSION_EXPIRATION_IN_MIN = 30;
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

// ─── Client ID ────────────────────────────────────────────────────────────────
// Persistent random ID stored in chrome.storage.local — survives browser restarts.
// Format: <10-digit-random>.<unix-timestamp> — matches GA4 client_id convention.

function getRandomId() {
  const digits = '123456789'.split('');
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += digits[Math.floor(Math.random() * 9)];
  }
  return result;
}

export async function getOrCreateClientId() {
  const result = await chrome.storage.local.get('clientId');
  let clientId = result.clientId;
  if (!clientId) {
    const unixTimestampSeconds = Math.floor(Date.now() / 1000);
    clientId = `${getRandomId()}.${unixTimestampSeconds}`;
    await chrome.storage.local.set({ clientId });
  }
  return clientId;
}

// ─── Session ID ───────────────────────────────────────────────────────────────
// Stored in chrome.storage.session — cleared when browser closes.
// Resets after 30 minutes of inactivity per GA4 session convention.

export async function getOrCreateSessionId() {
  let { sessionData } = await chrome.storage.session.get('sessionData');
  const currentTimeInMs = Date.now();

  if (sessionData && sessionData.timestamp) {
    const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
    if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
      sessionData = null;
    } else {
      sessionData.timestamp = currentTimeInMs;
      await chrome.storage.session.set({ sessionData });
    }
  }

  if (!sessionData) {
    sessionData = {
      session_id: currentTimeInMs.toString(),
      timestamp: currentTimeInMs,
    };
    await chrome.storage.session.set({ sessionData });
  }

  return sessionData.session_id;
}

// ─── Send Event ───────────────────────────────────────────────────────────────
// Main export — call this from popup.js and background.js.
// Silently no-ops if credentials are not configured or network fails.
// Analytics errors NEVER surface to the user or affect extension functionality.

export async function sendEvent(name, params = {}) {
  // Skip silently if credentials haven't been configured yet
  if (!MEASUREMENT_ID || MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

  try {
    const [clientId, sessionId] = await Promise.all([
      getOrCreateClientId(),
      getOrCreateSessionId(),
    ]);

    await fetch(
      `${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
          events: [
            {
              name,
              params: {
                session_id: sessionId,
                engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
                ...params,
              },
            },
          ],
        }),
      }
    );
  } catch {
    // Network failures are silent — analytics must never break the extension
  }
}
