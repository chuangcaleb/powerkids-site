import { fromPartial } from '@total-typescript/shoehorn'
import { describe, expect, it } from 'vitest'
import type { PayloadRequest } from 'payload'

import { stampClose } from './stamp-close'

function run(
  data: Record<string, unknown>,
  originalDoc: Record<string, unknown> | undefined,
  userId: number | undefined,
): Record<string, unknown> {
  const req = fromPartial<PayloadRequest>({ user: userId ? { id: userId } : undefined })
  return stampClose(fromPartial({ data, originalDoc, req, operation: 'update' }))
}

describe('stampClose', () => {
  it('stamps closedBy/closedAt when status transitions to closed', () => {
    const result = run({ status: 'closed' }, { status: 'unread' }, 7)

    expect(result.closedBy).toBe(7)
    expect(typeof result.closedAt).toBe('string')
  })

  it('clears closedBy/closedAt when status transitions back to unread', () => {
    const result = run(
      { status: 'unread' },
      { status: 'closed', closedBy: 7, closedAt: '2026-01-01T00:00:00.000Z' },
      7,
    )

    expect(result.closedBy).toBeNull()
    expect(result.closedAt).toBeNull()
  })

  it('leaves closedBy/closedAt untouched when status is unchanged', () => {
    const result = run(
      { status: 'closed', closedBy: 7, closedAt: '2026-01-01T00:00:00.000Z' },
      { status: 'closed', closedBy: 7, closedAt: '2026-01-01T00:00:00.000Z' },
      9,
    )

    expect(result.closedBy).toBe(7)
    expect(result.closedAt).toBe('2026-01-01T00:00:00.000Z')
  })

  it('is a no-op when data carries no status change (e.g. anon-guard already stripped it)', () => {
    const result = run({ name: 'Jane' }, { status: 'unread' }, undefined)

    expect(result).toEqual({ name: 'Jane' })
  })
})
