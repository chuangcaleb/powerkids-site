import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

/** Fallback SEO values for any page that leaves its own `meta` tab empty. */
export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'titleTemplate',
      type: 'text',
      required: true,
      admin: {
        description:
          'Use {title} as the page-title placeholder, e.g. "{title} | PowerKids Kindergarten".',
      },
    },
    {
      name: 'defaultDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'defaultImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
