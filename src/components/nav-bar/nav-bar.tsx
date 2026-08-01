import type { ReactNode } from 'react'
import Link from 'next/link'
import { cx } from '@/lib/cx'
import styles from './nav-bar.module.css'

export type NavLink = {
  href: string
  label: string
}

export type NavBarProps = {
  logo: ReactNode
  links: NavLink[]
}

/** Desktop header nav. Mobile drawer is a later phase — see docs/design/components.md. */
export function NavBar({ logo, links }: NavBarProps) {
  return (
    <header className={styles.header}>
      <div className={cx('wrapper', 'repel', styles.inner)}>
        <Link href="/" className={styles.logo}>
          {logo}
        </Link>
        <ul role="list" className={cx('cluster', styles.links)}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
