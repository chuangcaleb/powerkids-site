'use client'

import { useRef } from 'react'
import { Button } from '@/components/button/button'
import { Pill } from '@/components/pill/pill'
import { SectionHeader } from '@/components/section-header/section-header'
import { primitiveVars } from '@/lib/primitive-vars'
import { useEnquiryFormDemo } from './use-enquiry-form-demo'
import type { VariantProps } from './variant-a-stacked'
import styles from './variant-b-grid.module.css'

/** PROTOTYPE — throwaway. Variant B: two-column grid, shrunk heading, chip controls. Heaviest layout of the three; likely buries the doodle layer. */
export function VariantBGrid({
  header,
  enquiryTypes,
  simulate,
  slowNetwork,
}: VariantProps) {
  const errorSummaryRef = useRef<HTMLDivElement | null>(null)
  const firstFieldRef = useRef<HTMLInputElement | null>(null)
  const form = useEnquiryFormDemo(simulate, slowNetwork, enquiryTypes, {
    onError: () => errorSummaryRef.current?.focus(),
    onReset: () => firstFieldRef.current?.focus(),
  })
  const { values, set, phase, errors, errorMessage } = form

  if (phase === 'success') {
    return (
      <div className="flow-xs max-prose" role="status">
        <SectionHeader header={header} visualLevel={3} />
        <div className={styles.success}>
          <p>
            Thanks, {values.name.split(' ')[0] || 'there'} — we&apos;ve got your enquiry.
          </p>
          <Button variant="outline" onClick={form.reset}>
            Send another enquiry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flow-xs">
      <SectionHeader header={header} visualLevel={3} />
      <form className={styles.form} onSubmit={form.submit} noValidate>
        {phase === 'error' && errorMessage ? (
          <div ref={errorSummaryRef} className={styles.banner} role="alert" tabIndex={-1}>
            {errorMessage}
          </div>
        ) : null}

        <div
          className="grid-auto"
          style={primitiveVars({
            '--grid-gap': 'var(--space-s)',
            '--grid-item-min': 'max(14rem, calc((100% - var(--grid-gap)) / 2))',
          })}
        >
          <div className={styles.field}>
            <label htmlFor="b-name">Name</label>
            <input
              ref={firstFieldRef}
              id="b-name"
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="b-phone">Phone</label>
            <input
              id="b-phone"
              value={values.phone}
              onChange={(e) => set('phone', e.target.value)}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? <span className={styles.error}>{errors.phone}</span> : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="b-email">Email (optional)</label>
            <input
              id="b-email"
              type="email"
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <span id="b-type-label">What&apos;s this about?</span>
            <div className={styles.chips} role="group" aria-labelledby="b-type-label">
              {enquiryTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={styles.chipButton}
                  data-active={values.enquiryType === type}
                  onClick={() => set('enquiryType', type)}
                >
                  <Pill variant={values.enquiryType === type ? 'red' : 'neutral'}>
                    {type}
                  </Pill>
                </button>
              ))}
            </div>
            {errors.enquiryType ? (
              <span className={styles.error}>{errors.enquiryType}</span>
            ) : null}
          </div>
        </div>

        <div className={styles.field}>
          <span id="b-reply-label">Reply by</span>
          <div className={styles.segmented} role="group" aria-labelledby="b-reply-label">
            {(['whatsapp', 'call', 'email'] as const).map((option) => {
              const disabled = option === 'email' && !values.email
              return (
                <button
                  key={option}
                  type="button"
                  className={styles.segment}
                  data-active={values.replyBy === option}
                  disabled={disabled}
                  onClick={() => set('replyBy', option)}
                  title={disabled ? 'Add an email above to enable this' : undefined}
                >
                  {option === 'whatsapp'
                    ? 'WhatsApp'
                    : option === 'call'
                      ? 'Call'
                      : 'Email'}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="b-message">Message (optional)</label>
          <textarea
            id="b-message"
            rows={2}
            maxLength={1000}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
          />
          {errors.message ? <span className={styles.error}>{errors.message}</span> : null}
        </div>

        <Button type="submit" disabled={phase === 'submitting'}>
          {phase === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </Button>
      </form>
    </div>
  )
}
