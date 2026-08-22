import type { CollectionBeforeOperationHook } from 'payload'
import { createHash } from 'node:crypto'

/**
 * Hashes uploaded file content into `checksum` before save — on create and
 * on file-replace-on-update alike, so swapping a file on an existing doc
 * gets checked too. `flag-duplicate.ts`'s `afterChange`/`afterDelete` hooks
 * read this column after the write to find every doc sharing it.
 */
export const computeChecksum: CollectionBeforeOperationHook<'media'> = async ({
  args,
  operation,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') return args
  if (!req.file) return args

  args.data = {
    ...args.data,
    checksum: createHash('sha256').update(req.file.data).digest('hex'),
  }

  return args
}
