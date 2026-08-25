import { describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'

import { flagOwnDuplicate } from './flag-own-duplicate'
import { matchByChecksum, type ChecksumWhere } from './test-support'

type FakeDoc = { id: number; checksum: string }

/** Minimal in-memory stand-in for the Local API surface this hook calls. */
function fakeReq(docs: FakeDoc[]) {
  const payload = {
    find: vi.fn(async ({ where }: { where: ChecksumWhere }) => {
      const matches = matchByChecksum(docs, where)
      return { totalDocs: matches.length, docs: matches.slice(0, 1) }
    }),
  }
  const req = { payload } as unknown as PayloadRequest
  return req
}

describe('flagOwnDuplicate', () => {
  it('flags a new doc whose checksum already matches an existing doc', async () => {
    const req = fakeReq([{ id: 1, checksum: 'abc' }])

    const data = await flagOwnDuplicate({
      data: { checksum: 'abc' },
      req,
      originalDoc: undefined,
      operation: 'create',
    } as never)

    expect(data.hasDuplicate).toBe(true)
  })

  it('leaves a new doc with unique content unflagged', async () => {
    const req = fakeReq([])

    const data = await flagOwnDuplicate({
      data: { checksum: 'unique' },
      req,
      originalDoc: undefined,
      operation: 'create',
    } as never)

    expect(data.hasDuplicate).toBe(false)
  })

  it('excludes itself when checking on update, so a lone survivor is not flagged', async () => {
    const req = fakeReq([{ id: 5, checksum: 'abc' }])

    const data = await flagOwnDuplicate({
      data: { checksum: 'abc' },
      req,
      originalDoc: { id: 5, checksum: 'old' },
      operation: 'update',
    } as never)

    expect(data.hasDuplicate).toBe(false)
  })

  it('flags on update when a different doc still shares the new checksum', async () => {
    const req = fakeReq([
      { id: 5, checksum: 'abc' },
      { id: 6, checksum: 'abc' },
    ])

    const data = await flagOwnDuplicate({
      data: { checksum: 'abc' },
      req,
      originalDoc: { id: 5, checksum: 'old' },
      operation: 'update',
    } as never)

    expect(data.hasDuplicate).toBe(true)
  })

  it('skips the lookup entirely on a metadata-only edit (checksum unchanged)', async () => {
    const req = fakeReq([{ id: 5, checksum: 'abc' }])
    const findSpy = req.payload.find as ReturnType<typeof vi.fn>

    const data = await flagOwnDuplicate({
      data: { checksum: 'abc', alt: 'updated' },
      req,
      originalDoc: { id: 5, checksum: 'abc' },
      operation: 'update',
    } as never)

    expect(findSpy).not.toHaveBeenCalled()
    expect(data.hasDuplicate).toBeUndefined()
  })

  it('ignores delete operations', async () => {
    const req = fakeReq([{ id: 1, checksum: 'abc' }])
    const findSpy = req.payload.find as ReturnType<typeof vi.fn>

    const data = await flagOwnDuplicate({
      data: { checksum: 'abc' },
      req,
      originalDoc: { id: 1, checksum: 'abc' },
      operation: 'delete',
    } as never)

    expect(findSpy).not.toHaveBeenCalled()
    expect(data.hasDuplicate).toBeUndefined()
  })

  it('does nothing when there is no checksum on the data', async () => {
    const req = fakeReq([])
    const findSpy = req.payload.find as ReturnType<typeof vi.fn>

    const data = await flagOwnDuplicate({
      data: {},
      req,
      originalDoc: undefined,
      operation: 'create',
    } as never)

    expect(findSpy).not.toHaveBeenCalled()
    expect(data.hasDuplicate).toBeUndefined()
  })
})
