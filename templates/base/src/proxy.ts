import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './libs/i18nNavigation';

const handleI18n = createIntlMiddleware(routing);

export default function proxy(request: NextRequest) {
  return handleI18n(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|opengraph-image|twitter-image|.*\\..*).*)'],
};
