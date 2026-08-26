import { Card } from '@/components/card/card'
import { Heading } from '@/components/heading/heading'
import { JsonLd } from '@/components/json-ld/json-ld'
import { Media } from '@/components/media/media'
import { SectionHeader } from '@/components/section-header/section-header'
import { getSchools } from '@/payload/collections/schools/get-schools'
import type { SchoolsBlock as SchoolsBlockType } from '@/payload-types'

export async function SchoolsBlock({ header }: SchoolsBlockType) {
  const schools = await getSchools()

  return (
    <section className="wrapper flow region">
      <SectionHeader header={header} />
      <div className="grid-auto">
        {schools.map((school) => (
          <Card key={school.id}>
            <JsonLd
              data={{
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: school.name,
                address: school.address,
                telephone: school.phones?.[0]?.href,
                image: typeof school.photo === 'object' ? school.photo?.url : undefined,
                hasMap: school.mapUrl ?? undefined,
              }}
            />
            {typeof school.photo === 'object' && school.photo ? (
              <Media asset={school.photo} sizes="(min-width: 768px) 33vw, 100vw" />
            ) : null}
            <Heading level={3}>{school.name}</Heading>
            <p>{school.address}</p>
            <ul role="list" className="cluster">
              {school.phones?.map((phone) => (
                <li key={phone.id ?? phone.href}>
                  <a href={`tel:${phone.href}`}>{phone.number}</a>
                </li>
              ))}
            </ul>
            {school.mapUrl ? <a href={school.mapUrl}>View on map</a> : null}
          </Card>
        ))}
      </div>
    </section>
  )
}
