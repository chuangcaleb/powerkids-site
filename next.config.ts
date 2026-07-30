import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

/**
 * Media is served straight from the R2 bucket's public URL rather than proxied
 * through the app, so `next/image` needs that host allowed. Derived from the
 * env var so a custom domain works without editing this file — and so the
 * allowlist can never drift from what the storage adapter actually returns.
 *
 * Root config files are outside `src/`, so reading `process.env` here is fine;
 * the lint rule covers application code, which runs per request.
 */
function mediaHostname(): string | undefined {
  const raw = process.env.R2_PUBLIC_URL
  if (!raw) return undefined

  try {
    return new URL(raw).hostname
  } catch {
    throw new Error(`R2_PUBLIC_URL is not a valid URL: ${raw}`)
  }
}

const hostname = mediaHostname()

const nextConfig: NextConfig = {
  // Payload's admin panel and the upload pipeline need the Node runtime —
  // `sharp` cannot run on Edge. Keep route-level runtime overrides out of
  // anything that touches uploads.
  serverExternalPackages: ['sharp'],

  images: {
    remotePatterns: hostname ? [{ protocol: 'https', hostname }] : [],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
