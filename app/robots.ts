import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/contact', '/legal/privacy', '/legal/refund', '/legal/terms'],
      disallow: ['/user/', '/api/', '/auth/', '/flights/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
