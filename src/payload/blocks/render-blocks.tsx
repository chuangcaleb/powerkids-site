import type { ComponentType } from 'react'
import type { Page } from '@/payload-types'

import { Content } from './content/component'
import { Faq } from './faq/component'
import { FramedRows } from './framed-rows/component'
import { Gallery } from './gallery/component'
import { MediaText } from './media-text/component'
import { Scrapbook } from './scrapbook/component'
import { SchoolsBlock } from './schools/component'

type LayoutBlock = Page['layout'][number]
type BlockType = LayoutBlock['blockType']

/** The generated props for one `blockType`. */
type BlockProps<T extends BlockType> = Extract<LayoutBlock, { blockType: T }>

/**
 * Every block registered on `pages.layout` must have a renderer here.
 *
 * The mapped type is what enforces it: `BlockType` is derived from the
 * generated `Page['layout']` union, so a block added to the collection config
 * without a renderer is a missing key — `pnpm typecheck` fails instead of the
 * block silently rendering nothing on the page. Pairing a slug with the wrong
 * component is a props mismatch for the same reason.
 */
type BlockRenderers = { [T in BlockType]: ComponentType<BlockProps<T>> }

const blockComponents: BlockRenderers = {
  content: Content,
  faq: Faq,
  'framed-rows': FramedRows,
  gallery: Gallery,
  'media-text': MediaText,
  scrapbook: Scrapbook,
  schools: SchoolsBlock,
}

/**
 * Dispatches one `pages.layout` entry to its block component. A `blockType`
 * outside the map means data older than the current schema — renders nothing,
 * never throws.
 */
function renderBlock(block: LayoutBlock) {
  const Block = blockComponents[block.blockType] as ComponentType<LayoutBlock> | undefined

  // The cast above is the one unsound step, and it stays here rather than at
  // the call: TypeScript can't correlate a union member with its own entry in
  // the map, so `Block` is otherwise an intersection of every block's props.
  // The map's type checks the pairings; this only re-widens what it proved.
  return Block ? <Block {...block} /> : null
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
