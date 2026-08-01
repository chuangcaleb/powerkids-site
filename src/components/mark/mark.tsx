import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './mark.module.css'

export type MarkProps = {
  color?: 'red' | 'blue'
  children: ReactNode
  className?: string
}

export function Mark({ color = 'red', children, className }: MarkProps) {
  return <mark className={cx(styles.mark, styles[color], className)}>{children}</mark>
}
