import type { CSSProperties } from 'react'
import { Media } from '@/components/media/media'
import { cx } from '@/lib/cx'
import type { Media as TMedia } from '@/payload-types'
import styles from './polaroid.module.css'

export type PolaroidProps = {
  asset: TMedia
  /** Rendered as the figcaption. Omit for no caption strip. */
  caption?: string
  priority?: boolean
  sizes?: string
  /** Degrees to rotate the card, e.g. -3 or 5. Omit for no tilt. */
  tilt?: number
  /** Omit the tape strip, e.g. for reels where cards scroll under the edge. */
  noTape?: boolean
  /** Sizing is a layout concern — set it here, not in this component. */
  className?: string
}

/** White-framed, taped photo card. Sizing is the caller's job; tilt is a prop. */
export function Polaroid({
  asset,
  caption,
  priority,
  sizes,
  tilt,
  noTape,
  className,
}: PolaroidProps) {
  return (
    <figure
      className={cx(styles.polaroid, className)}
      style={tilt ? ({ '--polaroid-tilt': `${tilt}deg` } as CSSProperties) : undefined}
    >
      {!noTape ? <span className={styles.tape} aria-hidden="true" /> : null}
      <Media asset={asset} priority={priority} sizes={sizes} className={styles.photo} />
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  )
}
