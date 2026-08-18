import axios from 'axios';

/**
 * Checks URL against Google Safe Browsing API v4.
 * Uses realistic heuristic simulation when API key is set to mock/unconfigured.
 */
export async function checkGoogleSafeBrowsing(url) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  if (!apiKey || apiKey === 'mock_google_key') {
    const lower = url.toLowerCase();
    const isThreat =
      lower.includes('free-robux') ||
      lower.includes('free-vbucks') ||
      lower.includes('.xyz') ||
      lower.includes('cheat-injector') ||
      lower.includes('login-steal') ||
      lower.includes('aimbot-download');

    return {
      isMalicious: isThreat,
      threatType: isThreat ? 'PHISHING' : 'NONE',
      reason: isThreat ? 'Detected unverified phishing domain targeting child gaming credentials.' : null,
    };
  }

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const payload = {
      client: { clientId: 'safekids-ai', clientVersion: '1.0.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },
    };

    const response = await axios.post(endpoint, payload, { timeout: 3500 });
    const matches = response.data.matches || [];

    if (matches.length > 0) {
      const matchType = matches[0].threatType;
      return {
        isMalicious: true,
        threatType: matchType === 'SOCIAL_ENGINEERING' ? 'PHISHING' : 'MALWARE',
        reason: `Flagged by Google Safe Browsing as ${matchType}`,
      };
    }

    return { isMalicious: false, threatType: 'NONE', reason: null };
  } catch (error) {
    console.error('Google Safe Browsing API Error:', error.message);
    return { isMalicious: false, threatType: 'NONE', reason: null };
  }
}
