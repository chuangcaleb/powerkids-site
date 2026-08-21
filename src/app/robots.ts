import type { MetadataRoute } from 'next'
import { getServerUrl } from '@/lib/get-server-url'

// Must live at true app root, not in (site)/ — verified with `next build`:
// robots.ts inside a route group is silently dropped from the route table
// (Next 16.3.1), unlike sitemap.ts, which resolves fine from (site)/.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/preview', '/exit-preview'],
    },
    sitemap: `${getServerUrl()}/sitemap.xml`,
  }
}
