/* eslint-disable no-console */
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { RandomJoke } from '@/components/RandomJoke';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
              <LocaleSwitcher />
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
          <p className="mx-auto mb-16 max-w-4xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
            A production-ready Next.js boilerplate with TypeScript, Tailwind CSS, and authentication.
            <span className="mt-2 block font-semibold text-foreground">
              Built for developers who want to ship fast.
            </span>
          </p>

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
              {
                title: 'Authentication',
                description: 'Complete authentication system with NextAuth.js including social login and user management.',
                icon: '🔐',
                gradient: 'from-gray-800 to-gray-600',
              },
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
            ].map(feature => (
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
                'NextAuth',
                'Vitest',
              ].map(tech => (
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
    </div>
  );
}
