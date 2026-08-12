import { Button } from '@/components/button/button'
import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import type { CtaBannerBlock } from '@/payload-types'
import styles from './cta-banner.module.css'

export function CtaBanner({ header, body, cta }: CtaBannerBlock) {
  return (
    <section className={cx('wrapper', styles.section)}>
      <span className={styles.rays} aria-hidden="true" />
      <div className={cx('repel', styles.content)}>
        <div className="flow">
          <SectionHeader header={header} />
          {body ? <p>{body}</p> : null}
        </div>
        <Button href={cta.url} variant="outline">
          {cta.label}
        </Button>
      </div>
    </section>
  )
}
