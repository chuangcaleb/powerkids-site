import { Polaroid } from '@/components/polaroid/polaroid'
import type { Media } from '@/payload-types'
import styles from './polaroid-reel.module.css'

export type PolaroidReelProps = {
  photos: Media[]
}

/** Horizontal scroll-snap strip of Polaroids. Renders nothing when empty. */
export function PolaroidReel({ photos }: PolaroidReelProps) {
  if (photos.length === 0) return null

  return (
    <ul role="list" className={styles.strip}>
      {photos.map((photo, index) => (
        <li key={photo.id} className={styles.item}>
          <Polaroid
            doc={photo}
            tilt={index % 2 === 0 ? -4 : 3}
            noTape
            className={styles.polaroid}
          />
        </li>
      ))}
    </ul>
  )
}
