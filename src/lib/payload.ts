import { getPayload } from 'payload'

import config from '@payload-config'

// No extra memoization here: `getPayload` already caches its instance on
// `global._payload` keyed by config, process-wide — not just per-request.
// Wrapping it in React's `cache()` would only dedupe within one render pass,
// weaker than what Payload already does, so it's dead abstraction. Matches
// the official Payload website template, which calls `getPayload({ config })`
// directly at every call site.
export const getPayloadClient = () => getPayload({ config })
