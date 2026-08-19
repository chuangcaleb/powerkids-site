import { Wordmark } from '@/components/wordmark/wordmark'
import { cx } from '@/lib/cx'
import { getNavigation } from '@/payload/globals/get-navigation'
import styles from './footer-nav.module.css'
import { Logo } from '@/components/logo/logo'

/** Dark band: giant outline wordmark over the footer-columns link grid. */
export async function FooterNav() {
  const navigation = await getNavigation()

  return (
    <div className={cx('flow', styles.links)}>
      <div className="wrapper flow-2xl">
        <div className={cx('switcher', styles.brand)} aria-hidden="true">
          <Logo className={styles.icon} />
          <Wordmark variant="stroke" className={styles.wordmark} />
        </div>
        <nav aria-label="Footer" className={cx('grid-auto', styles.cols)}>
          {(navigation.footerColumns ?? []).map((column) => (
            <div key={column.id ?? column.heading} className="flow-xs">
              <h2 className={styles.heading}>{column.heading}</h2>
              <ul role="list" className="flow-2xs">
                {(column.links ?? []).map((link) => (
                  <li key={link.id ?? link.url}>
                    <a href={link.url}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
