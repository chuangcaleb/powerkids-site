import { cx } from '@/lib/cx'
import styles from './divider.module.css'

export type DividerProps = {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return <hr className={cx(styles.divider, className)} />
}
