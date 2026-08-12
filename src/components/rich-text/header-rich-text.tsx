import type { CSSProperties, ReactNode } from 'react'
import { NodeFormat } from '@payloadcms/richtext-lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import { cx } from '@/lib/cx'
import styles from './header-rich-text.module.css'

type Accent = 'blue' | 'neutral' | 'red'

const ACCENT_VAR: Record<Accent, string> = {
  blue: 'var(--accent-blue)',
  neutral: 'var(--text-strong)',
  red: 'var(--accent-red)',
}

export type HeaderRichTextProps = {
  data: Parameters<typeof LexicalRichText>[0]['data']
  accent?: Accent | null
  className?: string
}

/**
 * Renders a section-header heading/lead richText field: no `<p>`
 * wrapper (the field is inline title text, not a body), and the `emphasis`
 * mark (reused `underline` format bit, see richtext/emphasis/feature.server)
 * renders as the hand-drawn double underline instead of a plain line.
 */
export function HeaderRichText({
  data,
  accent = 'neutral',
  className,
}: HeaderRichTextProps) {
  const style = { '--emphasis-color': ACCENT_VAR[accent ?? 'neutral'] } as CSSProperties

  return (
    <span className={cx(styles.wrapper, className)} style={style}>
      <LexicalRichText
        data={data}
        disableContainer
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          paragraph: ({ node, nodesToJSX }) => nodesToJSX({ nodes: node.children }),
          text: ({ node }) => {
            let text: ReactNode = node.text

            if (node.format & NodeFormat.IS_BOLD) {
              text = <strong>{text}</strong>
            }
            if (node.format & NodeFormat.IS_ITALIC) {
              text = <em>{text}</em>
            }
            if (node.format & NodeFormat.IS_UNDERLINE) {
              text = <span className={styles.emphasis}>{text}</span>
            }

            return text
          },
        })}
      />
    </span>
  )
}
