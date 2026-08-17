import { Feather, PenLine, Rocket, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/button/button'
import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import { getCta } from '@/payload/globals/get-cta'
import styles from './registration-section.module.css'

const DOODLE_ICONS = [PenLine, Feather, Star, Rocket, Sparkles]

export type RegistrationSectionProps = { className?: string }

/** Red registration CTA, side by side with `FooterContact` inside `Footer`. */
export async function RegistrationSection({ className }: RegistrationSectionProps) {
  const cta = await getCta()
  const { header, button } = cta.registration

  return (
    <section className={cx('region', styles.section, className)}>
      <DoodleLayer zoneId="registration" density={30} icons={DOODLE_ICONS} />
      <div className={cx('flow', 'wrapper', styles.content)}>
        <SectionHeader header={header} />
        {button?.label && button.url ? (
          <Button href={button.url} variant="outline">
            {button.label}
          </Button>
        ) : null}
      </div>
    </section>
  )
}
