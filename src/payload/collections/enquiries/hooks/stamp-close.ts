import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Phase-2 follow-up: `closedBy`/`closedAt` describe the *current* close, not
 * a history log — they re-stamp on every close and clear on every re-open.
 * Runs after `stripStaffOnlyFields`, so `data.status` is only present when
 * an authenticated staff member is actually changing it.
 */
export const stampClose: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  if (!data.status || data.status === originalDoc?.status) return data

  if (data.status === 'closed') {
    data.closedBy = req.user?.id ?? null
    data.closedAt = new Date().toISOString()
  } else {
    data.closedBy = null
    data.closedAt = null
  }

  return data
}
