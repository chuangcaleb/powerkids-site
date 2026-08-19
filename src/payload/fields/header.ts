import { EmphasisFeature } from '@/payload/richtext/emphasis/feature.server'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'
import type { Field } from 'payload'

const headingLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    EmphasisFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

type HeaderFieldOptions = {
  /** Match the block's existing heading requiredness — defaults to optional. */
  headingRequired?: boolean
  /** Suppress the eyebrow input, e.g. for a repeated sub-item where a pill per row would be noise. Defaults to shown. */
  showEyebrow?: boolean
}

/**
 * Shared eyebrow/heading/lead/accent group for section blocks. Each
 * block still composes its own markup (heading level, layout) — this only
 * standardizes the authored fields and their lexical feature sets.
 */
export function headerField({
  headingRequired = false,
  showEyebrow = true,
}: HeaderFieldOptions = {}): Field {
  const accentField: Field = {
    name: 'accent',
    type: 'select',
    defaultValue: 'neutral',
    options: [
      { label: 'Neutral', value: 'neutral' },
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
    ],
    admin: {
      width: showEyebrow ? '50%' : undefined,
      description: 'Pill + emphasis color.',
    },
  }

  return {
    name: 'header',
    type: 'group',
    fields: [
      showEyebrow
        ? {
            type: 'row',
            fields: [
              {
                name: 'eyebrow',
                type: 'text',
                admin: {
                  width: '50%',
                  description: 'Rendered as a pill.',
                },
              },
              accentField,
            ],
          }
        : accentField,
      {
        name: 'heading',
        type: 'richText',
        label: 'Heading (h2)',
        editor: headingLexical,
        required: headingRequired,
      },
      {
        name: 'lead',
        type: 'richText',
      },
    ],
  }
}

/**
 * Splits a block's fields into Body/Header tabs for admin organization only
 * — both tabs are unnamed, so field paths (and the DB schema) are unchanged.
 * Body listed first so it's the tab shown by default on both create and edit.
 */
export function withHeaderTabs(
  bodyFields: Field[],
  options?: HeaderFieldOptions,
): Field[] {
  return [
    {
      type: 'tabs',
      tabs: [
        { label: 'Body', fields: bodyFields },
        { label: 'Header', fields: [headerField(options)] },
      ],
    },
  ]
}
