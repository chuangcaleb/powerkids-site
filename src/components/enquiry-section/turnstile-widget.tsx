'use client'

// Client component: loads a third-party script and drives an imperative
// widget API — no server equivalent.

import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styles from './turnstile-widget.module.css'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

/** A challenge that never calls back must not hang the submit button. */
const CHALLENGE_TIMEOUT_MS = 15_000

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          size: 'invisible'
          /** `'execute'` defers the challenge until `execute()` is called. */
          execution: 'execute'
          callback: (token: string) => void
          'error-callback': (code: string) => void
        },
      ) => string
      execute: (widgetId: string) => void
      reset: (widgetId: string) => void
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

export type TurnstileHandle = {
  /** Runs a fresh challenge and resolves its token. Rejects on failure. */
  getToken: () => Promise<string>
}

export type TurnstileWidgetProps = {
  siteKey: string
  ref: React.Ref<TurnstileHandle>
  /** Ref to the element whose scroll-into-view/focus triggers the lazy load. */
  triggerRef: React.RefObject<HTMLElement | null>
}

type Settlers = {
  resolve: (token: string) => void
  reject: (error: Error) => void
}

/**
 * Invisible-mode Cloudflare Turnstile widget. The script is never loaded
 * eagerly on page load (script-weight cost, spec §4) — only once the
 * enquiry form scrolls into view or gains focus, or on first `getToken()`.
 *
 * Tokens are single-use and short-lived, so none is held across attempts:
 * every `getToken()` resets the widget and runs a new challenge, otherwise
 * siteverify answers `timeout-or-duplicate`.
 */
export function TurnstileWidget({ siteKey, ref, triggerRef }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetPromiseRef = useRef<Promise<string> | null>(null)
  const settlersRef = useRef<Settlers | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  // The widget's callbacks are registered once at render but must land on
  // whichever `getToken()` is waiting now — clearing on hand-off stops a
  // late callback settling an unrelated attempt.
  function takeSettlers(): Settlers | null {
    const settlers = settlersRef.current
    settlersRef.current = null
    return settlers
  }

  // In a ref, not state, so `getToken` awaits the same in-flight render the
  // lazy-load effect started.
  const ensureWidget = useCallback((): Promise<string> => {
    widgetPromiseRef.current ??= loadTurnstileScript().then(() => {
      const container = containerRef.current
      if (!container || !window.turnstile) {
        throw new Error('Turnstile container or script unavailable')
      }
      return window.turnstile.render(container, {
        sitekey: siteKey,
        size: 'invisible',
        execution: 'execute',
        callback: (token) => takeSettlers()?.resolve(token),
        'error-callback': (code) =>
          takeSettlers()?.reject(new Error(`Turnstile error ${code}`)),
      })
    })
    return widgetPromiseRef.current
  }, [siteKey])

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
    if (!shouldLoad) return
    // Warm-up: a load failure surfaces at `getToken()` instead.
    ensureWidget().catch(() => {})
  }, [shouldLoad, ensureWidget])

  useImperativeHandle(
    ref,
    () => ({
      getToken: async () => {
        const widgetId = await ensureWidget()
        const turnstile = window.turnstile
        if (!turnstile) throw new Error('Turnstile script unavailable')

        // Earlier token is spent — reset so this call can't resolve with it.
        turnstile.reset(widgetId)

        return new Promise<string>((resolve, reject) => {
          takeSettlers()?.reject(new Error('Turnstile challenge superseded'))

          const timeout = setTimeout(
            () => takeSettlers()?.reject(new Error('Turnstile challenge timed out')),
            CHALLENGE_TIMEOUT_MS,
          )

          settlersRef.current = {
            resolve: (token) => {
              clearTimeout(timeout)
              resolve(token)
            },
            reject: (error) => {
              clearTimeout(timeout)
              reject(error)
            },
          }

          turnstile.execute(widgetId)
        })
      },
    }),
    [ensureWidget],
  )

  return <div ref={containerRef} className={styles.container} />
}
