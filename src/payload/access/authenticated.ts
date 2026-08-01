import type { Access } from 'payload'

/** Editor or admin — either role may write content. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
