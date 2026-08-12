import type { Block } from 'payload'
import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { withHeaderTabs } from '@/payload/fields/header'

/** Numbered process — the registration steps on v3. Primitive: `flow`. */
export const Steps: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  labels: { singular: 'Steps', plural: 'Steps Blocks' },
  fields: withHeaderTabs(
    [
      {
        name: 'body',
        type: 'richText',
        required: true,
        editor: lexicalEditor({
          features: [
            ParagraphFeature(),
            BoldFeature(),
            ItalicFeature(),
            OrderedListFeature(),
            UnorderedListFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ],
        }),
        admin: {
          description: 'Author as a numbered or bulleted list.',
        },
      },
      {
        name: 'cta',
        type: 'group',
        admin: {
          description: 'Optional call-to-action link shown after the steps.',
        },
        fields: [
          { name: 'label', type: 'text' },
          { name: 'url', type: 'text' },
        ],
      },
    ],
    { headingRequired: true },
  ),
}
