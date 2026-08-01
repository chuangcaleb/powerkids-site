import type { CollectionBeforeChangeHook } from 'payload'

/** Stamps `publishedAt` the first time a page is published, if not set manually. */
export const populatePublishedAt: CollectionBeforeChangeHook = ({
  data,
  operation,
  req,
}) => {
  if (operation === 'create' || operation === 'update') {
    if (data && data._status === 'published' && !data.publishedAt) {
      return {
        ...data,
        publishedAt: req.data?.publishedAt || new Date().toISOString(),
      }
    }
  }

  return data
}
