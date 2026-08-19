import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'

export const getNavigation = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation' })
})
