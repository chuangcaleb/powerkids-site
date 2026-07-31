import styles from './divider.module.css'

export type DividerProps = {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return <hr className={[styles.divider, className].filter(Boolean).join(' ')} />
}
