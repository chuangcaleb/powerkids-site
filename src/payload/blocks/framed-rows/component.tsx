import type { CSSProperties } from 'react'
import {
  Cloud,
  Feather,
  Flower,
  Music,
  Palette,
  PenLine,
  Rainbow,
  Rocket,
  Smile,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Zap,
} from 'lucide-react'
import { Heading } from '@/components/heading/heading'
import { Polaroid } from '@/components/polaroid/polaroid'
import { RichText } from '@/components/rich-text/rich-text'
import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import type { FramedRowsBlock as FramedRowsBlockType } from '@/payload-types'
import styles from './framed-rows.module.css'

const ICONS = {
  sunrise: Sunrise,
  sun: Sun,
  sunset: Sunset,
  star: Star,
  cloud: Cloud,
  sparkles: Sparkles,
  smile: Smile,
  feather: Feather,
  music: Music,
  rocket: Rocket,
  palette: Palette,
  'pen-line': PenLine,
  zap: Zap,
  rainbow: Rainbow,
  flower: Flower,
}

/** Position, not the CMS, decides colour and tilt — D-11/06-baseline-config.md#3. */
const ACCENTS = [styles.accentA, styles.accentB, styles.accentC]

export function FramedRows({ header, rows }: FramedRowsBlockType) {
  if (!rows || rows.length === 0) return null

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
        {header?.eyebrow || header?.heading || header?.lead ? (
          <div className={cx(styles.row)}>
            <div className="wrapper">
              <SectionHeader header={header} />
            </div>
          </div>
        ) : null}
        {rows.map((row, index) => {
          const Icon = row.icon ? ICONS[row.icon as keyof typeof ICONS] : null
          const image = typeof row.image === 'object' ? row.image : null

          return (
            <div key={row.id} className={cx(styles.row, ACCENTS[index % ACCENTS.length])}>
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
                    className={styles.media}
                  />
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
