import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nte-build-score-calculator.vercel.app';
const disallowIndex = process.env.NEXT_PUBLIC_ROBOTS_NOINDEX === 'true';

export default function robots(): MetadataRoute.Robots {
  if (disallowIndex) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
