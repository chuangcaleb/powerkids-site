'use client'

import { getClientSideUrl } from '@/lib/get-client-side-url'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/**
 * Listens for admin-panel edits and refreshes the route via router.refresh()
 * — needs "use client" since Payload posts messages to `window`. `serverURL`
 * comes from the server-rendered parent: `getServerUrl()` reads env vars via
 * a dynamic `process.env[key]` lookup, which Next can only inline for
 * literal `process.env.NEXT_PUBLIC_X` expressions — calling it from inside
 * this client component would resolve to `undefined` in the browser bundle.
 */
export function LivePreviewListener() {
  const router = useRouter()

  return (
    <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={getClientSideUrl()} />
  )
}
