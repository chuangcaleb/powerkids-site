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
import { Media } from '@/components/media/media'
import { cx } from '@/lib/cx'
import { getPrograms } from '@/payload/collections/programs/get-programs'
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

/** Position, not the CMS, decides colour and tilt — D-11/06-baseline-config.md#3. Peers, capped at 3. */
const ACCENTS = [styles.accentA, styles.accentB, styles.accentC]
const MAX_PROGRAMS = 3

export async function FramedRows({ heading }: FramedRowsBlockType) {
  const programs = (await getPrograms()).slice(0, MAX_PROGRAMS)

  if (programs.length === 0) return null

  return (
    <section
      className="wrapper flow"
      style={
        {
          '--wrapper-max-width': 'var(--max-bleed)',
        } as CSSProperties
      }
    >
      {heading ? (
        <div className="wrapper">
          <Heading level={2}>{heading}</Heading>
        </div>
      ) : null}
      <div className={styles.band}>
        {programs.map((program, index) => {
          const Icon = program.icon ? ICONS[program.icon as keyof typeof ICONS] : null
          const image = typeof program.image === 'object' ? program.image : null
          const body = program.strapline ?? program.summary

          return (
            <div
              key={program.id}
              className={cx(styles.row, ACCENTS[index % ACCENTS.length])}
            >
              <div
                className={cx(
                  'switcher',
                  'wrapper',
                  styles.switcher,
                  index % 2 === 1 && styles.reverse,
                )}
              >
                <div className={cx('flow', 'flow-2xs', styles.content)}>
                  <div className={cx('flow', styles.timeStack)}>
                    {Icon ? <Icon aria-hidden="true" strokeWidth={2.2} /> : null}
                    <span className={styles.hours}>{program.hours}</span>
                  </div>
                  <Heading level={3}>{program.name}</Heading>
                  {body ? <p>{body}</p> : null}
                </div>
                <div
                  className={cx(
                    styles.media,
                    index % 2 === 1 ? styles.tiltNeg : styles.tiltPos,
                  )}
                >
                  {image ? (
                    <figure className={styles.polaroid}>
                      <span className={styles.tape} aria-hidden="true" />
                      <div className={styles.photo}>
                        <Media doc={image} sizes="(min-width: 768px) 33vw, 100vw" />
                      </div>
                    </figure>
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
