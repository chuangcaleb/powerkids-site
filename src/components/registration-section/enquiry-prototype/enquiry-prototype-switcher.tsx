'use client'

import { useEffect, useState } from 'react'
import type { SectionHeaderData } from '@/components/section-header/section-header'
import type { AlertTone } from './primitives'
import { FinalCard, type ReplyByVariantKey } from './final-card'
import { NoJsFallback } from './no-js-fallback'
import type { Simulate } from './use-enquiry-form-demo'
import styles from './enquiry-prototype-switcher.module.css'

/**
 * PROTOTYPE — throwaway, ticket #29 (wayfinder map #20: Registration section
 * becomes an Enquiry form). Base layout (Variant C, floating card) is locked;
 * this switcher now compares the two still-open threads — reply-by control
 * and alert/error visual tone — against that same locked card. Dev-only:
 * mounted by registration-section.tsx only when NODE_ENV !== 'production'.
 */

const ENQUIRY_TYPES = ['General', 'Enrolment', 'Tour booking', 'Fees', 'Other']

const REPLY_BY_OPTIONS: { key: ReplyByVariantKey; label: string }[] = [
  { key: 'R1', label: 'Plain shadow pills' },
  { key: 'R2', label: 'Shadow pills + icons' },
  { key: 'R3', label: 'Segmented + lock affordance' },
]

const ALERT_OPTIONS: { key: AlertTone; label: string }[] = [
  { key: 'red-on-white', label: 'Red text, red border' },
  { key: 'tint-chip', label: 'Tint chip, dark text' },
  { key: 'icon-only', label: 'Neutral border, red icon' },
]

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
  const [replyByVariant, setReplyByVariant] = useState<ReplyByVariantKey>(() => {
    const param = readParam('replyBy')
    return REPLY_BY_OPTIONS.some((o) => o.key === param)
      ? (param as ReplyByVariantKey)
      : 'R2'
  })
  const [alertTone, setAlertTone] = useState<AlertTone>(() => {
    const param = readParam('alert')
    return ALERT_OPTIONS.some((o) => o.key === param) ? (param as AlertTone) : 'tint-chip'
  })
  const [simulate, setSimulate] = useState<Simulate>('success')
  const [slowNetwork, setSlowNetwork] = useState(false)
  const [noJs, setNoJs] = useState(false)

  useEffect(() => {
    writeParam('replyBy', replyByVariant)
  }, [replyByVariant])

  useEffect(() => {
    writeParam('alert', alertTone)
  }, [alertTone])

  return (
    <>
      {noJs ? (
        <NoJsFallback header={header} />
      ) : (
        <FinalCard
          header={header}
          enquiryTypes={ENQUIRY_TYPES}
          simulate={simulate}
          slowNetwork={slowNetwork}
          replyByVariant={replyByVariant}
          alertTone={alertTone}
        />
      )}

      <div className={styles.bar}>
        <label className={styles.control}>
          Reply-by
          <select
            value={replyByVariant}
            onChange={(e) => setReplyByVariant(e.target.value as ReplyByVariantKey)}
          >
            {REPLY_BY_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.key} — {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.control}>
          Alert tone
          <select
            value={alertTone}
            onChange={(e) => setAlertTone(e.target.value as AlertTone)}
          >
            {ALERT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

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
