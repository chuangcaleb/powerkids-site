import type { Page } from '@/payload-types'

import { CardGrid } from './card-grid/component'
import { Contact } from './contact/component'
import { Content } from './content/component'
import { CtaBanner } from './cta-banner/component'
import { Faq } from './faq/component'
import { Gallery } from './gallery/component'
import { MediaText } from './media-text/component'
import { Prose } from './prose/component'
import { SchoolsBlock } from './schools/component'
import { Stats } from './stats/component'
import { Steps } from './steps/component'
import { VideoBlock } from './video/component'

type LayoutBlock = Page['layout'][number]

/** Dispatches one `pages.layout` entry to its block component. Unknown type renders nothing, never throws. */
function renderBlock(block: LayoutBlock) {
  switch (block.blockType) {
    case 'prose':
      return <Prose {...block} />
    case 'content':
      return <Content {...block} />
    case 'media-text':
      return <MediaText {...block} />
    case 'card-grid':
      return <CardGrid {...block} />
    case 'steps':
      return <Steps {...block} />
    case 'stats':
      return <Stats {...block} />
    case 'gallery':
      return <Gallery {...block} />
    case 'cta-banner':
      return <CtaBanner {...block} />
    case 'schools':
      return <SchoolsBlock {...block} />
    case 'faq':
      return <Faq {...block} />
    case 'contact':
      return <Contact {...block} />
    case 'video':
      return <VideoBlock {...block} />
    default:
      return null
  }
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
