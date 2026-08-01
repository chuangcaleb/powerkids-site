import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

/** One Payload instance per request, shared by every server component that needs it. */
export const getPayloadClient = cache(() => getPayload({ config }))
