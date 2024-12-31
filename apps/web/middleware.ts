import { authMiddleware } from '@repo/auth/middleware';
import { env } from '@repo/env';
import { parseError } from '@repo/observability/error';
import { secure } from '@repo/security';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import { NextResponse } from 'next/server';

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on all routes except for static assets and Posthog ingest
  matcher: ['/((?!_next/static|_next/image|ingest|favicon.ico).*)'],
};

const securityHeaders = noseconeMiddleware(noseconeConfig);

export default authMiddleware(async (_auth, request) => {
  if (!env.ARCJET_KEY) {
    return securityHeaders();
  }

  try {
    await secure(
      [
        'CATEGORY:ACADEMIC',
        'CATEGORY:ADVERTISING',
        'CATEGORY:AI',
        'CATEGORY:AMAZON',
        // 'CATEGORY:ARCHIVE',
        'CATEGORY:FEEDFETCHER',
        'CATEGORY:GOOGLE',
        'CATEGORY:META',
        'CATEGORY:MICROSOFT',
        'CATEGORY:MONITOR',
        'CATEGORY:OPTIMIZER',
        'CATEGORY:PREVIEW',
        'CATEGORY:PROGRAMMATIC',
        'CATEGORY:SEARCH_ENGINE',
        'CATEGORY:SLACK',
        'CATEGORY:SOCIAL',
        'CATEGORY:TOOL',
        'CATEGORY:VERCEL',
        'CATEGORY:YAHOO',
      ],
      request
    );

    return securityHeaders();
  } catch (error) {
    const message = parseError(error);

    return NextResponse.json({ error: message }, { status: 403 });
  }
});
