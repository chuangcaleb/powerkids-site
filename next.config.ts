import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Payload's admin panel and the upload pipeline need the Node runtime —
  // `sharp` cannot run on Edge. Keep route-level runtime overrides out of
  // anything that touches uploads.
  serverExternalPackages: ['sharp'],
}

export default nextConfig
