import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import type { ScrapbookBlock as ScrapbookBlockType } from '@/payload-types'
import { resolveCollageItems, resolveSeed } from './normalize-items'
import { ScrapbookCollage } from './scrapbook-collage'
import styles from './scrapbook.module.css'

/**
 * Photo-collage recap of past activity. The lane count, packing and
 * reel/stacked fallback all depend on measured, rendered heights, so the
 * interactive part lives in the client `ScrapbookCollage` — this component
 * only resolves CMS data into plain props and renders the section shell
 * (doodles, texture, header) that's the same regardless of mode.
 */
export function Scrapbook({ header, items, id, seed: storedSeed }: ScrapbookBlockType) {
  const resolvedItems = resolveCollageItems(items)

  if (resolvedItems.length === 0) return null

  const seed = resolveSeed(storedSeed, id)

  return (
    <section className={cx('flow-xl', 'region', styles.scrapbook)}>
      <div className={cx('dot-grid-edge-fade', styles.texture)} aria-hidden="true" />
      <div className={cx('wrapper flow', styles.header)}>
        <SectionHeader header={header} />
      </div>
      <ScrapbookCollage items={resolvedItems} seed={seed} />
    </section>
  )
}
