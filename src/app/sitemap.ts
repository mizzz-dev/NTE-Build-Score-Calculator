import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nte-build-score-calculator.vercel.app';
const isNoIndex = process.env.NEXT_PUBLIC_ROBOTS_NOINDEX === 'true';

const publicPaths = [
  '/',
  '/score',
  '/card',
  '/compare',
  '/presets',
  '/ranking',
  '/guide',
  '/faq',
  '/updates',
  '/contact',
  '/terms',
  '/privacy',
  '/disclaimer',
  '/statuses',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  if (isNoIndex) {
    return [];
  }

  const now = new Date();

  return publicPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));
}
