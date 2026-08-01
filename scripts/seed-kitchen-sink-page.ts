/**
 * One-off: create a "kitchen sink" page with hero + all 11 blocks, plus one
 * `schools` doc, to render against while building Phase 4. Not the Phase 5
 * seed script — throwaway, delete once Phase 4 renderers are built and
 * checked.
 *
 *   pnpm payload run scripts/seed-kitchen-sink-page.ts
 */
import { getPayload } from 'payload'

import config from '@payload-config'

const PLACEHOLDER_IMAGE =
  '/private/tmp/claude-501/-Users-chuangcaleb-Documents-dev-web-powerkids-site--claude-worktrees-next-phase-implementation-f57fa5/136263a1-a810-4a1b-8421-80bdf01b7b5f/scratchpad/placeholder.jpg'

const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const payload = await getPayload({ config })

const media = await payload.create({
  collection: 'media',
  data: { alt: 'Kitchen sink placeholder image' },
  filePath: PLACEHOLDER_IMAGE,
})

await payload.updateGlobal({
  slug: 'site-settings',
  context: { disableRevalidate: true },
  data: {
    name: 'The Centre With A Heart',
    foundedYear: 1998,
    email: 'info@powerkids.example',
    phones: [{ number: '+60 12-345 6789', href: 'tel:+60123456789' }],
    openingHours: '8:30am - 5:00pm',
    openingDays: 'Monday - Friday',
  },
})

await payload.updateGlobal({
  slug: 'navigation',
  context: { disableRevalidate: true },
  data: {
    header: [{ label: 'Kitchen Sink', url: '/kitchen-sink' }],
    footerColumns: [
      {
        heading: 'Explore',
        links: [{ label: 'Kitchen Sink', url: '/kitchen-sink' }],
      },
    ],
  },
})

const existingSchools = await payload.find({ collection: 'schools', limit: 1 })
if (existingSchools.totalDocs === 0) {
  await payload.create({
    collection: 'schools',
    context: { disableRevalidate: true },
    data: {
      name: 'Kitchen Sink Demo School',
      slug: 'kitchen-sink-demo-school',
      address: '1 Demo Street, Test City',
      phones: [{ number: '+60 12-345 6789', href: 'tel:+60123456789' }],
      _status: 'published',
    },
  })
}

const page = await payload.create({
  collection: 'pages',
  context: { disableRevalidate: true },
  data: {
    title: 'Kitchen Sink',
    slug: 'kitchen-sink',
    _status: 'published',
    hero: {
      type: 'highImpact',
      heading: 'Kitchen Sink Page',
      subheading: 'Every block, one page, for Phase 4 renderer checks',
      ctas: [{ label: 'Register now', url: '#register' }],
      media: media.id,
    },
    layout: [
      { blockType: 'prose', content: richText('Prose block body copy.') },
      {
        blockType: 'media-text',
        media: media.id,
        content: richText('Media-text block body copy.'),
        mediaSide: 'left',
      },
      {
        blockType: 'card-grid',
        heading: 'Card Grid',
        source: 'manual',
        cards: [
          { heading: 'Card One', body: 'First card body.', image: media.id, url: '#' },
          { heading: 'Card Two', body: 'Second card body.', image: media.id },
        ],
      },
      {
        blockType: 'steps',
        heading: 'Registration Steps',
        steps: [{ label: 'Step one' }, { label: 'Step two' }, { label: 'Step three' }],
        cta: { label: 'Start now', url: '#register' },
      },
      {
        blockType: 'stats',
        heading: 'Stats',
        stats: [
          { useFoundedYear: false, value: '10+', label: 'Years' },
          { useFoundedYear: true, label: 'Years & counting' },
        ],
      },
      {
        blockType: 'gallery',
        heading: 'Gallery',
        source: 'manual',
        images: [media.id, media.id, media.id],
      },
      {
        blockType: 'cta-banner',
        heading: 'Ready to register?',
        body: 'Call to action body copy.',
        cta: { label: 'Register', url: '#register' },
      },
      { blockType: 'schools', heading: 'Our Schools' },
      {
        blockType: 'faq',
        heading: 'FAQ',
        items: [
          { question: 'Question one?', answer: richText('Answer one.') },
          { question: 'Question two?', answer: richText('Answer two.') },
        ],
      },
      { blockType: 'contact', heading: 'Contact Us' },
      {
        blockType: 'video',
        heading: 'Video',
        source: 'manual',
        embedId: 'dQw4w9WgXcQ',
        poster: media.id,
      },
    ],
  },
})

console.log(`Created page "${page.title}" at /${page.slug} (id ${page.id})`)
process.exit(0)
