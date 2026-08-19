import { describe, expect, it } from 'vitest'
import { lexicalHasText } from './lexical-has-text'

const withText = (text: string) => ({
  root: {
    children: [{ children: [{ text }] }],
  },
})

describe('lexicalHasText', () => {
  it('is false for null or undefined', () => {
    expect(lexicalHasText(null)).toBe(false)
    expect(lexicalHasText(undefined)).toBe(false)
  })

  it('is false for an empty paragraph shell', () => {
    expect(lexicalHasText({ root: { children: [{ children: [] }] } })).toBe(false)
  })

  it('is false for whitespace-only text', () => {
    expect(lexicalHasText(withText('   '))).toBe(false)
  })

  it('is true when a nested text node has content', () => {
    expect(lexicalHasText(withText('Hello'))).toBe(true)
  })
})
