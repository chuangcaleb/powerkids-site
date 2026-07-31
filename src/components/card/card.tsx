import type { ReactNode } from 'react'
import styles from './card.module.css'

export type CardProps = {
  children: ReactNode
  /** Rendered as a squared-off tab sitting above the card, file-tab style. */
  tabHeader?: ReactNode
  className?: string
}

export function Card({ children, tabHeader, className }: CardProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {tabHeader ? <div className={styles.tabHeader}>{tabHeader}</div> : null}
      <div className={tabHeader ? styles.bodyWithTab : styles.body}>{children}</div>
    </div>
  )
}
