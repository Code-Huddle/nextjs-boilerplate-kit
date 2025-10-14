import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './libs/i18nNavigation';

const intlMiddleware = createIntlMiddleware(routing);

const publicPaths = ['/', '/sign-in', '/sign-up'];

export default async function middleware(req: NextRequest) {
  const publicPathnameRegex = new RegExp(`^(/(${routing.locales.join('|')}))?(${publicPaths.join('|')})?/?$`, 'i');
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  }

  // Handle unauthenticated requests
  /* if (!session) {
    const locale = req.nextUrl.pathname.split("/")[1] || ""
    const signInUrl = new URL(`/${locale}/sign-in`, req.url)
    signInUrl.searchParams.set("callbackUrl", req.url)
    return NextResponse.redirect(signInUrl)
  } */

  // Apply intl middleware for authenticated requests
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets/images).*)',
  ],
};
