/*
 * @Author: leoking
 * @Date: 2025-06-10 21:54:25
 * @LastEditTime: 2025-06-12 20:35:54
 * @LastEditors: leoking
 * @Description:
 */

import type { AxiosResponse } from "axios";

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

export function toApiError(v: any): ApiError {
  if (v instanceof Error) {
    return {
      code: -1,
      message: v.message,
      stack: v.stack,
    };
  }
  if (v instanceof Response && v.status != 200) {
    return {
      code: v.status,
      message: v.statusText,
    };
  }

  if (typeof v === "object") {
    return {
      code: v.code ?? -1,
      message: v.message || v.msg || v.errmsg,
    };
  }

  return {
    code: -1,
    message: String(v ?? "unknown error"),
  };
}

/**
 * @deprecated 最好直接调用toApiError
 * @param v 任意值
 * @returns
 */
export function pickErrorMessage(v: any) {
  return toApiError(v).message;
}

export function positiveApiResponse<T = unknown>(
  r: Omit<ApiResponse<T>, "success">,
): ApiResponse<T> {
  return {
    ...r,
    success: true,
  };
}

export function negativeApiResponse<T = unknown>(
  error: ApiError,
): ApiResponse<T> {
  return {
    error,
    success: false,
  };
}

/**
 * 解析接口响应的json/txt数据，如果成功会resolve，如果失败则reject
 * @param r 响应
 * @returns promise
 */
export async function parseApiResponse<T = any>(
  r: ApiResponse<T> | Response | object,
): Promise<ApiResponse<T>> {
  if (!r) {
    return Promise.reject(new Error("unexpected empty value"));
  }
  if (r instanceof Response) {
    console.debug(r);
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
  const resp = r as ApiResponse<T>;
  return resp.success
    ? Promise.resolve(resp)
    : Promise.reject(new Error(`${pickErrorMessage(resp.error)}`));
}
