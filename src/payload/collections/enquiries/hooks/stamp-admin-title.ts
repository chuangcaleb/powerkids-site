import type { CollectionAfterChangeHook } from 'payload'

import type { Enquiry } from '@/payload-types'

/**
 * Payload's `useAsTitle` only accepts one stored field, but the admin edit
 * view should show id + type + name. `id` doesn't exist until after insert,
 * so this stamps `adminTitle` via a follow-up update, same pattern as
 * `sendEnquiryEmails`'s `notificationErrors` write. Runs once, on create only
 * — the three source fields are readonly forever, so it never goes stale.
 */
export const stampAdminTitle: CollectionAfterChangeHook<Enquiry> = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') return doc

  const adminTitle = `#${doc.id} · ${doc.enquiryTypeLabel} · ${doc.name}`

  await req.payload.update({
    collection: 'enquiries',
    id: doc.id,
    data: { adminTitle },
    context: { systemWrite: true },
  })

  return { ...doc, adminTitle }
}
