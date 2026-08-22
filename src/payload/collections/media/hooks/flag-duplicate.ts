import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Media } from '@/payload-types'

import {
  recomputeDuplicateGroup,
  SKIP_RECOMPUTE_CONTEXT_KEY,
} from './recompute-duplicate-group'

/**
 * Non-blocking duplicate detection. Re-uploading an identical file today just
 * gets a `-1` filename suffix from the storage adapter — silent, so editors
 * keep re-uploading the same photo instead of reusing the existing doc.
 *
 * Never throws or refuses the write: a genuine duplicate is a nudge for the
 * editor to notice, not a reason to block their work. A bulk upload where one
 * of ten files matches an existing doc must still save all ten — recompute
 * failure is logged and swallowed rather than surfaced as a write error.
 *
 * Runs on create and on update (covers file-replace, since `checksum` only
 * changes when `compute-checksum.ts` sees a new file). On a checksum change,
 * the doc has left its old group as well as joined a new one — both groups
 * need a recompute, or the old group's survivors are left stuck at
 * `hasDuplicate: true` after the only other member moved on.
 */
export const flagDuplicateAfterChange: CollectionAfterChangeHook<Media> = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context[SKIP_RECOMPUTE_CONTEXT_KEY]) return doc

  // A metadata-only edit (alt text, tags, dismissing the flag, ...) never
  // touches `checksum` — compute-checksum.ts only sets it when a file is
  // present — so the group hasn't changed and there's nothing to recompute.
  // Create has no `previousDoc` to compare against, so it always proceeds.
  if (previousDoc && previousDoc.checksum === doc.checksum) return doc

  try {
    await recomputeDuplicateGroup(doc.checksum, req)

    if (previousDoc?.checksum && previousDoc.checksum !== doc.checksum) {
      await recomputeDuplicateGroup(previousDoc.checksum, req)
    }
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'Duplicate-group recompute failed; write was not blocked.',
    })
  }

  return doc
}

/** Deleting a member can shrink its group down to 1 — that survivor needs unflagging. */
export const flagDuplicateAfterDelete: CollectionAfterDeleteHook<Media> = async ({
  doc,
  req,
}) => {
  try {
    await recomputeDuplicateGroup(doc.checksum, req)
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'Duplicate-group recompute failed; delete was not blocked.',
    })
  }

  return doc
}
