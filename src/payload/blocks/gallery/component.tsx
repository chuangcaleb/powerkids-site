import { Heading } from '@/components/heading/heading'
import { Media } from '@/components/media/media'
import { getEventById } from '@/payload/collections/events/get-events'
import type { GalleryBlock, Media as MediaDoc } from '@/payload-types'

async function resolveImages(block: GalleryBlock): Promise<MediaDoc[]> {
  if (block.source === 'event') {
    if (!block.event) return []
    const eventId = typeof block.event === 'object' ? block.event.id : block.event
    const event = await getEventById(eventId)
    return (event.gallery ?? []).filter((doc): doc is MediaDoc => typeof doc === 'object')
  }

  return (block.images ?? []).filter((doc): doc is MediaDoc => typeof doc === 'object')
}

export async function Gallery(block: GalleryBlock) {
  const images = await resolveImages(block)

  return (
    <section className="wrapper flow">
      {block.heading ? <Heading level={2}>{block.heading}</Heading> : null}
      <div className="grid-auto">
        {images.map((image, index) => (
          // Index in the key too: an editor can legitimately place the same
          // photo in more than one slot, which would otherwise collide.
          <Media
            key={`${image.id}-${index}`}
            doc={image}
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ))}
      </div>
    </section>
  )
}
