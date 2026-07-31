import type { ReactNode } from 'react'
import styles from './mark.module.css'

export type MarkProps = {
  color?: 'red' | 'blue'
  children: ReactNode
  className?: string
}

export function Mark({ color = 'red', children, className }: MarkProps) {
  const classes = [styles.mark, styles[color], className].filter(Boolean).join(' ')
  return <mark className={classes}>{children}</mark>
}
