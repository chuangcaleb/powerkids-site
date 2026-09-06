import { afterEach, describe, expect, it, vi } from 'vitest'
import { verifyTurnstileToken } from './turnstile'

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
  vi.unstubAllEnvs()
})

describe('verifyTurnstileToken', () => {
  it('returns true when Cloudflare reports success', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }))

    await expect(verifyTurnstileToken('good-token', '1.2.3.4')).resolves.toBe(true)
  })

  it('returns false when Cloudflare reports failure', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    global.fetch = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }),
          { status: 200 },
        ),
      )

    await expect(verifyTurnstileToken('bad-token', '1.2.3.4')).resolves.toBe(false)
  })

  it('returns false when the token is empty, without calling the network', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    const fetchSpy = vi.fn()
    global.fetch = fetchSpy

    await expect(verifyTurnstileToken('', '1.2.3.4')).resolves.toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns false when the network call throws', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'))

    await expect(verifyTurnstileToken('good-token', '1.2.3.4')).resolves.toBe(false)
  })
})
