/*
 * @Author: leoking
 * @Date: 2025-06-10 21:54:25
 * @LastEditTime: 2025-06-12 17:40:44
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
/**
 * 解析接口响应的json/txt数据，如果成功会resolve，如果失败则reject
 * @param r 响应
 * @returns promise
 */
export async function parseApiResponse<T>(
  r: ApiResponse<T> | Response
): Promise<ApiResponse<T>> {
  if (!r) {
    return Promise.reject(new Error("unexpected type"));
  }
  if (r instanceof Response) {
    if (r.status !== 200) {
      return Promise.reject(new Error(`${r.statusText}`));
    }
    const contentType = r.headers.get("Content-Type") ?? "application/json";
    if (!contentType.endsWith("json")) {
      return r.text().then((txt) => {
        return Promise.resolve<ApiResponse<T>>({
          success: true,
          data: txt as T,
        });
      });
    }
    return r.json().then((r) => parseApiResponse(r as ApiResponse<T>));
  }
  r = r as ApiResponse<T>;
  return r.success
    ? Promise.resolve(r)
    : Promise.reject(new Error(`${r.error?.code}/${r.error?.message}`));
}
