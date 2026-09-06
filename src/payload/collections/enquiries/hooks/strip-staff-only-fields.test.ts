import { fromPartial } from '@total-typescript/shoehorn'
import { describe, expect, it } from 'vitest'
import type { PayloadRequest } from 'payload'

import { stripStaffOnlyFields } from './strip-staff-only-fields'

function run(
  data: Record<string, unknown>,
  user?: object,
  context: Record<string, unknown> = {},
): Record<string, unknown> {
  const req = fromPartial<PayloadRequest>({ user })
  return stripStaffOnlyFields(fromPartial({ data, req, context }))
}

describe('stripStaffOnlyFields', () => {
  it('strips staff-only keys when no authenticated user is present', () => {
    const result = run({
      name: 'Jane',
      status: 'closed',
      closedBy: 1,
      closedAt: '2026-01-01',
      notificationErrors: ['boom'],
    })

    expect(result).toEqual({ name: 'Jane' })
  })

  it('leaves staff-only keys untouched when an authenticated user is present', () => {
    const data = { name: 'Jane', status: 'closed', closedBy: 1 }
    const result = run(data, { id: 1 })

    expect(result).toEqual({ name: 'Jane', status: 'closed', closedBy: 1 })
  })

  it('is a no-op when none of the staff-only keys are present', () => {
    const result = run({ name: 'Jane' })

    expect(result).toEqual({ name: 'Jane' })
  })

  it('leaves staff-only keys untouched for an anonymous request flagged as a system write', () => {
    const data = { name: 'Jane', notificationErrors: ['boom'] }
    const result = run(data, undefined, { systemWrite: true })

    expect(result).toEqual({ name: 'Jane', notificationErrors: ['boom'] })
  })
})
