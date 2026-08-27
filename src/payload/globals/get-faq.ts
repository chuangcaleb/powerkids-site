import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'

export const getFaq = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'faq' })
})
