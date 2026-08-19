import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'

export const getSeoDefaults = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'seo-defaults' })
})
