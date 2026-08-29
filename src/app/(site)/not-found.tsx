import { Button } from '@/components/button/button'
import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { Heading } from '@/components/heading/heading'
import { cx } from '@/lib/cx'
import styles from './not-found.module.css'
import { SectionDivider } from '@/components/section-divider/section-divider'

export default function NotFound() {
  return (
    <>
      <main className={styles.root} data-page-bg="sun">
        <DoodleLayer zoneId="404" density={30} />
        <div className={cx('wrapper region flow', styles.content)}>
          <Heading level={1}>Looks like this page ran off to recess</Heading>
          <p className="max-lead">
            We couldn&apos;t find the page you&apos;re looking for. It might have moved,
            or the link might be off — try heading back to the homepage.
          </p>
          <Button href="/" size="lg">
            Back to homepage
          </Button>
        </div>
        <SectionDivider
          shape="pinking"
          width={13.125}
          depth={1.375}
          above="var(--bg-sun)"
          below="var(--bg-surface)"
        />
      </main>
    </>
  )
}
