import { Card } from '@/components/card/card'
import { Heading } from '@/components/heading/heading'
import { Media } from '@/components/media/media'
import { getEvents } from '@/payload/collections/events/get-events'
import { getPrograms } from '@/payload/collections/programs/get-programs'
import type { CardGridBlock, Media as MediaDoc } from '@/payload-types'

type CardItem = {
  id: string | number
  heading: string
  body?: string | null
  image?: MediaDoc | null
  url?: string | null
}

async function resolveCards(block: CardGridBlock): Promise<CardItem[]> {
  if (block.source === 'programs') {
    const programs = await getPrograms()
    return programs.map((program) => ({
      id: program.id,
      heading: program.name,
      body: program.strapline ?? program.summary,
      image: typeof program.image === 'object' ? program.image : null,
      url: `/programs/${program.slug}`,
    }))
  }

  if (block.source === 'events') {
    const events = await getEvents()
    return events.map((event) => ({
      id: event.id,
      heading: event.name,
      body: event.summary,
      image:
        event.gallery?.find((doc): doc is MediaDoc => typeof doc === 'object') ?? null,
      url: `/events/${event.slug}`,
    }))
  }

  return (block.cards ?? []).map((card) => ({
    id: card.id ?? card.heading,
    heading: card.heading,
    body: card.body,
    image: typeof card.image === 'object' ? card.image : null,
    url: card.url,
  }))
}

export async function CardGrid(block: CardGridBlock) {
  const cards = await resolveCards(block)

  return (
    <section className="wrapper flow">
      {block.heading ? <Heading level={2}>{block.heading}</Heading> : null}
      <div className="grid-auto">
        {cards.map((card, index) => (
          <Card key={`${card.id}-${index}`}>
            {card.image ? (
              <Media doc={card.image} sizes="(min-width: 768px) 33vw, 100vw" />
            ) : null}
            <Heading level={3}>
              {card.url ? <a href={card.url}>{card.heading}</a> : card.heading}
            </Heading>
            {card.body ? <p>{card.body}</p> : null}
          </Card>
        ))}
      </div>
    </section>
  )
}
