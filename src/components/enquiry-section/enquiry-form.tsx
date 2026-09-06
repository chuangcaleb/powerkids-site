'use client'

// Client component: multi-step wizard state, field-level validation, and
// the Turnstile widget all need the browser.

import { SiWhatsapp } from '@icons-pack/react-simple-icons'
import { Mail, Phone } from 'lucide-react'
import { useActionState, useEffect, useRef, useState } from 'react'

import { AlertCallout } from '@/components/alert-callout/alert-callout'
import { Button } from '@/components/button/button'
import { Logo } from '@/components/logo/logo'
import { NativeSelectField } from '@/components/native-select-field/native-select-field'
import { TextField } from '@/components/text-field/text-field'
import { TextareaField } from '@/components/textarea-field/textarea-field'
import { ToggleChip } from '@/components/toggle-chip/toggle-chip'
import { emailRequired, phoneRequired, validateField } from '@/lib/validate-enquiry'
import type { EnquiryFieldName, ReplyBy } from '@/lib/validate-enquiry'
import { submitEnquiry } from './submit-enquiry'
import { TurnstileWidget } from './turnstile-widget'
import styles from './enquiry-form.module.css'
import { cx } from '@/lib/cx'
import { primitiveVars } from '@/lib/primitive-vars'

const REPLY_BY_LABEL: Record<ReplyBy, string> = {
  whatsapp: 'WhatsApp',
  call: 'phone call',
  email: 'email',
}

export type EnquiryTypeOption = { id: string; label: string }

export type EnquiryFormProps = {
  enquiryTypes: EnquiryTypeOption[]
  turnstileSiteKey: string
}

type FieldValues = {
  name: string
  phone: string
  email: string
  replyBy: ReplyBy
  enquiryTypeId: string
  message: string
}

function initialValues(enquiryTypes: EnquiryTypeOption[]): FieldValues {
  return {
    name: '',
    phone: '',
    email: '',
    replyBy: 'whatsapp',
    enquiryTypeId: enquiryTypes[0]?.id ?? '',
    message: '',
  }
}

// `useActionState`'s status never reverts to 'idle' on its own, and there is
// no reset API for it — "Send another enquiry" instead remounts this whole
// component under a fresh `key` (see `EnquiryForm` below), which gives every
// hook here, including `useActionState`, a clean slate.
export function EnquiryForm(props: EnquiryFormProps) {
  const [instance, setInstance] = useState(0)
  return (
    <EnquiryFormFields
      key={instance}
      {...props}
      onRequestReset={() => setInstance((n) => n + 1)}
    />
  )
}

function EnquiryFormFields({
  enquiryTypes,
  turnstileSiteKey,
  onRequestReset,
}: EnquiryFormProps & { onRequestReset: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [values, setValues] = useState<FieldValues>(() => initialValues(enquiryTypes))
  const [errors, setErrors] = useState<Partial<Record<EnquiryFieldName, string>>>({})
  const [turnstileToken, setTurnstileToken] = useState('')
  const [state, formAction, isPending] = useActionState(submitEnquiry, { status: 'idle' })
  // The submit-time server error banner doesn't come from `errors` (that's
  // field-level only) and `useActionState` has no reset — so it's dismissed
  // by hand on the next edit, otherwise it'd sit there stale through a whole
  // fresh attempt.
  const [serverErrorDismissed, setServerErrorDismissed] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status === 'error') alertRef.current?.focus()
  }, [state])

  // Field-values keys don't line up 1:1 with error keys (`enquiryTypeId` vs
  // `enquiryType`, and `replyBy` has no error of its own) — this map is the
  // single place that translates one to the other.
  const errorKeyFor: Record<keyof FieldValues, EnquiryFieldName | undefined> = {
    name: 'name',
    phone: 'phone',
    email: 'email',
    replyBy: undefined,
    enquiryTypeId: 'enquiryType',
    message: 'message',
  }

  function setValue<K extends keyof FieldValues>(key: K, value: FieldValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setServerErrorDismissed(true)
    const errorKey = errorKeyFor[key]
    if (!errorKey) return
    setErrors((prev) => {
      if (!prev[errorKey]) return prev
      const next = { ...prev }
      delete next[errorKey]
      return next
    })
  }

  // Switching reply-by flips which of phone/email is required — a
  // "Required." error already showing for the now-optional field must clear
  // immediately, not wait for the next submit (spec §7).
  function setReplyBy(replyBy: ReplyBy) {
    setValues((prev) => ({ ...prev, replyBy }))
    setServerErrorDismissed(true)
    setErrors((prev) => {
      const next = { ...prev }
      if (next.phone && !validateField('phone', values.phone, replyBy)) delete next.phone
      if (next.email && !validateField('email', values.email, replyBy)) delete next.email
      return next
    })
  }

  function goToStep2() {
    const error = validateField('enquiryType', values.enquiryTypeId, values.replyBy)
    if (error) {
      setErrors((prev) => ({ ...prev, enquiryType: error }))
      return
    }
    setStep(2)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const fieldErrors: Partial<Record<EnquiryFieldName, string>> = {}
    const fields: EnquiryFieldName[] = [
      'name',
      'phone',
      'email',
      'enquiryType',
      'message',
    ]
    for (const field of fields) {
      const value = field === 'enquiryType' ? values.enquiryTypeId : values[field]
      const error = validateField(field, value, values.replyBy)
      if (error) fieldErrors[field] = error
    }

    if (Object.keys(fieldErrors).length > 0) {
      event.preventDefault()
      setErrors(fieldErrors)
      return
    }
    setServerErrorDismissed(false)
  }

  if (state.status === 'success') {
    return (
      <div className={cx('flow-m region', styles.success)}>
        <Logo className={styles.successLogo} />
        <div className="flow-xs">
          <p className={styles.successTitle}>Successfully submitted</p>
          <p className={styles.successSubtitle}>
            Thanks, {values.name.split(' ')[0]}. We&apos;ll reply by{' '}
            {REPLY_BY_LABEL[values.replyBy]} soon.
          </p>
        </div>
        <Button type="button" variant="red" onClick={onRequestReset}>
          Send another enquiry
        </Button>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} noValidate>
      <div className="flow">
        <fieldset disabled={isPending}>
          <div className={step === 1 ? styles.stepVisible : styles.stepHidden}>
            <div className="flow">
              <NativeSelectField
                label="What can we help with?"
                name="enquiryTypeIdSelect"
                value={values.enquiryTypeId}
                onChange={(event) => setValue('enquiryTypeId', event.target.value)}
                options={enquiryTypes.map((type) => ({
                  value: type.id,
                  label: type.label,
                }))}
                error={errors.enquiryType}
              />
              <TextareaField
                label="Message"
                name="message"
                hint="(optional, max 1000 characters)"
                maxLength={1000}
                value={values.message}
                onChange={(event) => setValue('message', event.target.value)}
                error={errors.message}
              />
              <Button
                type="button"
                variant="red"
                className={styles.nextButton}
                onClick={goToStep2}
              >
                Next
              </Button>
            </div>
          </div>

          <div className={step === 2 ? styles.stepVisible : styles.stepHidden}>
            <div className="flow">
              <fieldset className={cx('flow-2xs', styles.replyByGroup)}>
                <legend>How should we reply to you?</legend>
                <div
                  className="cluster"
                  style={primitiveVars({ '--cluster-gap': 'var(--space-2xs)' })}
                >
                  <ToggleChip
                    name="replyBy"
                    value="whatsapp"
                    icon={<SiWhatsapp size={18} aria-hidden="true" />}
                    label="WhatsApp"
                    checked={values.replyBy === 'whatsapp'}
                    onChange={() => setReplyBy('whatsapp')}
                  />
                  <ToggleChip
                    name="replyBy"
                    value="call"
                    icon={<Phone size={16} aria-hidden="true" />}
                    label="Phone call"
                    checked={values.replyBy === 'call'}
                    onChange={() => setReplyBy('call')}
                  />
                  <ToggleChip
                    name="replyBy"
                    value="email"
                    icon={<Mail size={16} aria-hidden="true" />}
                    label="Email"
                    checked={values.replyBy === 'email'}
                    onChange={() => setReplyBy('email')}
                  />
                </div>
              </fieldset>

              <TextField
                label="Name"
                name="name"
                autoComplete="name"
                maxLength={80}
                value={values.name}
                onChange={(event) => setValue('name', event.target.value)}
                error={errors.name}
              />

              <div
                className="switcher"
                style={primitiveVars({
                  '--switcher-gap': 'var(--space-s)',
                  '--switcher-inline-at': '30rem',
                })}
              >
                <TextField
                  label="Phone"
                  name="phone"
                  hint={
                    phoneRequired(values.replyBy)
                      ? '(e.g. +60123456789)'
                      : '(optional, e.g. +60123456789)'
                  }
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  value={values.phone}
                  onChange={(event) => setValue('phone', event.target.value)}
                  error={errors.phone}
                />
                <TextField
                  label="Email"
                  name="email"
                  hint={emailRequired(values.replyBy) ? undefined : '(optional)'}
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={values.email}
                  onChange={(event) => setValue('email', event.target.value)}
                  error={errors.email}
                />
              </div>

              <div className="repel">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" variant="red">
                  Submit
                </Button>
              </div>
            </div>
          </div>

          <input type="hidden" name="enquiryTypeId" value={values.enquiryTypeId} />
          <input
            type="hidden"
            name="enquiryTypeLabel"
            value={
              enquiryTypes.find((type) => type.id === values.enquiryTypeId)?.label ?? ''
            }
          />
          <input type="hidden" name="turnstileToken" value={turnstileToken} />
        </fieldset>

        {step === 2 && state.status === 'error' && !serverErrorDismissed ? (
          <AlertCallout ref={alertRef}>{state.message}</AlertCallout>
        ) : null}
      </div>

      <TurnstileWidget
        siteKey={turnstileSiteKey}
        onToken={setTurnstileToken}
        triggerRef={formRef}
      />
    </form>
  )
}
