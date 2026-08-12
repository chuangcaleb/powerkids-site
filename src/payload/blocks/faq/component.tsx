import { Accordion } from '@/components/accordion/accordion'
import { RichText } from '@/components/rich-text/rich-text'
import { SectionHeader } from '@/components/section-header/section-header'
import type { FaqBlock as FaqBlockType } from '@/payload-types'

export function Faq({ header, items }: FaqBlockType) {
  return (
    <section className="wrapper flow">
      <SectionHeader header={header} />
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
