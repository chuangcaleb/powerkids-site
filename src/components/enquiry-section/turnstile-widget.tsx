'use client'

// Client component: loads a third-party script and drives an imperative
// widget API — no server equivalent.

import { useEffect, useRef, useState } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          size: 'invisible'
          callback: (token: string) => void
        },
      ) => string
    }
  }
}

let scriptLoadPromise: Promise<void> | null = null

function loadTurnstileScript(): Promise<void> {
  scriptLoadPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Turnstile script'))
    document.head.appendChild(script)
  })
  return scriptLoadPromise
}

export type TurnstileWidgetProps = {
  siteKey: string
  onToken: (token: string) => void
  /** Ref to the element whose scroll-into-view/focus triggers the lazy load. */
  triggerRef: React.RefObject<HTMLElement | null>
}

/**
 * Invisible-mode Cloudflare Turnstile widget. The script is never loaded
 * eagerly on page load (script-weight cost, spec §4) — only once the
 * enquiry form scrolls into view or gains focus.
 */
export function TurnstileWidget({ siteKey, onToken, triggerRef }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const target = triggerRef.current
    if (!target || shouldLoad) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setShouldLoad(true)
      },
      { rootMargin: '200px' },
    )
    observer.observe(target)

    const onFocusIn = () => setShouldLoad(true)
    target.addEventListener('focusin', onFocusIn)

    return () => {
      observer.disconnect()
      target.removeEventListener('focusin', onFocusIn)
    }
  }, [triggerRef, shouldLoad])

  useEffect(() => {
    if (!shouldLoad || !containerRef.current) return

    let cancelled = false
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          size: 'invisible',
          callback: onToken,
        })
      })
      .catch(() => {
        // Left unverified — the Server Action rejects a missing/invalid
        // token with the same generic error as any other submit failure.
      })

    return () => {
      cancelled = true
    }
  }, [shouldLoad, siteKey, onToken])

  return <div ref={containerRef} />
}
