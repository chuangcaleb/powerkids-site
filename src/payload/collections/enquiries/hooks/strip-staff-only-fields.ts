import type { CollectionBeforeChangeHook } from 'payload'

const STAFF_ONLY_FIELDS = [
  'status',
  'closedBy',
  'closedAt',
  'notificationErrors',
  'adminTitle',
] as const

// Deleting `status` isn't enough on create: `defaultValue` resolves in the
// beforeValidate pass and validation runs after this hook, so a required
// field left deleted fails validation as `undefined`.
const ANONYMOUS_CREATE_VALUES = { status: 'unread' }

/**
 * Actual security boundary for staff-only fields — field-level
 * `access.create: false` only signals intent in the admin UI, it does not
 * stop an anonymous API/Local-API caller from setting these keys directly.
 * Strips them whenever the request has no authenticated user, regardless of
 * operation — except the system's own follow-up write in
 * `sendEnquiryEmails`, which runs on the same (anonymous) request and marks
 * itself via `context.systemWrite` so its own staff-only field write isn't
 * stripped.
 */
export const stripStaffOnlyFields: CollectionBeforeChangeHook = ({
  data,
  operation,
  req,
  context,
}) => {
  if (req.user || context.systemWrite) return data

  for (const field of STAFF_ONLY_FIELDS) {
    delete data[field]
  }

  if (operation === 'create') Object.assign(data, ANONYMOUS_CREATE_VALUES)

  return data
}
