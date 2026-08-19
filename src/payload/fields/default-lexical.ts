import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import type { TextFieldSingleValidation } from 'payload'
import { EmphasisFeature } from '@/payload/richtext/emphasis/feature.server'

/** Shared by any lexical config that needs internal-page/external-URL links. */
export const linkFeature = () =>
  LinkFeature({
    enabledCollections: ['pages'],
    fields: ({ defaultFields }) => {
      const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
        if ('name' in field && field.name === 'url') return false
        return true
      })

      return [
        ...defaultFieldsWithoutUrl,
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
          },
          label: ({ t }) => t('fields:enterURL'),
          required: true,
          validate: ((value, options) => {
            if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
              return true
            }
            return value ? true : 'URL is required'
          }) as TextFieldSingleValidation,
        },
      ]
    },
  })

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    linkFeature(),
    EmphasisFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})
