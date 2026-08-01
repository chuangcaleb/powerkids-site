import { Button } from '@/components/button/button'
import { Heading } from '@/components/heading/heading'
import { Media } from '@/components/media/media'
import type { Page } from '@/payload-types'

export type HeroProps = { hero: Page['hero'] }

/** Every page's always-present opener. Not one of the 11 `layout` blocks — see docs/architecture/blocks.md. */
export function Hero({ hero }: HeroProps) {
  if (hero.type === 'none') return null

  const media =
    hero.type === 'highImpact' && hero.media && typeof hero.media === 'object'
      ? hero.media
      : null

  return (
    <section className="wrapper flow">
      {hero.heading ? <Heading level={1}>{hero.heading}</Heading> : null}
      {hero.subheading ? <p>{hero.subheading}</p> : null}
      {hero.ctas?.length ? (
        <div className="cluster">
          {hero.ctas.map((cta) => (
            <Button key={cta.id ?? cta.url} href={cta.url}>
              {cta.label}
            </Button>
          ))}
        </div>
      ) : null}
      {media ? <Media doc={media} priority sizes="100vw" /> : null}
    </section>
  )
}
