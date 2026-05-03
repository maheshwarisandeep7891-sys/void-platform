import { Redis } from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined;
};

function createRedisClient(): Redis | null {
  const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
  if (!url) {
    return null;
  }

  try {
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
    });

    client.on("error", (err) => {
      if (process.env.NODE_ENV !== "production") {
        console.error("Redis error:", err.message);
      }
    });

    return client;
  } catch {
    return null;
  }
}

export const redis: Redis | null =
  globalForRedis.redis !== undefined
    ? globalForRedis.redis
    : createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// Cache helpers
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds = 300
): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // Silently fail — cache is non-critical
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {}
}

export async function invalidatePattern(pattern: string): Promise<void> {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {}
}
