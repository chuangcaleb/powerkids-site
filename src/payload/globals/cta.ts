import type { GlobalConfig } from 'payload'

import { authenticated } from '@/payload/access/authenticated'
import { buttonField } from '@/payload/fields/button'
import { headerField } from '@/payload/fields/header'

import { revalidateLayout } from './hooks/revalidate-layout'

/**
 * Copy for the red registration and blue contact sections rendered at the
 * end of every page. Contact facts (phones, hours, socials) stay on
 * site-settings — this only holds the two sections' authored heading/lead.
 */
export const Cta: GlobalConfig = {
  slug: 'cta',
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
      name: 'footerSticker',
      type: 'text',
      admin: {
        description: 'Text on the folded sticker above the footer CTA.',
      },
    },
    {
      name: 'registration',
      type: 'group',
      fields: [headerField({ headingRequired: true }), buttonField()],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [headerField({ headingRequired: true })],
    },
  ],
}
