/*
 * @Author: leoking
 * @Date: 2025-06-10 21:54:25
 * @LastEditTime: 2025-06-12 20:35:54
 * @LastEditors: leoking
 * @Description:
 */

export interface ApiError {
  code: number | string;
  message: string;
  stack?: string;
  [k: string]: any;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success: boolean;
  error?: ApiError;
  [k: string]: any;
}

/**
 * 将任意值转换为ApiError
 * @param v
 * @returns
 */
export function toApiError(v: any): ApiError {
  if (v instanceof Response && v.status != 200) {
    return {
      code: v.status,
      message: v.statusText,
    };
  }
  if (v instanceof Error) {
    return {
      code: -1,
      message: v.message,
      stack: v.stack,
    };
  }

  if (typeof v === "object") {
    return {
      code: v.code ?? -1,
      message: v.message || v.msg || v.errmsg || String(v),
    };
  }

  if (typeof v === "number") {
    return {
      code: v,
      message: String(v),
    };
  }

  return {
    code: -1,
    message: String(v ?? "unknown error"),
  };
}

/**
 * @param v 任意值
 * @returns
 */
export function pickErrorMessage(v: any) {
  return toApiError(v).message;
}

/**
 * 成功响应
 * @param r
 * @returns
 */
export function positiveApiResponse<T = unknown>(
  r: Omit<ApiResponse<T>, "success">,
): ApiResponse<T> {
  if (r && typeof r !== "object") {
    r = { data: r };
  }

  return {
    ...r,
    success: true,
  };
}

/**
 * 失败响应
 * @param error
 * @returns
 */
export function negativeApiResponse<T = unknown>(
  error: Partial<ApiError>,
): ApiResponse<T> {
  if (error && typeof error !== "object") {
    error = {
      message: String(error),
    };
  }
  return {
    error: {
      code: -1,
      message: "unknown error",
      ...error,
    },
    success: false,
  };
}

/**
 * 解析接口响应的json/txt数据，如果成功会resolve({success,data})，如果失败则reject(message)
 * @param r 响应
 * @returns promise
 */
export async function parseApiResponse<T>(
  r: ApiResponse<T> | Response,
): Promise<ApiResponse<T>> {
  if (!r) {
    return Promise.reject(new Error("unexpected empty value"));
  }
  if (r instanceof Response) {
    // console.debug(r);
    if (r.status !== 200) {
      return Promise.reject(
        new Error(`${r.status}:${r.statusText || r.status}`),
      );
    }
    const contentType = r.headers.get("Content-Type") ?? "application/json";
    if (!contentType.endsWith("json")) {
      return r.text().then((txt) => {
        return Promise.resolve(
          positiveApiResponse<T>({
            data: txt as T,
          }),
        );
      });
    }
    return r.json().then((r) => parseApiResponse(r as ApiResponse<T>));
  }
  r = r as ApiResponse<T>;
  return r.success
    ? Promise.resolve(r)
    : Promise.reject(new Error(`${pickErrorMessage(r.error)}`));
}
