import type { Access } from 'payload'

/** Any signed-in user reads everything; the public reads published only. */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
