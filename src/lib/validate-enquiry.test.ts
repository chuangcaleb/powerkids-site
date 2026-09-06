import { describe, expect, it } from 'vitest'
import { validateField } from './validate-enquiry'

describe('validateField', () => {
  describe('name', () => {
    it('requires a value', () => {
      expect(validateField('name', '', 'email')).toBe('Required.')
    })

    it('rejects over 80 characters', () => {
      expect(validateField('name', 'a'.repeat(81), 'email')).toBe('Too long.')
    })

    it('accepts a normal name', () => {
      expect(validateField('name', 'Jane Tan', 'email')).toBeUndefined()
    })
  })

  describe('phone — conditional on replyBy', () => {
    it('is required when replyBy is whatsapp', () => {
      expect(validateField('phone', '', 'whatsapp')).toBe('Required.')
    })

    it('is required when replyBy is call', () => {
      expect(validateField('phone', '', 'call')).toBe('Required.')
    })

    it('is optional when replyBy is email', () => {
      expect(validateField('phone', '', 'email')).toBeUndefined()
    })

    it('accepts digits, spaces, +, -, ()', () => {
      expect(validateField('phone', '+60 12-345 6789', 'whatsapp')).toBeUndefined()
    })

    it('rejects letters', () => {
      expect(validateField('phone', 'call me maybe', 'whatsapp')).toBe(
        'Enter a valid phone number.',
      )
    })

    it('rejects shorter than 7 chars when provided', () => {
      expect(validateField('phone', '123', 'whatsapp')).toBe(
        'Enter a valid phone number.',
      )
    })

    it('rejects longer than 20 chars', () => {
      expect(validateField('phone', '1'.repeat(21), 'whatsapp')).toBe(
        'Enter a valid phone number.',
      )
    })
  })

  describe('email — conditional on replyBy', () => {
    it('is required when replyBy is email', () => {
      expect(validateField('email', '', 'email')).toBe('Required.')
    })

    it('is optional when replyBy is whatsapp', () => {
      expect(validateField('email', '', 'whatsapp')).toBeUndefined()
    })

    it('is optional when replyBy is call', () => {
      expect(validateField('email', '', 'call')).toBeUndefined()
    })

    it('accepts a well-formed address', () => {
      expect(validateField('email', 'jane@example.com', 'email')).toBeUndefined()
    })

    it('rejects a malformed address', () => {
      expect(validateField('email', 'not-an-email', 'email')).toBe(
        'Enter a valid email address.',
      )
    })

    it('rejects over 254 characters', () => {
      const longEmail = `${'a'.repeat(250)}@b.co`
      expect(validateField('email', longEmail, 'email')).toBe('Too long.')
    })
  })

  describe('enquiryType', () => {
    it('is always required regardless of replyBy', () => {
      expect(validateField('enquiryType', '', 'email')).toBe('Required.')
    })

    it('accepts a chosen id', () => {
      expect(validateField('enquiryType', 'row-id-1', 'email')).toBeUndefined()
    })
  })

  describe('message', () => {
    it('is optional', () => {
      expect(validateField('message', '', 'email')).toBeUndefined()
    })

    it('rejects over 1000 characters', () => {
      expect(validateField('message', 'a'.repeat(1001), 'email')).toBe('Too long.')
    })

    it('accepts up to 1000 characters', () => {
      expect(validateField('message', 'a'.repeat(1000), 'email')).toBeUndefined()
    })
  })
})
