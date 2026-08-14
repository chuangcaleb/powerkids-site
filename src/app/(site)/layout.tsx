import type { Metadata, Viewport } from 'next'
import { draftMode } from 'next/headers'
import type { ReactNode } from 'react'
import { AdminBar } from '@/components/admin-bar/admin-bar'
import { Footer } from '@/components/footer/footer'
import { Header } from '@/components/header/header'
import { PolaroidReel } from '@/components/polaroid-reel/polaroid-reel'
import { RegistrationSection } from '@/components/registration-section/registration-section'
import { cx } from '@/lib/cx'
import { getSiteSettings } from '@/payload/globals/get-site-settings'
import type { Media } from '@/payload-types'
import { archivo } from '@/styles/fonts/archivo'
import { bricolageGrotesque } from '@/styles/fonts/bricolage-grotesque'
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

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [{ isEnabled: preview }, siteSettings] = await Promise.all([
    draftMode(),
    getSiteSettings(),
  ])
  const footerReelPhotos = (siteSettings.footerReel ?? []).filter(
    (photo): photo is Media => typeof photo === 'object',
  )

  return (
    <html lang="en" className={cx(bricolageGrotesque.variable, archivo.variable)}>
      <body>
        <AdminBar preview={preview} />
        <Header />
        {children}
        <RegistrationSection />
        <PolaroidReel photos={footerReelPhotos} />
        <Footer />
      </body>
    </html>
  )
}
