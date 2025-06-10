/*
 * @Author: leoking
 * @Date: 2025-06-10 21:54:25
 * @LastEditTime: 2025-06-10 22:51:59
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

export async function parseApiResponse<T>(
  r: ApiResponse<T> | Request
): Promise<ApiResponse<T>> {
  if (r instanceof Request) {
    return r.json().then((r) => parseApiResponse(r as ApiResponse<T>));
  }
  return r.success
    ? Promise.resolve(r)
    : Promise.reject(new Error(`${r.error?.code}/${r.error?.message}`));
}
