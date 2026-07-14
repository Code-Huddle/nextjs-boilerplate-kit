import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from '@/libs/i18nNavigation';

const handleI18n = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = handleI18n(request);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const path = request.nextUrl.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  const protectedRole = path.startsWith('/admin') ? 'admin' : path.startsWith('/user') || path.startsWith('/dashboard') ? 'user' : null;
  if (!protectedRole) return response;

  if (!data?.claims) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const appMetadata = data.claims.app_metadata as { role?: unknown } | undefined;
  const role = appMetadata?.role === 'admin' ? 'admin' : 'user';
  if (protectedRole === 'admin' && role !== 'admin') {
    return NextResponse.redirect(new URL('/user', request.url));
  }
  return response;
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|opengraph-image|twitter-image|.*\\..*).*)'] };
