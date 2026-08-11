import { cx } from '@/lib/cx'
import { getNavigation } from '@/payload/globals/get-navigation'
import { getSiteSettings } from '@/payload/globals/get-site-settings'
import styles from './footer.module.css'

export async function Footer() {
  const [navigation, siteSettings] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
  ])

  return (
    <footer className={cx('flow', styles.footer)}>
      <div className="wrapper">
        <p className={styles.wordmark} aria-hidden="true">
          Power<span>Kids</span>
        </p>
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
          <div className="flow-2xs">
            <h2>Contact</h2>
            <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
            {siteSettings.phones?.map((phone) => (
              <a key={phone.id ?? phone.href} href={`tel:${phone.href}`}>
                {phone.number}
              </a>
            ))}
          </div>
          <div className="flow-2xs">
            <h2>Opening Hours</h2>
            <p>{siteSettings.openingDays}</p>
            <p>{siteSettings.openingHours}</p>
          </div>
          {siteSettings.socials?.length ? (
            <div className="flow-2xs">
              <h2>Follow Us</h2>
              <ul role="list" className="cluster">
                {siteSettings.socials.map((social) => (
                  <li key={social.id ?? social.url}>
                    <a href={social.url}>{social.platform}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
