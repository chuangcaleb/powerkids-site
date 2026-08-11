import type { CSSProperties } from 'react'
import { Media } from '@/components/media/media'
import { cx } from '@/lib/cx'
import type { Media as MediaDoc } from '@/payload-types'
import styles from './polaroid.module.css'

export type PolaroidProps = {
  doc: MediaDoc
  /** Rendered as the figcaption. Omit for no caption strip. */
  caption?: string
  priority?: boolean
  sizes?: string
  /** Degrees to rotate the card, e.g. -3 or 5. Omit for no tilt. */
  tilt?: number
  /** Sizing is a layout concern — set it here, not in this component. */
  className?: string
}

/** White-framed, taped photo card. Sizing is the caller's job; tilt is a prop. */
export function Polaroid({
  doc,
  caption,
  priority,
  sizes,
  tilt,
  className,
}: PolaroidProps) {
  return (
    <figure
      className={cx(styles.polaroid, className)}
      style={tilt ? ({ '--polaroid-tilt': `${tilt}deg` } as CSSProperties) : undefined}
    >
      <span className={styles.tape} aria-hidden="true" />
      <Media doc={doc} priority={priority} sizes={sizes} className={styles.photo} />
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  )
}
