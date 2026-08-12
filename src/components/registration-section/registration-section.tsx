import { Button } from '@/components/button/button'
import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import { getCta } from '@/payload/globals/get-cta'
import styles from './registration-section.module.css'

/** Red registration CTA landing at the end of every page. */
export async function RegistrationSection() {
  const cta = await getCta()
  const { header, button } = cta.registration

  return (
    <section className={styles.section}>
      <div className={cx('wrapper flow', styles.content)}>
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
