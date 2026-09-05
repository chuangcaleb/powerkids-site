'use client'

import { type FormEvent, useState } from 'react'

/** PROTOTYPE — throwaway, ticket #29. Shared behaviour across variant-a/b/c so only markup differs. */

export type Phase = 'idle' | 'submitting' | 'success' | 'error'
export type Simulate =
  'success' | 'validation' | 'server-error' | 'rate-limited' | 'offline'
export type ReplyBy = 'whatsapp' | 'call' | 'email'

export type EnquiryFormValues = {
  name: string
  phone: string
  email: string
  replyBy: ReplyBy
  enquiryType: string
  message: string
}

type ValidatableField = 'name' | 'phone' | 'email' | 'enquiryType' | 'message'
type FieldErrors = Partial<Record<ValidatableField, string>>

type Callbacks = {
  /** Fired after an error is set — variant focuses its own error-summary ref. */
  onError?: () => void
  /** Fired after a reset — variant focuses its own first-field ref. */
  onReset?: () => void
}

function initialValues(enquiryTypes: string[]): EnquiryFormValues {
  return {
    name: '',
    phone: '',
    email: '',
    replyBy: 'whatsapp',
    enquiryType: enquiryTypes[0] ?? '',
    message: '',
  }
}

/**
 * Per-field validity, given the reply-by choice a phone/email required-ness
 * depends on. Shared by the full submit-time `validate()` and by `set()`'s
 * live re-check, so a field's error clears the moment it becomes valid
 * instead of waiting for the next submit attempt.
 */
function validateField(
  field: ValidatableField,
  value: string,
  replyBy: ReplyBy,
): string | undefined {
  switch (field) {
    case 'name':
      return value.trim() ? undefined : 'Enter your name.'
    case 'phone': {
      if (!value.trim()) {
        return replyBy === 'email' ? undefined : 'Enter a phone number.'
      }
      return /^[0-9+\-\s()]{6,20}$/.test(value)
        ? undefined
        : "That doesn't look like a phone number."
    }
    case 'email': {
      if (!value.trim()) {
        return replyBy === 'email' ? 'Enter an email address.' : undefined
      }
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? undefined
        : "That doesn't look like an email address."
    }
    case 'enquiryType':
      return value ? undefined : 'Choose what this is about.'
    case 'message':
      return value.length > 1000
        ? 'Message is too long (max 1000 characters).'
        : undefined
  }
}

export function useEnquiryFormDemo(
  simulate: Simulate,
  slowNetwork: boolean,
  enquiryTypes: string[],
  { onError, onReset }: Callbacks = {},
) {
  const [values, setValues] = useState<EnquiryFormValues>(() =>
    initialValues(enquiryTypes),
  )
  const [phase, setPhase] = useState<Phase>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function set<K extends keyof EnquiryFormValues>(key: K, value: EnquiryFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))

    setErrors((prevErrors) => {
      if (Object.keys(prevErrors).length === 0) return prevErrors
      const nextErrors = { ...prevErrors }
      const nextReplyBy = key === 'replyBy' ? (value as ReplyBy) : values.replyBy

      if (key !== 'replyBy') {
        const ownError = validateField(
          key as ValidatableField,
          value as string,
          nextReplyBy,
        )
        if (ownError) nextErrors[key as ValidatableField] = ownError
        else delete nextErrors[key as ValidatableField]
      }

      // Switching reply-by flips which of phone/email is required —
      // re-check both against the new choice, not just the edited field.
      if (key === 'replyBy') {
        const phoneError = validateField('phone', values.phone, nextReplyBy)
        if (phoneError) nextErrors.phone = phoneError
        else delete nextErrors.phone

        const emailError = validateField('email', values.email, nextReplyBy)
        if (emailError) nextErrors.email = emailError
        else delete nextErrors.email
      }

      return nextErrors
    })
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    const fields: ValidatableField[] = [
      'name',
      'phone',
      'email',
      'enquiryType',
      'message',
    ]
    for (const field of fields) {
      const error = validateField(field, values[field] as string, values.replyBy)
      if (error) next[field] = error
    }
    return next
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (phase === 'submitting') return // double-submit guard

    const fieldErrors = validate()
    const forcedValidation =
      simulate === 'validation' && Object.keys(fieldErrors).length === 0
    if (Object.keys(fieldErrors).length > 0 || forcedValidation) {
      const merged = forcedValidation
        ? { message: 'Message is too long (max 1000 characters).' }
        : fieldErrors
      setErrors(merged)
      setPhase('error')
      setErrorMessage(null)
      onError?.()
      return
    }

    setErrors({})
    setErrorMessage(null)
    setPhase('submitting')

    await new Promise((resolve) => setTimeout(resolve, slowNetwork ? 3000 : 600))

    if (simulate === 'server-error') {
      setPhase('error')
      setErrorMessage(
        'Something went wrong on our end. Your details are still here — please try again.',
      )
      onError?.()
      return
    }
    if (simulate === 'rate-limited') {
      setPhase('error')
      setErrorMessage('Too many attempts. Please wait a few minutes and try again.')
      onError?.()
      return
    }
    if (simulate === 'offline') {
      setPhase('error')
      setErrorMessage('You appear to be offline. Check your connection and try again.')
      onError?.()
      return
    }

    setPhase('success')
  }

  function reset() {
    setValues(initialValues(enquiryTypes))
    setPhase('idle')
    setErrors({})
    setErrorMessage(null)
    onReset?.()
  }

  return { values, set, phase, errors, setErrors, errorMessage, submit, reset }
}
