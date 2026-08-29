import type { CSSProperties, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './sticker.module.css'

export type StickerProps = {
  children: ReactNode
  /** Tilt in degrees. */
  rotate?: number
  className?: string
}

/** Pill badge meant to straddle a `SectionDivider`, centred on its parent. */
export function Sticker({ children, rotate = -5, className }: StickerProps) {
  return (
    <span
      className={cx(styles.sticker, className)}
      style={{ '--sticker-rotate': `${rotate}deg` } as CSSProperties}
    >
      {children}
    </span>
  )
}
