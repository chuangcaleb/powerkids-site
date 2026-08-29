import { Heading } from '@/components/heading/heading'
import { Polaroid } from '@/components/polaroid/polaroid'
import { RichText } from '@/components/rich-text/rich-text'
import { SectionHeader } from '@/components/section-header/section-header'
import { SectionSeam } from '@/components/section-seam/section-seam'
import { cx } from '@/lib/cx'
import { primitiveVars } from '@/lib/primitive-vars'
import { ICONS, isIconName } from '@/lib/icons'
import { sectionId } from '@/lib/section-id'
import type { FramedRowsBlock as FramedRowsBlockType } from '@/payload-types'
import { Fragment } from 'react'
import styles from './framed-rows.module.css'
import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'

/** Position, not the CMS, decides colour and tilt — D-11/06-baseline-config.md#3.
 * The .row class handles its own accent/reverse/bleed via nth-child selectors
 * in framed-rows.module.css; only the SectionSeam gradient still needs the
 * resolved colour in JS since it's an inline style, not a class. */
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

export function FramedRows({ header, rows, id }: FramedRowsBlockType) {
  if (!rows || rows.length === 0) return null

  const hasHeader = Boolean(header?.eyebrow || header?.heading || header?.lead)

  return (
    <section
      id={sectionId(header)}
      className="wrapper flow region"
      style={primitiveVars({ '--wrapper-max-width': 'var(--max-bleed)' })}
    >
      <div className={styles.band}>
        {hasHeader ? (
          <>
            <div className={styles.row}>
              <DoodleLayer zoneId={String(id)} />
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
            <Fragment key={row.id ?? index}>
              {index > 0 ? (
                <SectionSeam
                  {...SUB_SEAM}
                  above={accentFill(index - 1)}
                  below={accentFill(index)}
                />
              ) : null}
              <div className={styles.row}>
                <div
                  className={cx('switcher', 'wrapper', styles.switcher)}
                  style={primitiveVars({
                    '--switcher-gap': 'var(--space-2xl)',
                    '--switcher-vertical-align': 'center',
                  })}
                >
                  <div className="flow-s">
                    <div className="flow-2xs">
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
                      asset={image}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      tilt={index % 2 === 1 ? 5 : -5}
                    />
                  ) : null}
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}
