import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/payload/blocks/render-blocks'
import { getPage } from '@/payload/collections/pages/get-page'
import { getSeoDefaults } from '@/payload/globals/get-seo-defaults'
import { getServerUrl } from '@/lib/get-server-url'
import { Hero } from '@/payload/collections/pages/render-hero'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ slug?: string[] }> }

function slugFromParams(slug: string[] | undefined) {
  return slug?.length ? slug.join('/') : 'home'
}

// No generateStaticParams: it would query Postgres during `next build`, and
// CI intentionally builds against fake placeholder env vars so the build
// never reaches a real service (see docs/ops/environments.md). Pages render
// dynamically on first request and are cached until a `pages` publish
// revalidates them — see revalidate-page.ts.

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slugFromParams(slug))
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
    openGraph: {
      title,
      description,
      url: `${getServerUrl()}/${page.slug === 'home' ? '' : page.slug}`,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slugFromParams(slug))

  if (!page) notFound()

  return (
    <main>
      <Hero hero={page.hero} />
      <RenderBlocks layout={page.layout} />
    </main>
  )
}
