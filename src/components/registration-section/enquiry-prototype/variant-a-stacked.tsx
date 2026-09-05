'use client'

import { useRef } from 'react'
import { Button } from '@/components/button/button'
import {
  SectionHeader,
  type SectionHeaderData,
} from '@/components/section-header/section-header'
import type { Simulate } from './use-enquiry-form-demo'
import { useEnquiryFormDemo } from './use-enquiry-form-demo'
import styles from './variant-a-stacked.module.css'

export type VariantProps = {
  header?: SectionHeaderData | null
  enquiryTypes: string[]
  simulate: Simulate
  slowNetwork: boolean
}

/** PROTOTYPE — throwaway. Variant A: single column, native controls, closest to today's shell. */
export function VariantAStacked({
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
      <div className="flow max-prose" role="status">
        <SectionHeader header={header} />
        <div className={styles.success}>
          <p>
            Thanks, {values.name.split(' ')[0] || 'there'} — we&apos;ve got your enquiry.
          </p>
          <p>
            We&apos;ll reply by{' '}
            {values.replyBy === 'whatsapp' ? 'WhatsApp' : values.replyBy} soon.
          </p>
          <Button variant="outline" onClick={form.reset}>
            Send another enquiry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flow max-prose">
      <SectionHeader header={header} />
      <form className={styles.form} onSubmit={form.submit} noValidate>
        {phase === 'error' && errorMessage ? (
          <div ref={errorSummaryRef} className={styles.banner} role="alert" tabIndex={-1}>
            {errorMessage}
          </div>
        ) : null}

        <div className={styles.field}>
          <label htmlFor="a-name">Name</label>
          <input
            ref={firstFieldRef}
            id="a-name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'a-name-error' : undefined}
          />
          {errors.name ? (
            <span id="a-name-error" className={styles.error} role="alert">
              {errors.name}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="a-phone">Phone</label>
          <input
            id="a-phone"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'a-phone-error' : undefined}
          />
          {errors.phone ? (
            <span id="a-phone-error" className={styles.error} role="alert">
              {errors.phone}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="a-email">Email (optional)</label>
          <input
            id="a-email"
            type="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </div>

        <fieldset className={styles.field}>
          <legend>Reply by</legend>
          <div className={styles.radioRow}>
            {(['whatsapp', 'call', 'email'] as const).map((option) => {
              const disabled = option === 'email' && !values.email
              return (
                <label
                  key={option}
                  className={styles.radioOption}
                  data-disabled={disabled}
                >
                  <input
                    type="radio"
                    name="a-replyBy"
                    checked={values.replyBy === option}
                    disabled={disabled}
                    onChange={() => set('replyBy', option)}
                  />
                  {option === 'whatsapp'
                    ? 'WhatsApp'
                    : option === 'call'
                      ? 'Call'
                      : 'Email'}
                  {disabled ? (
                    <span className={styles.hint}> (add email above)</span>
                  ) : null}
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className={styles.field}>
          <label htmlFor="a-type">What&apos;s this about?</label>
          <select
            id="a-type"
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
            <span className={styles.error} role="alert">
              {errors.enquiryType}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="a-message">Message (optional)</label>
          <textarea
            id="a-message"
            rows={3}
            maxLength={1000}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
          />
          {errors.message ? (
            <span className={styles.error} role="alert">
              {errors.message}
            </span>
          ) : null}
        </div>

        <Button type="submit" disabled={phase === 'submitting'}>
          {phase === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </Button>
      </form>
    </div>
  )
}
