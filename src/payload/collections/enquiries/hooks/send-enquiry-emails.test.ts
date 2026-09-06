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
  const req = { payload, context: {} } as unknown as PayloadRequest
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
  it('sends only the admin notification when no email was given', async () => {
    const { req, sendEmail } = fakeReq()

    await sendEnquiryEmails({
      doc: doc(),
      req,
      operation: 'create',
      context: {},
    } as never)

    expect(sendEmail).toHaveBeenCalledTimes(1)
    expect(sendEmail.mock.calls[0]![0].to).toBe('admin@powerkids.edu.my')
  })

  it('sends both confirmation and admin notification when an email was given', async () => {
    const { req, sendEmail } = fakeReq()

    await sendEnquiryEmails({
      doc: doc({ email: 'parent@example.com' }),
      req,
      operation: 'create',
      context: {},
    } as never)

    expect(sendEmail).toHaveBeenCalledTimes(2)
    const recipients = sendEmail.mock.calls.map((call) => call[0].to)
    expect(recipients).toContain('parent@example.com')
    expect(recipients).toContain('admin@powerkids.edu.my')
  })

  it('never rethrows when the confirmation send fails, and flags confirmationFailed', async () => {
    const sendEmail = vi
      .fn()
      .mockRejectedValueOnce(new Error('quota exceeded')) // confirmation
      .mockResolvedValueOnce(undefined) // admin notification
    const { req, update } = fakeReq({ sendEmail })

    await expect(
      sendEnquiryEmails({
        doc: doc({ email: 'parent@example.com' }),
        req,
        operation: 'create',
        context: {},
      } as never),
    ).resolves.not.toThrow()

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { confirmationFailed: true } }),
    )
  })

  it('never rethrows when the admin notification fails, and flags adminNotificationFailed', async () => {
    const sendEmail = vi.fn().mockRejectedValue(new Error('quota exceeded'))
    const { req, update } = fakeReq({ sendEmail })

    await expect(
      sendEnquiryEmails({ doc: doc(), req, operation: 'create', context: {} } as never),
    ).resolves.not.toThrow()

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { adminNotificationFailed: true } }),
    )
  })

  it('skips entirely on update — only fires on create', async () => {
    const { req, sendEmail } = fakeReq()

    await sendEnquiryEmails({
      doc: doc(),
      req,
      operation: 'update',
      context: {},
    } as never)

    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('does not echo the free-text message in the confirmation email body', async () => {
    const { req, sendEmail } = fakeReq()

    await sendEnquiryEmails({
      doc: doc({ email: 'parent@example.com', message: '<script>evil()</script>' }),
      req,
      operation: 'create',
      context: {},
    } as never)

    const confirmationCall = sendEmail.mock.calls.find(
      (call) => call[0].to === 'parent@example.com',
    )
    expect(confirmationCall![0].html ?? confirmationCall![0].text).not.toContain('evil()')
  })

  it('HTML-escapes interpolated values in the confirmation email', async () => {
    const { req, sendEmail } = fakeReq()

    await sendEnquiryEmails({
      doc: doc({ email: 'parent@example.com', name: '<b>Jane</b>' }),
      req,
      operation: 'create',
      context: {},
    } as never)

    const confirmationCall = sendEmail.mock.calls.find(
      (call) => call[0].to === 'parent@example.com',
    )
    expect(confirmationCall![0].html).not.toContain('<b>Jane</b>')
    expect(confirmationCall![0].html).toContain('&lt;b&gt;Jane&lt;/b&gt;')
  })
})
