import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Accordion } from '@/components/accordion/accordion'
import { MapBoxPrototypeSection } from '@/components/footer/footer-contact/prototype-map-box/map-box-prototype-section'
import { Button } from '@/components/button/button'
import { Card } from '@/components/card/card'
import { Divider } from '@/components/divider/divider'
import { DoodleLayer } from '@/components/doodle-layer/doodle-layer'
import { Heading } from '@/components/heading/heading'
import { Mark } from '@/components/mark/mark'
import { NavBar } from '@/components/nav-bar/nav-bar'
import { Pill } from '@/components/pill/pill'
import { VideoEmbed } from '@/components/video-embed/video-embed'
import { cx } from '@/lib/cx'
import { isProduction } from '@/lib/env'
import { primitiveVars } from '@/lib/primitive-vars'
import { Content } from '@/payload/blocks/content/component'
import { FramedRows } from '@/payload/blocks/framed-rows/component'
import { Gallery } from '@/payload/blocks/gallery/component'
import { Scrapbook } from '@/payload/blocks/scrapbook/component'
import type { Media } from '@/payload-types'
import styles from './kitchen-sink.module.css'

const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [
      { type: 'paragraph', children: [{ type: 'text', text, version: 1 }], version: 1 },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const COLOURS = [
  { name: '--bg-surface', var: '--bg-surface' },
  { name: '--text-strong', var: '--text-strong' },
  { name: '--text-body', var: '--text-body' },
  { name: '--text-muted', var: '--text-muted' },
  { name: '--border-strong', var: '--border-strong' },
  { name: '--accent-red', var: '--accent-red' },
  { name: '--accent-blue', var: '--accent-blue' },
  { name: '--accent-amber', var: '--accent-amber' },
  { name: '--accent-red-fill', var: '--accent-red-fill' },
  { name: '--accent-blue-fill', var: '--accent-blue-fill' },
  { name: '--accent-amber-fill', var: '--accent-amber-fill' },
]

const TYPE_STEPS = [-2, -1, 0, 1, 2, 3, 4, 5]
const SPACE_STEPS = ['3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl']

/** Inline SVG, so the demo needs no remote image domain — `next/image` skips the loader entirely for `data:` sources. */
function samplePhoto(id: number, width: number, height: number, fill: string): Media {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='${fill}'/%3E%3C/svg%3E`
  return {
    id,
    alt: 'Decorative placeholder photo',
    url: `data:image/svg+xml,${svg}`,
    width,
    height,
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
  }
}

const ACCORDION_ITEMS = [
  {
    id: 'a',
    trigger: 'What ages does PowerKids accept?',
    children: 'Sample answer copy.',
  },
  { id: 'b', trigger: 'What are the school hours?', children: 'Sample answer copy.' },
  { id: 'c', trigger: 'How do I register?', children: 'Sample answer copy.' },
]

/**
 * Every token, primitive, and component variant on one page — how visual
 * regressions get caught before a reviewer sees them. Kept out of production
 * with a request-time 404 rather than a build-time exclusion: simplest thing
 * that actually works with the App Router's route structure, and this route
 * has no data dependencies that would make a real page in prod anyway.
 */
export default function KitchenSinkPage() {
  if (isProduction) notFound()

  return (
    <main className="flow-2xl">
      <div className="wrapper">
        <Heading level={1}>Kitchen sink</Heading>
      </div>

      <section className="flow wrapper">
        <Heading level={2}>Colour</Heading>
        <div className="cluster">
          {COLOURS.map((colour) => (
            <div key={colour.name} className={cx('flow-3xs', styles.swatch)}>
              <div
                className={styles.swatchFill}
                style={{ backgroundColor: `var(${colour.var})` }}
              />
              <code>{colour.name}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="flow wrapper">
        <Heading level={2}>Type scale</Heading>
        <div className="flow-s">
          {TYPE_STEPS.map((step) => (
            <p key={step} style={{ fontSize: `var(--step-${step})`, margin: 0 }}>
              step {step} — The quick brown fox
            </p>
          ))}
        </div>
      </section>

      <section className="flow wrapper">
        <Heading level={2}>Space scale</Heading>
        <div className="flow-2xs">
          {SPACE_STEPS.map((step) => (
            <div
              key={step}
              className="cluster"
              style={primitiveVars({ '--cluster-gap': 'var(--space-s)' })}
            >
              <code>{step}</code>
              <div
                className={styles.spaceBar}
                style={{ width: `var(--space-${step})` }}
              />
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section className="flow wrapper">
        <Heading level={2}>Button</Heading>
        <div className="cluster">
          <Button variant="red">Red</Button>
          <Button variant="blue">Blue</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="cluster">
          <Button variant="red" size="sm">
            Small
          </Button>
          <Button variant="red" size="md">
            Medium
          </Button>
          <Button variant="red" size="lg">
            Large
          </Button>
        </div>
      </section>

      <section className="flow wrapper">
        <Heading level={2}>Card</Heading>
        <div className="cluster">
          <Card>
            <Heading level={3}>Default card</Heading>
            <p>Card body copy.</p>
          </Card>
          <Card tabHeader={<Heading level={3}>Tab header</Heading>}>
            <p>Card body copy, tab-header variant.</p>
          </Card>
        </div>
      </section>

      <section className="flow wrapper">
        <Heading level={2}>Heading</Heading>
        <div className="flow-s">
          <Heading level={1}>Level 1</Heading>
          <Heading level={2}>Level 2</Heading>
          <Heading level={3}>Level 3</Heading>
          <Heading level={4}>Level 4</Heading>
          <Heading level={5}>Level 5</Heading>
          <Heading level={6}>Level 6</Heading>
        </div>
      </section>

      <section className="flow wrapper">
        <Heading level={2}>Mark</Heading>
        <p>
          Double underline in <Mark color="red">red</Mark> and{' '}
          <Mark color="blue">blue</Mark>.
        </p>
      </section>

      <section className="flow wrapper">
        <Heading level={2}>Pill</Heading>
        <div className="cluster">
          <Pill>Neutral</Pill>
          <Pill variant="red">Red</Pill>
          <Pill variant="blue">Blue</Pill>
          <Pill variant="amber">Amber</Pill>
          <Pill href="#">Link pill</Pill>
        </div>
      </section>

      <section className="flow wrapper">
        <Heading level={2}>DoodleLayer</Heading>
        <div className={styles.doodleDemo}>
          <DoodleLayer zoneId="kitchen-sink-doodle-demo" />
        </div>
      </section>

      <section className="flow wrapper">
        <Heading level={2}>Accordion</Heading>
        <Accordion items={ACCORDION_ITEMS} />
      </section>

      <section className="flow wrapper">
        <Heading level={2}>NavBar</Heading>
        <NavBar
          links={[
            { label: 'About', url: '#about' },
            { label: 'Programs', url: '#programs' },
            { label: 'Events', url: '#events' },
            { label: 'Contact', url: '#contact' },
          ]}
        />
      </section>

      <section className="flow wrapper">
        <Heading level={2}>VideoEmbed</Heading>
        <div style={{ maxWidth: '32rem' }}>
          <VideoEmbed
            embedUrl="https://www.youtube-nocookie.com/embed/placeholder"
            title="Sample video"
            posterUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%230000eb'/%3E%3C/svg%3E"
          />
        </div>
      </section>

      <section className="flow wrapper">
        <Heading level={2}>Map box prototype (issue #18)</Heading>
        <p>
          Footer-blue background dropped for the prototype — real placement uses
          `.contact`.
        </p>
        <Suspense fallback={null}>
          <MapBoxPrototypeSection />
        </Suspense>
      </section>

      <section className="flow">
        <div className="wrapper">
          <Heading level={2}>FramedRows block</Heading>
        </div>
        <FramedRows
          header={{
            heading: richText('Fun learning is our serious business.'),
          }}
          blockType="framed-rows"
          rows={[
            {
              title: 'Morning School',
              body: richText(
                'Essential early childhood education for children from Ages 2–6 — play, phonics, numbers, and a lot of singing.',
              ),
              eyebrow: '7:30am - 1:00pm',
              icon: 'sunrise',
              image: null,
            },
            {
              title: 'After School Program',
              body: richText('Homework support, enrichment activities, and a hot meal.'),
              eyebrow: '1:00pm - 6:00pm',
              icon: 'sun',
              image: null,
            },
            {
              title: 'Evening Daycare',
              body: richText(
                'A calm, supervised space for kids whose parents work late.',
              ),
              eyebrow: '6:00pm - 9:00pm',
              icon: 'sunset',
              image: null,
            },
            {
              title: 'Holiday Camp',
              body: richText('Themed weeks of activities during school breaks.'),
              eyebrow: 'School holidays',
              icon: 'rocket',
              image: null,
            },
          ]}
        />
      </section>

      <section className="flow">
        <div className="wrapper">
          <Heading level={2}>Scrapbook block</Heading>
        </div>
        <Scrapbook
          id="kitchen-sink-scrapbook"
          blockType="scrapbook"
          header={{
            heading: richText("What we've been up to"),
            lead: richText('Camps, showcases and the odd messy afternoon.'),
          }}
          items={[
            {
              id: 'camp',
              header: { heading: richText('Holiday Robotics Camp') },
              button: { label: 'See the camp', url: '#' },
              icons: ['Rocket', 'Star', 'Sparkles'],
              media: [
                samplePhoto(1, 960, 540, '%232434e8'),
                samplePhoto(2, 800, 600, '%23e12c2c'),
                samplePhoto(3, 900, 600, '%23fdeeda'),
                samplePhoto(4, 960, 540, '%234c433a'),
                samplePhoto(5, 600, 800, '%232434e8'),
              ],
            },
            {
              id: 'showcase',
              header: { heading: richText('Year-End Showcase') },
              button: { label: 'Watch highlights', url: '#' },
              media: [
                samplePhoto(6, 800, 600, '%23e12c2c'),
                samplePhoto(7, 960, 540, '%23fdeeda'),
                samplePhoto(8, 900, 600, '%234c433a'),
              ],
            },
            // Extreme case: a single photo, to check the packer and reel both hold with one item.
            {
              id: 'reading-corner',
              header: { heading: richText('Reading Corner') },
              media: [samplePhoto(9, 700, 700, '%232434e8')],
            },
          ]}
        />
      </section>

      <section className="flow">
        <div className="wrapper">
          <Heading level={2}>Gallery block</Heading>
        </div>
        {/* Extreme case: 20 images, unknown final count is the whole point of the block. */}
        <Gallery
          id="kitchen-sink-gallery-extreme"
          blockType="gallery"
          mode="manual"
          header={{ heading: richText('Extreme: 20 images') }}
          images={Array.from({ length: 20 }, (_, index) =>
            samplePhoto(
              100 + index,
              600,
              400,
              index % 2 === 0 ? '%232434e8' : '%23e12c2c',
            ),
          )}
        />
        {/* Minimal case: no header, no images. */}
        <Gallery
          id="kitchen-sink-gallery-minimal"
          blockType="gallery"
          mode="manual"
          images={[]}
        />
      </section>

      <section className="flow">
        <div className="wrapper">
          <Heading level={2}>Content block</Heading>
        </div>
        {/* Extreme case: 90-char heading, long body copy. */}
        <Content
          id="kitchen-sink-content-extreme"
          blockType="content"
          header={{
            heading: richText(
              'A ninety character heading exists to prove wrapping holds even at this length here',
            ),
          }}
          columns={[
            {
              size: 'full',
              variant: 'align-start',
              richText: richText(
                'Long body copy repeated to check the column does not overflow or clip. '.repeat(
                  6,
                ),
              ),
            },
          ]}
        />
        {/* Minimal case: no header, column with no richText and no media. */}
        <Content
          id="kitchen-sink-content-minimal"
          blockType="content"
          columns={[{ size: 'full', variant: 'align-start' }]}
        />
      </section>

      <section className="flow wrapper">
        <Heading level={2}>Layout primitives</Heading>
        <div className="flow-s">
          <p>
            <code>.switcher</code>
          </p>
          <div className="switcher">
            <div className={styles.box}>One</div>
            <div className={styles.box}>Two</div>
          </div>
          <p>
            <code>.repel</code>
          </p>
          <div className={cx('repel', styles.box)}>
            <span>Left</span>
            <span>Right</span>
          </div>
          <p>
            <code>.grid-auto</code>
          </p>
          <div className="grid-auto">
            <div className={styles.box}>A</div>
            <div className={styles.box}>B</div>
            <div className={styles.box}>C</div>
          </div>
        </div>
      </section>
    </main>
  )
}
