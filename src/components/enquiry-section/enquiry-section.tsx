import { Feather, PenLine, Rocket, Sparkles, Star } from 'lucide-react'
import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import { requireEnv } from '@/lib/env'
import { getCta } from '@/payload/globals/get-cta'
import { EnquiryForm } from './enquiry-form'
import styles from './enquiry-section.module.css'

const DOODLE_ICONS = [PenLine, Feather, Star, Rocket, Sparkles]

export type EnquirySectionProps = { className?: string }

/** Red enquiry CTA, side by side with `FooterContact` inside `Footer`. */
export async function EnquirySection({ className }: EnquirySectionProps) {
  const cta = await getCta()
  const { header, types } = cta.enquiry
  const enquiryTypes = (types ?? [])
    .filter((type) => !type.hideFromForm)
    .map((type) => ({ id: type.id ?? '', label: type.label }))

  return (
    <section id="enquiry" className={cx('region', styles.section, className)}>
      <DoodleLayer zoneId="enquiry" density={30} icons={DOODLE_ICONS} />
      <div className="wrapper">
        <div className="flow max-prose">
          <SectionHeader header={header} />
          <div className={styles.card}>
            {/* JS is required — bot defence runs client-side, so there is no
             * progressive-enhancement submit path (spec §4). */}
            <noscript>
              <p>
                Please enable JavaScript to load this form, or reach us through the{' '}
                <a href="#contact">contact information below</a>.
              </p>
            </noscript>
            <EnquiryForm
              enquiryTypes={enquiryTypes}
              turnstileSiteKey={requireEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY')}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
