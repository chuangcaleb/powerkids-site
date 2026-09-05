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

type FieldErrors = Partial<Record<keyof EnquiryFormValues, string>>

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
    setValues((prev) => {
      const next = { ...prev, [key]: value }
      // Email cleared while "Email" reply chosen: fall back, since the option
      // only exists once there's an email to reply to.
      if (key === 'email' && value === '' && prev.replyBy === 'email')
        next.replyBy = 'whatsapp'
      return next
    })
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    if (!values.name.trim()) next.name = 'Enter your name.'
    if (!values.phone.trim()) next.phone = 'Enter a phone number.'
    else if (!/^[0-9+\-\s()]{6,20}$/.test(values.phone))
      next.phone = "That doesn't look like a phone number."
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "That doesn't look like an email address."
    }
    if (!values.enquiryType) next.enquiryType = 'Choose what this is about.'
    if (values.message.length > 1000)
      next.message = 'Message is too long (max 1000 characters).'
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

  return { values, set, phase, errors, errorMessage, submit, reset }
}
