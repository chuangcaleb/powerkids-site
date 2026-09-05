import { Feather, PenLine, Rocket, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/button/button'
import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import { isProduction } from '@/lib/env'
import { getCta } from '@/payload/globals/get-cta'
import { EnquiryPrototypeSwitcher } from './enquiry-prototype/enquiry-prototype-switcher'
import styles from './registration-section.module.css'

const DOODLE_ICONS = [PenLine, Feather, Star, Rocket, Sparkles]

export type RegistrationSectionProps = { className?: string }

/** Red registration CTA, side by side with `FooterContact` inside `Footer`. */
export async function RegistrationSection({ className }: RegistrationSectionProps) {
  const cta = await getCta()
  const { header, button } = cta.registration

  return (
    <section id="register" className={cx('region', styles.section, className)}>
      <DoodleLayer zoneId="registration" density={30} icons={DOODLE_ICONS} />
      <div className={cx('wrapper ', styles.content)}>
        {!isProduction ? (
          // PROTOTYPE — throwaway, ticket #29. Delete this branch once the
          // Enquiry form ships; see enquiry-prototype/ for the variants.
          <EnquiryPrototypeSwitcher header={header} />
        ) : (
          <div className="flow max-prose">
            <SectionHeader header={header} />
            {button?.label && button.url ? (
              <Button href={button.url} variant="outline">
                {button.label}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
