import type { CollectionBeforeOperationHook } from 'payload'
import { createHash } from 'node:crypto'

/**
 * Non-blocking duplicate detection. Re-uploading an identical file today just
 * gets a `-1` filename suffix from the storage adapter — silent, so editors
 * keep re-uploading the same photo instead of reusing the existing doc.
 *
 * Never throws or refuses the upload: a genuine duplicate is a nudge for the
 * editor to notice, not a reason to block their work. A bulk upload where one
 * of ten files matches an existing doc must still save all ten.
 */
export const flagDuplicate: CollectionBeforeOperationHook<'media'> = async ({
  args,
  operation,
  req,
}) => {
  if (operation !== 'create') return args
  if (!req.file) return args

  const checksum = createHash('sha256').update(req.file.data).digest('hex')

  const existing = await req.payload.find({
    collection: 'media',
    where: { checksum: { equals: checksum } },
    limit: 1,
    depth: 0,
  })

  args.data = {
    ...args.data,
    checksum,
    possibleDuplicateOf: existing.docs[0]?.id,
  }

  return args
}
