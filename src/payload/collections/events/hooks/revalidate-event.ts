import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import type { Event } from '@/payload-types'

/** Events render on their own route AND inside `card-grid`/`gallery`/`video` blocks elsewhere — revalidate the whole layout. */
export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc._status === 'published') {
    payload.logger.info(`Revalidating layout after event change: ${doc.slug}`)
    revalidatePath('/', 'layout')
  }

  return doc
}

export const revalidateEventDelete: CollectionAfterDeleteHook<Event> = ({
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/', 'layout')
  }
}
