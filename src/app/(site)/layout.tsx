import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { shantellSans } from '@/fonts/shantell-sans'
import '@/styles/tokens/index.css'
import '@/styles/compositions/index.css'
import '@/styles/global/index.css'

/**
 * Root layout for the public site.
 *
 * Header, footer, and content-driven metadata arrive with the CMS.
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
    <html lang="en" className={shantellSans.variable}>
      <body>{children}</body>
    </html>
  )
}
