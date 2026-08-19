import type { Page } from '@/payload-types'

import { Content } from './content/component'
import { Faq } from './faq/component'
import { FramedRows } from './framed-rows/component'
import { Gallery } from './gallery/component'
import { MediaText } from './media-text/component'
import { Scrapbook } from './scrapbook/component'
import { SchoolsBlock } from './schools/component'

const blockComponents = {
  content: Content,
  faq: Faq,
  'framed-rows': FramedRows,
  gallery: Gallery,
  'media-text': MediaText,
  scrapbook: Scrapbook,
  schools: SchoolsBlock,
}

/** Dispatches one `pages.layout` entry to its block component. Unknown type renders nothing, never throws. */
function renderBlock(block: Page['layout'][number]) {
  const { blockType } = block

  if (blockType && blockType in blockComponents) {
    const Block = blockComponents[blockType as keyof typeof blockComponents]

    if (Block) {
      // @ts-expect-error mismatch between generic block union and each component's specific props
      return <Block {...block} />
    }
  }

  return null
}

export function RenderBlocks({ layout }: { layout: Page['layout'] }) {
  return (
    <>
      {layout.map((block, index) => (
        <div key={block.id ?? index}>{renderBlock(block)}</div>
      ))}
    </>
  )
}
