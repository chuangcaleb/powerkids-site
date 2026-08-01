import { Button } from '@/components/button/button'
import { Heading } from '@/components/heading/heading'
import type { StepsBlock } from '@/payload-types'

export function Steps({ heading, steps, cta }: StepsBlock) {
  return (
    <section className="wrapper flow" id="register">
      <Heading level={2}>{heading}</Heading>
      <ol>
        {(steps ?? []).map((step, index) => (
          <li key={step.id ?? index}>{step.label}</li>
        ))}
      </ol>
      {cta?.label && cta.url ? <Button href={cta.url}>{cta.label}</Button> : null}
    </section>
  )
}
