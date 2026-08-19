import { SectionSeam } from '@/components/section-seam/section-seam'
import { cx } from '@/lib/cx'
import styles from './divider.module.css'

export type DividerProps = {
  className?: string
  /** Seeds the torn jitter — vary it if two dividers land on the same page. */
  seed?: string
}

export function Divider({ className, seed = 'divider' }: DividerProps) {
  return (
    <SectionSeam
      role="separator"
      shape="torn"
      width={1.25}
      depth={0.375}
      referenceWidth={48}
      seed={seed}
      above="var(--bg-surface)"
      below="var(--bg-surface)"
      className={cx(styles.divider, className)}
    />
  )
}
