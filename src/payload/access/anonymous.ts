import type { Access } from 'payload'

/**
 * True only for unauthenticated requests. Staff acting in the admin panel
 * always carry `req.user`; the public enquiry form always writes anonymously
 * — so this blocks manual admin-panel creation while leaving the form path open.
 */
export const anonymousOnly: Access = ({ req: { user } }) => !user
