import { describe, expect, it } from 'vitest'
import type { PayloadRequest } from 'payload'

import { stampClose } from './stamp-close'

function run(
  data: Record<string, unknown>,
  originalDoc: Record<string, unknown> | undefined,
  userId: number | undefined,
) {
  const req = { user: userId ? { id: userId } : undefined } as unknown as PayloadRequest
  return stampClose({ data, originalDoc, req, operation: 'update' } as never)
}

describe('stampClose', () => {
  it('stamps closedBy/closedAt when status transitions to closed', () => {
    const result = run({ status: 'closed' }, { status: 'unread' }, 7) as Record<
      string,
      unknown
    >

    expect(result.closedBy).toBe(7)
    expect(typeof result.closedAt).toBe('string')
  })

  it('clears closedBy/closedAt when status transitions back to unread', () => {
    const result = run(
      { status: 'unread' },
      { status: 'closed', closedBy: 7, closedAt: '2026-01-01T00:00:00.000Z' },
      7,
    ) as Record<string, unknown>

    expect(result.closedBy).toBeNull()
    expect(result.closedAt).toBeNull()
  })

  it('leaves closedBy/closedAt untouched when status is unchanged', () => {
    const result = run(
      { status: 'closed', closedBy: 7, closedAt: '2026-01-01T00:00:00.000Z' },
      { status: 'closed', closedBy: 7, closedAt: '2026-01-01T00:00:00.000Z' },
      9,
    ) as Record<string, unknown>

    expect(result.closedBy).toBe(7)
    expect(result.closedAt).toBe('2026-01-01T00:00:00.000Z')
  })

  it('is a no-op when data carries no status change (e.g. anon-guard already stripped it)', () => {
    const result = run({ name: 'Jane' }, { status: 'unread' }, undefined) as Record<
      string,
      unknown
    >

    expect(result).toEqual({ name: 'Jane' })
  })
})
