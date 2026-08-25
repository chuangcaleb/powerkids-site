import type { CollectionBeforeChangeHook } from 'payload'
import type { Media } from '@/payload-types'

/**
 * Sets `hasDuplicate` on the doc being written, as part of its own
 * create/file-replace statement. `recomputeDuplicateGroup` (`flag-duplicate.ts`)
 * still owns every *other* group member. Why this hook exists instead of
 * leaving it to recompute alone: see ADR 0005 addendum (2026-08-25).
 */
export const flagOwnDuplicate: CollectionBeforeChangeHook<Media> = async ({
  data,
  req,
  originalDoc,
  operation,
}) => {
  if (operation !== 'create' && operation !== 'update') return data

  const checksum = data.checksum
  if (!checksum) return data
  // Metadata-only edit — checksum hasn't moved, group hasn't changed.
  if (operation === 'update' && originalDoc?.checksum === checksum) return data

  // Not atomic with the write below — accepted, see ADR 0005 addendum.
  const existing = await req.payload.find({
    collection: 'media',
    where: {
      and: [
        { checksum: { equals: checksum } },
        ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
      ],
    },
    depth: 0,
    limit: 1,
    req,
  })

  data.hasDuplicate = existing.totalDocs > 0
  return data
}
