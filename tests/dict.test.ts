import { describe, expect, it } from 'bun:test'
import { dict } from '@/index'

describe('dict', () => {
  it('join', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    }
    const opts = {
      kvDelimeter: '=',
      entryDelimeter: ',',
    }
    const expected = 'a=1,b=2,c=3'
    expect(dict.join(obj, opts)).toBe(expected)
  })

  it('name', () => {
    expect(dict.name()).toBe('dict')
  })

  it('join excludes nil values by default', () => {
    const result = dict.join({ a: 1, b: null, c: undefined, d: 4 })
    expect(result).toBe('a:1\nd:4')
  })

  it('join includes nil values when excludeNil is false', () => {
    const result = dict.join({ a: 1, b: null, c: undefined }, { excludeNil: false })
    expect(result).toBe('a:1\nb:null\nc:undefined')
  })

  it('join uses default options when opts is partial', () => {
    const result = dict.join({ x: 10, y: 20 })
    expect(result).toBe('x:10\ny:20')
  })

  it('join handles empty object', () => {
    expect(dict.join({})).toBe('')
  })
})
