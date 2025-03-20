import { isDef, isUndef } from '../src/utils'

describe('type utils', () => {
  describe('isUndef', () => {
    test('returns true for null', () => {
      expect(isUndef(null)).toBe(true)
      expect(typeof isUndef(null)).toBe('boolean')
    })

    test('returns true for undefined', () => {
      expect(isUndef(undefined)).toBe(true)
    })

    test('returns false for defined values', () => {
      expect(isUndef(0)).toBe(false)
      expect(isUndef('')).toBe(false)
      expect(isUndef({})).toBe(false)
    })
  })

  describe('isDef', () => {
    test('returns false for null', () => {
      expect(isDef(null)).toBe(false)
    })

    test('returns false for undefined', () => {
      expect(isDef(undefined)).toBe(false)
    })

    test('returns true for defined values', () => {
      expect(isDef(0)).toBe(true)
      expect(isDef('')).toBe(true)
      expect(isDef([])).toBe(true)
      expect(typeof isDef({})).toBe('boolean')
    })
  })
})
