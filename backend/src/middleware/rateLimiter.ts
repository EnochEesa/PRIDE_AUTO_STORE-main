import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { logger } from '../config/logger';

// ── Fallback-aware Redis Instantiation ──────────────────────────────────────
const UPSTASH_URL = process.env.UPSTASH_REDIS_URL;

let redisClient: Redis | undefined;
let store: RedisStore | undefined;

if (UPSTASH_URL) {
  try {
    redisClient = new Redis(UPSTASH_URL, {
      maxRetriesPerRequest: 1, // Fail fast to prevent bottlenecking web queue
      enableOfflineQueue: false, // Drop commands immediately if offline
    });

    redisClient.on('error', (err) => {
      // Logs the disconnect error but does not throw, ensuring App stays alive
      logger.warn(`Redis disconnected or failed to connect: ${err.message}`);
    });

    store = new RedisStore({
      // Bypass tight typing differences between ioredis and rate-limit-redis
      sendCommand: (...args: string[]) => redisClient!.call(args[0], ...args.slice(1)) as any,
    });
    logger.info('Upstash Redis store attached to Rate Limiter successfully.');
  } catch (err: any) {
    logger.error(`Failed to initialize Redis store for rate limiting: ${err.message}`);
  }
}

// ── Limiters ────────────────────────────────────────────────────────────────
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
  store: store,
});

export const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, error: 'Inquiry limit reached. Please call us directly at 0422-4392481.' },
  store: store,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many login attempts. Please try again later.' },
  store: store,
});
