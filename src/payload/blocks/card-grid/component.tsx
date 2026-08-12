import { Card } from '@/components/card/card'
import { Heading } from '@/components/heading/heading'
import { Media } from '@/components/media/media'
import { SectionHeader } from '@/components/section-header/section-header'
import type { CardGridBlock, Media as MediaDoc } from '@/payload-types'

type CardItem = {
  id: string | number
  heading: string
  body?: string | null
  image?: MediaDoc | null
  url?: string | null
}

function resolveCards(block: CardGridBlock): CardItem[] {
  return (block.cards ?? []).map((card) => ({
    id: card.id ?? card.heading,
    heading: card.heading,
    body: card.body,
    image: typeof card.image === 'object' ? card.image : null,
    url: card.url,
  }))
}

export function CardGrid(block: CardGridBlock) {
  const cards = resolveCards(block)

  return (
    <section className="wrapper flow">
      <SectionHeader header={block.header} />
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
