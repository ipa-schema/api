export interface ApiError {
  code: number | string
  message: string
  stack?: string
  [k: string]: any
}

export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  success: boolean
  error?: ApiError
  [k: string]: any
}

/**
 * @deprecated 使用 ApiResponse 代替
 */
export type JsonResponse<T> = ApiResponse<T>

export type PositiveApiResponse<T> = Pick<
  ApiResponse<T>,
  'data' | 'message'
> & { success: true }

export type NegativeApiResponse<T> = Omit<ApiResponse<T>, 'data'> & Partial<Pick<ApiResponse<T>, 'data'>> & {
  success: false
  error: ApiError
}
