import type { GlobalConfig } from 'payload'

import { authenticated } from '@/payload/access/authenticated'
import { headerField } from '@/payload/fields/header'

import { revalidateLayout } from './hooks/revalidate-layout'

/** Seed order also governs display order in the form's enquiry-type select. */
const ENQUIRY_TYPE_SEED = [
  'Enrolment',
  'Fees',
  'Schedule Visit',
  'Programs',
  'Events',
  'Other',
] as const

/**
 * Copy for the red enquiry and blue contact sections rendered at the end of
 * every page. Contact facts (phones, hours, socials) stay on site-settings —
 * this only holds the two sections' authored heading/lead, plus the enquiry
 * form's type options.
 */
export const Cta: GlobalConfig = {
  slug: 'cta',
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
        description: 'Sticker text, above the footer CTA.',
      },
    },
    {
      name: 'enquiry',
      type: 'group',
      fields: [
        headerField({ headingRequired: true }),
        {
          name: 'types',
          type: 'array',
          minRows: 1,
          defaultValue: ENQUIRY_TYPE_SEED.map((label) => ({
            label,
            hideFromForm: false,
          })),
          admin: {
            description:
              'Options shown in the enquiry form. Row order is display order. ' +
              '"Hide from form" removes an option without deleting past enquiries that reference it.',
            components: {
              RowLabel: '@/payload/admin/components/row-labels/row-label#RowLabel',
            },
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            {
              name: 'hideFromForm',
              type: 'checkbox',
              defaultValue: false,
              label: 'Hide from form',
            },
          ],
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [headerField({ headingRequired: true })],
    },
  ],
}
