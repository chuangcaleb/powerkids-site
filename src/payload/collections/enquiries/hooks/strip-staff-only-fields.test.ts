import { describe, expect, it } from 'vitest'
import type { PayloadRequest } from 'payload'

import { stripStaffOnlyFields } from './strip-staff-only-fields'

function run(data: Record<string, unknown>, user?: object) {
  const req = { user } as unknown as PayloadRequest
  return stripStaffOnlyFields({ data, req } as never)
}

describe('stripStaffOnlyFields', () => {
  it('strips staff-only keys when no authenticated user is present', () => {
    const result = run({
      name: 'Jane',
      status: 'closed',
      closedBy: 1,
      closedAt: '2026-01-01',
      confirmationFailed: true,
      adminNotificationFailed: true,
    }) as Record<string, unknown>

    expect(result).toEqual({ name: 'Jane' })
  })

  it('leaves staff-only keys untouched when an authenticated user is present', () => {
    const data = { name: 'Jane', status: 'closed', closedBy: 1 }
    const result = run(data, { id: 1 }) as Record<string, unknown>

    expect(result).toEqual({ name: 'Jane', status: 'closed', closedBy: 1 })
  })

  it('is a no-op when none of the staff-only keys are present', () => {
    const result = run({ name: 'Jane' }) as Record<string, unknown>

    expect(result).toEqual({ name: 'Jane' })
  })
})
