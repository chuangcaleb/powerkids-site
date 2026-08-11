import { Button } from '@/components/button/button'
import { Heading } from '@/components/heading/heading'
import { cx } from '@/lib/cx'
import type { CtaBannerBlock } from '@/payload-types'
import styles from './cta-banner.module.css'

export function CtaBanner({ heading, body, cta }: CtaBannerBlock) {
  return (
    <section className={cx('wrapper', styles.section)}>
      <span className={styles.rays} aria-hidden="true" />
      <div className={cx('repel', styles.content)}>
        <div className="flow">
          <Heading level={2}>{heading}</Heading>
          {body ? <p>{body}</p> : null}
        </div>
        <Button href={cta.url} variant="outline">
          {cta.label}
        </Button>
      </div>
    </section>
  )
}
