import { NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store mapping IP addresses to request counts
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired IP records periodically to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  limit?: number;      // Maximum allowed requests in the window
  windowMs?: number;   // Time window in milliseconds
}

export function checkRateLimit(ip: string, config: RateLimitConfig = {}) {
  const limit = config.limit ?? 15; // Default: 15 requests per minute
  const windowMs = config.windowMs ?? 60 * 1000; // Default: 1 minute window
  const now = Date.now();

  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // New or expired window: initialize count
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      isLimited: false,
      remaining: limit - 1,
      resetTime: now + windowMs,
      retryAfter: 0,
    };
  }

  if (record.count >= limit) {
    // Exceeded rate limit
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      isLimited: true,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter,
    };
  }

  // Increment request count
  record.count += 1;
  rateLimitStore.set(ip, record);

  return {
    isLimited: false,
    remaining: limit - record.count,
    resetTime: record.resetTime,
    retryAfter: 0,
  };
}
