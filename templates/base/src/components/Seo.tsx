import type { Metadata } from 'next';
import { AppConfig } from '@/utils/AppConfig';

export type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  languages?: Record<string, string>;
  keywords?: string[];
  noIndex?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    locale?: string;
  };
  twitter?: {
    title?: string;
    description?: string;
    creator?: string;
    site?: string;
  };
};

export function constructMetadata({
  title,
  description = AppConfig.description,
  canonical = AppConfig.url,
  languages,
  keywords = AppConfig.keywords,
  noIndex = false,
  openGraph,
  twitter,
}: SeoProps = {}): Metadata {
  const resolvedTitle = title
    ? `${title}${AppConfig.titleSeparator}${AppConfig.name}`
    : AppConfig.title;
  const socialTitle = openGraph?.title || resolvedTitle;
  const socialDescription = openGraph?.description || description;
  const twitterHandle = twitter?.creator || AppConfig.twitterHandle;
  const twitterSite = twitter?.site || AppConfig.twitterHandle;

  return {
    metadataBase: new URL(AppConfig.url),
    applicationName: AppConfig.name,
    title: resolvedTitle,
    description,
    keywords,
    authors: [{ name: AppConfig.author }],
    creator: AppConfig.author,
    publisher: AppConfig.author,
    category: 'technology',
    referrer: 'origin-when-cross-origin',
    alternates: {
      canonical,
      languages,
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: 'website',
      title: socialTitle,
      description: socialDescription,
      url: openGraph?.url || canonical,
      siteName: AppConfig.name,
      locale: openGraph?.locale || AppConfig.locale,
      images: [{
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: socialTitle,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: twitter?.title || resolvedTitle,
      description: twitter?.description || description,
      images: ['/twitter-image'],
      ...(twitterHandle ? { creator: twitterHandle } : {}),
      ...(twitterSite ? { site: twitterSite } : {}),
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png' }],
    },
    manifest: '/manifest.webmanifest',
  };
}
