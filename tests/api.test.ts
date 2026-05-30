import type { ApiResponse } from '@/api/types'
import { describe, expect, it } from 'bun:test'
import {
  negativeApiResponse,
  parseApiResponse,
  positiveApiResponse,
  toApiError,
} from '@/index'

describe('toApiError', () => {
  it('raw', () => {
    const e = toApiError({ message: 'xxxxx', code: -1 })
    expect(e.code).toBe(-1)
    expect(e.message).toBe('xxxxx')
  })
})

describe('ApiResponse', () => {
  it('positiveApiResponse', () => {
    const r = positiveApiResponse({ data: 1 })
    expect(r.success).toBe(true)
  })
  it('negativeApiResponse', () => {
    const r1 = negativeApiResponse({ message: 'error', code: -1 })
    expect(r1.success).toBe(false)
    const r2 = negativeApiResponse('xxxxx' as any)
    expect(r2.success).toBe(false)
  })
})

describe('parseApiResponse', () => {
  it('rejects on falsy input', async () => {
    await expect(parseApiResponse(null)).rejects.toThrow('unexpected empty value')
    await expect(parseApiResponse(undefined)).rejects.toThrow('unexpected empty value')
  })

  it('rejects on non-200 Response', async () => {
    const res = new Response('Not Found', { status: 404, statusText: 'Not Found' })
    await expect(parseApiResponse(res)).rejects.toThrow('404:Not Found')
  })

  it('resolves with text from non-json Response', async () => {
    const res = new Response('hello world', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
    const result = await parseApiResponse(res)
    expect(result.success).toBe(true)
    expect(result.data).toBe('hello world')
  })

  it('resolves with parsed data from json success Response', async () => {
    const body = JSON.stringify({ success: true, data: { id: 1 } })
    const res = new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
    const result = await parseApiResponse<{ id: number }>(res)
    expect(result.success).toBe(true)
    expect(result.data).toEqual({ id: 1 })
  })

  it('rejects on json error Response', async () => {
    const body = JSON.stringify({ success: false, error: { message: 'fail' } })
    const res = new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
    await expect(parseApiResponse(res)).rejects.toThrow('fail')
  })

  it('resolves with ApiResponse object directly', async () => {
    const input: ApiResponse<number> = { success: true, data: 42 }
    const result = await parseApiResponse(input)
    expect(result.success).toBe(true)
    expect(result.data).toBe(42)
  })

  it('rejects with ApiResponse error object directly', async () => {
    const input = { success: false, error: { code: -1, message: 'bad' } }
    await expect(parseApiResponse(input)).rejects.toThrow('bad')
  })
})
