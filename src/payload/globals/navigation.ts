import type { GlobalConfig } from 'payload'

import { authenticated } from '@/payload/access/authenticated'

import { revalidateLayout } from './hooks/revalidate-layout'

const linkFields = [
  { name: 'label', type: 'text', required: true },
  { name: 'url', type: 'text', required: true },
] as const

const rowLabel = {
  RowLabel: '@/payload/admin/components/row-labels/row-label#RowLabel',
} as const

/**
 * Header and footer link trees. Header nav is flat (D-04/K-04 resolved to a
 * plain underline style, not dropdowns) — the homepage is a single scrolling
 * page (see docs/adr/0004-single-page-mvp-no-redirects.md), so header
 * links are anchors/routes, capped small. Footer link groups are the only
 * nesting; footer column headings are fields, not markup.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
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
    {
      name: 'headerLinks',
      type: 'array',
      maxRows: 7,
      admin: {
        description: 'Flat top-level nav — no dropdowns.',
        components: rowLabel,
      },
      fields: [...linkFields],
    },
    {
      name: 'footerColumns',
      type: 'array',
      admin: {
        description: 'Each column has a heading and its own list of links.',
        components: rowLabel,
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          admin: { components: rowLabel },
          fields: [...linkFields],
        },
      ],
    },
  ],
}
