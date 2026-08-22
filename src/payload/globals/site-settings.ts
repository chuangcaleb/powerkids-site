import type { GlobalConfig } from 'payload'

import { authenticated } from '@/payload/access/authenticated'

import { revalidateLayout } from './hooks/revalidate-layout'

/**
 * Brand-wide facts referenced across the site.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
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
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phones',
      type: 'array',
      minRows: 1,
      admin: {
        components: {
          RowLabel: '@/payload/admin/components/row-labels/row-label#RowLabel',
        },
      },
      fields: [
        { name: 'number', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'tel: link target, with country code.' },
        },
      ],
    },
    {
      name: 'openingHours',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "8:30am - 5:00pm".' },
    },
    {
      name: 'openingDays',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Monday - Friday".' },
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['facebook', 'instagram', 'youtube', 'tiktok'],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'defaultShareImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
