import { describe, expect, it } from 'vitest'
import { iconField } from './icon'

const validate = (field: ReturnType<typeof iconField>, value: unknown) =>
  // Payload passes options this field's validation never reads.
  (field.validate as (value: unknown) => string | true)(value)

describe('iconField validation', () => {
  it('accepts a registry name, and an empty value when optional', () => {
    const field = iconField()
    expect(validate(field, 'GraduationCap')).toBe(true)
    expect(validate(field, null)).toBe(true)
    expect(validate(field, '')).toBe(true)
  })

  it('rejects names outside the registry, naming them', () => {
    expect(validate(iconField(), 'pen-line')).toContain('pen-line')
    expect(validate(iconField({ hasMany: true }), ['Star', 'Nope'])).toContain('Nope')
  })

  it('rejects an empty required value, including an empty array', () => {
    expect(validate(iconField({ required: true }), null)).toBe('Pick an icon.')
    expect(validate(iconField({ hasMany: true, required: true }), [])).toBe(
      'Pick at least one icon.',
    )
  })
})
