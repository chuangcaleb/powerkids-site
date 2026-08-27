import type { GlobalConfig } from 'payload'

import { authenticated } from '@/payload/access/authenticated'
import { headerField } from '@/payload/fields/header'

import { revalidateLayout } from './hooks/revalidate-layout'

/**
 * FAQ accordion rendered at the end of every page, above the registration
 * section. One list, site-wide — not a per-page block. See
 * docs/adr/0009-headless-ui-for-complex-interactive-components.md for the
 * Radix accordion this feeds.
 */
export const Faq: GlobalConfig = {
  slug: 'faq',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateLayout],
  },
  fields: [
    headerField(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: {
        components: {
          RowLabel: '@/payload/admin/components/row-labels/row-label#RowLabel',
        },
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
  ],
}
