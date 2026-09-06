import { fromPartial } from '@total-typescript/shoehorn'
import { describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'

import { sendEnquiryEmails } from './send-enquiry-emails'

type FakeDoc = {
  id: number
  name: string
  phone: string
  email: string | null
  replyBy: 'whatsapp' | 'call' | 'email'
  enquiryTypeLabel: string
  message: string | null
}

function fakeReq({
  sendEmail = vi.fn().mockResolvedValue(undefined),
  siteSettingsEmail = 'admin@powerkids.edu.my',
}: {
  sendEmail?: ReturnType<typeof vi.fn>
  siteSettingsEmail?: string
} = {}) {
  const update = vi.fn().mockResolvedValue(undefined)
  const payload = {
    sendEmail,
    update,
    findGlobal: vi
      .fn()
      .mockResolvedValue({ enquiryNotificationEmail: siteSettingsEmail }),
    logger: { error: vi.fn() },
  }
  const req = fromPartial<PayloadRequest>({ payload, context: {} })
  return { req, payload, update, sendEmail }
}

function doc(overrides: Partial<FakeDoc> = {}): FakeDoc {
  return {
    id: 1,
    name: 'Jane',
    phone: '+60123456789',
    email: null,
    replyBy: 'whatsapp',
    enquiryTypeLabel: 'Fees',
    message: null,
    ...overrides,
  }
}

describe('sendEnquiryEmails', () => {
  it('sends only the admin notification, regardless of whether an email was given', async () => {
    const { req, sendEmail } = fakeReq()

    await sendEnquiryEmails(
      fromPartial({
        doc: doc({ email: 'parent@example.com' }),
        req,
        operation: 'create',
        context: {},
      }),
    )

    expect(sendEmail).toHaveBeenCalledTimes(1)
    expect(sendEmail.mock.calls[0]![0].to).toBe('admin@powerkids.edu.my')
  })

  it('never rethrows when the admin notification fails, and records the error', async () => {
    const sendEmail = vi.fn().mockRejectedValue(new Error('quota exceeded'))
    const { req, update } = fakeReq({ sendEmail })

    await expect(
      sendEnquiryEmails(
        fromPartial({ doc: doc(), req, operation: 'create', context: {} }),
      ),
    ).resolves.not.toThrow()

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { notificationErrors: ['quota exceeded'] },
        context: { systemWrite: true },
      }),
    )
  })

  it('skips entirely on update — only fires on create', async () => {
    const { req, sendEmail } = fakeReq()

    await sendEnquiryEmails(
      fromPartial({
        doc: doc(),
        req,
        operation: 'update',
        context: {},
      }),
    )

    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('HTML-escapes interpolated values in the admin notification', async () => {
    const { req, sendEmail } = fakeReq()

    await sendEnquiryEmails(
      fromPartial({
        doc: doc({ name: '<b>Jane</b>', message: '<script>evil()</script>' }),
        req,
        operation: 'create',
        context: {},
      }),
    )

    const adminCall = sendEmail.mock.calls[0]![0]
    expect(adminCall.html).not.toContain('<b>Jane</b>')
    expect(adminCall.html).not.toContain('<script>evil()</script>')
    expect(adminCall.html).toContain('&lt;b&gt;Jane&lt;/b&gt;')
  })
})
