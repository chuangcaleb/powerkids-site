'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/button/button'
import { Logo } from '@/components/logo/logo'
import {
  SectionHeader,
  type SectionHeaderData,
} from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import { primitiveVars } from '@/lib/primitive-vars'
import {
  ErrorCallout,
  SelectField,
  TextAreaField,
  TextField,
  type AlertTone,
} from './primitives'
import { ReplyByR1, ReplyByR2, ReplyByR3 } from './reply-by-variants'
import type { Simulate } from './use-enquiry-form-demo'
import { useEnquiryFormDemo } from './use-enquiry-form-demo'
import styles from './final-card.module.css'

export type ReplyByVariantKey = 'R1' | 'R2' | 'R3'

const REPLY_BY_VARIANTS = { R1: ReplyByR1, R2: ReplyByR2, R3: ReplyByR3 }

// A bigger gap than the rest of the fieldset's `flow-m` rhythm, ahead of a
// step-nav button row — set as a local override on that row's own
// `--flow-space`, since flow's margin reads whatever custom property is
// nearest the element itself.
const WIDER_GAP_ABOVE = primitiveVars({ '--flow-space': 'var(--space-l)' })

export type FinalCardProps = {
  header?: SectionHeaderData | null
  enquiryTypes: string[]
  simulate: Simulate
  slowNetwork: boolean
  replyByVariant: ReplyByVariantKey
  alertTone: AlertTone
}

/**
 * PROTOTYPE — throwaway. Consolidates #29's locked decisions (Variant C card,
 * native select, fieldset-disabled submitting state) with the still-open
 * reply-by and alert-tone threads left switchable, as a two-step wizard:
 * step 1 picks what the enquiry is about, step 2 collects contact details.
 * Step 2 leads with reply-by, since it decides which of phone/email is
 * required — that field renders first in the row.
 */
export function FinalCard({
  header,
  enquiryTypes,
  simulate,
  slowNetwork,
  replyByVariant,
  alertTone,
}: FinalCardProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const errorSummaryRef = useRef<HTMLDivElement | null>(null)
  const form = useEnquiryFormDemo(simulate, slowNetwork, enquiryTypes, {
    onError: () => errorSummaryRef.current?.focus(),
    onReset: () => setStep(1),
  })
  const { values, set, phase, errors, errorMessage } = form
  const ReplyBy = REPLY_BY_VARIANTS[replyByVariant]
  const submitting = phase === 'submitting'
  const emailRequired = values.replyBy === 'email'

  function handleNext() {
    if (!values.enquiryType) {
      form.setErrors({ enquiryType: 'Choose what this is about.' })
      return
    }
    form.setErrors({})
    setStep(2)
  }

  if (phase === 'success') {
    return (
      <div className="flow max-prose">
        <SectionHeader header={header} />
        <div className={styles.card}>
          <div className={styles.success} role="status">
            <Logo className={styles.successLogo} aria-hidden="true" />
            <p>
              Thanks, {values.name.split(' ')[0] || 'there'} — we&apos;ve got your
              enquiry.
            </p>
            <p>
              We&apos;ll reply by{' '}
              {values.replyBy === 'whatsapp' ? 'WhatsApp' : values.replyBy} soon.
            </p>
            <Button variant="red" onClick={form.reset}>
              Send another enquiry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const phoneField = (
    <TextField
      id="fc-phone"
      label="Phone"
      hint={emailRequired ? '(optional)' : undefined}
      type="tel"
      autoComplete="tel"
      pattern="[0-9+\-\s()]{6,20}"
      maxLength={20}
      value={values.phone}
      onChange={(e) => set('phone', e.target.value)}
      error={errors.phone}
      wrapperClassName={styles.half}
    />
  )
  const emailField = (
    <TextField
      id="fc-email"
      label="Email"
      hint={emailRequired ? undefined : '(optional)'}
      type="email"
      autoComplete="email"
      maxLength={254}
      value={values.email}
      onChange={(e) => set('email', e.target.value)}
      error={errors.email}
      wrapperClassName={styles.half}
    />
  )

  return (
    <div className="flow max-prose">
      <SectionHeader header={header} />
      <div className={styles.card}>
        <form className="flow-m" onSubmit={form.submit} noValidate>
          {step === 1 ? (
            <fieldset className={cx('flow-m', styles.fieldset)}>
              <SelectField
                id="fc-type"
                label="What's this about?"
                options={enquiryTypes}
                value={values.enquiryType}
                onChange={(e) => set('enquiryType', e.target.value)}
                error={errors.enquiryType}
              />

              <TextAreaField
                id="fc-message"
                label="Message"
                hint="(optional, max 1000 characters)"
                rows={3}
                maxLength={1000}
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
                error={errors.message}
              />

              <Button
                type="button"
                variant="red"
                className={cx(styles.navButton, styles.stepButton)}
                style={WIDER_GAP_ABOVE}
                onClick={handleNext}
              >
                Next
              </Button>
            </fieldset>
          ) : (
            <fieldset className={cx('flow-m', styles.fieldset)} disabled={submitting}>
              <ReplyBy value={values.replyBy} onChange={(v) => set('replyBy', v)} />

              <TextField
                id="fc-name"
                label="Name"
                autoComplete="name"
                maxLength={80}
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                error={errors.name}
              />

              <div className={styles.row}>
                {emailRequired ? (
                  <>
                    {emailField}
                    {phoneField}
                  </>
                ) : (
                  <>
                    {phoneField}
                    {emailField}
                  </>
                )}
              </div>

              <div className={styles.buttonRow} style={WIDER_GAP_ABOVE}>
                <Button
                  type="button"
                  variant="outline"
                  className={styles.navButton}
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="red"
                  className={styles.navButton}
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Send enquiry'}
                </Button>
              </div>
            </fieldset>
          )}

          {/* Below the submit button, not above the fields: the top position put
           * the alert out of view on a tall form, and toggling it there shifted
           * every field below it. Bottom placement plus focus-on-error (which
           * browsers auto-scroll to) covers both visibility and announcement
           * without moving content the user is already looking at. */}
          {step === 2 && phase === 'error' && errorMessage ? (
            <ErrorCallout
              message={errorMessage}
              tone={alertTone}
              calloutRef={errorSummaryRef}
            />
          ) : null}
        </form>
      </div>
    </div>
  )
}
