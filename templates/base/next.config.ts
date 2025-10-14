import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/libs/Env';

const withNextIntl = createNextIntlPlugin('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
export default bundleAnalyzer(
  withNextIntl({
    eslint: {
      dirs: ['.'],
    },
    poweredByHeader: false,
    reactStrictMode: true,
    serverExternalPackages: ['@electric-sql/pglite'],

    // Performance optimizations
    compress: true,

    // Modularize imports to reduce bundle size
    modularizeImports: {
      'lucide-react': {
        transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
        skipDefaultConversion: true,
      },
      '@radix-ui/react-icons': {
        transform: '@radix-ui/react-icons/dist/{{member}}',
      },
    },

    // Image optimization
    images: {
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 60,
    },

    // Production-only optimizations
    ...(process.env.NODE_ENV === 'production' && {
      compiler: {
        removeConsole: {
          exclude: ['error', 'warn'],
        },
      },
    }),
  }),
);
