import type { CollectionConfig } from 'payload'

import { admin, adminFieldAccess } from '@/access/admin'
import { authenticated } from '@/access/authenticated'

/**
 * Admin panel accounts. Two roles, and the distinction is deliberate:
 * `editor` covers everyone at the school who updates content, `admin` adds
 * the ability to create and remove accounts. Staff get `editor`.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  access: {
    // Only admins manage accounts. Editors can still read the list so that
    // "last edited by" shows a name rather than an id.
    create: admin,
    delete: admin,
    read: authenticated,
    update: ({ req, id }) => req.user?.role === 'admin' || req.user?.id === id,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Shown in the admin panel and in version history.',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Editor — can change content', value: 'editor' },
        { label: 'Administrator — can also manage accounts', value: 'admin' },
      ],
      access: {
        // A user must not be able to promote themselves.
        update: adminFieldAccess,
      },
    },
  ],
}
