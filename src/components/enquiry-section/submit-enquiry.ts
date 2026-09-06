'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'
import { verifyTurnstileToken } from '@/lib/turnstile'
import { validateField } from '@/lib/validate-enquiry'
import type { ReplyBy } from '@/lib/validate-enquiry'
import { GENERIC_ERROR } from './generic-error'

const REPLY_BY_VALUES: ReplyBy[] = ['whatsapp', 'call', 'email']

function parseReplyBy(value: FormDataEntryValue | null): ReplyBy | undefined {
  return REPLY_BY_VALUES.find((option) => option === value)
}

export type SubmitEnquiryState =
  { status: 'idle' } | { status: 'error'; message: string } | { status: 'success' }

/**
 * Server Action behind the enquiry wizard's submit button. Rate limiting
 * (3 submissions / IP / 10 min) is enforced upstream by a Vercel Firewall
 * rule, not here — that's dashboard/infra config, out of scope for app code.
 *
 * `overrideAccess: false` is deliberate: the Local API defaults to
 * `overrideAccess: true`, which would bypass the collection's access control
 * (and the `stripStaffOnlyFields` hook) entirely.
 */
export async function submitEnquiry(
  _prevState: SubmitEnquiryState,
  formData: FormData,
): Promise<SubmitEnquiryState> {
  const name = String(formData.get('name') ?? '')
  const phone = String(formData.get('phone') ?? '')
  const email = String(formData.get('email') ?? '')
  const replyBy = parseReplyBy(formData.get('replyBy'))
  const enquiryTypeId = String(formData.get('enquiryTypeId') ?? '')
  const enquiryTypeLabel = String(formData.get('enquiryTypeLabel') ?? '')
  const message = String(formData.get('message') ?? '')
  const turnstileToken = String(formData.get('turnstileToken') ?? '')

  const fieldErrors = [
    validateField('name', name, replyBy),
    validateField('phone', phone, replyBy),
    validateField('email', email, replyBy),
    validateField('enquiryType', enquiryTypeId, replyBy),
    validateField('message', message, replyBy),
  ].filter(Boolean)

  if (!replyBy || fieldErrors.length > 0) {
    console.error('submitEnquiry: server-side validation failed', {
      replyBy,
      fieldErrors,
    })
    return { status: 'error', message: GENERIC_ERROR }
  }

  const forwardedFor = (await headers()).get('x-forwarded-for')
  const remoteIp = forwardedFor?.split(',')[0]?.trim() ?? ''

  // Rejection is dropped silently, never persisted — a bot-defence rejection
  // means the request was judged untrusted, so persisting it just fills
  // `enquiries` with the spam the defence exists to keep out.
  const verified = await verifyTurnstileToken(turnstileToken, remoteIp)
  if (!verified) {
    console.error('submitEnquiry: Turnstile verification failed', { remoteIp })
    return { status: 'error', message: GENERIC_ERROR }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'enquiries',
      overrideAccess: false,
      data: {
        name,
        phone: phone || undefined,
        email: email || undefined,
        replyBy,
        enquiryTypeId,
        enquiryTypeLabel,
        message: message || undefined,
        // Stripped by `stripStaffOnlyFields`/field access regardless — set
        // explicitly only to satisfy the now-required `status` field's type.
        status: 'unread',
      },
    })

    return { status: 'success' }
  } catch (error) {
    console.error('submitEnquiry: payload.create failed', error)
    return { status: 'error', message: GENERIC_ERROR }
  }
}
