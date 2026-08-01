/**
 * Realistic dummy content for visual styling review — home, about, careers
 * pages, all 3 programs, all 4 events, 3 schools, 4 people. Structure
 * (names, slugs, hours, addresses, phone numbers) mirrors
 * docs/reference/content-inventory.md; all prose/body copy is generated
 * lorem ipsum (via the `lorem-ipsum` package), not hand-written. One
 * placeholder image reused everywhere a media/upload field is needed.
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
    tagline: 'the Centre with a Heart',
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
    header: [
      { label: 'Who We Are', url: '/about' },
      { label: 'Our Schools', url: '/about#our-schools' },
      { label: "We're Hiring!", url: '/careers' },
      { label: 'Morning School', url: '/programs/morning-school' },
      { label: 'After School Program', url: '/programs/after-school-program' },
      { label: 'Evening Daycare', url: '/programs/evening-daycare' },
      { label: 'Graduation', url: '/events/graduation' },
      { label: 'Sports Day', url: '/events/sports-day' },
      { label: 'Field Trips', url: '/events/field-trips' },
      { label: 'Community Service', url: '/events/community-service' },
    ],
    footerColumns: [
      {
        heading: 'About',
        links: [
          { label: 'Who We Are', url: '/about' },
          { label: 'Our Schools', url: '/about#our-schools' },
          { label: "We're Hiring!", url: '/careers' },
        ],
      },
      {
        heading: 'Programs',
        links: [
          { label: 'Morning School', url: '/programs/morning-school' },
          { label: 'After School Program', url: '/programs/after-school-program' },
          { label: 'Evening Daycare', url: '/programs/evening-daycare' },
        ],
      },
      {
        heading: 'Events',
        links: [
          { label: 'Graduation', url: '/events/graduation' },
          { label: 'Sports Day', url: '/events/sports-day' },
          { label: 'Field Trips', url: '/events/field-trips' },
          { label: 'Community Service', url: '/events/community-service' },
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

// --- Programs ----------------------------------------------------------

const programSeeds = [
  {
    name: 'Morning School',
    slug: 'morning-school',
    hours: '08:30AM - 12:30noon',
    ageRange: 'Ages 2 - 6',
    strapline: loremSentence(),
    summary: loremSentence(),
    body: richText(loremParagraph()),
  },
  {
    name: 'After School Program',
    slug: 'after-school-program',
    hours: '12:30PM - 03:00PM',
    ageRange: '',
    strapline: loremSentence(),
    summary: loremSentence(),
    body: richText(loremParagraph(), loremParagraph()),
  },
  {
    name: 'Evening Daycare',
    slug: 'evening-daycare',
    hours: '03:00PM - 07:00PM',
    ageRange: '',
    strapline: loremSentence(),
    summary: loremSentence(),
    body: richText(loremParagraph()),
  },
]

for (const [index, seed] of programSeeds.entries()) {
  await payload.create({
    collection: 'programs',
    context: { disableRevalidate: true },
    data: {
      name: seed.name,
      slug: seed.slug,
      hours: seed.hours,
      ageRange: seed.ageRange || undefined,
      strapline: seed.strapline,
      summary: seed.summary,
      body: seed.body,
      image: media.id,
      order: index,
      _status: 'published',
    },
  })
}

// --- Events --------------------------------------------------------------

const eventSeeds = [
  {
    name: 'Graduation',
    slug: 'graduation',
    summary: loremSentence(),
    body: richText(loremParagraph()),
    videos: [
      { label: 'Graduation 2020', embedId: 'eyyBMt6-zIc' },
      { label: 'Graduation 2019', embedId: '7nphFvgTY2M' },
    ],
  },
  {
    name: 'Sports Day',
    slug: 'sports-day',
    summary: loremSentence(),
    body: richText(loremParagraph()),
    videos: [{ label: 'Sports Day 2019', embedId: 'vj-9e65wtPE' }],
  },
  {
    name: 'Field Trips',
    slug: 'field-trips',
    summary: loremSentence(),
    body: richText(loremParagraph(), loremParagraph()),
    videos: [],
  },
  {
    name: 'Community Service',
    slug: 'community-service',
    summary: loremSentence(),
    body: richText(loremParagraph(), loremParagraph()),
    videos: [],
  },
]

for (const [index, seed] of eventSeeds.entries()) {
  await payload.create({
    collection: 'events',
    context: { disableRevalidate: true },
    data: {
      name: seed.name,
      slug: seed.slug,
      summary: seed.summary,
      body: seed.body,
      gallery: [media.id, media.id, media.id],
      videos: seed.videos,
      order: index,
      _status: 'published',
    },
  })
}

// --- Pages -----------------------------------------------------------------

await payload.create({
  collection: 'pages',
  context: { disableRevalidate: true },
  data: {
    title: 'Home',
    slug: 'home',
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
        source: 'manual',
        cards: [
          {
            heading: 'Morning School',
            body: loremSentence(),
            image: media.id,
            url: '/programs/morning-school',
          },
          {
            heading: 'After School Program',
            body: loremSentence(),
            image: media.id,
            url: '/programs/after-school-program',
          },
          {
            heading: 'Evening Daycare',
            body: loremSentence(),
            image: media.id,
            url: '/programs/evening-daycare',
          },
        ],
      },
      {
        blockType: 'card-grid',
        heading: 'Our Events',
        source: 'manual',
        cards: [
          {
            heading: 'Graduation',
            body: loremSentence(),
            image: media.id,
            url: '/events/graduation',
          },
          {
            heading: 'Sports Day',
            body: loremSentence(),
            image: media.id,
            url: '/events/sports-day',
          },
          {
            heading: 'Field Trips',
            body: loremSentence(),
            image: media.id,
            url: '/events/field-trips',
          },
          {
            heading: 'Community Service',
            body: loremSentence(),
            image: media.id,
            url: '/events/community-service',
          },
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
      { blockType: 'contact', heading: 'Contact Us!' },
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
        source: 'manual',
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
      { blockType: 'contact', heading: 'Contact Us!' },
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
        source: 'manual',
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

console.log(
  `Seeded 3 pages, ${programSeeds.length} programs, ${eventSeeds.length} events, ${schoolIds.length} schools, 4 people.`,
)
process.exit(0)
