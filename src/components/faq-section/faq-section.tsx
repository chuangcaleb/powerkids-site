import { Accordion } from '@/components/accordion/accordion'
import { RichText } from '@/components/rich-text/rich-text'
import { SectionHeader } from '@/components/section-header/section-header'
import { cx } from '@/lib/cx'
import { getFaq } from '@/payload/globals/get-faq'

export type FaqSectionProps = { className?: string }

/** Sitewide FAQ accordion, rendered at the end of every page above `RegistrationSection`. */
export async function FaqSection({ className }: FaqSectionProps) {
  const faq = await getFaq()
  const items = faq.items ?? []
  if (items.length === 0) return null

  return (
    <section className={cx('wrapper flow region', className)}>
      <SectionHeader header={faq.header} />
      <Accordion
        items={items.map((item, index) => ({
          // `id` is only missing for an unsaved draft row; every saved item has one.
          id: String(item.id ?? index),
          trigger: item.question,
          children: <RichText data={item.answer} />,
        }))}
      />
    </section>
  )
}
