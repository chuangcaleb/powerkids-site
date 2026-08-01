import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import type { School } from '@/payload-types'

/** The `schools` block always renders the whole collection — revalidate the layout on any change. */
export const revalidateSchool: CollectionAfterChangeHook<School> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc._status === 'published') {
    payload.logger.info(`Revalidating layout after school change: ${doc.slug}`)
    revalidatePath('/', 'layout')
  }

  return doc
}

export const revalidateSchoolDelete: CollectionAfterDeleteHook<School> = ({
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/', 'layout')
  }
}
