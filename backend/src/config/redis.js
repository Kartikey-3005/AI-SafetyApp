import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const memoryCache = new Map();

class RedisAdapter {
  constructor() {
    this.isRedisReady = false;
    this.client = null;
  }

  async init() {
    try {
      this.client = createClient({
        url: redisUrl,
        socket: {
          connectTimeout: 1000,
          reconnectStrategy: (retries) => {
            if (retries > 1) {
              return false; // Stop retrying and use in-memory fallback
            }
            return 500;
          },
        },
      });

      this.client.on('error', (err) => {
        if (this.isRedisReady) {
          console.warn('🔴 Redis connection dropped, falling back to memory store.');
          this.isRedisReady = false;
        }
      });

      this.client.on('connect', () => {
        this.isRedisReady = true;
        console.log('🟢 Connected to Redis Server');
      });

      await this.client.connect();
    } catch (e) {
      console.log('🟡 Redis server offline: Running with internal high-speed memory cache.');
      this.isRedisReady = false;
    }
  }

  async get(key) {
    if (this.isRedisReady && this.client) {
      try {
        return await this.client.get(key);
      } catch (e) {
        return memoryCache.get(key) || null;
      }
    }
    return memoryCache.get(key) || null;
  }

  async set(key, value, options = {}) {
    if (this.isRedisReady && this.client) {
      try {
        return await this.client.set(key, value, options);
      } catch (e) {
        memoryCache.set(key, value);
        return 'OK';
      }
    }
    memoryCache.set(key, value);
    return 'OK';
  }
}

export const redisClient = new RedisAdapter();

export const initRedis = async () => {
  await redisClient.init();
};
