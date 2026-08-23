import crypto from 'crypto';
import prisma, { isDbConnected } from '../config/prisma.js';
import { redisClient } from '../config/redis.js';
import { ScanService } from '../services/scan.service.js';
import {
  parseAndNormalizeUrl,
  checkIndiaRegionalBlocklist,
  checkHeuristicsThreats,
  checkGoogleSafeBrowsing,
} from '../services/urlScanner.service.js';

const URL_CACHE_TTL = 86400; // 24 Hours

/**
 * Controller: POST /api/scan/url
 * Strict gatekeeper endpoint evaluating URLs against 4 threat vectors
 */
export async function scanUrlHandler(req, res) {
  try {
    const { url, userId = 'user_child_01' } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'A valid "url" string is required in the request body.',
      });
    }

    // 1. Canonical Parsing & Normalization
    let parsedData;
    try {
      parsedData = parseAndNormalizeUrl(url);
    } catch (parseErr) {
      return res.status(400).json({
        error: 'Malformed URL',
        message: parseErr.message,
      });
    }

    const { rawUrl, normalizedUrl, hostname } = parsedData;

    // 2. Check Redis Scan Cache
    const urlHash = crypto.createHash('sha256').update(normalizedUrl).digest('hex');
    const scanCacheKey = `url_scan:${urlHash}`;

    try {
      const cached = await redisClient.get(scanCacheKey);
      if (cached) {
        const cachedResult = JSON.parse(cached);

        // If cached as blocked, return 403 Forbidden
        if (cachedResult.status === 'BLOCKED') {
          return res.status(403).json({
            status: 'BLOCKED',
            url: rawUrl,
            blockedReason: cachedResult.reason,
            flaggedLayer: cachedResult.layer,
            fromCache: true,
          });
        }

        // If cached as allowed, return 200 OK
        return res.status(200).json({
          status: 'ALLOWED',
          url: rawUrl,
          message: 'URL verified safe.',
          fromCache: true,
        });
      }
    } catch (redisErr) {
      console.warn('[Redis] Scan cache lookup notice:', redisErr.message);
    }

    // 3. Sequential Security Pipeline
    let threatResult = null;

    // Layer 1: Regional Compliance (India Blocklist)
    threatResult = await checkIndiaRegionalBlocklist(hostname);

    // Layer 2: The Heuristics Engine (IPs, HTTP, Risk TLDs)
    if (!threatResult.isThreat) {
      threatResult = checkHeuristicsThreats(parsedData);
    }

    // Layer 3: Google Safe Browsing API (Malware / Phishing)
    if (!threatResult.isThreat) {
      threatResult = await checkGoogleSafeBrowsing(rawUrl);
    }

    // 4. Handle BLOCKED Verdict (Failed ANY Layer)
    if (threatResult.isThreat) {
      const cachePayload = {
        status: 'BLOCKED',
        reason: threatResult.reason,
        layer: threatResult.layer,
      };

      // Cache the Block verdict in Redis
      try {
        await redisClient.set(scanCacheKey, JSON.stringify(cachePayload), {
          EX: URL_CACHE_TTL,
        });
      } catch (err) {
        console.warn('[Redis] Cache write failed:', err.message);
      }

      // Memory log sync for dashboard feeds
      const memoryLogs = ScanService.getMemoryLogs();
      memoryLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        appSource: 'Web Browser',
        contentType: 'URL Navigation',
        status: 'Blocked',
        threatCategory: threatResult.layer === 'LAYER_1_REGIONAL' ? 'Regional Blocklist Violation' : 'Insecure / Malicious URL',
        flaggedContent: rawUrl,
        childFriendlyExplanation: `🛡️ "This link was blocked: ${threatResult.reason}"`,
      });

      // Persist to database if available
      if (isDbConnected() && prisma?.activityLog) {
        prisma.activityLog.create({
          data: {
            userId,
            content: rawUrl,
            contentType: 'URL',
            appSource: 'Web Browser',
            scannedUrl: rawUrl,
            normalizedHost: hostname,
            status: 'BLOCKED',
            threatType: 'PHISHING',
            severityScore: 1.0,
            blockedReason: threatResult.reason,
            flaggedLayer: threatResult.layer,
            fromCache: false,
            parentDiagnosticReason: threatResult.reason,
            childFriendlyExplanation: `🛡️ "This link was blocked: ${threatResult.reason}"`,
          },
        }).catch((e) => console.warn('[DB] Log creation failed:', e.message));
      }

      return res.status(403).json({
        status: 'BLOCKED',
        url: rawUrl,
        blockedReason: threatResult.reason,
        flaggedLayer: threatResult.layer,
        fromCache: false,
      });
    }

    // 5. Handle ALLOWED Verdict (Passed all layers)
    const safePayload = {
      status: 'ALLOWED',
      reason: null,
      layer: null,
    };

    // Cache the Safe verdict in Redis
    try {
      await redisClient.set(scanCacheKey, JSON.stringify(safePayload), {
        EX: URL_CACHE_TTL,
      });
    } catch (err) {
      console.warn('[Redis] Cache write failed:', err.message);
    }

    // Memory log sync for dashboard feeds
    const memoryLogs = ScanService.getMemoryLogs();
    memoryLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      appSource: 'Web Browser',
      contentType: 'URL Navigation',
      status: 'Allowed',
      threatCategory: 'Safe Browsing Verified',
      flaggedContent: rawUrl,
      childFriendlyExplanation: '✅ "Verified safe and secure browsing destination."',
    });

    // Persist to database if available
    if (isDbConnected() && prisma?.activityLog) {
      prisma.activityLog.create({
        data: {
          userId,
          content: rawUrl,
          contentType: 'URL',
          appSource: 'Web Browser',
          scannedUrl: rawUrl,
          normalizedHost: hostname,
          status: 'ALLOWED',
          threatType: 'NONE',
          severityScore: 0.0,
          blockedReason: null,
          flaggedLayer: null,
          fromCache: false,
          childFriendlyExplanation: '✅ "Verified safe and secure browsing destination."',
        },
      }).catch((e) => console.warn('[DB] Log creation failed:', e.message));
    }

    return res.status(200).json({
      status: 'ALLOWED',
      url: rawUrl,
      message: 'URL passed all security vectors and is verified safe.',
      fromCache: false,
    });
  } catch (error) {
    console.error('Unhandled URL Scanner Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to complete URL safety evaluation pipeline.',
    });
  }
}
