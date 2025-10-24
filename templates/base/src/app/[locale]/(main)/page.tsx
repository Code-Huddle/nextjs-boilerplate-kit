/* eslint-disable no-console */
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { RandomJoke } from '@/components/RandomJoke';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthFeatureCard } from '@/components/AuthFeatureCard';
import { AuthTechBadge } from '@/components/AuthTechBadge';
import { StripeTechBadge } from '@/components/StripeFeatureCard';
import { EmailTechBadge } from '@/components/EmailTechBadge';
import { PWADownloadPrompt } from '@/components/PWADownloadPrompt';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  console.log('locale', locale);
  return {
    title: 'CodeHuddle - Modern Web Development Boilerplate',
    description: 'A modern Next.js boilerplate with TypeScript, Tailwind CSS, and authentication built by CodeHuddle.',
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  // Get auth-specific content
  const authFeatureCard = AuthFeatureCard();
  const authTechBadge = AuthTechBadge();
  
  // Get Stripe-specific content (will be replaced by CLI)
  const stripeTechBadge = StripeTechBadge({ integrationType: '__STRIPE_INTEGRATION_TYPE__' });
  
  // Get Email-specific content (will be replaced by CLI)
  const emailTechBadge = EmailTechBadge();

  // Generator placeholders (strings) safely handled at runtime
  const AUTH_MESSAGE = '__AUTH_MESSAGE__';
  const STRIPE_INTEGRATION_TYPE = '__STRIPE_INTEGRATION_TYPE__';
  const AUTH_TYPE = '__AUTH_TYPE__';
  const EMAIL_INTEGRATION = '__EMAIL_INTEGRATION__';
  const DASHBOARD_MESSAGE = '__DASHBOARD_MESSAGE__';
  const PWA_MESSAGE = '__PWA_MESSAGE__';
  const STORYBOOK_MESSAGE = '__STORYBOOK_MESSAGE__';
  const DOCKER_MESSAGE = '__DOCKER_MESSAGE__';
  const SENTRY_MESSAGE = '__SENTRY_MESSAGE__';
  const ORM_MESSAGE = '__ORM_MESSAGE__';
  const ORM_TYPE = '__ORM_TYPE__';
  const DARK_MODE_ENABLED = '__DARK_MODE_ENABLED__';

  const hasStripe = !STRIPE_INTEGRATION_TYPE.startsWith('__') && (STRIPE_INTEGRATION_TYPE === 'OneTime' || STRIPE_INTEGRATION_TYPE === 'Subscriptions');
  const hasAuth = !AUTH_TYPE.startsWith('__');
  const hasEmail = !EMAIL_INTEGRATION.startsWith('__') && EMAIL_INTEGRATION.length > 0;
  const hasDashboard = !DASHBOARD_MESSAGE.startsWith('__') && DASHBOARD_MESSAGE.length > 0;
  const hasPwa = !PWA_MESSAGE.startsWith('__') && PWA_MESSAGE.length > 0;
  const hasStorybook = !STORYBOOK_MESSAGE.startsWith('__') && STORYBOOK_MESSAGE.length > 0;
  const hasDocker = !DOCKER_MESSAGE.startsWith('__') && DOCKER_MESSAGE.length > 0;
  const hasSentry = !SENTRY_MESSAGE.startsWith('__') && SENTRY_MESSAGE.length > 0;
  const hasOrm = !ORM_MESSAGE.startsWith('__') && ORM_MESSAGE.length > 0 && ORM_TYPE !== 'None';
  const showDarkToggle = !DARK_MODE_ENABLED.startsWith('__') && DARK_MODE_ENABLED === 'true';

  return (
    <div className="geometric-bg min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-futuristic text-2xl font-bold transition-all duration-500 hover:scale-105"
              >
                CodeHuddle
              </Link>
              <a
                href="https://github.com/codehuddle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-foreground"
              >
                GitHub
              </a>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/sign-in"
                className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-foreground"
              >
                {t('sign_in_link')}
              </Link>
              <Button asChild variant="futuristic" size="sm">
                <Link href="/sign-up">
                  {t('sign_up_link')}
                </Link>
              </Button>
              {hasDashboard && (
                <Link
                  href="/dashboard"
                  className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-foreground"
                >
                  Dashboard
                </Link>
              )}
              <LocaleSwitcher />
              {showDarkToggle && <DarkModeToggle />}
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-32 text-center">
          {/* Floating Badge */}
          <div className="mb-8 animate-float">
            <span className="inline-flex items-center rounded-full border border-border/30 bg-muted/50 px-6 py-3 text-sm font-medium text-foreground shadow-lg backdrop-blur-sm">
              ✨ Futuristic Web Development
            </span>
          </div>

          {/* Main Heading */}
          <div className="mb-8 space-y-4">
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
              <span className="block text-foreground">Welcome to</span>
              <span className="text-futuristic block">
                CodeHuddle
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="mx-auto mb-6 max-w-4xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
            A production-ready Next.js boilerplate with TypeScript, Tailwind CSS, and authentication.
            <span className="mt-2 block font-semibold text-foreground">
              Built for developers who want to ship fast.
            </span>
          </p>

          {/* Integration Cards */}
          <div className="mx-auto mb-16 max-w-4xl">
            {/* Welcome Message */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {!AUTH_MESSAGE.startsWith('__') && (
                <h2 className="text-xl font-semibold text-foreground mb-2">{AUTH_MESSAGE}</h2>
              )}
              <p className="text-muted-foreground">Your application is configured and ready</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Auth Card */}
              {hasAuth && (
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.761 0-5 2.239-5 5v1h10v-1c0-2.761-2.239-5-5-5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {AUTH_TYPE === 'None' && 'Authentication is disabled'}
                        {AUTH_TYPE === 'NextAuth' && 'NextAuth.js configured'}
                        {AUTH_TYPE === 'Supabase' && 'Supabase Auth configured'}
                        {AUTH_TYPE === 'SupabaseRoles' && 'Supabase Auth with Roles configured'}
                      </p>
                      {AUTH_TYPE === 'SupabaseRoles' && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-2">Protected Routes:</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              /admin (Admin only)
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              /user (User only)
                            </span>
                          </div>
                        </div>
                      )}
                      {AUTH_TYPE === 'None' ? (
                        <a href="/sign-in" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                          Explore Auth Options
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      ) : (
                        <a href="/sign-in" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                          Go to Sign In
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-primary/10 opacity-20" />
                </div>
              )}
              {/* Stripe Card */}
              {hasStripe && (
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                      <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.573-2.354 1.573-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Stripe Integration</h3>
                      <p className="text-sm text-muted-foreground mb-3">{STRIPE_INTEGRATION_TYPE === 'Subscriptions' ? 'Subscription billing enabled' : 'One-time payments enabled'}</p>
                      <a 
                        href={STRIPE_INTEGRATION_TYPE === 'Subscriptions' ? '/test-subscription' : '/test-payment'}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        {STRIPE_INTEGRATION_TYPE === 'Subscriptions' ? 'Test Subscription' : 'Test Payment'}
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-green-500/10 opacity-20" />
                </div>
              )}

              {/* Email Card */}
              {hasEmail && (
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Email Integration</h3>
                      <p className="text-sm text-muted-foreground mb-3">Email sending enabled with Nodemailer</p>
                      <a href="/test-email" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        Test Email
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-blue-500/10 opacity-20" />
                </div>
              )}

              {/* Dashboard Card */}
              {hasDashboard && (
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                      <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M9 7h12M9 11h12M9 15h12M3 7h4M3 11h4M3 15h4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Dashboard</h3>
                      <p className="text-sm text-muted-foreground mb-3">Explore analytics and UI widgets</p>
                      <a href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        Open Dashboard
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-purple-500/10 opacity-20" />
                </div>
              )}

              {/* PWA Card */}
              {hasPwa && (
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                      <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3-6 4 12 3-6h4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">PWA Enabled</h3>
                      <p className="text-sm text-muted-foreground mb-3">Install the app and enjoy offline support</p>
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-amber-500/10 opacity-20" />
                </div>
              )}

              {/* Storybook Card */}
              {hasStorybook && (
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/50">
                      <svg className="h-5 w-5 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Storybook</h3>
                      <p className="text-sm text-muted-foreground mb-3">Run <code>npm run storybook</code> to explore UI components</p>
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-pink-500/10 opacity-20" />
                </div>
              )}

              {/* Docker Card */}
              {hasDocker && (
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/50">
                      <svg className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Docker Configuration</h3>
                      <p className="text-sm text-muted-foreground mb-3">Containerization ready with Dockerfile and docker-compose.yml</p>
                      <div className="text-xs text-muted-foreground">
                        <code>docker-compose up</code> for development
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-cyan-500/10 opacity-20" />
                </div>
              )}

              {/* Sentry Card */}
              {hasSentry && (
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
                      <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Sentry Monitoring</h3>
                      <p className="text-sm text-muted-foreground mb-3">Error tracking and performance monitoring enabled</p>
                      <div className="text-xs text-muted-foreground">
                        Configure <code>NEXT_PUBLIC_SENTRY_DSN</code> in your environment
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-orange-500/10 opacity-20" />
                </div>
              )}

              {/* ORM Card */}
              {hasOrm && (
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                      <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Database ORM</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {ORM_TYPE === 'None' && 'No ORM selected'}
                        {ORM_TYPE === 'Drizzle' && 'Drizzle ORM configured'}
                        {ORM_TYPE === 'Prisma' && 'Prisma ORM configured'}
                        {ORM_TYPE === 'Mongoose' && 'Mongoose ORM configured'}
                      </p>
                      {ORM_TYPE !== 'None' && (
                        <a href="/test-orm" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                          Test Database Operations
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-indigo-500/10 opacity-20" />
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mb-20 flex flex-col justify-center gap-6 sm:flex-row">
            <Button asChild variant="futuristic" size="xl" className="animate-glow">
              <Link href="/sign-up">
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link href="/sign-in">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Floating Elements */}
          <div className="relative">
            <div className="animate-pulse-slow absolute -left-20 top-0 size-32 rounded-full bg-primary/5 blur-3xl" />
            <div className="animate-pulse-slow absolute -right-20 top-0 size-32 rounded-full bg-primary/10 blur-3xl" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-32">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Everything You Need to
              <span className="text-futuristic block">
                Build Fast
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Comprehensive tooling and modern architecture patterns for scalable applications
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Next.js 15',
                description: 'Built with the latest Next.js App Router for optimal performance and cutting-edge features.',
                icon: '⚡',
                gradient: 'from-black to-gray-800',
              },
              authFeatureCard,
              {
                title: 'TypeScript',
                description: 'Fully typed with TypeScript for better development experience and fewer runtime errors.',
                icon: '📘',
                gradient: 'from-gray-600 to-gray-400',
              },
              {
                title: 'Tailwind CSS',
                description: 'Beautiful, responsive design with Tailwind CSS and modern UI components.',
                icon: '🎨',
                gradient: 'from-gray-400 to-gray-200',
              },
              {
                title: 'Internationalization',
                description: 'Multi-language support with next-intl for building global applications.',
                icon: '🌍',
                gradient: 'from-gray-200 to-white',
              },
              {
                title: 'Developer Tools',
                description: 'ESLint, Prettier, Husky, and comprehensive testing setup for smooth development.',
                icon: '🛠️',
                gradient: 'from-white to-gray-100',
              },
            ].filter(Boolean).map(feature => (
              <Card
                key={`feature-${feature.title}`}
                className="border-futuristic group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`} />
                <CardHeader className="pb-4">
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-32">
          <div className="text-center">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Built with
              <span className="text-futuristic block">
                Modern Technologies
              </span>
            </h2>
            <p className="mx-auto mb-16 max-w-3xl text-lg text-muted-foreground">
              Leveraging the best tools and frameworks to ensure your project is scalable, maintainable, and future-proof.
            </p>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {[
                'Next.js',
                'React 19',
                'TypeScript',
                'Tailwind',
                authTechBadge,
                stripeTechBadge,
                emailTechBadge,
                'Vitest',
              ].filter(Boolean).map(tech => (
                <div
                  key={`tech-${tech}`}
                  className="border-futuristic group rounded-2xl border border-border/30 bg-card/50 p-6 text-center font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-border/60 hover:bg-card/80 hover:shadow-lg"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-futuristic mb-24 border-0 bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 p-16 text-center backdrop-blur-sm">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl font-bold text-foreground md:text-5xl">
              Ready to Build Something
              <span className="text-futuristic block">
                Amazing?
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Start your next project with our production-ready boilerplate and ship faster than ever before.
            </p>

            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Button asChild variant="futuristic" size="xl" className="animate-glow">
                <Link href="/sign-up">
                  Start Building Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a
                  href="https://github.com/codehuddle"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sample data fetching with React Query */}
        <div className="mb-24">
          <RandomJoke />
        </div>

        {/* Footer */}
        <div className="border-t border-border/20 pt-16 text-center">
          <p className="text-muted-foreground">
            Made with ♥ by
            {' '}
            <a
              href="https://github.com/codehuddle"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary transition-all duration-300 hover:scale-105 hover:text-primary/80"
            >
              CodeHuddle
            </a>
          </p>
          <p className="mt-2 text-sm text-muted-foreground/70">
            Licensed under the MIT License, Copyright © 2024 CodeHuddle.
          </p>
        </div>
      </div>
      {/* PWA Download Prompt */}
      {hasPwa && <PWADownloadPrompt />}
    </div>
  );
}
