import { RichText } from '@/components/rich-text/rich-text'
import type { ProseBlock } from '@/payload-types'

export function Prose({ content }: ProseBlock) {
  return (
    <section className="wrapper">
      <RichText data={content} />
    </section>
  )
}
