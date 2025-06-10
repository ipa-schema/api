/*
 * @Author: leoking
 * @Date: 2025-06-10 21:54:25
 * @LastEditTime: 2025-06-10 22:00:13
 * @LastEditors: leoking
 * @Description:
 */

export interface ApiError {
  code: number | string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  error?: ApiError;
}

export function parseApiResponse(r: ApiResponse<any>) {
  return r.success
    ? Promise.resolve(r)
    : Promise.reject(new Error(`${r.error?.code}/${r.error?.message}`));
}
