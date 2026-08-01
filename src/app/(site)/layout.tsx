import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/footer/footer'
import { Header } from '@/components/header/header'
import { shantellSans } from '@/styles/fonts/shantell-sans'
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

// Header/Footer read `site-settings`/`navigation` from Postgres, so every
// page under this layout must render at request time, never at build time —
// CI builds against fake placeholder env vars with no real database to
// reach (see docs/ops/environments.md). Content freshness comes from the
// revalidatePath calls in each collection/global's afterChange hook, not
// from build-time static generation.
export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={shantellSans.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
