import { optionalEnv, requireEnv } from '@/lib/env'

/**
 * Canonical site origin, no trailing slash. Used for absolute URLs (SEO, previews).
 *
 * On Vercel preview/branch deployments the origin changes per-deploy, so
 * `NEXT_PUBLIC_SERVER_URL` is left unset there and we fall back to the
 * Vercel-injected `VERCEL_URL` (host only, no protocol). Production sets
 * `NEXT_PUBLIC_SERVER_URL` explicitly to the real domain.
 */
export function getServerUrl(): string {
  const vercelUrl = optionalEnv('VERCEL_URL', '')
  if (vercelUrl) return `https://${vercelUrl}`.replace(/\/$/, '')
  return requireEnv('NEXT_PUBLIC_SERVER_URL').replace(/\/$/, '')
}
