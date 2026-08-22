import type { Access, FieldAccess } from 'payload'

/** Editor or admin — either role may write content. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Same check, field-level shape — for fields hidden from public/unauthenticated reads. */
export const authenticatedFieldAccess: FieldAccess = ({ req: { user } }) => Boolean(user)
