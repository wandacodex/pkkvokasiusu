import { NextResponse } from 'next/server';

// In-memory sliding-window counter for rate limiting
const rateLimits = new Map();

// Rate limiting configuration per endpoint type
const CONFIG = {
  auth: { limit: 15, windowMs: 60 * 1000 },          // 15 req / 1 min for auth attempts (prevents brute-force)
  suratPost: { limit: 15, windowMs: 5 * 60 * 1000 },    // 15 submissions / 5 min (prevents letter spam)
  suratGet: { limit: 60, windowMs: 60 * 1000 },        // 60 queries / 1 min (prevents scraping)
  seed: { limit: 5, windowMs: 60 * 1000 },             // 5 req / 1 min
  generalApi: { limit: 120, windowMs: 60 * 1000 },     // 120 req / 1 min for mutations
};

function getClientIp(req) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  let timestamps = rateLimits.get(key) || [];

  // Filter out expired timestamps outside the sliding window
  timestamps = timestamps.filter((time) => now - time < windowMs);

  if (timestamps.length >= limit) {
    rateLimits.set(key, timestamps);
    const earliestTime = timestamps[0];
    const retryAfter = Math.ceil((windowMs - (now - earliestTime)) / 1000);
    return { limited: true, retryAfter: Math.max(1, retryAfter) };
  }

  timestamps.push(now);
  rateLimits.set(key, timestamps);

  // Periodic pruning if cache exceeds 5,000 active keys
  if (rateLimits.size > 5000) {
    for (const [k, v] of rateLimits.entries()) {
      const active = v.filter((t) => now - t < 5 * 60 * 1000);
      if (active.length === 0) {
        rateLimits.delete(k);
      } else {
        rateLimits.set(k, active);
      }
    }
  }

  return { limited: false };
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // Only apply rate limiting to /api/* routes
  if (pathname.startsWith('/api/')) {
    const ip = getClientIp(req);
    let rule = null;
    let ruleKey = '';

    if (pathname.startsWith('/api/auth')) {
      rule = CONFIG.auth;
      ruleKey = `auth:${ip}`;
    } else if (pathname === '/api/surat') {
      if (method === 'POST') {
        rule = CONFIG.suratPost;
        ruleKey = `surat-post:${ip}`;
      } else if (method === 'GET') {
        rule = CONFIG.suratGet;
        ruleKey = `surat-get:${ip}`;
      }
    } else if (pathname === '/api/seed') {
      rule = CONFIG.seed;
      ruleKey = `seed:${ip}`;
    } else if (['POST', 'PUT', 'DELETE'].includes(method)) {
      rule = CONFIG.generalApi;
      ruleKey = `general-write:${ip}`;
    }

    if (rule && ruleKey) {
      const { limited, retryAfter } = checkRateLimit(ruleKey, rule.limit, rule.windowMs);
      if (limited) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: 'Terlalu banyak permintaan (Rate limit terlampaui). Silakan tunggu sejenak sebelum mencoba kembali.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(retryAfter),
            },
          }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
