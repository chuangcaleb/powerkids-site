import { SectionHeader } from '@/components/section-header/section-header'
import { getSiteSettings } from '@/payload/globals/get-site-settings'
import type { ContactBlock } from '@/payload-types'

export async function Contact({ header }: ContactBlock) {
  const siteSettings = await getSiteSettings()

  return (
    <section className="wrapper flow" id="contact">
      <SectionHeader header={header} />
      <div className="switcher">
        <div className="flow-2xs">
          <p>{siteSettings.openingDays}</p>
          <p>{siteSettings.openingHours}</p>
        </div>
        <ul role="list" className="flow-2xs">
          {siteSettings.phones?.map((phone) => (
            <li key={phone.id ?? phone.href}>
              <a href={`tel:${phone.href}`}>{phone.number}</a>
            </li>
          ))}
        </ul>
        <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
        {siteSettings.socials?.length ? (
          <ul role="list" className="cluster">
            {siteSettings.socials.map((social) => (
              <li key={social.id ?? social.url}>
                <a href={social.url}>{social.platform}</a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
