'use client'

import { useEffect, useState } from 'react'
import type { SectionHeaderData } from '@/components/section-header/section-header'
import { NoJsFallback } from './no-js-fallback'
import type { Simulate } from './use-enquiry-form-demo'
import { VariantAStacked } from './variant-a-stacked'
import { VariantBGrid } from './variant-b-grid'
import { VariantCCard } from './variant-c-card'
import styles from './enquiry-prototype-switcher.module.css'

/**
 * PROTOTYPE — throwaway, ticket #29 (wayfinder map #20: Registration section
 * becomes an Enquiry form). Three variants of the form living where the
 * button used to be, switchable via `?variant=`, plus a state-matrix control
 * panel driving simulated submit outcomes. Dev-only: mounted by
 * registration-section.tsx only when NODE_ENV !== 'production'.
 */

const ENQUIRY_TYPES = ['General', 'Enrolment', 'Tour booking', 'Fees', 'Other']

const VARIANTS = [
  { key: 'A', label: 'Stacked, native controls', Component: VariantAStacked },
  { key: 'B', label: 'Two-column grid, shrunk heading, chips', Component: VariantBGrid },
  { key: 'C', label: 'Floating card, section as backdrop', Component: VariantCCard },
] as const

const SIMULATE_OPTIONS: { value: Simulate; label: string }[] = [
  { value: 'success', label: 'Success' },
  { value: 'validation', label: 'Validation failure' },
  { value: 'server-error', label: 'Server error (503)' },
  { value: 'rate-limited', label: 'Rate-limited' },
  { value: 'offline', label: 'Offline' },
]

function readParam(name: string): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get(name)
}

function writeParam(name: string, value: string) {
  const url = new URL(window.location.href)
  url.searchParams.set(name, value)
  window.history.replaceState(null, '', url.toString())
}

export type EnquiryPrototypeSwitcherProps = { header?: SectionHeaderData | null }

export function EnquiryPrototypeSwitcher({ header }: EnquiryPrototypeSwitcherProps) {
  const [variantIndex, setVariantIndex] = useState(() => {
    const idx = VARIANTS.findIndex((v) => v.key === readParam('variant'))
    return idx >= 0 ? idx : 0
  })
  const [simulate, setSimulate] = useState<Simulate>('success')
  const [slowNetwork, setSlowNetwork] = useState(false)
  const [noJs, setNoJs] = useState(false)

  useEffect(() => {
    writeParam('variant', (VARIANTS[variantIndex] ?? VARIANTS[0]).key)
  }, [variantIndex])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.isContentEditable
      ) {
        return
      }
      if (event.key === 'ArrowLeft') {
        setVariantIndex((i) => (i - 1 + VARIANTS.length) % VARIANTS.length)
      }
      if (event.key === 'ArrowRight') {
        setVariantIndex((i) => (i + 1) % VARIANTS.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const { key, label, Component } = VARIANTS[variantIndex] ?? VARIANTS[0]

  return (
    <>
      {noJs ? (
        <NoJsFallback header={header} />
      ) : (
        <Component
          header={header}
          enquiryTypes={ENQUIRY_TYPES}
          simulate={simulate}
          slowNetwork={slowNetwork}
        />
      )}

      <div className={styles.bar}>
        <div className={styles.group}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() =>
              setVariantIndex((i) => (i - 1 + VARIANTS.length) % VARIANTS.length)
            }
            aria-label="Previous variant"
          >
            ←
          </button>
          <span className={styles.label}>
            {key} — {label}
          </span>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => setVariantIndex((i) => (i + 1) % VARIANTS.length)}
            aria-label="Next variant"
          >
            →
          </button>
        </div>

        <label className={styles.control}>
          Simulate
          <select
            value={simulate}
            onChange={(e) => setSimulate(e.target.value as Simulate)}
          >
            {SIMULATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.control}>
          <input
            type="checkbox"
            checked={slowNetwork}
            onChange={(e) => setSlowNetwork(e.target.checked)}
          />
          Slow network
        </label>

        <label className={styles.control}>
          <input
            type="checkbox"
            checked={noJs}
            onChange={(e) => setNoJs(e.target.checked)}
          />
          No-JS fallback
        </label>
      </div>
    </>
  )
}
