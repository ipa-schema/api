import { describe, expect, it } from 'bun:test'

import { resolveCssVar } from '@/browser/index'

describe('browser', () => {
  it('returns raw string if not var()', () => {
    expect(resolveCssVar('#ff0')).toBe('#ff0')
  })

  it('trims whitespace inside var()', () => {
    expect(resolveCssVar('var( --a-undefined-css-variable )')).toBe('')
  })

  it('returns empty for undefined CSS variable', () => {
    expect(resolveCssVar('var(--a-undefined-css-variable)')).toBe('')
  })
})
