import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

/**
 * Root layout for the public site.
 *
 * Deliberately bare. Fonts, tokens, global styles, header, and footer arrive
 * with the design system; content-driven metadata arrives with the CMS. Adding
 * any of it here now would only have to be undone.
 */
export const metadata: Metadata = {
  title: 'PowerKids Kindergarten',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
