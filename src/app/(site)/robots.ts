import type { MetadataRoute } from 'next'
import { getServerUrl } from '@/lib/get-server-url'

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
