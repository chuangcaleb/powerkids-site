/**
 * Typed, validated environment access — the only module allowed to touch
 * `process.env` (lint-enforced). Validation is strict at build time too, which
 * means every build needs every variable set to something.
 *
 * Why that ordering, and how CI/Vercel satisfy it:
 * docs/ops/environments.md § How variables are read.
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
  | 'VERCEL_BRANCH_URL'
  | 'RESEND_API_KEY'
  | 'RESEND_FROM_ADDRESS'

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
 * R2's region is always the literal `auto`, so it is a constant, not a
 * variable — hard-coded here so it cannot be misconfigured. See
 * docs/ops/environments.md § Three R2 traps.
 */
export const S3_REGION = 'auto'

export const isProduction = process.env.NODE_ENV === 'production'
