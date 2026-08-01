import { getNavigation } from '@/payload/globals/get-navigation'
import { getSiteSettings } from '@/payload/globals/get-site-settings'

export async function Footer() {
  const [navigation, siteSettings] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
  ])

  return (
    <footer className="wrapper">
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
          <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
          {siteSettings.phones?.map((phone) => (
            <a key={phone.id ?? phone.href} href={`tel:${phone.href}`}>
              {phone.number}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
