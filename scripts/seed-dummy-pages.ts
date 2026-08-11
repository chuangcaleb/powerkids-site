/**
 * Realistic dummy content for visual styling review — home, about, careers
 * pages, 3 schools, 4 people. Structure (names, slugs, addresses, phone
 * numbers) mirrors docs/reference/content-inventory.md; all prose/body copy
 * is generated lorem ipsum (via the `lorem-ipsum` package), not
 * hand-written. One placeholder image reused everywhere a media/upload
 * field is needed.
 *
 *   pnpm payload run scripts/seed-dummy-pages.ts
 */
import { getPayload } from 'payload'
import { LoremIpsum } from 'lorem-ipsum'

import config from '@payload-config'

const PLACEHOLDER_IMAGE = process.env.SEED_PLACEHOLDER_IMAGE
if (!PLACEHOLDER_IMAGE) {
  throw new Error(
    'Set SEED_PLACEHOLDER_IMAGE to a local image file path before running this script.',
  )
}

const lorem = new LoremIpsum({
  sentencesPerParagraph: { max: 5, min: 3 },
  wordsPerSentence: { max: 16, min: 6 },
})

const loremSentence = () => lorem.generateSentences(1)
const loremParagraph = () => lorem.generateParagraphs(1)

const richText = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      children: [{ type: 'text', text, version: 1 }],
      version: 1,
    })),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const payload = await getPayload({ config })

const media = await payload.create({
  collection: 'media',
  data: { alt: 'Placeholder photo' },
  filePath: PLACEHOLDER_IMAGE,
})

await payload.updateGlobal({
  slug: 'site-settings',
  context: { disableRevalidate: true },
  data: {
    name: 'the Centre with a Heart',
    foundedYear: 2001,
    email: 'powerkidschool@gmail.com',
    phones: [
      { number: '010 - 221 2482', href: 'tel:+60102212482' },
      { number: '03 - 9056 4288', href: 'tel:+60390564288' },
      { number: '010 - 221 2483', href: 'tel:+60102212483' },
    ],
    openingHours: '8:30am - 5:00pm',
    openingDays: 'Monday - Friday',
    socials: [
      { platform: 'facebook', url: 'https://www.facebook.com/PowerKidsChildcare' },
      { platform: 'instagram', url: 'https://www.instagram.com/powerkids_2001/' },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/channel/UCOjK8A2hTRbh1jg3hPE7uCw',
      },
    ],
    defaultShareImage: media.id,
  },
})

await payload.updateGlobal({
  slug: 'navigation',
  context: { disableRevalidate: true },
  data: {
    footerColumns: [
      {
        heading: 'About',
        links: [
          { label: 'Who We Are', url: '/about' },
          { label: 'Our Schools', url: '/about#our-schools' },
          { label: "We're Hiring!", url: '/careers' },
        ],
      },
    ],
  },
})

// --- Schools + People (principals) -----------------------------------

const schoolSeeds = [
  {
    name: 'PowerKids Sri Petaling',
    slug: 'sri-petaling',
    address:
      '2, Jalan 5/149B\nTaman Sri Endah\nBandar Baru Sri Petaling\n57000 Kuala Lumpur',
    phones: [
      { number: '03 - 9056 4288', href: 'tel:+60390564288' },
      { number: '010 - 221 2482', href: 'tel:+60102212482' },
    ],
    principalName: 'Ms. Wan Hong',
    principalBio: richText(loremParagraph(), loremParagraph(), loremParagraph()),
  },
  {
    name: 'PowerKids Puchong Utama',
    slug: 'puchong-utama',
    address: 'No 1, Jalan PU 3/1A\nTaman Puchong Utama\n47140 Puchong, Selangor',
    phones: [
      { number: '03 - 8066 9363', href: 'tel:+60380669363' },
      { number: '012 - 218 0240', href: 'tel:+60122180240' },
    ],
    principalName: 'Uncle Chun Hoe',
    principalBio: richText(loremParagraph(), loremParagraph(), loremParagraph()),
  },
  {
    name: 'PowerKids Parklane OUG',
    slug: 'parklane-oug',
    address: 'D1-1-11 Jalan 1/152\nTaman OUG Parklane\n58200 Kuala Lumpur',
    phones: [
      { number: '012 - 386 1123', href: 'tel:+60123861123' },
      { number: '03 - 7498 1905', href: 'tel:+60374981905' },
    ],
    principalName: 'Ms. Mary',
    principalBio: richText(loremParagraph(), loremParagraph(), loremParagraph()),
  },
]

const schoolIds: number[] = []
for (const [index, seed] of schoolSeeds.entries()) {
  const school = await payload.create({
    collection: 'schools',
    context: { disableRevalidate: true },
    data: {
      name: seed.name,
      slug: seed.slug,
      address: seed.address,
      phones: seed.phones,
      photo: media.id,
      order: index,
    },
  })
  schoolIds.push(school.id)

  const principal = await payload.create({
    collection: 'people',
    data: {
      name: seed.principalName,
      role: `Principal of ${seed.name}`,
      school: school.id,
      bio: seed.principalBio,
      portrait: media.id,
      order: index,
    },
  })

  await payload.update({
    collection: 'schools',
    id: school.id,
    context: { disableRevalidate: true },
    data: { principal: principal.id },
  })
}

await payload.create({
  collection: 'people',
  data: {
    name: 'Uncle Peck Guan',
    role: 'Founder',
    bio: richText(loremParagraph(), loremParagraph()),
    portrait: media.id,
    order: -1,
  },
})

// --- Pages -----------------------------------------------------------------

await payload.create({
  collection: 'pages',
  context: { disableRevalidate: true },
  data: {
    title: 'Home',
    slug: 'index',
    _status: 'published',
    hero: {
      type: 'highImpact',
      heading: 'the Centre with a Heart',
      subheading: loremSentence(),
      ctas: [
        { label: 'Register', url: '#register' },
        { label: 'Contact', url: '#contact' },
      ],
      media: media.id,
    },
    layout: [
      {
        blockType: 'prose',
        content: richText(loremParagraph(), loremParagraph()),
      },
      {
        blockType: 'card-grid',
        heading: 'Our Programs',
        cards: [
          { heading: 'Morning School', body: loremSentence(), image: media.id },
          { heading: 'After School Program', body: loremSentence(), image: media.id },
          { heading: 'Evening Daycare', body: loremSentence(), image: media.id },
        ],
      },
      {
        blockType: 'card-grid',
        heading: 'Our Events',
        cards: [
          { heading: 'Graduation', body: loremSentence(), image: media.id },
          { heading: 'Sports Day', body: loremSentence(), image: media.id },
          { heading: 'Field Trips', body: loremSentence(), image: media.id },
          { heading: 'Community Service', body: loremSentence(), image: media.id },
        ],
      },
      {
        blockType: 'stats',
        heading: 'Fun learning is our serious business.',
        stats: [
          { useFoundedYear: true, label: 'Years & counting' },
          { useFoundedYear: false, value: '3', label: 'Schools' },
          { useFoundedYear: false, value: '4', label: 'Signature Events' },
        ],
      },
      {
        blockType: 'steps',
        heading: 'Register Today!',
        steps: [
          { label: 'Sign the Registration Form' },
          { label: 'Attach photocopy of birth cert.' },
          { label: 'Email proof of full payment' },
        ],
        cta: { label: 'Open our form', url: '#register' },
      },
    ],
  },
})

await payload.create({
  collection: 'pages',
  context: { disableRevalidate: true },
  data: {
    title: 'Who We Are',
    slug: 'about',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      heading: 'Who We Are',
      subheading: loremSentence(),
    },
    layout: [
      {
        blockType: 'prose',
        content: richText(loremParagraph(), loremParagraph()),
      },
      {
        blockType: 'card-grid',
        heading: 'Our Mission & Vision',
        cards: [
          {
            heading: 'Our Mission',
            body: loremSentence(),
            image: media.id,
          },
          {
            heading: 'Our Vision',
            body: loremSentence(),
            image: media.id,
          },
        ],
      },
      { blockType: 'schools', heading: 'Our Schools' },
      {
        blockType: 'media-text',
        media: media.id,
        mediaSide: 'left',
        content: richText('Uncle Peck Guan — Founder', loremParagraph()),
      },
      {
        blockType: 'media-text',
        media: media.id,
        mediaSide: 'right',
        content: richText(
          'Ms. Wan Hong — Principal of PowerKids Sri Petaling',
          loremParagraph(),
        ),
      },
      {
        blockType: 'faq',
        heading: 'Frequently Asked Questions',
        items: [
          {
            question: `${loremSentence().replace(/\.$/, '')}?`,
            answer: richText(loremSentence()),
          },
          {
            question: `${loremSentence().replace(/\.$/, '')}?`,
            answer: richText(loremSentence()),
          },
        ],
      },
    ],
  },
})

await payload.create({
  collection: 'pages',
  context: { disableRevalidate: true },
  data: {
    title: 'Careers',
    slug: 'careers',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      heading: 'We Want You!',
      subheading: loremSentence(),
    },
    layout: [
      {
        blockType: 'prose',
        content: richText(loremParagraph()),
      },
      {
        blockType: 'card-grid',
        heading: 'Current Vacancies',
        cards: [
          {
            heading: 'Teacher',
            body: loremSentence(),
            image: media.id,
          },
        ],
      },
      {
        blockType: 'cta-banner',
        heading: 'Not 100% certain?',
        body: loremSentence(),
        cta: { label: 'Call for an interview', url: 'tel:+60390564288' },
      },
    ],
  },
})

console.log(`Seeded 3 pages, ${schoolIds.length} schools, 4 people.`)
process.exit(0)
