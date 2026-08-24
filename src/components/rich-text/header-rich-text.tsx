import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import { cx } from '@/lib/cx'
import { emphasisTextConverter } from './emphasis-text-converter'
import styles from './header-rich-text.module.css'

export type HeaderRichTextProps = {
  data: Parameters<typeof LexicalRichText>[0]['data']
  className?: string
}

/**
 * Renders a heading richText field inline: no `<p>` wrapper, since this is
 * meant to sit inside a `<Heading>` tag, which can't contain block children
 * — only ever used with `headingLexical` (paragraph + emphasis, no lists),
 * so flattening away the paragraph loses nothing. The `emphasis` mark reads
 * `--accent-color`, set once by the section container (see `src/lib/accent`),
 * not passed in here.
 */
export function HeaderRichText({ data, className }: HeaderRichTextProps) {
  return (
    <span className={cx(styles.wrapper, className)}>
      <LexicalRichText
        data={data}
        disableContainer
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          paragraph: ({ node, nodesToJSX }) => nodesToJSX({ nodes: node.children }),
          text: emphasisTextConverter,
        })}
      />
    </span>
  )
}
