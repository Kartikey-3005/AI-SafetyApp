import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { redisClient } from '../config/redis.js';
import { checkGoogleSafeBrowsing } from '../integrations/googleSafeBrowsing.js';
import { checkOpenAiModeration } from '../integrations/openAiModeration.js';
import { generateChildFriendlyExplanation } from '../integrations/openAiExplainer.js';

const CACHE_TTL_SECONDS = 3600;

// High-speed fallback store for local testing
const inMemoryLogs = [];
const inMemoryGamification = new Map();

export class ScanService {
  static getCacheKey(userId, content) {
    const hash = crypto.createHash('sha256').update(`${userId}:${content.trim()}`).digest('hex');
    return `scan_cache:${hash}`;
  }

  static async scanPayload({ userId, content, contentType, appSource }) {
    // 1. Redis Cache Check
    const cacheKey = this.getCacheKey(userId, content);
    const cachedResult = await redisClient.get(cacheKey);

    if (cachedResult) {
      return {
        ...JSON.parse(cachedResult),
        fromCache: true,
      };
    }

    let isSafeBrowsingActive = true;
    let isAiModActive = true;

    let isBlocked = false;
    let threatType = 'NONE';
    let severityScore = 0.0;
    let parentReason = null;

    // 2. Check Google Safe Browsing
    const isUrl = contentType === 'URL' || content.startsWith('http://') || content.startsWith('https://');
    if (isUrl && isSafeBrowsingActive) {
      const gsbResult = await checkGoogleSafeBrowsing(content);
      if (gsbResult.isMalicious) {
        isBlocked = true;
        threatType = gsbResult.threatType;
        severityScore = 0.95;
        parentReason = gsbResult.reason;
      }
    }

    // 3. Check OpenAI Content Moderation
    if (!isBlocked && isAiModActive) {
      const modResult = await checkOpenAiModeration(content);
      if (modResult.flagged) {
        isBlocked = true;
        threatType = modResult.threatType;
        severityScore = modResult.score;
        parentReason = modResult.reason;
      }
    }

    const status = isBlocked ? 'BLOCKED' : 'ALLOWED';

    // 4. Generate Child-Friendly AI Explanation if blocked
    let childFriendlyExplanation = null;
    if (isBlocked) {
      childFriendlyExplanation = await generateChildFriendlyExplanation({
        content,
        threatType,
        reason: parentReason,
      });
    }

    const logRecord = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      userId,
      content,
      contentType: contentType || 'TEXT_STREAM',
      appSource: appSource || 'Discord',
      status,
      threatType,
      severityScore,
      parentDiagnosticReason: parentReason,
      childFriendlyExplanation,
      createdAt: new Date().toISOString(),
    };

    let petLevel = 4;
    let currentXp = 780;

    // Update memory cache
    inMemoryLogs.unshift(logRecord);
    const existingPet = inMemoryGamification.get(userId) || { petLevel: 4, currentXp: 780 };
    if (!isBlocked) existingPet.currentXp += 20;
    inMemoryGamification.set(userId, existingPet);
    petLevel = existingPet.petLevel;
    currentXp = existingPet.currentXp;

    // Async Prisma database persistence if DB is configured
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost:5432/safekids_db')) {
      try {
        prisma.activityLog.create({
          data: {
            userId,
            content,
            contentType: contentType || 'TEXT_STREAM',
            appSource: appSource || 'UnknownApp',
            status,
            threatType,
            severityScore,
            parentDiagnosticReason: parentReason,
            childFriendlyExplanation,
          }
        }).catch(() => {});
      } catch (e) {}
    }

    const responsePayload = {
      logId: logRecord.id,
      status,
      threatType,
      childFriendlyExplanation,
      pointsEarned: isBlocked ? 0 : 20,
      petStatus: {
        petLevel,
        currentXp,
      },
      fromCache: false,
    };

    // 6. Cache to Redis with TTL
    await redisClient.set(cacheKey, JSON.stringify(responsePayload), {
      EX: CACHE_TTL_SECONDS,
    });

    return responsePayload;
  }

  static getMemoryLogs() {
    return inMemoryLogs;
  }
}
