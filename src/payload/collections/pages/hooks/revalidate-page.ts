import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import { pathForSlug } from '@/lib/page-path'
import type { Page } from '@/payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = pathForSlug(doc.slug)
      payload.logger.info(`Revalidating page at path: ${path}`)
      revalidatePath(path)
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = pathForSlug(previousDoc.slug)
      payload.logger.info(`Revalidating old page at path: ${oldPath}`)
      revalidatePath(oldPath)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(pathForSlug(doc?.slug))
  }

  return doc
}
