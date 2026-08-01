import { describe, expect, it } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('joins truthy classnames with a space', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c')
  })

  it('drops falsy values', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('returns an empty string when nothing survives', () => {
    expect(cx(false, undefined, null)).toBe('')
  })
})
