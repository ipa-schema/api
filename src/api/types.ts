/*
 * @Author: leoking
 * @Date: 2025-06-10 21:54:25
 * @LastEditTime: 2025-06-12 20:35:54
 * @LastEditors: leoking
 * @Description:
 */

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
