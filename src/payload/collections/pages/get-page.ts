import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'

/**
 * `depth: 1` populates one level of relationship/upload — enough for every
 * block's own media/relationship fields. Raise per-query only where a
 * renderer genuinely needs a nested populated doc (e.g. an event's own
 * gallery via the `gallery` block's `event` relationship).
 */
export const getPage = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { isEnabled: draft } = await draftMode()

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft,
    depth: 1,
    limit: 1,
    overrideAccess: draft,
  })

  return result.docs[0] ?? null
})
