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
    {
      name: 'locations',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      // No custom RowLabel — the default one already reads `name` first.
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          admin: { description: 'Multi-line — rendered as written, no auto-formatting.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              required: true,
              admin: {
                width: '50%',
                description:
                  'Right-click the exact spot in Google Maps — the first context-menu item copies it.',
              },
            },
            {
              name: 'longitude',
              type: 'number',
              required: true,
              admin: {
                width: '50%',
                description:
                  'Right-click the exact spot in Google Maps — the first context-menu item copies it.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'locationsMapPoster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          "Screenshot of the Location pins above — re-shoot and re-upload whenever a Location's coordinates change.",
      },
    },
  ],
}
