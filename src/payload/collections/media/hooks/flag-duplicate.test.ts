import { describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'

import { flagDuplicateAfterChange, flagDuplicateAfterDelete } from './flag-duplicate'

type FakeDoc = {
  id: number
  checksum: string | null
  hasDuplicate: boolean
  duplicateDismissed?: boolean
}

/** Minimal in-memory stand-in for the Local API surface these hooks call. */
function fakeReq(docs: FakeDoc[]) {
  const payload = {
    find: vi.fn(async ({ where }: { where: { checksum: { equals: string } } }) => ({
      docs: docs.filter((doc) => doc.checksum === where.checksum.equals),
    })),
    update: vi.fn(async ({ id, data }: { id: number; data: Partial<FakeDoc> }) => {
      const doc = docs.find((d) => d.id === id)
      if (doc) Object.assign(doc, data)
      return doc
    }),
    logger: { error: vi.fn() },
  }
  const req = { payload, context: {} } as unknown as PayloadRequest
  return { req, payload }
}

describe('flagDuplicateAfterChange', () => {
  it('flags both docs once a second upload shares a checksum', async () => {
    const docs: FakeDoc[] = [
      { id: 1, checksum: 'abc', hasDuplicate: false },
      { id: 2, checksum: 'abc', hasDuplicate: false },
    ]
    const { req } = fakeReq(docs)

    await flagDuplicateAfterChange({
      doc: docs[1],
      previousDoc: undefined,
      req,
      context: {},
    } as never)

    expect(docs[0]!.hasDuplicate).toBe(true)
    expect(docs[1]!.hasDuplicate).toBe(true)
  })

  it('flags every member once a group grows to 3+', async () => {
    const docs: FakeDoc[] = [
      { id: 1, checksum: 'abc', hasDuplicate: true },
      { id: 2, checksum: 'abc', hasDuplicate: true },
      { id: 3, checksum: 'abc', hasDuplicate: false },
    ]
    const { req } = fakeReq(docs)

    await flagDuplicateAfterChange({
      doc: docs[2],
      previousDoc: undefined,
      req,
      context: {},
    } as never)

    expect(docs.every((doc) => doc.hasDuplicate)).toBe(true)
  })

  it('leaves a doc with unique content unflagged', async () => {
    const docs: FakeDoc[] = [{ id: 1, checksum: 'unique', hasDuplicate: false }]
    const { req, payload } = fakeReq(docs)

    await flagDuplicateAfterChange({
      doc: docs[0],
      previousDoc: undefined,
      req,
      context: {},
    } as never)

    expect(docs[0]!.hasDuplicate).toBe(false)
    expect(payload.update).not.toHaveBeenCalled()
  })

  it('recomputes both groups when a file-replace moves a doc to a new checksum', async () => {
    // Doc 2 used to match doc 1 (group of 2); replacing its file gives it a
    // new checksum matching doc 3 instead. Doc 1 must drop back to
    // unflagged, and docs 2/3 must both flag.
    const docs: FakeDoc[] = [
      { id: 1, checksum: 'old', hasDuplicate: true },
      { id: 2, checksum: 'new', hasDuplicate: true },
      { id: 3, checksum: 'new', hasDuplicate: false },
    ]
    const { req } = fakeReq(docs)

    await flagDuplicateAfterChange({
      doc: docs[1],
      previousDoc: { checksum: 'old' },
      req,
      context: {},
    } as never)

    expect(docs[0]!.hasDuplicate).toBe(false)
    expect(docs[1]!.hasDuplicate).toBe(true)
    expect(docs[2]!.hasDuplicate).toBe(true)
  })

  it('skips entirely when context carries the recompute guard', async () => {
    const docs: FakeDoc[] = [{ id: 1, checksum: 'abc', hasDuplicate: false }]
    const { req, payload } = fakeReq(docs)

    await flagDuplicateAfterChange({
      doc: docs[0],
      previousDoc: undefined,
      req,
      context: { skipDuplicateRecompute: true },
    } as never)

    expect(payload.find).not.toHaveBeenCalled()
  })

  it('never throws when the recompute itself fails, and logs instead', async () => {
    const docs: FakeDoc[] = [{ id: 1, checksum: 'abc', hasDuplicate: false }]
    const { req, payload } = fakeReq(docs)
    payload.find.mockRejectedValueOnce(new Error('db unavailable'))

    await expect(
      flagDuplicateAfterChange({
        doc: docs[0],
        previousDoc: undefined,
        req,
        context: {},
      } as never),
    ).resolves.not.toThrow()

    expect(payload.logger.error).toHaveBeenCalled()
  })

  it("dismissing one member doesn't touch siblings' hasDuplicate or duplicateDismissed", async () => {
    // Dismissal alone is a metadata-only edit (checksum unchanged) and never
    // reaches recompute at all — see the guard below. What this test
    // actually guards: when some *other* group-affecting write does
    // recompute (here, a third doc joining), a dismissed member's
    // `duplicateDismissed` must survive untouched, since recompute only
    // ever writes `hasDuplicate`.
    const docs: FakeDoc[] = [
      { id: 1, checksum: 'abc', hasDuplicate: true, duplicateDismissed: true },
      { id: 2, checksum: 'abc', hasDuplicate: true, duplicateDismissed: false },
      { id: 3, checksum: 'abc', hasDuplicate: false, duplicateDismissed: false },
    ]
    const { req } = fakeReq(docs)

    await flagDuplicateAfterChange({
      doc: docs[2],
      previousDoc: undefined,
      req,
      context: {},
    } as never)

    expect(docs[0]!.duplicateDismissed).toBe(true)
    expect(docs[1]!.duplicateDismissed).toBe(false)
    expect(docs.every((doc) => doc.hasDuplicate)).toBe(true)
  })

  it('skips recompute entirely for a metadata-only edit (e.g. dismissing the flag)', async () => {
    const docs: FakeDoc[] = [
      { id: 1, checksum: 'abc', hasDuplicate: true, duplicateDismissed: false },
      { id: 2, checksum: 'abc', hasDuplicate: true, duplicateDismissed: false },
    ]
    const { req, payload } = fakeReq(docs)

    await flagDuplicateAfterChange({
      doc: { ...docs[0]!, duplicateDismissed: true },
      previousDoc: docs[0],
      req,
      context: {},
    } as never)

    expect(payload.find).not.toHaveBeenCalled()
  })

  it('a new upload joining an already-dismissed group starts undismissed, and recompute never sets duplicateDismissed', async () => {
    const docs: FakeDoc[] = [
      { id: 1, checksum: 'abc', hasDuplicate: false, duplicateDismissed: true },
      // Schema default (`duplicateDismissed: false`) applies to the new doc — not this hook's job to set it.
      { id: 2, checksum: 'abc', hasDuplicate: false, duplicateDismissed: false },
    ]
    const { req } = fakeReq(docs)

    await flagDuplicateAfterChange({
      doc: docs[1],
      previousDoc: undefined,
      req,
      context: {},
    } as never)

    expect(docs[0]!.hasDuplicate).toBe(true)
    expect(docs[1]!.hasDuplicate).toBe(true)
    expect(docs[0]!.duplicateDismissed).toBe(true)
    expect(docs[1]!.duplicateDismissed).toBe(false)
  })
})

describe('flagDuplicateAfterDelete', () => {
  it('shrinks a group of 4 to 3 and keeps the remaining members flagged', async () => {
    const docs: FakeDoc[] = [
      { id: 1, checksum: 'abc', hasDuplicate: true },
      { id: 2, checksum: 'abc', hasDuplicate: true },
      { id: 3, checksum: 'abc', hasDuplicate: true },
    ]
    const { req } = fakeReq(docs)

    await flagDuplicateAfterDelete({
      doc: { id: 4, checksum: 'abc' },
      req,
    } as never)

    expect(docs.every((doc) => doc.hasDuplicate)).toBe(true)
  })

  it('unflags the last survivor once a group shrinks to 1', async () => {
    const docs: FakeDoc[] = [{ id: 1, checksum: 'abc', hasDuplicate: true }]
    const { req } = fakeReq(docs)

    await flagDuplicateAfterDelete({
      doc: { id: 2, checksum: 'abc' },
      req,
    } as never)

    expect(docs[0]!.hasDuplicate).toBe(false)
  })

  it('never throws when the recompute itself fails, and logs instead', async () => {
    const docs: FakeDoc[] = [{ id: 1, checksum: 'abc', hasDuplicate: true }]
    const { req, payload } = fakeReq(docs)
    payload.find.mockRejectedValueOnce(new Error('db unavailable'))

    await expect(
      flagDuplicateAfterDelete({ doc: { id: 2, checksum: 'abc' }, req } as never),
    ).resolves.not.toThrow()

    expect(payload.logger.error).toHaveBeenCalled()
  })
})
