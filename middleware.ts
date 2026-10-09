import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from './lib/rate-limit';
import { verifyAdminAuth } from './lib/auth';

export function middleware(request: NextRequest) {
  // Protect /api/ingest* endpoints with Admin Auth
  if (request.nextUrl.pathname.startsWith('/api/ingest')) {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthorized && auth.response) {
      return auth.response;
    }
  }

  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Allow 60 requests per minute per IP address
    const result = checkRateLimit(ip, { limit: 60, windowMs: 60 * 1000 });

    if (result.isLimited) {
      return NextResponse.json(
        { 
          error: `Too many requests. Rate limit exceeded. Please try again in ${result.retryAfter} seconds.` 
        },
        { 
          status: 429, 
          headers: {
            'Retry-After': String(result.retryAfter),
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': '0',
          } 
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', '60');
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
