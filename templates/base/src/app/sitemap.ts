import type { MetadataRoute } from 'next';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl, getI18nPath } from '@/utils/Helpers';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  return AppConfig.locales.map(locale => ({
    url: `${baseUrl}${getI18nPath('/', locale)}`,
    changeFrequency: 'weekly',
    priority: 1,
  }));
}
