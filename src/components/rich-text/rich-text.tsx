import type { CSSProperties } from 'react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import { cx } from '@/lib/cx'
import { emphasisTextConverter } from './emphasis-text-converter'

// `lexical` itself is a transitive dependency (pulled in by
// @payloadcms/richtext-lexical) and not hoisted under pnpm's strict
// node_modules, so the data type is derived from the component instead of
// importing `SerializedEditorState` from `lexical` directly.
export type RichTextProps = {
  data: Parameters<typeof LexicalRichText>[0]['data']
  className?: string
  style?: CSSProperties
}

/**
 * Renders a Payload lexical richText field as real block-level HTML
 * (paragraphs, lists, ...) — layout comes from the `flow` composition. The
 * `emphasis` mark reads `--accent-color`, set once by the section container
 * (see `src/lib/accent`), not passed in here.
 */
export function RichText({ data, className, style }: RichTextProps) {
  return (
    <div className={cx('flow-s', className)} style={style}>
      <LexicalRichText
        data={data}
        disableContainer
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          text: emphasisTextConverter,
        })}
      />
    </div>
  )
}
