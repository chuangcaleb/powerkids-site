import type { Metadata, Viewport } from 'next'
import { draftMode } from 'next/headers'
import type { ReactNode } from 'react'
import { AdminBar } from '@/components/admin-bar/admin-bar'
import { Footer } from '@/components/footer/footer'
import { Header } from '@/components/header/header'
import { JsonLd } from '@/components/json-ld/json-ld'
import { cx } from '@/lib/cx'
import { getServerUrl } from '@/lib/get-server-url'
import { SITE_NAME } from '@/lib/site'
import { getSiteSettings } from '@/payload/globals/get-site-settings'
import { bricolageGrotesque } from '@/styles/fonts/bricolage-grotesque'
import { figtree } from '@/styles/fonts/figtree'
import '@/styles/index.css'

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
  const siteSettings = await getSiteSettings()
  const origin = getServerUrl()

  return (
    <html lang="en" className={cx(bricolageGrotesque.variable, figtree.variable)}>
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: origin,
            email: siteSettings.email,
            telephone: siteSettings.phones?.[0]?.href,
            sameAs: siteSettings.socials?.map((social) => social.url) ?? [],
          }}
        />
        <AdminBar preview={preview} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
