/*
 * @Author: leoking
 * @Date: 2025-06-10 21:54:25
 * @LastEditTime: 2025-06-11 00:01:01
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
  r: ApiResponse<T> | Response
): Promise<ApiResponse<T>> {
  if (!r) {
    return Promise.reject(new Error("unexpected type"));
  }
  if (r instanceof Response) {
    return r.json().then((r) => parseApiResponse(r as ApiResponse<T>));
  }
  r = r as ApiResponse<T>;
  return r.success
    ? Promise.resolve(r)
    : Promise.reject(new Error(`${r.error?.code}/${r.error?.message}`));
}
