import Link from 'next/link'
import { cx } from '@/lib/cx'
import { Logo } from '@/components/logo/logo'
import { Wordmark } from '@/components/wordmark/wordmark'
import styles from './nav-bar.module.css'
import type { CSSProperties } from 'react'

export type NavLink = {
  id?: string | null
  label: string
  url: string
}

export type NavBarProps = {
  links: NavLink[]
}

/** Site header. */
export function NavBar({ links }: NavBarProps) {
  return (
    <header className={styles.header}>
      <div
        className={cx('wrapper', 'repel', styles.inner)}
        style={{ '--repel-y-alignment': 'center' } as CSSProperties}
      >
        <Link
          href="/"
          aria-label="PowerKids"
          className={cx('cluster', styles.brand)}
          style={{ '--cluster-gap': 'var(--space-xs)' } as CSSProperties}
        >
          <Logo className={styles.icon} />
          <Wordmark className={styles.wordmark} />
        </Link>
        <nav aria-label="Primary" className={cx('cluster', styles.nav)}>
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
