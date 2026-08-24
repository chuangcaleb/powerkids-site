import type { ReactNode } from 'react'
import { NodeFormat } from '@payloadcms/richtext-lexical'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'
import emphasisStyles from './emphasis.module.css'

type TextConverter = NonNullable<JSXConverters['text']>

/**
 * Bold/italic/`emphasis` (the hand-drawn double-underline mark, see
 * emphasis.module.css) text-node converter, shared by `RichText` and
 * `HeaderRichText` so both render the mark identically.
 */
export const emphasisTextConverter: TextConverter = ({ node }) => {
  let text: ReactNode = node.text

  if (node.format & NodeFormat.IS_BOLD) {
    text = <strong>{text}</strong>
  }
  if (node.format & NodeFormat.IS_ITALIC) {
    text = <em>{text}</em>
  }
  if (node.format & NodeFormat.IS_UNDERLINE) {
    text = <span className={emphasisStyles.emphasis}>{text}</span>
  }

  return text
}
