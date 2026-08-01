import { Button } from '@/components/button/button'
import { Heading } from '@/components/heading/heading'
import type { CtaBannerBlock } from '@/payload-types'

export function CtaBanner({ heading, body, cta }: CtaBannerBlock) {
  return (
    <section className="wrapper">
      <div className="repel">
        <div className="flow">
          <Heading level={2}>{heading}</Heading>
          {body ? <p>{body}</p> : null}
        </div>
        <Button href={cta.url}>{cta.label}</Button>
      </div>
    </section>
  )
}
