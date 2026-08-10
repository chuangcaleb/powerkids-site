import { notFound } from 'next/navigation'
import { Accordion } from '@/components/accordion/accordion'
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
import { FramedRows } from '@/payload/blocks/framed-rows/component'
import styles from './kitchen-sink.module.css'

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
            <div key={colour.name} className={styles.swatch}>
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
            <div key={step} className={styles.spaceRow}>
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
          logo={<span>PowerKids</span>}
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

      <section className="flow">
        <div className="wrapper">
          <Heading level={2}>FramedRows block</Heading>
        </div>
        <FramedRows heading="Our Programs" blockType="framed-rows" />
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
