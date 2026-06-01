import type { HttpMethodType, MimeType } from '@/index'
import { describe, expect, it } from 'bun:test'
import {
  API_BODY_TYPES,
  AUTH_TYPES,
  HTTP_METHODS,
  HttpMethodOptions,

  MIME_TYPES,

  MimeTypeOptions,
} from '@/index'

describe('HTTP_METHODS', () => {
  it('contains standard HTTP methods', () => {
    expect(HTTP_METHODS).toEqual(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
  })

  it('has correct TypeScript type inference', () => {
    const method: HttpMethodType = 'GET'
    expect(HTTP_METHODS).toContain(method)
  })
})

describe('MIME_TYPES', () => {
  it('contains common MIME types', () => {
    expect(MIME_TYPES).toContain('application/json')
    expect(MIME_TYPES).toContain('application/x-www-form-urlencoded')
    expect(MIME_TYPES).toContain('multipart/form-data')
  })
})

describe('API_BODY_TYPES', () => {
  it('contains expected body types', () => {
    expect(API_BODY_TYPES).toContain('none')
    expect(API_BODY_TYPES).toContain('form-data')
    expect(API_BODY_TYPES).toContain('raw')
  })
})

describe('AUTH_TYPES', () => {
  it('contains expected auth types', () => {
    expect(AUTH_TYPES).toContain('NONE')
    expect(AUTH_TYPES).toContain('BASIC')
    expect(AUTH_TYPES).toContain('JWT')
    expect(AUTH_TYPES).toContain('BEARER')
  })
})

describe('HttpMethodOptions', () => {
  it('has an entry for every HTTP method', () => {
    expect(HttpMethodOptions).toHaveLength(HTTP_METHODS.length)
  })

  it('each option has label and value matching', () => {
    for (const opt of HttpMethodOptions) {
      expect(opt.label).toBe(opt.value)
      expect(HTTP_METHODS).toContain(opt.value)
    }
  })
})

describe('MimeTypeOptions', () => {
  it('contains JSON entry', () => {
    const json = MimeTypeOptions.find(o => o.value === 'application/json')
    expect(json).toBeDefined()
    expect(json!.label).toBe('JSON')
  })

  it('value type is MimeType', () => {
    const values = MimeTypeOptions.map(o => o.value)
    for (const v of values) {
      expect(MIME_TYPES).toContain(v satisfies MimeType)
    }
  })
})
