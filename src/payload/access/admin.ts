import type { Access, FieldAccess } from 'payload'

/** Admin role only — account management, role changes. */
export const admin: Access = ({ req: { user } }) => user?.role === 'admin'

export const adminFieldAccess: FieldAccess = ({ req: { user } }) => user?.role === 'admin'
