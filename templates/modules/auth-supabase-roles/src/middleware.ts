import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Supported locales
const supportedLocales = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'];
const defaultLocale = 'en';

// Helper function to extract locale from pathname
function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0];

  if (potentialLocale && supportedLocales.includes(potentialLocale)) {
    return potentialLocale;
  }

  return defaultLocale;
}

// Helper function to detect locale from request
function detectLocale(req: NextRequest): string {
  // 1. Check URL path for locale
  const pathLocale = getLocaleFromPathname(req.nextUrl.pathname);
  if (pathLocale !== defaultLocale) {
    return pathLocale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = req.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0]?.split('-')[0]?.toLowerCase() || '')
      .filter(lang => supportedLocales.includes(lang));

    if (preferredLocales.length > 0) {
      return preferredLocales[0]!;
    }
  }

  // 3. Check for locale cookie
  const localeCookie = req.cookies.get('locale')?.value;
  if (localeCookie && supportedLocales.includes(localeCookie)) {
    return localeCookie;
  }

  return defaultLocale;
}

// Helper function to create locale-aware URL
function createLocalizedUrl(req: NextRequest, path: string, locale?: string): URL {
  const detectedLocale = locale || detectLocale(req);
  const url = new URL(path, req.url);

  // Ensure locale is in the path
  const pathSegments = url.pathname.split('/');
  if (!supportedLocales.includes(pathSegments[1] || '')) {
    url.pathname = `/${detectedLocale}${path.startsWith('/') ? path : `/${path}`}`;
  }

  return url;
}

// Role-based middleware for auth-supabase-roles module
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static assets and API routes that don't need role checking
  if (
    pathname.startsWith('/_next/')
    || pathname.startsWith('/favicon.ico')
    || pathname.startsWith('/api/')
    || pathname.includes('.css')
    || pathname.includes('.js')
    || pathname.includes('.png')
    || pathname.includes('.jpg')
    || pathname.includes('.jpeg')
    || pathname.includes('.gif')
    || pathname.includes('.svg')
    || pathname.includes('.ico')
  ) {
    return NextResponse.next();
  }

  // Handle locale fallback for root path and paths without locale
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];

  // Special handling for root path - redirect to localized home
  if (pathname === '/') {
    const locale = detectLocale(req);
    const response = NextResponse.redirect(new URL(`/${locale}`, req.url));

    // Set locale cookie for future requests
    response.cookies.set('locale', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  }

  // If the first segment is not a supported locale, redirect to localized version
  // But avoid redirecting if we're already on a localized path to prevent loops
  if (pathSegments.length > 0 && firstSegment && !supportedLocales.includes(firstSegment)) {
    const locale = detectLocale(req);
    const localizedPath = `/${locale}${pathname}`;

    // Prevent infinite redirects by checking if we're already on a localized path
    if (!pathname.startsWith(`/${locale}/`)) {
      const response = NextResponse.redirect(new URL(localizedPath, req.url));

      // Set locale cookie for future requests
      response.cookies.set('locale', locale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
    }
  }

  // Define public paths that don't require authentication (locale-agnostic)
  const publicPaths = [
    // Base template routes
    '/',
    '/sign-in',
    '/sign-up',

    // Test pages (from modules)
    '/test-payment',
    '/test-subscription',
    '/test-email',
    '/test-orm',

    // Payment pages
    '/payment/success',
    '/payment/cancel',

    // API routes (public by default)
    '/api/auth',
    '/api/auth/[...nextauth]',
    '/api/auth/supabase',
    '/api/email/send',
    '/api/stripe/[...stripe]',
    '/api/users',
    '/api/users/[id]',

    // System routes
    '/robots.txt',
    '/sitemap.xml',
    '/favicon.ico',

    // Add more public routes here
  ];

  // Helper function to check if path is public (ignoring locale prefix)
  const isPublicPath = (path: string): boolean => {
    // Remove locale prefix for checking
    const pathWithoutLocale = path.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
    return publicPaths.some((publicPath) => {
      if (publicPath === '/') {
        return pathWithoutLocale === '/';
      }
      return pathWithoutLocale.startsWith(publicPath);
    });
  };

  // Check if the current path is public (no authentication required)
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated by looking for session cookies
  const sessionToken = req.cookies.get('sb-access-token')
    || req.cookies.get('sb-refresh-token')
    || req.cookies.get('supabase-auth-token')
    || req.cookies.get('auth-token')
    || req.cookies.get('session-token');

  // Get user role from cookies (set during sign-in)
  const userRole = req.cookies.get('userRole')?.value
    || req.cookies.get('user-role')?.value
    || req.cookies.get('role')?.value;

  // Debug logging
  console.warn('🔍 Middleware Debug:', {
    pathname,
    hasSession: !!sessionToken,
    hasRole: !!userRole,
    userRole,
    willRedirectToSignIn: !sessionToken && !userRole,
    sessionCookies: {
      'sb-access-token': !!req.cookies.get('sb-access-token'),
      'sb-refresh-token': !!req.cookies.get('sb-refresh-token'),
      'supabase-auth-token': !!req.cookies.get('supabase-auth-token'),
      'auth-token': !!req.cookies.get('auth-token'),
      'session-token': !!req.cookies.get('session-token'),
    },
    roleCookies: {
      'userRole': req.cookies.get('userRole')?.value,
      'user-role': req.cookies.get('user-role')?.value,
      'role': req.cookies.get('role')?.value,
    },
  });

  // If no session token AND no user role, redirect to sign-in
  if (!sessionToken && !userRole) {
    // Don't redirect if we're already on a sign-in or sign-up page to prevent loops
    if (pathname.includes('/sign-in') || pathname.includes('/sign-up')) {
      return NextResponse.next();
    }

    const locale = detectLocale(req);
    const signInUrl = createLocalizedUrl(req, '/sign-in', locale);
    return NextResponse.redirect(signInUrl);
  }

  // If user has session but no role, redirect to role selection or default page
  if (sessionToken && !userRole) {
    const locale = detectLocale(req);
    // You can redirect to a role selection page or default to user role
    const defaultUrl = createLocalizedUrl(req, '/user', locale);
    return NextResponse.redirect(defaultUrl);
  }

  // Define allowed paths for each role
  const rolePaths = {
    admin: [
      '/admin',
      '/dashboard',
      // Add more admin routes here
    ],
    user: [
      '/user',
      '/dashboard',
      // Add more user routes here
    ],
  };

  // Helper function to check if a path is allowed for a role (locale-aware)
  const isPathAllowed = (path: string, allowedPaths: string[]) => {
    // Remove locale prefix for checking
    const pathWithoutLocale = path.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

    return allowedPaths.some((allowedPath) => {
      // Exact match
      if (pathWithoutLocale === allowedPath) {
        return true;
      }
      // Starts with match (for nested routes)
      if (pathWithoutLocale.startsWith(`${allowedPath}/`)) {
        return true;
      }
      return false;
    });
  };

  // Helper function to check if user has access to a path based on their role
  const hasAccessToPath = (path: string, role: string): boolean => {
    if (role === 'admin') {
      return isPathAllowed(path, rolePaths.admin);
    } else if (role === 'user') {
      return isPathAllowed(path, rolePaths.user);
    }
    return false;
  };

  // Check if the current path requires role-based access (locale-aware)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  const requiresRoleCheck = pathWithoutLocale.includes('/admin')
    || pathWithoutLocale.includes('/user')
    || pathWithoutLocale.includes('/dashboard');

  // If user is authenticated and accessing root path, redirect to their role-based page
  if (sessionToken && userRole && pathWithoutLocale === '/') {
    const locale = detectLocale(req);
    const roleBasedUrl = userRole === 'admin'
      ? createLocalizedUrl(req, '/admin', locale)
      : createLocalizedUrl(req, '/user', locale);
    console.warn('🏠 Root redirect to:', roleBasedUrl.toString());
    return NextResponse.redirect(roleBasedUrl);
  }

  if (requiresRoleCheck) {
    // Check if user has access to the current path based on their role
    const hasAccess = hasAccessToPath(pathname, userRole || '');
    console.warn('🚦 Role Check:', {
      pathname,
      userRole,
      hasAccess,
      requiresRoleCheck,
    });

    if (!hasAccess) {
      const locale = detectLocale(req);

      // Redirect to appropriate role-based page
      const redirectUrl = userRole === 'admin'
        ? createLocalizedUrl(req, '/admin', locale)
        : createLocalizedUrl(req, '/user', locale);

      console.warn('🔄 Redirecting to:', redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|assets/images).*)',
  ],
};
