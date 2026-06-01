export interface Option<V> {
  id?: any
  label: string
  value: V
  children?: Option<V>[]
  [k: string]: any
}

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const
export type HttpMethodType = (typeof HTTP_METHODS)[number]
export const HttpMethodOptions: Option<string>[] = HTTP_METHODS.map(m => ({ label: m, value: m }))

export const API_BODY_TYPES = [
  'none',
  'form-data',
  'x-www-form-urlencoded',
  'raw',
  'binary',
] as const
export type ApiBodyType = (typeof API_BODY_TYPES)[number]

/**
 * TODO: use third party library to replace this
 */
export const MIME_TYPES = [
  'application/json',
  'application/x-www-form-urlencoded',
  'multipart/form-data',
] as const
export type MimeType = (typeof MIME_TYPES)[number]
/**
 * TODO：use third party library to replace this
 */
export const MimeTypeOptions: Option<MimeType>[] = [
  { label: 'JSON', value: 'application/json' },
]

export const AUTH_TYPES = ['NONE', 'BASIC', 'JWT', 'BEARER'] as const
export type AuthType = (typeof AUTH_TYPES)[number]

export interface HttpKvEntry {
  name: string
  value?: any
  description?: string
}

export interface HttpAuth {
  type: AuthType
  token?: string
  username?: string
  password?: string
}

export interface HttpBody {
  contentType?: MimeType
  type: ApiBodyType
  raw?: any
  json?: string
}

export interface HttpRequest {
  method: HttpMethodType
  url: string
  headerItems?: HttpKvEntry[]
  paramItems?: HttpKvEntry[]
  body?: HttpBody
  auth?: HttpAuth
}
