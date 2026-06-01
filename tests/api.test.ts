import type { ApiResponse } from '@/api/types'
import { describe, expect, it } from 'bun:test'
import {
  negativeApiResponse,
  parseApiResponse,
  pickErrorMessage,
  positiveApiResponse,
  toApiError,
} from '@/index'

describe('toApiError', () => {
  it('raw', () => {
    const e = toApiError({ message: 'xxxxx', code: -1 })
    expect(e.code).toBe(-1)
    expect(e.message).toBe('xxxxx')
  })

  it('handles Response object', () => {
    const res = new Response(null, { status: 404, statusText: 'Not Found' })
    const e = toApiError(res)
    expect(e.code).toBe(404)
    expect(e.message).toBe('Not Found')
  })

  it('handles Error object', () => {
    const err = new Error('something went wrong')
    const e = toApiError(err)
    expect(e.code).toBe(-1)
    expect(e.message).toBe('something went wrong')
    expect(e.stack).toBeString()
  })

  it('handles numeric input', () => {
    const e = toApiError(500)
    expect(e.code).toBe(500)
    expect(e.message).toBe('500')
  })

  it('handles null', () => {
    const e = toApiError(null)
    expect(e.code).toBe(-1)
    expect(e.message).toBe('unknown error')
  })

  it('handles undefined', () => {
    const e = toApiError(undefined)
    expect(e.code).toBe(-1)
    expect(e.message).toBe('unknown error')
  })

  it('falls back through alternative message keys', () => {
    const e = toApiError({ msg: 'fallback-msg', code: 1 })
    expect(e.message).toBe('fallback-msg')
  })

  it('falls back to errmsg', () => {
    const e = toApiError({ errmsg: 'errmsg-value', code: 2 })
    expect(e.message).toBe('errmsg-value')
  })

  it('falls back to errorMessage', () => {
    const e = toApiError({ errorMessage: 'errorMessage-value', code: 3 })
    expect(e.message).toBe('errorMessage-value')
  })

  it('stringifies unknown object', () => {
    const e = toApiError({ unexpected: true })
    expect(e.message).toContain('[object Object]')
  })
})

describe('pickErrorMessage', () => {
  it('extracts message from ApiError-like object', () => {
    expect(pickErrorMessage({ code: -1, message: 'test' })).toBe('test')
  })

  it('handles Error instance', () => {
    expect(pickErrorMessage(new Error('err'))).toBe('err')
  })
})

describe('ApiResponse', () => {
  it('positiveApiResponse', () => {
    const r = positiveApiResponse({ data: 1 })
    expect(r.success).toBe(true)
  })

  it('positiveApiResponse wraps primitive data', () => {
    const r = positiveApiResponse('hello' as any)
    expect(r.success).toBe(true)
    expect(r.data).toBe('hello')
  })

  it('negativeApiResponse', () => {
    const r1 = negativeApiResponse({ message: 'error', code: -1 })
    expect(r1.success).toBe(false)
    const r2 = negativeApiResponse('xxxxx' as any)
    expect(r2.success).toBe(false)
  })

  it('negativeApiResponse with empty error still generates defaults', () => {
    const r = negativeApiResponse({})
    expect(r.success).toBe(false)
    expect(r.error).toBeDefined()
    expect(r.error!.code).toBe(-1)
    expect(r.error!.message).toBe('unknown error')
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

  it('falls back to status number when statusText is empty', async () => {
    const res = new Response('', { status: 500, statusText: '' })
    await expect(parseApiResponse(res)).rejects.toThrow('500:500')
  })
})
