import { ScanService } from '../services/scan.service.js';
import {
  parseAndNormalizeUrl,
  evaluateTier1Heuristics,
  checkRedisScanCache,
  queryGoogleSafeBrowsing,
  persistScanResult,
} from '../services/urlScanner.service.js';

/**
 * Controller: POST /api/scan/url
 * Strict Multi-Tier URL Inspection Pipeline
 * 1. URL Normalization
 * 2. Tier 1 - Heuristics & Regional Compliance (Instant Local Filtering -> HTTP 403)
 * 3. Tier 2 - Cache Lookup (Redis: scan:{hostname})
 * 4. Tier 3 - Google Safe Browsing API (Threat Database)
 * 5. Tier 4 - Database Persistence (Prisma ActivityLog) & Caching (Redis 24h TTL)
 */
export async function scanUrlHandler(req, res) {
  try {
    const { url, userId = 'user_child_01' } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'A valid "url" string is required in the request body.',
      });
    }

    // Step 1: URL Normalization
    let parsedData;
    try {
      parsedData = parseAndNormalizeUrl(url);
    } catch (parseErr) {
      return res.status(400).json({
        error: 'Malformed URL',
        message: 'Unable to parse provided destination as a valid URL.',
      });
    }

    const { rawUrl, hostname } = parsedData;

    // Step 2: Tier 1 - Heuristics & Regional Compliance (Instant Local Filtering)
    const tier1Result = await evaluateTier1Heuristics(parsedData);
    if (tier1Result.isThreat) {
      // Immediately log and return HTTP 403 without querying external APIs
      await persistScanResult({
        userId,
        url: rawUrl,
        hostname,
        status: 'BLOCKED',
        category: tier1Result.category,
        threatType: tier1Result.threatType,
        explanation: tier1Result.childFriendlyExplanation,
        reason: tier1Result.reason,
        layer: tier1Result.layer,
        fromCache: false,
      });

      // Synchronize in-memory feed for instant UI sync
      ScanService.getMemoryLogs().unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        appSource: 'Browser',
        contentType: 'URL Navigation',
        status: 'Blocked',
        threatCategory: tier1Result.category,
        flaggedContent: rawUrl,
        childFriendlyExplanation: tier1Result.childFriendlyExplanation,
      });

      return res.status(403).json({
        status: 'BLOCKED',
        url: rawUrl,
        hostname,
        category: tier1Result.category,
        blockedReason: tier1Result.reason,
        childFriendlyExplanation: tier1Result.childFriendlyExplanation,
        flaggedLayer: tier1Result.layer,
        fromCache: false,
      });
    }

    // Step 3: Tier 2 - Cache Lookup (Redis: scan:{normalizedHostname})
    const cacheResult = await checkRedisScanCache(hostname);
    if (cacheResult.found && cacheResult.data) {
      const cached = cacheResult.data;

      // Synchronize in-memory feed
      ScanService.getMemoryLogs().unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        appSource: 'Browser',
        contentType: 'URL Navigation',
        status: cached.status === 'BLOCKED' ? 'Blocked' : 'Allowed',
        threatCategory: cached.category || 'Safe Browsing Verified',
        flaggedContent: rawUrl,
        childFriendlyExplanation: cached.explanation,
      });

      if (cached.status === 'BLOCKED') {
        return res.status(403).json({
          status: 'BLOCKED',
          url: rawUrl,
          hostname,
          category: cached.category,
          blockedReason: cached.reason,
          childFriendlyExplanation: cached.explanation,
          flaggedLayer: cached.layer || 'TIER_2_CACHE',
          fromCache: true,
        });
      }

      return res.status(200).json({
        status: 'ALLOWED',
        url: rawUrl,
        hostname,
        category: 'Safe Browsing Verified',
        childFriendlyExplanation: cached.explanation || '✅ "Verified safe and secure browsing destination."',
        fromCache: true,
      });
    }

    // Step 4: Tier 3 - Google Safe Browsing API (Threat Database)
    const gsbResult = await queryGoogleSafeBrowsing(rawUrl);
    if (gsbResult.isThreat) {
      await persistScanResult({
        userId,
        url: rawUrl,
        hostname,
        status: 'BLOCKED',
        category: gsbResult.category,
        threatType: gsbResult.threatType,
        explanation: gsbResult.childFriendlyExplanation,
        reason: gsbResult.reason,
        layer: gsbResult.layer,
        fromCache: false,
      });

      ScanService.getMemoryLogs().unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        appSource: 'Browser',
        contentType: 'URL Navigation',
        status: 'Blocked',
        threatCategory: gsbResult.category,
        flaggedContent: rawUrl,
        childFriendlyExplanation: gsbResult.childFriendlyExplanation,
      });

      return res.status(403).json({
        status: 'BLOCKED',
        url: rawUrl,
        hostname,
        category: gsbResult.category,
        blockedReason: gsbResult.reason,
        childFriendlyExplanation: gsbResult.childFriendlyExplanation,
        flaggedLayer: gsbResult.layer,
        fromCache: false,
      });
    }

    // Step 5: Tier 4 - Database Persistence & Caching (Safe Verdict)
    const safeExplanation = '✅ "Verified safe and secure browsing destination."';
    await persistScanResult({
      userId,
      url: rawUrl,
      hostname,
      status: 'ALLOWED',
      category: 'Safe Browsing Verified',
      threatType: 'NONE',
      explanation: safeExplanation,
      reason: null,
      layer: 'CLEAN',
      fromCache: false,
    });

    ScanService.getMemoryLogs().unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      appSource: 'Browser',
      contentType: 'URL Navigation',
      status: 'Allowed',
      threatCategory: 'Safe Browsing Verified',
      flaggedContent: rawUrl,
      childFriendlyExplanation: safeExplanation,
    });

    return res.status(200).json({
      status: 'ALLOWED',
      url: rawUrl,
      hostname,
      category: 'Safe Browsing Verified',
      childFriendlyExplanation: safeExplanation,
      fromCache: false,
    });
  } catch (error) {
    console.error('Unhandled URL Scanner Controller Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to complete URL safety inspection pipeline.',
    });
  }
}
