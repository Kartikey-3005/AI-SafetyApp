/**
 * SafeKids AI - Client-Side Real-Time Protection Service Worker
 * Manifest V3 Event-Driven Tracker & Interceptor
 */

const BACKEND_SCAN_ENDPOINT = 'http://localhost:5000/api/scan/url';
const DEFAULT_USER_ID = 'user_child_01';

// Set default extension state on install
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(['shieldEnabled', 'threatsBlockedToday', 'lastResetDate']);
  const today = new Date().toDateString();

  const updates = {};
  if (data.shieldEnabled === undefined) {
    updates.shieldEnabled = true;
  }
  if (data.threatsBlockedToday === undefined || data.lastResetDate !== today) {
    updates.threatsBlockedToday = 0;
    updates.lastResetDate = today;
  }

  if (Object.keys(updates).length > 0) {
    await chrome.storage.local.set(updates);
  }
  console.log('[SafeKids AI] Service worker initialized and ready.');
});

// Cache recently verified blocked URLs to prevent redirect loops
const pendingScanCache = new Map();

/**
 * Filter out browser internals and safe origins
 */
function shouldIgnoreUrl(url) {
  if (!url) return true;
  const ignoredProtocols = ['chrome:', 'chrome-extension:', 'about:', 'edge:', 'devtools:', 'view-source:', 'data:'];
  return (
    ignoredProtocols.some((protocol) => url.startsWith(protocol)) ||
    url.includes('blocked.html')
  );
}

/**
 * Increment daily blocked threats counter in storage
 */
async function incrementBlockedCounter() {
  const today = new Date().toDateString();
  const data = await chrome.storage.local.get(['threatsBlockedToday', 'lastResetDate']);
  let count = (data.lastResetDate === today ? (data.threatsBlockedToday || 0) : 0) + 1;
  await chrome.storage.local.set({
    threatsBlockedToday: count,
    lastResetDate: today
  });
}

/**
 * Core Tracker: Listener on tab navigation and URL updates
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only trigger when the page starts loading with a valid URL
  if (changeInfo.status !== 'loading' || !changeInfo.url) {
    return;
  }

  const destinationUrl = changeInfo.url;

  if (shouldIgnoreUrl(destinationUrl)) {
    return;
  }

  try {
    // 1. Check parent shield status in storage
    const { shieldEnabled = true } = await chrome.storage.local.get('shieldEnabled');
    if (!shieldEnabled) {
      console.log('[SafeKids AI] Shield disabled by parent. Skipping scan for:', destinationUrl);
      return;
    }

    // 2. Transmit destination URL to local SafeKids backend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s fail-safe timeout

    const response = await fetch(BACKEND_SCAN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: destinationUrl,
        userId: DEFAULT_USER_ID
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));

    // 3. Blocking Logic: On 403 Forbidden or status === 'BLOCKED'
    if (response.status === 403) {
      const scanData = await response.json();
      console.warn('[SafeKids AI] ⚠️ Threat Intercepted:', scanData);

      await incrementBlockedCounter();

      const reason = encodeURIComponent(scanData.category || scanData.blockedReason || 'High Risk Threat');
      const explanation = encodeURIComponent(
        scanData.childFriendlyExplanation ||
        scanData.explanation ||
        '🛡️ SafeKids AI detected unsafe content on this page and blocked it to protect you.'
      );
      const originalUrl = encodeURIComponent(destinationUrl);

      const blockedPageUrl = chrome.runtime.getURL(
        `blocked.html?reason=${reason}&explanation=${explanation}&originalUrl=${originalUrl}`
      );

      // Immediately redirect child tab to local blocked warning screen
      chrome.tabs.update(tabId, { url: blockedPageUrl });
    } else {
      console.log('[SafeKids AI] ✅ URL clean:', destinationUrl);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('[SafeKids AI] Backend scan timed out for:', destinationUrl);
    } else {
      console.error('[SafeKids AI] Backend connection error:', error.message);
    }
    // Fail-open or continue silently if backend is momentarily unreachable
  }
});
