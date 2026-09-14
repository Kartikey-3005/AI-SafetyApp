import net from 'net';
import axios from 'axios';
import prisma, { isDbConnected } from '../config/prisma.js';
import { redisClient } from '../config/redis.js';

// Cache TTL Configurations
export const CACHE_TTL_SECONDS = 86400; // 24 Hours for Redis cached URLs
const REGIONAL_DOMAIN_TTL = 3600; // 1 Hour for India blocklist cache

// 1. Explicit / Adult keywords list
export const adultKeywords = [
  'porn',
  'xxx',
  'xvideos',
  'pornhub',
  'sex',
  'onlyfans',
  'chaturbate',
  'redtube',
  'youporn',
  'cam4',
  'adult'
];

// 2. Regionally Banned Domains (e.g. Indian DoT Orders, illegal betting, predatory streams)
export const indiaBannedDomains = [
  'desiflix.com',
  'neonxvip.com',
  'ullu.app',
  'banned-betting-india.in',
  'illegal-gambling-hub.com',
  'satta-matka-online.net',
  'bet365-unauthorized.in',
  'predatory-crypto-ponzi.org',
  'fairplay-banned-mirror.in'
];

// 3. Suspicious / High-Risk TLDs targeting kids or commonly used in malicious phishing
export const HIGH_RISK_TLDS = new Set([
  '.xyz',
  '.top',
  '.zip',
  '.onion',
  '.cc',
  '.tk',
  '.gq',
  '.work',
  '.buzz',
  '.country',
  '.mov'
]);

/**
 * Normalizes input URL and extracts hostname, protocol, and pathname using Node's native URL
 */
export function parseAndNormalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('URL must be a non-empty string');
  }

  // Strip markdown brackets [], parentheses (), and trailing whitespace
  let cleanUrl = rawUrl.replace(/[\[\]\(\)]/g, '').trim();

  if (!/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = `http://${cleanUrl}`;
  }

  const parsed = new URL(cleanUrl);
  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();
  const pathname = parsed.pathname;

  return {
    rawUrl,
    cleanUrl,
    normalizedUrl: parsed.origin + pathname,
    hostname,
    protocol,
    pathname,
    port: parsed.port,
    parsed
  };
}

/**
 * Tier 1 - Heuristics & Regional Compliance (Instant Local Filtering)
 * Evaluates in strict sequence:
 *  1. Adult/explicit keyword list
 *  2. Known regionally banned domains (India DoT orders)
 *  3. Raw IP access (IPv4/IPv6)
 *  4. Suspicious TLDs (.xyz, .top, .zip, etc.)
 */
export async function evaluateTier1Heuristics({ hostname, protocol, rawUrl }) {
  const normalizedHost = hostname.replace(/^www\./, '').toLowerCase();

  // A. Adult / Explicit Content Check
  const matchedAdult = adultKeywords.find((kw) => normalizedHost.includes(kw));
  if (matchedAdult) {
    return {
      isThreat: true,
      category: 'Adult/Explicit Content',
      threatType: 'UNVERIFIED_ADULT',
      reason: `Explicit/Adult keyword detected ("${matchedAdult}") in domain.`,
      childFriendlyExplanation: '🛡️ "Hold on! Explicit adult websites are blocked to keep you safe."',
      layer: 'TIER_1_HEURISTICS_ADULT',
    };
  }

  // B. Regional Compliance / India DoT Blocklist Check
  // Check Redis cache for regional lookup
  const regCacheKey = `blocklist:india:${normalizedHost}`;
  try {
    const cachedReg = await redisClient.get(regCacheKey);
    if (cachedReg === '1') {
      return {
        isThreat: true,
        category: 'Regionally Banned Content',
        threatType: 'GOVERNMENT_DIRECTIVE',
        reason: 'Regionally Banned Content (India DoT order / MeitY directive)',
        childFriendlyExplanation: '🛡️ "This website has been restricted by national cyber directives to protect users from illegal gambling, betting, or unrated content."',
        layer: 'TIER_1_REGIONAL_BANNED',
      };
    }
  } catch (err) {
    console.warn('[Redis] Regional cache read warning:', err.message);
  }

  // Check DB or Seed List
  let isRegionallyBanned = indiaBannedDomains.some((domain) => normalizedHost.includes(domain));
  if (!isRegionallyBanned && isDbConnected() && prisma?.indiaBlocklist) {
    try {
      const record = await prisma.indiaBlocklist.findFirst({
        where: {
          domain: { in: [normalizedHost, `www.${normalizedHost}`] },
          isActive: true,
        },
      });
      if (record) isRegionallyBanned = true;
    } catch (dbErr) {
      console.warn('[DB] IndiaBlocklist check notice:', dbErr.message);
    }
  }

  // Cache lookup result in Redis
  try {
    await redisClient.set(regCacheKey, isRegionallyBanned ? '1' : '0', { EX: REGIONAL_DOMAIN_TTL });
  } catch (e) {
    // silently proceed
  }

  if (isRegionallyBanned) {
    return {
      isThreat: true,
      category: 'Regionally Banned Content',
      threatType: 'GOVERNMENT_DIRECTIVE',
      reason: 'Regionally Banned Content (India DoT / MeitY Directive)',
      childFriendlyExplanation: '🛡️ "This website has been restricted by national cyber directives to protect users from illegal gambling, betting, or unrated content."',
      layer: 'TIER_1_REGIONAL_BANNED',
    };
  }

  // C. Raw IP Access Detection (e.g., http://192.168.1.1 or public IPv4)
  const isDirectIp = net.isIP(hostname);
  if (isDirectIp !== 0) {
    return {
      isThreat: true,
      category: 'Malware/Phishing',
      threatType: 'PHISHING',
      reason: `Direct IP Access Prohibited (${isDirectIp === 4 ? 'IPv4' : 'IPv6'} address detected). Raw IP destinations bypass child safety DNS protections.`,
      childFriendlyExplanation: '🛡️ "We stopped this connection because direct numeric IP addresses are not permitted for child browsing safety."',
      layer: 'TIER_1_HEURISTICS_IP',
    };
  }

  // D. Suspicious TLDs Check (.xyz, .top, .zip, etc.)
  for (const tld of HIGH_RISK_TLDS) {
    if (hostname.endsWith(tld)) {
      return {
        isThreat: true,
        category: 'Malware/Phishing',
        threatType: 'PHISHING',
        reason: `Suspicious High-Risk TLD Restricted (${tld}). Domains with this extension exhibit high rates of credential harvesting, gaming scams, or malware.`,
        childFriendlyExplanation: `⚠️ "Hold on! Websites ending in ${tld} often host fake giveaways or malicious software. We blocked it to protect your accounts and passwords!"`,
        layer: 'TIER_1_HEURISTICS_TLD',
      };
    }
  }

  return { isThreat: false };
}

/**
 * Tier 2 - Cache Lookup (Redis)
 */
export async function checkRedisScanCache(normalizedHostname) {
  const cacheKey = `scan:${normalizedHostname}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return { found: true, data: JSON.parse(cached) };
    }
  } catch (err) {
    console.warn('[Redis] Cache lookup warning:', err.message);
  }
  return { found: false, data: null };
}

/**
 * Tier 3 - Google Safe Browsing API (Threat Database)
 * Matches against MALWARE, SOCIAL_ENGINEERING, UNWANTED_SOFTWARE, and POTENTIALLY_HARMFUL_APPLICATION
 */
export async function queryGoogleSafeBrowsing(rawUrl) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  if (!apiKey || apiKey === 'mock_google_key') {
    const lower = rawUrl.toLowerCase();
    const isMockMalware =
      lower.includes('phishing') ||
      lower.includes('malware') ||
      lower.includes('free-robux') ||
      lower.includes('cheat-injector') ||
      lower.includes('stealer');

    if (isMockMalware) {
      return {
        isThreat: true,
        category: 'Malware/Phishing',
        threatType: 'PHISHING',
        reason: 'Flagged by Threat Intelligence as SOCIAL_ENGINEERING (Phishing / Credential Theft)',
        childFriendlyExplanation: '⚠️ "Hold on! That link leads to a deceptive website trying to steal passwords or download harmful files. We blocked the link so your device stays safe!"',
        layer: 'TIER_3_GSB',
      };
    }
    return { isThreat: false };
  }

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const payload = {
      client: { clientId: 'safekids-ai-gateway', clientVersion: '2.0.0' },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url: rawUrl }],
      },
    };

    const response = await axios.post(endpoint, payload, { timeout: 4000 });
    const matches = response.data?.matches || [];

    if (matches.length > 0) {
      const match = matches[0];
      return {
        isThreat: true,
        category: 'Malware/Phishing',
        threatType: match.threatType === 'MALWARE' ? 'MALWARE' : 'PHISHING',
        reason: `Flagged by Google Safe Browsing as ${match.threatType} on ${match.platformType}`,
        childFriendlyExplanation: '⚠️ "Hold on! That destination was identified by Google Safe Browsing as malicious or deceptive. We blocked it to protect you."',
        layer: 'TIER_3_GSB',
      };
    }

    return { isThreat: false };
  } catch (error) {
    console.error('[GoogleSafeBrowsing] Inspection request failed:', error.message);
    return { isThreat: false };
  }
}

/**
 * Tier 4 - Database Persistence & Caching
 */
export async function persistScanResult({
  userId = 'user_child_01',
  url,
  hostname,
  status,
  category,
  threatType = 'NONE',
  explanation,
  reason,
  layer,
  fromCache = false
}) {
  // 1. Cache in Redis with 24-hour TTL (EX 86400)
  const cacheKey = `scan:${hostname}`;
  const cachePayload = {
    status,
    category,
    threatType,
    explanation,
    reason,
    layer,
    cachedAt: new Date().toISOString()
  };

  try {
    await redisClient.set(cacheKey, JSON.stringify(cachePayload), { EX: CACHE_TTL_SECONDS });
  } catch (err) {
    console.warn('[Redis] Cache write warning:', err.message);
  }

  // 2. Persist to PostgreSQL ActivityLog via Prisma
  if (isDbConnected() && prisma?.activityLog) {
    try {
      await prisma.activityLog.create({
        data: {
          userId,
          content: url,
          contentType: 'URL',
          appSource: 'Browser',
          scannedUrl: url,
          normalizedHost: hostname,
          status: status === 'BLOCKED' ? 'BLOCKED' : 'ALLOWED',
          threatType: status === 'BLOCKED' ? (threatType === 'MALWARE' ? 'MALWARE' : 'PHISHING') : 'NONE',
          severityScore: status === 'BLOCKED' ? 1.0 : 0.0,
          blockedReason: reason || (status === 'BLOCKED' ? category : null),
          flaggedLayer: layer,
          fromCache,
          parentDiagnosticReason: reason || null,
          childFriendlyExplanation: explanation,
        },
      });
    } catch (dbErr) {
      console.warn('[DB] Prisma ActivityLog save warning:', dbErr.message);
    }
  }
}
