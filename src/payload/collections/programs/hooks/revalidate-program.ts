import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import type { Program } from '@/payload-types'

/**
 * Programs render on their own route AND inside `card-grid` blocks on any
 * page (source: "programs") — revalidating just `/programs/<slug>` would
 * miss those. Revalidate the whole layout instead of tracking every page
 * that might embed one.
 */
export const revalidateProgram: CollectionAfterChangeHook<Program> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc._status === 'published') {
    payload.logger.info(`Revalidating layout after program change: ${doc.slug}`)
    revalidatePath('/', 'layout')
  }

  return doc
}

export const revalidateProgramDelete: CollectionAfterDeleteHook<Program> = ({
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/', 'layout')
  }
}
