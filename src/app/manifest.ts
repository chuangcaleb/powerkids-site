import type { MetadataRoute } from 'next'

import { SITE_NAME } from '@/lib/site'
import { BRAND } from '@/lib/brand-colours'

// Must live at true app root, not in (site)/ — same route-group gotcha as
// robots.ts.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'PowerKids',
    start_url: '/',
    display: 'standalone',
    background_color: BRAND.cream,
    theme_color: BRAND.cream,
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
