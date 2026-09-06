/**
 * Single source of truth for enquiry-form field validation, shared by the
 * client wizard (immediate feedback) and the `enquiries` collection's
 * server-side field `validate` functions (actual authority — see
 * spec §3: client validation is UX, not the security boundary).
 */

export type ReplyBy = 'whatsapp' | 'call' | 'email'

export type EnquiryFieldName = 'name' | 'phone' | 'email' | 'enquiryType' | 'message'

const PHONE_PATTERN = /^[0-9+\-()\s]{7,20}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** WhatsApp/Call require phone; Email requires email — never both, never neither. */
export function phoneRequired(replyBy: ReplyBy | undefined): boolean {
  return replyBy === 'whatsapp' || replyBy === 'call'
}

export function emailRequired(replyBy: ReplyBy | undefined): boolean {
  return replyBy === 'email'
}

/**
 * Returns an error message, or `undefined` when the value is valid.
 * `replyBy` may be `undefined` (e.g. sibling data not yet resolved) — in
 * that case the conditional-required checks are skipped, but format/length
 * checks still run.
 */
export function validateField(
  field: EnquiryFieldName,
  value: string,
  replyBy: ReplyBy | undefined,
): string | undefined {
  const trimmed = value.trim()

  switch (field) {
    case 'name':
      if (!trimmed) return 'Required.'
      if (value.length > 80) return 'Too long.'
      return undefined

    case 'phone':
      if (!trimmed) return phoneRequired(replyBy) ? 'Required.' : undefined
      if (!PHONE_PATTERN.test(value)) return 'Enter a valid phone number.'
      return undefined

    case 'email':
      if (!trimmed) return emailRequired(replyBy) ? 'Required.' : undefined
      if (value.length > 254) return 'Too long.'
      if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.'
      return undefined

    case 'enquiryType':
      return trimmed ? undefined : 'Required.'

    case 'message':
      if (value.length > 1000) return 'Too long.'
      return undefined
  }
}
