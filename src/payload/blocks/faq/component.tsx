import { Accordion } from '@/components/accordion/accordion'
import { Heading } from '@/components/heading/heading'
import { RichText } from '@/components/rich-text/rich-text'
import type { FaqBlock as FaqBlockType } from '@/payload-types'

export function Faq({ heading, items }: FaqBlockType) {
  return (
    <section className="wrapper flow">
      {heading ? <Heading level={2}>{heading}</Heading> : null}
      <Accordion
        items={(items ?? []).map((item, index) => ({
          id: String(item.id ?? index),
          trigger: item.question,
          children: <RichText data={item.answer} />,
        }))}
      />
    </section>
  )
}
