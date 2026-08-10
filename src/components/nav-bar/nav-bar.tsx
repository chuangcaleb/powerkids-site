import type { ReactNode } from 'react'
import Link from 'next/link'
import { cx } from '@/lib/cx'
import styles from './nav-bar.module.css'

export type NavLink = {
  id?: string | null
  label: string
  url: string
}

export type NavBarProps = {
  logo: ReactNode
  links: NavLink[]
}

/** Site header. Nav link visual treatment (underline hover mark) lands in a later pass. */
export function NavBar({ logo, links }: NavBarProps) {
  return (
    <header className={styles.header}>
      <div className={cx('wrapper', 'repel', styles.inner)}>
        <Link href="/" className={styles.logo}>
          {logo}
        </Link>
        <nav className={styles.nav}>
          {links.map((link) => (
            <a key={link.id ?? link.url} href={link.url} className={styles.link}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
