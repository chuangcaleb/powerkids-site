import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'

/** overrideAccess: false — Local API runs as admin by default; the public read must stay filtered to published. */
export const getPrograms = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'programs',
    sort: 'order',
    depth: 1,
    limit: 100,
    overrideAccess: false,
  })
  return result.docs
})

export const getProgramBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'programs',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  return result.docs[0] ?? null
})
