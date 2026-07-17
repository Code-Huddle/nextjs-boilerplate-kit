import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Your App';
const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION
  || 'A fast, accessible web application built with Next.js.';
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || undefined;

// Replace the defaults and public environment variables before deployment.
export const AppConfig = {
  // App info
  name: appName,
  title: appName,
  description: appDescription,
  url: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, ''),

  // SEO defaults
  titleSeparator: ' | ',
  locale: 'en_US',
  author: 'Code Huddle',
  twitterHandle,
  keywords: [
    appName,
    'web application',
    'Next.js',
  ],

  // Internationalization settings
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix,

  // Theme settings
  defaultTheme: 'system', // 'light', 'dark', or 'system'

  // Contact information
  contactEmail: '',

  // Social media
  social: {
    github: '',
    twitter: '',
    linkedin: {
      haris: 'https://www.linkedin.com/in/haris-ahmed-software-engineer/',
      kashif: 'https://linkedin.com/in/kashiekzmi',
    },
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
