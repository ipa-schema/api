import type { ApiError, ApiResponse } from './types'

export * from './types'

/**
 * 将任意值转换为ApiError
 *
 * 注意此方法假定传入的一定是错误
 *
 * @param v
 * @returns ApiError
 */
export function toApiError(v: unknown): ApiError {
  if (v instanceof Response) {
    return {
      code: v.status,
      message: v.statusText,
    }
  }
  if (v instanceof Error) {
    return {
      code: -1,
      message: v.message,
      stack: v.stack,
    }
  }

  if (typeof v === 'object' && v !== null) {
    const obj = v as Record<string, unknown>
    return {
      code: (obj.code ?? -1) as number | string,
      message: (obj.message ?? obj.msg ?? obj.errmsg ?? obj.errorMessage ?? String(v)) as string,
    }
  }

  if (typeof v === 'number') {
    return {
      code: v,
      message: String(v),
    }
  }

  return {
    code: -1,
    message: String(v ?? 'unknown error'),
  }
}

/**
 * @param v 任意值
 * @returns 错误消息
 */
export function pickErrorMessage(v: any) {
  return toApiError(v).message
}

/**
 * 成功响应
 * @param r
 * @returns ApiResponse
 */
export function positiveApiResponse<T = unknown>(
  r: Omit<ApiResponse<T>, 'success'>,
): ApiResponse<T> {
  const base = r && typeof r !== 'object' ? { data: r } : r

  return {
    ...base,
    success: true,
  }
}

/**
 * 失败响应
 * @param error
 * @returns ApiResponse
 */
export function negativeApiResponse<T = unknown>(
  error: Partial<ApiError>,
): ApiResponse<T> {
  const base = error && typeof error !== 'object'
    ? { message: String(error) }
    : error
  return {
    error: {
      code: -1,
      message: 'unknown error',
      ...base,
    },
    success: false,
  }
}

/**
 * 解析接口响应的json/txt数据，如果成功会resolve({success,data})，如果失败则reject(message)
 * @param r 响应
 * @returns promise
 */
export async function parseApiResponse<T>(r: ApiResponse<T>): Promise<ApiResponse<T>>
export async function parseApiResponse<T = unknown>(r: Response): Promise<ApiResponse<T>>
export async function parseApiResponse<T = unknown>(r: null | undefined): Promise<ApiResponse<T>>
export async function parseApiResponse<T = unknown>(
  r: unknown,
): Promise<ApiResponse<T>> {
  if (!r) {
    return Promise.reject(new Error('unexpected empty value'))
  }
  if (r instanceof Response) {
    // console.debug(r);
    if (r.status !== 200) {
      return Promise.reject(
        new Error(`${r.status}:${r.statusText || r.status}`),
      )
    }
    const contentType = r.headers.get('Content-Type') ?? 'application/json'
    if (!contentType.endsWith('json')) {
      return r.text().then((txt) => {
        return Promise.resolve(
          positiveApiResponse<T>({
            data: txt as T,
          }),
        )
      })
    }
    return r.json().then(json => parseApiResponse(json as ApiResponse<T>))
  }
  const res = r as ApiResponse<T>
  return res.success
    ? Promise.resolve(res)
    : Promise.reject(new Error(`${pickErrorMessage(res.error)}`))
}
