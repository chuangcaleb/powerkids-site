'use client'

import { useRef } from 'react'
import { Button } from '@/components/button/button'
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
 * state, top error banner, height-stable success swap) with the still-open
 * reply-by and alert-tone threads left switchable.
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
  const success = phase === 'success'

  return (
    <div className="flow max-prose">
      <SectionHeader header={header} />
      <div className={styles.card}>
        {/* Height-stable swap: both branches stay laid out via CSS grid stacking (final-card.module.css), so the card never collapses on success. */}
        <div className={styles.stack}>
          <form
            className={styles.stackItem}
            data-hidden={success}
            inert={success || undefined}
            onSubmit={form.submit}
            noValidate
          >
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
                  pattern="[0-9+\-\s()]{6,20}"
                  maxLength={20}
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  error={errors.phone}
                  className={styles.half}
                />
                <TextField
                  id="fc-email"
                  label="Email"
                  hint="(optional)"
                  type="email"
                  maxLength={254}
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  error={errors.email}
                  className={styles.half}
                />
              </div>

              <ReplyBy
                value={values.replyBy}
                onChange={(v) => set('replyBy', v)}
                emailPresent={Boolean(values.email)}
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

          <div
            className={styles.stackItem}
            data-hidden={!success}
            role="status"
            inert={!success || undefined}
          >
            <p>
              Thanks, {values.name.split(' ')[0] || 'there'} — we&apos;ve got your
              enquiry.
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
      </div>
    </div>
  )
}
