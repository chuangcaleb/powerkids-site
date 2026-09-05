'use client'

import { useRef } from 'react'
import { Button } from '@/components/button/button'
import { SectionHeader } from '@/components/section-header/section-header'
import { useEnquiryFormDemo } from './use-enquiry-form-demo'
import type { VariantProps } from './variant-a-stacked'
import styles from './variant-c-card.module.css'

/** PROTOTYPE — throwaway. Variant C: red section stays a plain backdrop (doodle fully visible); form lives on a floating light card. */
export function VariantCCard({
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

  return (
    <div className="flow max-prose">
      <SectionHeader header={header} />

      {phase === 'success' ? (
        <div className={styles.card} role="status">
          <p>
            Thanks, {values.name.split(' ')[0] || 'there'} — we&apos;ve got your enquiry.
          </p>
          <p>
            We&apos;ll reply by{' '}
            {values.replyBy === 'whatsapp' ? 'WhatsApp' : values.replyBy} soon.
          </p>
          <Button variant="red" onClick={form.reset}>
            Send another enquiry
          </Button>
        </div>
      ) : (
        <form className={styles.card} onSubmit={form.submit} noValidate>
          {phase === 'error' && errorMessage ? (
            <div
              ref={errorSummaryRef}
              className={styles.banner}
              role="alert"
              tabIndex={-1}
            >
              {errorMessage}
            </div>
          ) : null}

          <div className={styles.field}>
            <label htmlFor="c-name">Name</label>
            <input
              ref={firstFieldRef}
              id="c-name"
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="c-phone">Phone</label>
              <input
                id="c-phone"
                value={values.phone}
                onChange={(e) => set('phone', e.target.value)}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone ? <span className={styles.error}>{errors.phone}</span> : null}
            </div>
            <div className={styles.field}>
              <label htmlFor="c-email">Email (optional)</label>
              <input
                id="c-email"
                type="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <span id="c-reply-label">Reply by</span>
            <div
              className={styles.pillGroup}
              role="group"
              aria-labelledby="c-reply-label"
            >
              {(['whatsapp', 'call', 'email'] as const).map((option) => {
                const disabled = option === 'email' && !values.email
                return (
                  <button
                    key={option}
                    type="button"
                    className={styles.pillButton}
                    data-active={values.replyBy === option}
                    data-disabled={disabled}
                    disabled={disabled}
                    onClick={() => set('replyBy', option)}
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
            {values.replyBy !== 'email' && !values.email ? (
              <span className={styles.hint}>Add an email to reply by email instead.</span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="c-type">What&apos;s this about?</label>
            <select
              id="c-type"
              value={values.enquiryType}
              onChange={(e) => set('enquiryType', e.target.value)}
              aria-invalid={Boolean(errors.enquiryType)}
            >
              {enquiryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.enquiryType ? (
              <span className={styles.error}>{errors.enquiryType}</span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="c-message">Message (optional)</label>
            <textarea
              id="c-message"
              rows={3}
              maxLength={1000}
              value={values.message}
              onChange={(e) => set('message', e.target.value)}
            />
            {errors.message ? (
              <span className={styles.error}>{errors.message}</span>
            ) : null}
          </div>

          <Button type="submit" variant="red" disabled={phase === 'submitting'}>
            {phase === 'submitting' ? 'Sending…' : 'Send enquiry'}
          </Button>
        </form>
      )}
    </div>
  )
}
