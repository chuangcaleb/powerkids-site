import { getServerUrl } from '@/lib/get-server-url'
import { INDEX_SLUG, slugFromSegments, urlForSlug } from '@/lib/page-path'
import { getPayloadClient } from '@/lib/payload'
import type { Media } from '@/payload-types'
import { RenderBlocks } from '@/payload/blocks/render-blocks'
import { getPage } from '@/payload/collections/pages/get-page'
import { LivePreviewListener } from '@/payload/collections/pages/live-preview-listener'
import { Hero } from '@/payload/collections/pages/render-hero'
import { getSeoDefaults } from '@/payload/globals/get-seo-defaults'
import { SectionDivider } from '@/components/section-divider/section-divider'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug?: string[] }> }

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: 0,
    select: { slug: true },
    overrideAccess: false,
  })

  return docs
    .filter((doc) => doc.slug !== INDEX_SLUG)
    .map((doc) => ({ slug: doc.slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slugFromSegments(slug))
  if (!page) return {}

  const seoDefaults = await getSeoDefaults()
  const title = page.meta?.title ?? page.title
  const description = page.meta?.description ?? seoDefaults.defaultDescription
  const image = (page.meta?.image ?? seoDefaults.defaultImage) as
    Media | number | null | undefined
  const imageUrl = image && typeof image === 'object' ? image.url : undefined

  return {
    title,
    description,
    alternates: { canonical: urlForSlug(getServerUrl(), page.slug) },
    openGraph: {
      title,
      description,
      url: urlForSlug(getServerUrl(), page.slug),
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slugFromSegments(slug))

  if (!page) notFound()

  const { isEnabled: draft } = await draftMode()

  return (
    <>
      {draft && <LivePreviewListener />}
      <main>
        <Hero hero={page.hero} />
        {page.hero.type !== 'none' ? (
          <SectionDivider
            shape="pinking"
            width={13.125}
            depth={1.375}
            above="var(--bg-sun)"
            below="var(--bg-surface)"
          />
        ) : null}
        <RenderBlocks layout={page.layout} />
      </main>
    </>
  )
}
