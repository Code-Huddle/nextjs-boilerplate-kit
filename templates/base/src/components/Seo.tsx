import type { Metadata } from 'next';
import { AppConfig } from '@/utils/AppConfig';

export type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    locale?: string;
    type?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  additionalLinkTags?: Array<{
    rel: string;
    href: string;
    as?: string;
    type?: string;
    sizes?: string;
  }>;
};

export function constructMetadata({
  title,
  description,
  canonical,
  openGraph,
  twitter,

}: SeoProps = {}): Metadata {
  // Use the app config for defaults
  const defaultTitle = AppConfig.title;
  const defaultDescription = AppConfig.description;
  const defaultOgImage = '/images/og-image.jpg';

  // Construct the metadata object
  const metadata: any = {
    metadataBase: new URL(AppConfig.url),
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description ?? defaultDescription,
    authors: [{ name: AppConfig.author }],
    openGraph: {
      title: openGraph?.title || title || defaultTitle,
      description: openGraph?.description || description || defaultDescription,
      url: openGraph?.url || canonical || AppConfig.url,
      siteName: openGraph?.siteName || defaultTitle,
      images: openGraph?.images || [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: openGraph?.title || title || defaultTitle,
        },
      ],
      locale: openGraph?.locale || AppConfig.locale,
      type: openGraph?.type || 'website',
    },
    twitter: {
      card: twitter?.card || 'summary_large_image',
      title: twitter?.title || title || defaultTitle,
      description: twitter?.description || description || defaultDescription,
      images: twitter?.image ? [twitter.image] : undefined,
      creator: twitter?.creator || '@yourtwitterhandle',
      site: twitter?.site || '@yourtwitterhandle',
    },
    alternates: {
      canonical: canonical || AppConfig.url,
    },
  };

  return metadata;
}

// Usage example for a page:
// export const metadata = constructMetadata({
//   title: 'Home',
//   description: 'Welcome to our website',
// });
