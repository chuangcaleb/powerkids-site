import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import type {
  Media as MediaDoc,
  ScrapbookBlock as ScrapbookBlockType,
} from '@/payload-types'
import type { CollageItem } from './scrapbook-collage'
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
  const resolvedItems: CollageItem[] = (items ?? [])
    .map((item) => ({
      id: item.id ?? '',
      header: {
        heading: item.header?.heading ?? null,
        lead: item.header?.lead ?? null,
        accent: item.header?.accent ?? 'neutral',
      },
      button: item.button,
      photos: (item.media ?? [])
        .filter((media): media is MediaDoc => typeof media === 'object')
        .filter((doc) => doc.width && doc.height)
        .map((doc) => ({
          id: String(doc.id),
          doc,
          aspectRatio: doc.width! / doc.height!,
        })),
    }))
    .filter((item) => item.photos.length > 0)

  if (resolvedItems.length === 0) return null

  // Editor-controlled via the "Shuffle layout" button (see seed-field.tsx),
  // stored on the block rather than left implicit — otherwise the only way
  // to change the arrangement would be to edit content and re-trigger a
  // build, and the id-derived fallback would silently reshuffle any time the
  // block's id itself changes (e.g. duplicating the block).
  const seed = storedSeed || `scrapbook-${id ?? 'preview'}`

  return (
    <section className={styles.scrapbook}>
      <div className={styles.texture} aria-hidden="true" />
      {/*
        Reused unmodified: no negative-space rejection step. The prototype
        added one (marks re-rolled until they miss the packed cells), but
        that needs real layout rects at render time, which is exactly what
        DoodleLayer's own placement deliberately avoids (see its comment) to
        keep server and client output identical. A stray mark landing on a
        low-opacity photo under this layer is a minor cosmetic miss, not a
        hydration bug, so the simpler, safer component wins here.
      */}
      <DoodleLayer zoneId={`${seed}-doodles`} density={80} />
      <div className={cx('wrapper', styles.header)}>
        <SectionHeader header={header} />
      </div>
      <ScrapbookCollage items={resolvedItems} seed={seed} />
    </section>
  )
}
