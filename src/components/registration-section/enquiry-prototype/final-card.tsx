'use client'

import { useRef } from 'react'
import { Button } from '@/components/button/button'
import { Logo } from '@/components/logo/logo'
import {
  SectionHeader,
  type SectionHeaderData,
} from '@/components/section-header/section-header'
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
 * half-width phone/email row, native select, fieldset-disabled submitting
 * state, top error banner) with the still-open reply-by and alert-tone
 * threads left switchable. Success collapses the card rather than locking
 * its height — the owner reversed that earlier call once they saw the
 * wasted whitespace it caused.
 */
export function FinalCard({
  header,
  enquiryTypes,
  simulate,
  slowNetwork,
  replyByVariant,
  alertTone,
}: FinalCardProps) {
  const errorSummaryRef = useRef<HTMLDivElement | null>(null)
  const firstFieldRef = useRef<HTMLInputElement | null>(null)
  const form = useEnquiryFormDemo(simulate, slowNetwork, enquiryTypes, {
    onError: () => errorSummaryRef.current?.focus(),
    onReset: () => firstFieldRef.current?.focus(),
  })
  const { values, set, phase, errors, errorMessage } = form
  const ReplyBy = REPLY_BY_VARIANTS[replyByVariant]
  const submitting = phase === 'submitting'

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

  return (
    <div className="flow max-prose">
      <SectionHeader header={header} />
      <div className={styles.card}>
        <form onSubmit={form.submit} noValidate>
          {phase === 'error' && errorMessage ? (
            <ErrorCallout
              message={errorMessage}
              tone={alertTone}
              calloutRef={errorSummaryRef}
            />
          ) : null}

          <fieldset className={styles.fieldset} disabled={submitting}>
            <TextField
              ref={firstFieldRef}
              id="fc-name"
              label="Name"
              autoComplete="name"
              maxLength={80}
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              error={errors.name}
            />

            <div className={styles.row}>
              <TextField
                id="fc-phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
                pattern="[0-9+\-\s()]{6,20}"
                maxLength={20}
                value={values.phone}
                onChange={(e) => set('phone', e.target.value)}
                error={errors.phone}
                wrapperClassName={styles.half}
              />
              <TextField
                id="fc-email"
                label="Email"
                hint="(optional)"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                error={errors.email}
                wrapperClassName={styles.half}
              />
            </div>

            <ReplyBy
              value={values.replyBy}
              onChange={(v) => set('replyBy', v)}
              error={errors.replyBy}
            />

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

            <Button type="submit" variant="red">
              {submitting ? 'Sending…' : 'Send enquiry'}
            </Button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}
