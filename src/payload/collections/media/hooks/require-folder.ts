import type { CollectionBeforeValidateHook } from 'payload'
import type { Media } from '@/payload-types'
import { ValidationError } from 'payload'

/**
 * Media must sit in a folder — no dropping files at the library root. Forces
 * an intentional choice of where an asset lives instead of an ever-growing
 * unsorted root; existing root-level docs are left alone until next edit.
 */
export const requireFolder: CollectionBeforeValidateHook<Media> = ({
  data,
  req,
  operation,
}) => {
  if (operation !== 'create' && operation !== 'update') return data
  if (data?.folder) return data

  throw new ValidationError({
    collection: 'media',
    errors: [
      { path: 'folder', message: 'Choose a folder — media cannot live at the root.' },
    ],
    req,
  })
}
