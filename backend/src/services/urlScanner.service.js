import net from 'net';
import axios from 'axios';
import prisma, { isDbConnected } from '../config/prisma.js';
import { redisClient } from '../config/redis.js';

// Cache TTL Configurations
const CACHE_TTL_SECONDS = 86400; // 24 Hours for scanned URLs
const REGIONAL_DOMAIN_TTL = 3600; // 1 Hour for India blocklist cache

// Explicit adult keywords to intercept adult and predatory websites
export const adultKeywords = [
  'porn',
  'xxx',
  'xvideos',
  'pornhub',
  'sex',
  'adult',
  'onlyfans',
  'chaturbate',
  'redtube',
  'youporn',
  'cam4'
];

// Mock list of domains banned by the Indian DoT (Stored in PostgreSQL + Redis Cache)
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

// High-Risk TLDs targeting kids or commonly used in malicious phishing / dark web
export const HIGH_RISK_TLDS = new Set([
  '.xyz',
  '.zip',
  '.top',
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
 * Normalizes input URL and extracts valid URL parts
 * Defends against bypasses (e.g. safe query params on bad hosts, invalid encodings)
 */
export function parseAndNormalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('URL must be a non-empty string');
  }

  let formatted = rawUrl.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `http://${formatted}`;
  }

  const parsed = new URL(formatted);
  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();

  return {
    rawUrl,
    normalizedUrl: parsed.origin + parsed.pathname,
    hostname,
    protocol,
    port: parsed.port,
    pathname: parsed.pathname,
    parsed
  };
}

/**
 * Standalone Fast Heuristic Evaluator
 */
export const checkUrlHeuristics = (urlToScan) => {
  try {
    let formatted = urlToScan.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = `http://${formatted}`;
    }

    const parsedUrl = new URL(formatted);
    const hostname = parsedUrl.hostname.toLowerCase();

    // 1. Check for explicit keywords in the domain
    const isAdult = adultKeywords.some((keyword) => hostname.includes(keyword));
    if (isAdult) {
      return { status: 'BLOCKED', reason: 'Explicit/Adult Content Detected' };
    }

    // 2. Check against the India DoT Blocklist
    const isBannedInIndia = indiaBannedDomains.some((domain) => hostname.includes(domain));
    if (isBannedInIndia) {
      return { status: 'BLOCKED', reason: 'Regionally Banned Content (India DoT)' };
    }

    return { status: 'SAFE' };
  } catch (error) {
    return { status: 'BLOCKED', reason: 'Invalid URL Format' };
  }
};

/**
 * Layer 1: Regional Compliance (India Blocklist)
 * Fast-path check: Redis Cache -> DB check -> Local In-Memory Fallback
 */
export async function checkIndiaRegionalBlocklist(hostname) {
  const normalizedHost = hostname.replace(/^www\./, '').toLowerCase();
  const cacheKey = `blocklist:india:${normalizedHost}`;

  // 1. Check Redis Cache for blocklist entry
  try {
    const cachedStatus = await redisClient.get(cacheKey);
    if (cachedStatus !== null) {
      const isBlocked = cachedStatus === '1';
      if (isBlocked) {
        return {
          isThreat: true,
          layer: 'LAYER_1_REGIONAL',
          reason: 'Regionally Banned Content (India DoT)',
        };
      }
      return { isThreat: false };
    }
  } catch (err) {
    console.warn('[Redis] Regional cache read failed, falling back to DB/Memory:', err.message);
  }

  // 2. Query Database (IndiaBlocklist table) if database is connected
  let record = null;
  if (isDbConnected() && prisma?.indiaBlocklist) {
    try {
      record = await prisma.indiaBlocklist.findFirst({
        where: {
          domain: { in: [normalizedHost, `www.${normalizedHost}`] },
          isActive: true,
        },
      });
    } catch (dbErr) {
      console.warn('[DB] Prisma query notice:', dbErr.message);
    }
  }

  // 3. Check India DoT Seed List Fallback
  const isBannedInIndia = !!record || indiaBannedDomains.some((domain) => normalizedHost.includes(domain));
  const blockReason = record?.reason || 'Regionally Banned Content (India DoT)';

  // 4. Cache the lookup result in Redis
  try {
    await redisClient.set(cacheKey, isBannedInIndia ? '1' : '0', { EX: REGIONAL_DOMAIN_TTL });
  } catch (err) {
    console.warn('[Redis] Regional cache write failed:', err.message);
  }

  if (isBannedInIndia) {
    return {
      isThreat: true,
      layer: 'LAYER_1_REGIONAL',
      reason: blockReason,
    };
  }

  return { isThreat: false };
}

/**
 * Layer 2: Heuristics Engine (Hidden/Suspicious Sites & Adult Content)
 * Evaluates: Explicit keywords, Raw IP addresses, unencrypted HTTP, and high-risk TLDs
 */
export function checkHeuristicsThreats({ hostname, protocol }) {
  // 1. Check for explicit / adult keywords in domain
  const isAdult = adultKeywords.some((keyword) => hostname.includes(keyword));
  if (isAdult) {
    return {
      isThreat: true,
      layer: 'LAYER_2_HEURISTICS',
      reason: 'Explicit/Adult Content Detected',
    };
  }

  // 2. Check for raw IPv4 or IPv6 (often used to bypass DNS filters)
  const isDirectIp = net.isIP(hostname);
  if (isDirectIp !== 0) {
    return {
      isThreat: true,
      layer: 'LAYER_2_HEURISTICS',
      reason: `Direct IP Access Prohibited (${isDirectIp === 4 ? 'IPv4' : 'IPv6'} raw address detected). Standard domain required for child safety.`,
    };
  }

  // 3. Check for unencrypted HTTP
  if (protocol === 'http:') {
    return {
      isThreat: true,
      layer: 'LAYER_2_HEURISTICS',
      reason: 'Insecure Connection: Unencrypted HTTP protocol is blocked for child protection. HTTPS required.',
    };
  }

  // 4. Check for high-risk / dark web TLDs
  for (const tld of HIGH_RISK_TLDS) {
    if (hostname.endsWith(tld)) {
      return {
        isThreat: true,
        layer: 'LAYER_2_HEURISTICS',
        reason: `High-Risk TLD Restricted (${tld}). Domains with this extension have high rates of scams, phishing, or dark-web content.`,
      };
    }
  }

  return { isThreat: false };
}

/**
 * Layer 3: Google Safe Browsing API v4
 * Checks MALWARE, SOCIAL_ENGINEERING (Phishing), and UNWANTED_SOFTWARE
 */
export async function checkGoogleSafeBrowsing(targetUrl) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  if (!apiKey || apiKey === 'mock_google_key') {
    // Realistic heuristic simulation when API key is not yet configured
    const lower = targetUrl.toLowerCase();
    const isMockThreat =
      lower.includes('phishing') ||
      lower.includes('malware') ||
      lower.includes('free-robux-generator') ||
      lower.includes('cheat-injector') ||
      lower.includes('stealer');

    if (isMockThreat) {
      return {
        isThreat: true,
        layer: 'LAYER_3_GSB',
        reason: 'Flagged by Threat Intelligence as SOCIAL_ENGINEERING (Phishing / Credential Harvesting)',
      };
    }
    return { isThreat: false };
  }

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const payload = {
      client: { clientId: 'safekids-ai-gateway', clientVersion: '1.0.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url: targetUrl }],
      },
    };

    const response = await axios.post(endpoint, payload, { timeout: 4000 });
    const matches = response.data?.matches || [];

    if (matches.length > 0) {
      const match = matches[0];
      return {
        isThreat: true,
        layer: 'LAYER_3_GSB',
        reason: `Flagged by Google Safe Browsing as ${match.threatType} on ${match.platformType}`,
      };
    }

    return { isThreat: false };
  } catch (error) {
    console.error('[GoogleSafeBrowsing] Inspection error:', error.message);
    // Fail-safe graceful degradation for external API timeouts
    return { isThreat: false };
  }
}
