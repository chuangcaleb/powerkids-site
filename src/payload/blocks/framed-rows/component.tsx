import { Heading } from '@/components/heading/heading'
import { Polaroid } from '@/components/polaroid/polaroid'
import { RichText } from '@/components/rich-text/rich-text'
import { SectionHeader } from '@/components/section-header/section-header'
import { SectionSeam } from '@/components/section-seam/section-seam'
import { cx } from '@/lib/cx'
import { ICONS, isIconName } from '@/lib/icons'
import type { FramedRowsBlock as FramedRowsBlockType } from '@/payload-types'
import type { CSSProperties } from 'react'
import styles from './framed-rows.module.css'

/** Position, not the CMS, decides colour and tilt — D-11/06-baseline-config.md#3. */
const ACCENTS = [styles.accentA, styles.accentB, styles.accentC]
const ACCENT_FILLS = [
  'var(--accent-red-fill)',
  'var(--accent-blue-fill)',
  'var(--accent-amber-fill)',
]
const accentFill = (index: number) =>
  ACCENT_FILLS[
    ((index % ACCENT_FILLS.length) + ACCENT_FILLS.length) % ACCENT_FILLS.length
  ]!

const SUB_SEAM = { shape: 'wave', width: 5.75, depth: 0.25, referenceWidth: 75 } as const

export function FramedRows({ header, rows }: FramedRowsBlockType) {
  if (!rows || rows.length === 0) return null

  const hasHeader = Boolean(header?.eyebrow || header?.heading || header?.lead)

  return (
    <section
      className="wrapper flow region"
      style={
        {
          '--wrapper-max-width': 'var(--max-bleed)',
        } as CSSProperties
      }
    >
      <div className={styles.band}>
        {hasHeader ? (
          <>
            <div className={cx(styles.row, styles.roundTop)}>
              <div className="wrapper">
                <SectionHeader header={header} />
              </div>
            </div>
            <SectionSeam {...SUB_SEAM} above="var(--bg-surface)" below={accentFill(0)} />
          </>
        ) : null}
        {rows.map((row, index) => {
          const Icon = isIconName(row.icon) ? ICONS[row.icon] : null
          const image = typeof row.image === 'object' ? row.image : null

          return (
            <div key={row.id ?? index}>
              {index > 0 ? (
                <SectionSeam
                  {...SUB_SEAM}
                  above={accentFill(index - 1)}
                  below={accentFill(index)}
                />
              ) : null}
              <div
                className={cx(
                  styles.row,
                  ACCENTS[index % ACCENTS.length],
                  index === 0 && !hasHeader && styles.roundTop,
                  index === rows.length - 1 && styles.roundBottom,
                )}
              >
                <div
                  className={cx(
                    'switcher',
                    'wrapper',
                    styles.switcher,
                    index % 2 === 1 && styles.reverse,
                  )}
                >
                  <div className="flow-m">
                    <div className="flow-xs">
                      <div className={cx('flow-2xs', styles.timeStack)}>
                        {Icon ? <Icon aria-hidden="true" strokeWidth={2.2} /> : null}
                        {row.eyebrow ? (
                          <span className={styles.hours}>{row.eyebrow}</span>
                        ) : null}
                      </div>
                      <Heading level={3}>{row.title}</Heading>
                    </div>
                    {row.body ? <RichText data={row.body} /> : null}
                  </div>
                  {image ? (
                    <Polaroid
                      doc={image}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      tilt={index % 2 === 1 ? -5 : 5}
                      className={cx(styles.media, index % 2 ? styles.left : styles.right)}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
