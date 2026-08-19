import type { Metadata, Viewport } from 'next'
import { draftMode } from 'next/headers'
import type { ReactNode } from 'react'
import { AdminBar } from '@/components/admin-bar/admin-bar'
import { Footer } from '@/components/footer/footer'
import { Header } from '@/components/header/header'
import { cx } from '@/lib/cx'
import { SITE_NAME } from '@/lib/site'
import { archivo } from '@/styles/fonts/archivo'
import { bricolageGrotesque } from '@/styles/fonts/bricolage-grotesque'
import '@/styles/tokens/index.css'
import '@/styles/compositions/index.css'
import '@/styles/utilities/index.css'
import '@/styles/global/index.css'

/**
 * Root layout for the public site.
 *
 * Header, footer, and content-driven metadata arrive with the CMS.
 */
export const metadata: Metadata = {
  title: SITE_NAME,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { isEnabled: preview } = await draftMode()

  return (
    <html lang="en" className={cx(bricolageGrotesque.variable, archivo.variable)}>
      <body>
        <AdminBar preview={preview} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
