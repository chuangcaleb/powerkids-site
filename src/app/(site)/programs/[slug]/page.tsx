import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Heading } from '@/components/heading/heading'
import { Media } from '@/components/media/media'
import { RichText } from '@/components/rich-text/rich-text'
import { getProgramBySlug } from '@/payload/collections/programs/get-programs'

type Props = { params: Promise<{ slug: string }> }

// No generateStaticParams — see the same note in src/app/(site)/[[...slug]]/page.tsx.

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) return {}

  return {
    title: program.name,
    description: program.summary ?? program.strapline ?? undefined,
  }
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params
  const program = await getProgramBySlug(slug)

  if (!program) notFound()

  return (
    <main className="wrapper flow">
      <Heading level={1}>{program.name}</Heading>
      {program.strapline ? <p>{program.strapline}</p> : null}
      <dl className="cluster">
        <div>
          <dt>Hours</dt>
          <dd>{program.hours}</dd>
        </div>
        {program.ageRange ? (
          <div>
            <dt>Age range</dt>
            <dd>{program.ageRange}</dd>
          </div>
        ) : null}
      </dl>
      {typeof program.image === 'object' && program.image ? (
        <Media doc={program.image} sizes="(min-width: 768px) 50vw, 100vw" />
      ) : null}
      {program.body ? <RichText data={program.body} /> : null}
    </main>
  )
}
