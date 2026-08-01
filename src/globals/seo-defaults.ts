import type { GlobalConfig } from 'payload'

/** Fallback SEO values for any page that leaves its own `seo` group empty. */
export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
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
