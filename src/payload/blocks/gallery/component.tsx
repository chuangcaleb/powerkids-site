import { Media } from '@/components/media/media'
import { SectionHeader } from '@/components/section-header/section-header'
import { getPayloadClient } from '@/lib/payload'
import type { GalleryBlock, Media as TMedia } from '@/payload-types'

const SORT: Record<NonNullable<GalleryBlock['sort']>, string> = {
  newest: '-createdAt',
  oldest: 'createdAt',
  filename: 'filename',
}

async function resolveImages(block: GalleryBlock): Promise<TMedia[]> {
  if (block.mode === 'tag') {
    if (!block.tag) return []
    const tagId = typeof block.tag === 'object' ? block.tag.id : block.tag
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'media',
      where: { tags: { contains: tagId } },
      sort: SORT[block.sort ?? 'newest'],
      depth: 0,
      limit: 100,
      overrideAccess: false,
    })
    return result.docs
  }

  return (block.images ?? []).filter(
    (asset): asset is TMedia => typeof asset === 'object',
  )
}

export async function Gallery(block: GalleryBlock) {
  const images = await resolveImages(block)

  return (
    <section className="wrapper flow region">
      <SectionHeader header={block.header} />
      <div className="grid-auto">
        {images.map((image, index) => (
          // Index in the key too: an editor can legitimately place the same
          // photo in more than one slot, which would otherwise collide.
          <Media
            key={`${image.id}-${index}`}
            asset={image}
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ))}
      </div>
    </section>
  )
}
