import type { MetadataRoute } from 'next'
import { getServerUrl } from '@/lib/get-server-url'
import { urlForSlug } from '@/lib/page-path'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: 0,
    select: { slug: true, updatedAt: true },
    overrideAccess: false,
  })

  const origin = getServerUrl()

  return docs.map((doc) => ({
    url: urlForSlug(origin, doc.slug),
    lastModified: doc.updatedAt,
  }))
}
