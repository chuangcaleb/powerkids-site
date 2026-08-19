import { cx } from '@/lib/cx'
import styles from './wordmark.module.css'

export type WordmarkProps = {
  variant?: 'solid' | 'stroke'
  className?: string
}

/**
 * Fixed "PowerKids" display convention — see docs/architecture/content-model.md.
 * Not CMS content: brand name is never a prop.
 */
export function Wordmark({ variant = 'solid', className }: WordmarkProps) {
  return (
    <span className={cx(styles.wordmark, styles[variant], className)} aria-hidden="true">
      <span className={styles.red}>Power</span>
      <span className={styles.blue}>Kids</span>
    </span>
  )
}
