import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import type { PayloadRequest } from 'payload'

import { computeChecksum } from './compute-checksum'

function fakeArgs(data: Record<string, unknown> = {}) {
  return { data }
}

/** The hook's return type is a large operation-specific union; tests only care about `data`. */
function asData(result: unknown) {
  return (result as { data: Record<string, unknown> }).data
}

describe('computeChecksum', () => {
  it('sets checksum from file bytes on create', async () => {
    const data = Buffer.from('photo bytes')
    const req = { file: { data, name: 'a.jpg' } } as unknown as PayloadRequest
    const args = fakeArgs()

    const result = await computeChecksum({ args, operation: 'create', req } as never)

    expect(asData(result).checksum).toBe(createHash('sha256').update(data).digest('hex'))
  })

  it('sets checksum on update when the operation replaces the file', async () => {
    const data = Buffer.from('new photo bytes')
    const req = { file: { data, name: 'b.jpg' } } as unknown as PayloadRequest
    const args = fakeArgs({ alt: 'kept' })

    const result = await computeChecksum({ args, operation: 'update', req } as never)

    expect(asData(result).checksum).toBe(createHash('sha256').update(data).digest('hex'))
    expect(asData(result).alt).toBe('kept')
  })

  it('leaves data untouched when no file is present (metadata-only update)', async () => {
    const req = {} as unknown as PayloadRequest
    const args = fakeArgs({ alt: 'kept' })

    const result = await computeChecksum({ args, operation: 'update', req } as never)

    expect(asData(result)).toEqual({ alt: 'kept' })
  })

  it('ignores delete operations', async () => {
    const req = {
      file: { data: Buffer.from('x'), name: 'x.jpg' },
    } as unknown as PayloadRequest
    const args = fakeArgs({})

    const result = await computeChecksum({ args, operation: 'delete', req } as never)

    expect(asData(result)).toEqual({})
  })
})
