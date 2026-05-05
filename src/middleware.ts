import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter using edge-compatible approach
// Uses a Map stored per-request (resets on cold start — good enough for Vercel)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

// Clean up old entries periodically (every 1000 requests)
let cleanupCounter = 0;
function maybeCleanup() {
  cleanupCounter++;
  if (cleanupCounter % 1000 === 0) {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  maybeCleanup();

  // Rate limit API routes
  if (pathname.startsWith("/api/")) {
    // Auth endpoints — strict limit
    if (pathname.startsWith("/api/auth/")) {
      const { allowed } = rateLimit(`auth:${ip}`, 20, 60_000); // 20/min
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many requests. Please slow down." },
          { status: 429, headers: { "Retry-After": "60" } }
        );
      }
    }

    // Post creation — prevent spam
    if (pathname === "/api/posts" && req.method === "POST") {
      const { allowed } = rateLimit(`post:${ip}`, 10, 60_000); // 10 posts/min
      if (!allowed) {
        return NextResponse.json(
          { error: "Posting too fast. Please wait a moment." },
          { status: 429 }
        );
      }
    }

    // Messages — prevent spam
    if (pathname.startsWith("/api/messages/") && req.method === "POST") {
      const { allowed } = rateLimit(`msg:${ip}`, 30, 60_000); // 30 msgs/min
      if (!allowed) {
        return NextResponse.json(
          { error: "Sending too fast." },
          { status: 429 }
        );
      }
    }

    // General API — broad protection
    const { allowed } = rateLimit(`api:${ip}`, 300, 60_000); // 300 req/min
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded." },
        { status: 429 }
      );
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
