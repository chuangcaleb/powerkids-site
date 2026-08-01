/**
 * Typed, validated environment access.
 *
 * Every other module imports from here. The lint config forbids `process.env`
 * elsewhere, so a missing or misspelled variable surfaces as a startup error
 * naming the variable, rather than as `undefined` flowing into a database URL
 * and failing somewhere unrelated three layers down.
 *
 * Validation is strict everywhere, including at build time. The Payload config
 * calls `requireEnv` while it is being constructed, and Next constructs it
 * during page-data collection — so a missing variable fails the build rather
 * than the first request that happens to need it. That is the useful ordering:
 * a deploy that cannot work should not become a deploy that half works.
 *
 * The cost is that any build needs every variable set to something. CI sets
 * deliberately fake values (see .github/workflows/verify.yml); real values live
 * only in `.env` and the Vercel dashboard.
 */

type EnvKey =
  | 'DATABASE_URI'
  | 'PAYLOAD_SECRET'
  | 'NEXT_PUBLIC_SERVER_URL'
  | 'S3_BUCKET'
  | 'S3_ACCESS_KEY_ID'
  | 'S3_SECRET_ACCESS_KEY'
  | 'S3_ENDPOINT'
  | 'R2_PUBLIC_URL'
  | 'PREVIEW_SECRET'
  | 'VERCEL_URL'

/** Read a required variable, or throw naming it. */
export function requireEnv(key: EnvKey): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `See .env.example and docs/ops/environments.md.`,
    )
  }

  return value
}

/** Read an optional variable, falling back to a default. */
export function optionalEnv(key: EnvKey, fallback: string): string {
  return process.env[key] || fallback
}

/**
 * R2 is S3-compatible but not S3. Its region is always the literal string
 * `auto` — passing the bucket's location hint instead produces signature
 * errors that read like a credentials problem. Hard-coded so it cannot be
 * misconfigured.
 */
export const S3_REGION = 'auto'

export const isProduction = process.env.NODE_ENV === 'production'
