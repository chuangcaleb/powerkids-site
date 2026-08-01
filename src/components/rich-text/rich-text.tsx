import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import { cx } from '@/lib/cx'

// `lexical` itself is a transitive dependency (pulled in by
// @payloadcms/richtext-lexical) and not hoisted under pnpm's strict
// node_modules, so the data type is derived from the component instead of
// importing `SerializedEditorState` from `lexical` directly.
export type RichTextProps = {
  data: Parameters<typeof LexicalRichText>[0]['data']
  className?: string
}

/** Renders a Payload lexical richText field. Layout comes from the `flow` composition. */
export function RichText({ data, className }: RichTextProps) {
  return <LexicalRichText data={data} className={cx('flow-m', className)} />
}
