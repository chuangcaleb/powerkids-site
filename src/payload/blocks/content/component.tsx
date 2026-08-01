import { CMSLink } from '@/components/cms-link/cms-link'
import { Media } from '@/components/media/media'
import { RichText } from '@/components/rich-text/rich-text'
import { cx } from '@/lib/cx'
import type { ContentBlock } from '@/payload-types'
import styles from './content.module.css'

type Column = NonNullable<ContentBlock['columns']>[number]

const sizeStyles: Record<NonNullable<Column['size']>, string> = {
  full: cx(styles.col),
  oneHalfWide: cx(styles.col, styles.oneHalfWide),
  oneThird: cx(styles.col, styles.oneThird),
  twoThirds: cx(styles.col, styles.twoThirds),
  oneHalfNarrow: cx(styles.col, styles.oneHalfNarrow),
}

export function Content({ columns }: ContentBlock) {
  return (
    <section className="wrapper flow">
      <div className={styles.grid}>
        {(columns ?? []).map((column, index) => {
          const { size, variant, richText, media, enableLink, link } = column
          const hasMedia = typeof media === 'object' && media !== null
          const showLink = Boolean(enableLink && link)
          const spanClass = sizeStyles[size ?? 'full']

          return (
            <div
              key={column.id ?? index}
              className={cx(spanClass, variant === 'align-center' && styles.alignCenter)}
            >
              {variant === 'image' ? (
                hasMedia ? (
                  <Media doc={media} sizes="(min-width: 1024px) 33vw, 100vw" />
                ) : null
              ) : richText ? (
                <RichText data={richText} />
              ) : null}
              {showLink && link ? <CMSLink link={link} /> : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
