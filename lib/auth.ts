import { NextResponse } from 'next/server';

export function verifyAdminAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  const apiKeyHeader = request.headers.get('x-api-key') || request.headers.get('x-admin-key');

  let providedToken = '';
  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      providedToken = authHeader.substring(7).trim();
    } else {
      providedToken = authHeader.trim();
    }
  } else if (apiKeyHeader) {
    providedToken = apiKeyHeader.trim();
  }

  // Use configured ADMIN_API_KEY env var. In production, require ADMIN_API_KEY to be set explicitly.
  const adminKey = process.env.ADMIN_API_KEY || (process.env.NODE_ENV === 'production' ? '' : 'default-admin-secret-key');

  if (!adminKey) {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: ADMIN_API_KEY environment variable is not configured.' },
        { status: 401 }
      ),
    };
  }

  if (!providedToken || providedToken !== adminKey) {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: Invalid or missing admin API key / Bearer token.' },
        { status: 401 }
      ),
    };
  }

  return { isAuthorized: true };
}
