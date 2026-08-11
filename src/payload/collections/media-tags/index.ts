import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'

/**
 * Flat tags for Media — no `kind` field, `after-school` sits beside
 * `sports-day`. Lets an editor build a Gallery block from "every photo
 * tagged X" instead of hand-picking uploads.
 */
export const MediaTags: CollectionConfig = {
  slug: 'media-tags',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({ fieldToUse: 'name' }),
  ],
}
