import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'

/** overrideAccess: false — Local API runs as admin by default; the public read must stay filtered to published. */
export const getSchools = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'schools',
    sort: 'order',
    depth: 1,
    limit: 100,
    overrideAccess: false,
  })
  return result.docs
})
