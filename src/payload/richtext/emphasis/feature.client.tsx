'use client'

// Client component: Lexical toolbar features register commands against the
// editor instance, which only exists in the browser.

import {
  createClientFeature,
  toolbarFormatGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { EmphasisSvg } from './emphasis-svg'

const toolbarGroups = [
  toolbarFormatGroupWithItems([
    {
      ChildComponent: EmphasisSvg,
      isActive: ({ selection }) =>
        $isRangeSelection(selection) && selection.hasFormat('underline'),
      key: 'emphasis',
      label: 'Emphasis',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
      },
      order: 3,
    },
  ]),
]

/** Reuses the `underline` format bit — see feature.server.ts for why. */
export const EmphasisFeatureClient = createClientFeature({
  enableFormats: ['underline'],
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
