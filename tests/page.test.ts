import { describe, expect, it } from 'bun:test'
import { toPager } from '@/index'

describe('toPager', () => {
  it('returns undefined for null/undefined', () => {
    expect(toPager(undefined)).toBeUndefined()
    expect(toPager(null as any)).toBeUndefined()
  })

  it('maps camelCase fields', () => {
    const result = toPager({ pageAt: 1, pageSize: 20, total: 100 })
    expect(result).toEqual({ pageBase: undefined, pageAt: 1, pageSize: 20, total: 100 })
  })

  it('falls back to snake_case fields', () => {
    const result = toPager({ page_at: 1, page_size: 20, page_base: 0 })
    expect(result).toEqual({ pageBase: 0, pageAt: 1, pageSize: 20, total: undefined })
  })

  it('prefers camelCase over snake_case', () => {
    const result = toPager({ page_at: 1, pageAt: 2, page_size: 10, pageSize: 20 })
    expect(result).toEqual({ pageBase: undefined, pageAt: 2, pageSize: 20, total: undefined })
  })

  it('falls back through pageAt -> page_at -> page', () => {
    expect(toPager({ page: 5, pageSize: 10 })?.pageAt).toBe(5)
  })

  it('falls back through pageSize -> page_size -> size -> limit', () => {
    expect(toPager({ pageAt: 1, size: 50 })?.pageSize).toBe(50)
    expect(toPager({ pageAt: 1, limit: 100 })?.pageSize).toBe(100)
  })

  it('preserves extra properties from PageResult', () => {
    const result = toPager({ pageAt: 1, pageSize: 10, items: [1, 2] })
    expect(result).toEqual({ pageBase: undefined, pageAt: 1, pageSize: 10, total: undefined })
  })
})
