import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { authenticated } from '@/payload/access/authenticated'
import { authenticatedOrPublished } from '@/payload/access/authenticated-or-published'
import { CardGrid } from '@/payload/blocks/card-grid/config'
import { Contact } from '@/payload/blocks/contact/config'
import { CtaBanner } from '@/payload/blocks/cta-banner/config'
import { Faq } from '@/payload/blocks/faq/config'
import { Gallery } from '@/payload/blocks/gallery/config'
import { MediaText } from '@/payload/blocks/media-text/config'
import { Prose } from '@/payload/blocks/prose/config'
import { SchoolsBlock } from '@/payload/blocks/schools/config'
import { Stats } from '@/payload/blocks/stats/config'
import { Steps } from '@/payload/blocks/steps/config'
import { VideoBlock } from '@/payload/blocks/video/config'

import { hero } from './hero'
import { populatePublishedAt } from './hooks/populate-published-at'
import { revalidateDelete, revalidatePage } from './hooks/revalidate-page'

/** Editor-composed routes. `layout` is the closed 11-block set — hero is not one of them, see ./hero.ts. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    group: 'Content',
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        { fields: [hero], label: 'Hero' },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              admin: { initCollapsed: true },
              blocks: [
                Prose,
                MediaText,
                CardGrid,
                Steps,
                Stats,
                Gallery,
                CtaBanner,
                SchoolsBlock,
                Faq,
                Contact,
                VideoBlock,
              ],
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
    beforeChange: [populatePublishedAt],
  },
}
