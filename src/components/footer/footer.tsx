import { cx } from '@/lib/cx'
import { Logo } from '@/components/logo/logo'
import { Wordmark } from '@/components/wordmark/wordmark'
import { getNavigation } from '@/payload/globals/get-navigation'
import styles from './footer.module.css'

export async function Footer() {
  const navigation = await getNavigation()

  return (
    <footer className={cx('flow', styles.footer)}>
      <div className="wrapper">
        <div className={cx('switcher', styles.brand)} aria-hidden="true">
          <Logo className={styles.icon} />
          <Wordmark variant="stroke" className={styles.wordmark} />
        </div>
        <div className="switcher">
          {(navigation.footerColumns ?? []).map((column) => (
            <div key={column.id ?? column.heading} className="flow-2xs">
              <h2>{column.heading}</h2>
              <ul role="list" className="flow-2xs">
                {(column.links ?? []).map((link) => (
                  <li key={link.id ?? link.url}>
                    <a href={link.url}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
