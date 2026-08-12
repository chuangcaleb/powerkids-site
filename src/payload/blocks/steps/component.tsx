import { Button } from '@/components/button/button'
import { RichText } from '@/components/rich-text/rich-text'
import { SectionHeader } from '@/components/section-header/section-header'
import type { StepsBlock } from '@/payload-types'

export function Steps({ header, body, cta }: StepsBlock) {
  return (
    <section className="wrapper flow" id="register">
      <SectionHeader header={header} />
      <RichText data={body} />
      {cta?.label && cta.url ? <Button href={cta.url}>{cta.label}</Button> : null}
    </section>
  )
}
