import { requireEnv } from '@/lib/env'

/** Canonical site origin, no trailing slash. Used for absolute URLs (SEO, previews). */
export function getServerUrl(): string {
  return requireEnv('NEXT_PUBLIC_SERVER_URL').replace(/\/$/, '')
}
