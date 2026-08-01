import { Card } from '@/components/card/card'
import { VideoEmbed } from '@/components/video-embed/video-embed'
import { getEventById } from '@/payload/collections/events/get-events'
import type { Media as MediaDoc, VideoBlock as VideoBlockType } from '@/payload-types'

import { VideoTabs } from './video-tabs'

export async function VideoBlock({
  heading,
  source,
  embedId,
  poster,
  event,
}: VideoBlockType) {
  if (source === 'event') {
    if (!event) return null
    const eventId = typeof event === 'object' ? event.id : event
    const eventDoc = await getEventById(eventId)
    const firstImage = (eventDoc.gallery ?? []).find(
      (doc): doc is MediaDoc => typeof doc === 'object',
    )

    return (
      <section className="wrapper">
        <Card tabHeader={heading}>
          <VideoTabs
            tabs={(eventDoc.videos ?? []).map((video) => ({
              label: video.label,
              embedId: video.embedId,
            }))}
            posterUrl={firstImage?.url ?? ''}
          />
        </Card>
      </section>
    )
  }

  const posterDoc = typeof poster === 'object' ? poster : null

  if (!embedId) return null

  return (
    <section className="wrapper">
      <Card tabHeader={heading}>
        <VideoEmbed
          embedUrl={`https://www.youtube.com/embed/${embedId}`}
          title={heading ?? 'Video'}
          posterUrl={posterDoc?.url ?? ''}
        />
      </Card>
    </section>
  )
}
