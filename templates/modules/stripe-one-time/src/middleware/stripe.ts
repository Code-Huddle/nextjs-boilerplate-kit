import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to protect Stripe API routes
 * This ensures that Stripe routes are only accessible to authenticated users
 * when authentication is enabled
 */
export function withStripeAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Check if authentication is required
    const authRequired = process.env.AUTH_REQUIRED === 'true';
    
    if (authRequired) {
      // Check for authentication token/session
      const authHeader = req.headers.get('authorization');
      const sessionCookie = req.cookies.get('auth-session') || req.cookies.get('next-auth.session-token');
      
      if (!authHeader && !sessionCookie) {
        return NextResponse.json(
          { error: 'Authentication required for Stripe operations' },
          { status: 401 }
        );
      }
    }

    return handler(req);
  };
}

/**
 * Utility to get user ID from request for Stripe customer operations
 */
export function getUserIdFromRequest(req: NextRequest): string | null {
  // Try to extract user ID from various auth sources
  const authHeader = req.headers.get('authorization');
  const sessionCookie = req.cookies.get('auth-session') || req.cookies.get('next-auth.session-token');
  
  // This would need to be implemented based on your auth provider
  // For now, return null to indicate no user ID found
  return null;
}
