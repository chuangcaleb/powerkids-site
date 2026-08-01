import { Heading } from '@/components/heading/heading'
import { getSiteSettings } from '@/payload/globals/get-site-settings'
import type { StatsBlock } from '@/payload-types'

function yearsAndCounting(foundedYear: number) {
  const years = new Date().getFullYear() - foundedYear
  return `${years}+`
}

export async function Stats({ heading, stats }: StatsBlock) {
  const siteSettings = await getSiteSettings()

  return (
    <section className="wrapper flow">
      {heading ? <Heading level={2}>{heading}</Heading> : null}
      <div className="grid-auto">
        {(stats ?? []).map((stat, index) => (
          <div key={stat.id ?? index}>
            <Heading level={3}>
              {stat.useFoundedYear
                ? yearsAndCounting(siteSettings.foundedYear)
                : stat.value}
            </Heading>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
