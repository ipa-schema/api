/*
 * @Author: leoking
 * @Date: 2025-06-12 20:08:14
 * @LastEditTime: 2025-06-12 20:31:50
 * @LastEditors: leoking
 * @Description:
 */

import {
  negativeApiResponse,
  parseApiResponse,
  positiveApiResponse,
  toApiError,
} from "@ipa-schema/api";

describe("toApiError", () => {
  it("raw", () => {
    const e = toApiError({ message: "xxxxx", code: -1 });
    expect(e.code).toBe(-1);
    expect(e.message).toBe("xxxxx");
  });
});

describe("ApiResponse", () => {
  it("positiveApiResponse", () => {
    const r = positiveApiResponse({ data: 1 });
    expect(r.success).toBe(true);
  });
  it("negativeApiResponse", () => {
    const r1 = negativeApiResponse({ message: "error", code: -1 });
    expect(r1.success).toBe(false);
    // @ts-ignore
    const r2 = negativeApiResponse("xxxxx");
    expect(r2.success).toBe(false);
  });
});

describe("parseApiResponse", () => {
  it("error", async () => {
    return fetch("https://baidu.com/api")
      .then(parseApiResponse)
      .then((x) => {
        console.info(x);
      })
      .catch((e) => {
        console.warn(e);
      });
  }, 1000);

  it("text", async () => {
    return fetch("https://www.baidu.com")
      .then(parseApiResponse)
      .then((x) => {
        console.info(x);
      })
      .catch((e) => {
        console.warn(e);
      });
  }, 1000);
});
