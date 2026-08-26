import { Media } from '@/components/media/media'
import { RichText } from '@/components/rich-text/rich-text'
import { cx } from '@/lib/cx'
import type { MediaTextBlock } from '@/payload-types'
import styles from './media-text.module.css'

export function MediaText({ media, content, mediaSide }: MediaTextBlock) {
  const side = mediaSide ?? 'left'
  const mediaAsset = typeof media === 'object' ? media : null

  return (
    <section className="wrapper region">
      <div
        className={cx('switcher', styles.switcher, side === 'right' && styles.reverse)}
      >
        {mediaAsset ? (
          <Media asset={mediaAsset} sizes="(min-width: 768px) 50vw, 100vw" />
        ) : null}
        <RichText data={content} />
      </div>
    </section>
  )
}
