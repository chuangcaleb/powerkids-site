import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Heading } from '@/components/heading/heading'
import { Media } from '@/components/media/media'
import { RichText } from '@/components/rich-text/rich-text'
import { getEventBySlug } from '@/payload/collections/events/get-events'
import { VideoTabs } from '@/payload/blocks/video/video-tabs'
import type { Media as MediaDoc } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

// No generateStaticParams — see the same note in src/app/(site)/[[...slug]]/page.tsx.

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return {}

  return { title: event.name, description: event.summary ?? undefined }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) notFound()

  const images = (event.gallery ?? []).filter(
    (doc): doc is MediaDoc => typeof doc === 'object',
  )

  return (
    <main className="wrapper flow">
      <Heading level={1}>{event.name}</Heading>
      {event.summary ? <p>{event.summary}</p> : null}
      {event.body ? <RichText data={event.body} /> : null}
      {event.videos?.length ? (
        <VideoTabs
          tabs={event.videos.map((video) => ({
            label: video.label,
            embedId: video.embedId,
          }))}
          posterUrl={images[0]?.url ?? ''}
        />
      ) : null}
      {images.length ? (
        <div className="grid-auto">
          {images.map((image) => (
            <Media key={image.id} doc={image} sizes="(min-width: 768px) 25vw, 50vw" />
          ))}
        </div>
      ) : null}
    </main>
  )
}
