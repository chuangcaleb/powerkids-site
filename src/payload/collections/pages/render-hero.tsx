import type { ReactNode } from 'react'
import { Button } from '@/components/button/button'
import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { Heading } from '@/components/heading/heading'
import { Polaroid } from '@/components/polaroid/polaroid'
import { cx } from '@/lib/cx'
import { primitiveVars } from '@/lib/primitive-vars'
import type { Page } from '@/payload-types'
import styles from './render-hero.module.css'

export type HeroProps = { hero: Page['hero'] }

/**
 * D-09: `Centre` and `Heart` get the tilted box highlight anywhere they
 * appear in the hero headline. `hero.heading` is a plain `text` field (no
 * richText), so this matches whole words in the string rather than needing a
 * schema change — it's a fixed design rule, not per-page markup an editor authors,
 * so it doesn't conflict with "content is data, never markup".
 *
 * This is panel3.html's `.hl` box style, deliberately not the shared `Mark`
 * double-underline — per 06-baseline-config.md, general heading emphasis
 * uses the hand-drawn underline, while the hero headline specifically uses
 * this marker-highlight box. Two distinct mechanisms for two contexts.
 */
const HIGHLIGHT_WORDS: Record<string, 'red' | 'blue'> = {
  centre: 'blue',
  heart: 'red',
}

const HIGHLIGHT_CLASS: Record<'red' | 'blue', string | undefined> = {
  blue: styles.highlightBlue,
  red: styles.highlightRed,
}

function highlightHeading(text: string): ReactNode[] {
  return text.split(/(\b\w+\b)/).map((part, index) => {
    const color = HIGHLIGHT_WORDS[part.toLowerCase()]
    if (!color) return part
    return (
      <span key={index} className={cx(styles.highlight, HIGHLIGHT_CLASS[color])}>
        {part}
      </span>
    )
  })
}

/** Every page's always-present opener. Not one of the 11 `layout` blocks — see docs/architecture/blocks.md. */
export function Hero({ hero }: HeroProps) {
  if (hero.type === 'none') return null

  const media =
    hero.type === 'highImpact' && hero.media && typeof hero.media === 'object'
      ? hero.media
      : null

  return (
    <section className={styles.hero} id="hero">
      <div className={cx('dot-grid-edge-fade', styles.texture)} aria-hidden="true" />
      <DoodleLayer zoneId="hero" density={50} />
      <div
        className={cx('wrapper', 'region-2xl', styles.content)}
        style={primitiveVars({
          '--sidebar-size': '43%',
          '--sidebar-gap': 'var(--space-xl)',
          '--sidebar-wrap-at': '51%',
          '--sidebar-align': 'center',
        })}
      >
        <div className={cx('flow', styles.copy)}>
          {hero.heading ? (
            <Heading level={1}>{highlightHeading(hero.heading)}</Heading>
          ) : null}
          {hero.subheading ? <p>{hero.subheading}</p> : null}
          {hero.ctas?.length ? (
            <div
              className="cluster"
              style={primitiveVars({ '--cluster-gap': 'var(--space-s)' })}
            >
              {hero.ctas.map((cta, index) => (
                <Button
                  key={cta.id ?? cta.url}
                  href={cta.url}
                  variant={index === 0 ? 'red' : 'outline'}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
        {media ? (
          <div className="sidebar">
            <Polaroid
              asset={media}
              caption={media.alt}
              priority
              sizes="(min-width: 40rem) 45vw, 100vw"
              tilt={-3}
              className="max-lead"
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
