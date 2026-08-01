import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'

/** overrideAccess: false — Local API runs as admin by default; the public read must stay filtered to published. */
export const getEvents = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'events',
    sort: 'order',
    depth: 1,
    limit: 100,
    overrideAccess: false,
  })
  return result.docs
})

export const getEventById = cache(async (id: number) => {
  const payload = await getPayloadClient()
  return payload.findByID({ collection: 'events', id, depth: 1, overrideAccess: false })
})

export const getEventBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  return result.docs[0] ?? null
})
