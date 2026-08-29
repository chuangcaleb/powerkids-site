import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { SectionHeader } from '@/components/section-header/section-header'
import { primitiveVars } from '@/lib/primitive-vars'
import { cx } from '@/lib/cx'
import type { SiteSetting } from '@/payload-types'
import { getCta } from '@/payload/globals/get-cta'
import { getSiteSettings } from '@/payload/globals/get-site-settings'
import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiYoutube,
} from '@icons-pack/react-simple-icons'
import { Clock, Mail, Phone, Share2 } from 'lucide-react'
import type { ComponentType } from 'react'
import styles from './footer-contact.module.css'

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

export type FooterContactProps = { className?: string }

/** Blue contact-facts band inside the footer. */
export async function FooterContact({ className }: FooterContactProps) {
  const [cta, siteSettings] = await Promise.all([getCta(), getSiteSettings()])
  const { header } = cta.contact

  return (
    <section id="contact" className={cx('region', styles.contact, className)}>
      <DoodleLayer zoneId="contact" density={30} icons={DOODLE_ICONS} />
      <div className={cx('flow-xl wrapper', styles.content)}>
        <SectionHeader header={header} />
        {/* Caps at two columns: each track is forced to at least half the
            container, so auto-fill can never place a third. */}
        <div
          className="grid-auto max-prose"
          style={primitiveVars({
            '--grid-gap': 'var(--space-xl)',
            '--grid-item-min':
              'max(var(--max-heading), calc((100% - var(--grid-gap, var(--space-l))) / 2))',
          })}
        >
          <div className="flow-xs">
            <h3 className={styles.label}>
              <Clock size={18} aria-hidden="true" /> Opening hours
            </h3>
            <div className="flow-2xs">
              <p>{siteSettings.openingDays}</p>
              <p>{siteSettings.openingHours}</p>
            </div>
          </div>
          <div className="flow-xs">
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
          <div className="flow-xs">
            <h3 className={styles.label}>
              <Mail size={18} aria-hidden="true" /> Email
            </h3>
            <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
          </div>
          {siteSettings.socials?.length ? (
            <div className="flow-xs">
              <h3 className={styles.label}>
                <Share2 size={18} aria-hidden="true" /> Social Links
              </h3>
              <ul role="list" className="flow-2xs">
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
                      <a
                        href={social.url}
                        className={cx('cluster', styles.social)}
                        style={primitiveVars({ '--cluster-gap': 'var(--space-2xs)' })}
                      >
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
