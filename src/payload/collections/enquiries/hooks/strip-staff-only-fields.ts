import type { CollectionBeforeChangeHook } from 'payload'

const STAFF_ONLY_FIELDS = [
  'status',
  'closedBy',
  'closedAt',
  'adminNotificationFailed',
] as const

/**
 * Actual security boundary for staff-only fields — field-level
 * `access.create: false` only signals intent in the admin UI, it does not
 * stop an anonymous API/Local-API caller from setting these keys directly.
 * Strips them whenever the request has no authenticated user, regardless of
 * operation.
 */
export const stripStaffOnlyFields: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.user) return data

  for (const field of STAFF_ONLY_FIELDS) {
    delete data[field]
  }

  return data
}
