import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

// App configuration variables - adjust according to your project
export const AppConfig = {
  // App info
  name: 'Next.js Boilerplate',
  title: 'Next.js Boilerplate - Production Ready Template',
  description: 'A modern Next.js boilerplate with App Router, TypeScript, Tailwind CSS, and more.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://nextjs-boilerplate.vercel.app',

  // SEO defaults
  titleSeparator: ' | ',
  locale: 'en_US',
  author: 'Haris Ahmed',
  twitterHandle: '@harisahmed',

  // Internationalization settings
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix,

  // Theme settings
  defaultTheme: 'system', // 'light', 'dark', or 'system'

  // Contact information
  contactEmail: 'hello@example.com',

  // Social media
  social: {
    github: 'https://github.com/yourusername/nextjs-boilerplate',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
  },

  // Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,

  // API endpoints - centralize API URLs here
  api: {
    base: process.env.NEXT_PUBLIC_API_URL,
    auth: '/v1/auth',
    users: '/v1/users',
  },

  // Feature flags
  features: {
    darkMode: true,
    auth: true,
    analytics: true,
  },
};
