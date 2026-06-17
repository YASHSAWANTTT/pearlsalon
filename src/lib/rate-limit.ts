import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, requests: number, window: `${number} ${"s" | "m" | "h" | "d"}`) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const key = `${name}:${requests}:${window}`;
  if (!limiters.has(key)) {
    limiters.set(
      key,
      new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(requests, window),
        prefix: `pearlsalon:${name}`,
      })
    );
  }
  return limiters.get(key)!;
}

/** Best-effort client IP for rate limiting (Vercel / proxy headers). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function checkLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<RateLimitResult> {
  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[rate-limit] UPSTASH_REDIS_REST_URL not set — rate limits disabled");
    }
    return { ok: true };
  }

  const { success, reset } = await limiter.limit(identifier);
  if (success) return { ok: true };

  const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return { ok: false, retryAfterSec };
}

export async function rateLimitBooking(ip: string) {
  return checkLimit(getLimiter("booking", 5, "15 m"), ip);
}

export async function rateLimitQueueJoin(ip: string) {
  return checkLimit(getLimiter("queue-join", 5, "15 m"), ip);
}

export async function rateLimitQueueStatus(ip: string) {
  return checkLimit(getLimiter("queue-status", 30, "1 m"), ip);
}

export async function rateLimitLogbookExtract(userId: string) {
  return checkLimit(getLimiter("logbook-extract", 10, "1 h"), userId);
}

export function rateLimitResponse(retryAfterSec: number) {
  return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfterSec),
    },
  });
}
