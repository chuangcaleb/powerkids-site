import type { CollectionAfterChangeHook } from 'payload'

import { getServerUrl } from '@/lib/get-server-url'
import type { Enquiry } from '@/payload-types'

const REPLY_BY_LABEL: Record<Enquiry['replyBy'], string> = {
  whatsapp: 'WhatsApp',
  call: 'Call',
  email: 'Email',
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Fires once, on create only — phase-2 status updates must never re-send.
 * The send is wrapped and never rethrown: this hook runs inside
 * `afterChange`, which Payload runs *before* `commitTransaction`. An
 * uncaught throw here triggers `killTransaction`, deleting the just-created
 * Enquiry (verified in `node_modules/payload/dist/collections/operations/create.js`,
 * `afterChange` :291, `commitTransaction` :324, `killTransaction` :328).
 * Failure is recorded as a flag instead, via a follow-up `update` — which is
 * itself an `update` operation, so it does not re-trigger this hook.
 */
export const sendEnquiryEmails: CollectionAfterChangeHook<Enquiry> = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') return doc

  const siteSettings = await req.payload.findGlobal({ slug: 'site-settings' })
  const adminAddress = siteSettings.enquiryNotificationEmail

  try {
    const adminUrl = `${getServerUrl()}/admin/collections/enquiries/${doc.id}`
    await req.payload.sendEmail({
      to: adminAddress,
      subject: `Website Enquiry: ${doc.enquiryTypeLabel} ${REPLY_BY_LABEL[doc.replyBy]} - ${doc.name}`,
      html: [
        `<p><strong>Name:</strong> ${escapeHtml(doc.name)}</p>`,
        `<p><strong>Phone:</strong> ${escapeHtml(doc.phone ?? '—')}</p>`,
        doc.email ? `<p><strong>Email:</strong> ${escapeHtml(doc.email)}</p>` : '',
        `<p><strong>Enquiry type:</strong> ${escapeHtml(doc.enquiryTypeLabel)}</p>`,
        `<p><strong>Reply by:</strong> ${REPLY_BY_LABEL[doc.replyBy]}</p>`,
        doc.message ? `<p><strong>Message:</strong> ${escapeHtml(doc.message)}</p>` : '',
        `<p><a href="${adminUrl}">View in admin</a> — remember to update its status.</p>`,
      ]
        .filter(Boolean)
        .join('\n'),
    })
  } catch (error) {
    req.payload.logger.error(
      { err: error },
      'Enquiry admin notification email failed to send',
    )
    await req.payload.update({
      collection: 'enquiries',
      id: doc.id,
      data: {
        notificationErrors: [error instanceof Error ? error.message : String(error)],
      },
      context: { systemWrite: true },
    })
  }

  return doc
}
