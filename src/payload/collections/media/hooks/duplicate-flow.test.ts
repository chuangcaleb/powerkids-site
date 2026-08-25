import { describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'

import { flagOwnDuplicate } from './flag-own-duplicate'
import { flagDuplicateAfterChange } from './flag-duplicate'
import { matchByChecksum, type ChecksumWhere } from './test-support'

type FakeDoc = { id: number; checksum: string; hasDuplicate: boolean }

/**
 * Wires `flagOwnDuplicate` (beforeChange) and `flagDuplicateAfterChange`
 * (afterChange) against one shared in-memory store, so a sequence of
 * `create()` calls exercises the same two-hook pipeline the real Media
 * collection runs — this is what a bulk upload actually does: N sequential
 * creates, each running beforeChange then afterChange before the next starts.
 */
function fakeCollection() {
  const docs: FakeDoc[] = []
  let nextId = 1

  const mockPayload = {
    find: vi.fn(async ({ where }: { where: ChecksumWhere }) => {
      const matches = matchByChecksum(docs, where)
      return { totalDocs: matches.length, docs: matches }
    }),
    update: vi.fn(async ({ id, data }: { id: number; data: Partial<FakeDoc> }) => {
      const doc = docs.find((d) => d.id === id)
      if (doc) Object.assign(doc, data)
      return doc
    }),
    logger: { error: vi.fn() },
  }
  const req = { payload: mockPayload, context: {} } as unknown as PayloadRequest

  async function create(checksum: string): Promise<FakeDoc> {
    const data = await flagOwnDuplicate({
      data: { checksum },
      req,
      originalDoc: undefined,
      operation: 'create',
    } as never)

    const doc: FakeDoc = {
      id: nextId++,
      checksum,
      hasDuplicate: Boolean(data.hasDuplicate),
    }
    docs.push(doc)

    await flagDuplicateAfterChange({
      doc,
      previousDoc: undefined,
      req,
      context: {},
    } as never)

    return doc
  }

  return { docs, create, mockPayload }
}

describe('bulk-create duplicate flagging (flagOwnDuplicate + flagDuplicateAfterChange together)', () => {
  it('flags every doc in a 3-item bulk upload of the same file, including the last', async () => {
    const { docs, create, mockPayload } = fakeCollection()

    await create('abc')
    await create('abc')
    await create('abc')

    expect(mockPayload.logger.error).not.toHaveBeenCalled()
    expect(docs.every((doc) => doc.hasDuplicate)).toBe(true)
  })

  it('leaves a single unique upload unflagged', async () => {
    const { docs, create } = fakeCollection()

    await create('unique')

    expect(docs[0]!.hasDuplicate).toBe(false)
  })
})
