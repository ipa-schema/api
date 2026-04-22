import { describe, expect, it } from 'bun:test'
import { toPager } from '@/index'

describe('toPager', () => {
  it('undefined', () => {
    expect(toPager(undefined)).toBeUndefined()
  })
})
