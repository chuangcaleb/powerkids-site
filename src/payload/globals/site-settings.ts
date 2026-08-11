import type { GlobalConfig } from 'payload'

import { authenticated } from '@/payload/access/authenticated'

import { revalidateLayout } from './hooks/revalidate-layout'

/**
 * Brand-wide facts referenced across the site. Founding year is stored, not
 * hard-coded, so "{n} years & counting" stays a computed value. `name` is the
 * site name shown in the header, linking back to the index page.
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'foundedYear',
      type: 'number',
      required: true,
      admin: {
        description:
          'Used to compute "{n} years & counting" — do not hard-code the count anywhere.',
      },
    },
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
        components: { RowLabel: '@/payload/admin/components/row-label#RowLabel' },
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
    {
      name: 'footerReel',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          'Photos for the polaroid reel straddling the footer edge. Renders nothing when empty.',
      },
    },
  ],
}
