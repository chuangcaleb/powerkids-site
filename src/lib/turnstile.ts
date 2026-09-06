import { requireEnv } from '@/lib/env'

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Verifies a Cloudflare Turnstile (invisible mode) token server-side, inside
 * the enquiry Server Action. Never throws — a network hiccup or malformed
 * response should read as "not verified", not crash the submission.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp: string,
): Promise<boolean> {
  if (!token) return false

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: requireEnv('TURNSTILE_SECRET_KEY'),
        response: token,
        remoteip: remoteIp,
      }),
    })

    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch {
    return false
  }
}
