import type { ReactNode } from 'react'
import Link from 'next/link'
import { cx } from '@/lib/cx'
import styles from './nav-bar.module.css'

export type NavBarProps = {
  logo: ReactNode
}

/** Site header. Nav links return in a later phase — see docs/design/components.md. */
export function NavBar({ logo }: NavBarProps) {
  return (
    <header className={styles.header}>
      <div className={cx('wrapper', 'repel', styles.inner)}>
        <Link href="/" className={styles.logo}>
          {logo}
        </Link>
      </div>
    </header>
  )
}
