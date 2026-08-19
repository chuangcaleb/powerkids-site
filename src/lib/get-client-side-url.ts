import { getServerUrl } from '@/lib/get-server-url'

/**
 * Canonical site origin, for use in client components. Reads `window.location`
 * directly rather than `getServerUrl()`'s env lookup — Next only inlines
 * literal `process.env.NEXT_PUBLIC_X` expressions into the client bundle, so
 * a dynamic `process.env[key]` read (which `getServerUrl` does) resolves to
 * `undefined` in the browser. `window` is unavailable during the server-side
 * render of a client component, so that path falls back to `getServerUrl()`,
 * which runs on the server where the real env is available.
 */
export function getClientSideUrl(): string {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }

  return getServerUrl()
}
