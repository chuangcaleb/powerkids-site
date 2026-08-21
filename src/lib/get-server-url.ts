import { optionalEnv } from '@/lib/env'

/**
 * Canonical site origin, no trailing slash. Used for absolute URLs (SEO, previews)
 * and, critically, as Payload's `serverURL` — which Payload auto-adds to its CSRF
 * allowlist. Must match the Origin header the browser actually sends, or admin
 * writes fail with 401/403 while login and page loads still work.
 *
 * On Vercel preview/branch deployments the origin changes per-deploy, so
 * `NEXT_PUBLIC_SERVER_URL` is left unset there. We fall back to the
 * Vercel-injected `VERCEL_BRANCH_URL` (stable per git branch — matches the
 * alias domain reviewers actually browse to) rather than `VERCEL_URL` (unique
 * per deployment, never matches the alias domain's Origin header). Production
 * sets `NEXT_PUBLIC_SERVER_URL` explicitly to the real domain.
 */
export function getServerUrl(): string {
  const nextPublicServerUrl = optionalEnv('NEXT_PUBLIC_SERVER_URL', '')
  if (nextPublicServerUrl) return `https://${nextPublicServerUrl}`.replace(/\/$/, '')

  const vercelBranchUrl = optionalEnv('VERCEL_BRANCH_URL', '')
  if (vercelBranchUrl) return `https://${vercelBranchUrl}`.replace(/\/$/, '')

  const vercelUrl = optionalEnv('VERCEL_URL', '')
  if (vercelUrl) return `https://${vercelUrl}`.replace(/\/$/, '')

  return 'http://localhost:3000'
}
