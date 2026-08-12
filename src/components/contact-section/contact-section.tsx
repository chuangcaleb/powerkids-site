import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiYoutube,
} from '@icons-pack/react-simple-icons'
import { Clock, Mail, Phone, Share2 } from 'lucide-react'
import type { ComponentType } from 'react'
import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import { getCta } from '@/payload/globals/get-cta'
import { getSiteSettings } from '@/payload/globals/get-site-settings'
import type { SiteSetting } from '@/payload-types'
import styles from './contact-section.module.css'

const DOODLE_ICONS = [Mail, Phone, Clock, Share2]

type SocialPlatform = NonNullable<SiteSetting['socials']>[number]['platform']

const socialIcons: Record<
  SocialPlatform,
  ComponentType<{ size?: number; title?: string; 'aria-hidden'?: boolean }>
> = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  youtube: SiYoutube,
  tiktok: SiTiktok,
}

/** Blue contact facts landing at the end of every page, after the polaroid reel. */
export async function ContactSection() {
  const [cta, siteSettings] = await Promise.all([getCta(), getSiteSettings()])
  const { header } = cta.contact

  return (
    <section className={styles.section}>
      <DoodleLayer zoneId="contact" density={30} icons={DOODLE_ICONS} />
      <div className={cx('wrapper flow', styles.content)}>
        <SectionHeader header={header} />
        <div className={cx('grid-auto', styles.grid)}>
          <div className="flow-2xs">
            <h3 className={styles.label}>
              <Clock size={18} aria-hidden="true" /> Opening hours
            </h3>
            <p>{siteSettings.openingDays}</p>
            <p>{siteSettings.openingHours}</p>
          </div>
          <div className="flow-2xs">
            <h3 className={styles.label}>
              <Phone size={18} aria-hidden="true" /> Call us
            </h3>
            <ul role="list" className="flow-2xs">
              {siteSettings.phones?.map((phone) => (
                <li key={phone.id ?? phone.href}>
                  <a href={`tel:${phone.href}`}>{phone.number}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flow-2xs">
            <h3 className={styles.label}>
              <Mail size={18} aria-hidden="true" /> Email
            </h3>
            <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
          </div>
          {siteSettings.socials?.length ? (
            <div className="flow-2xs">
              <h3 className={styles.label}>
                <Share2 size={18} aria-hidden="true" /> Follow along
              </h3>
              <ul role="list" className="cluster">
                {siteSettings.socials.map((social) => {
                  const Icon:
                    | ComponentType<{
                        size?: number
                        title?: string
                        'aria-hidden'?: boolean
                      }>
                    | undefined = socialIcons[social.platform]
                  if (!Icon) return null
                  return (
                    <li key={social.id ?? social.url}>
                      <a href={social.url} className={styles.social}>
                        <Icon size={20} title="" aria-hidden={true} />
                        {social.platform}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
