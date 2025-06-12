/*
 * @Author: leoking
 * @Date: 2025-06-12 20:08:14
 * @LastEditTime: 2025-06-12 20:31:50
 * @LastEditors: leoking
 * @Description:
 */

import { parseApiResponse } from "../index";

describe("parseApiResponse", () => {
  it("error", async () => {
    await fetch("https://xxxxxx.com/api")
      .then(parseApiResponse)
      .then((x) => {
        console.info(x);
      })
      .catch((e) => {
        console.warn(e);
      });
  }, 100000);

  it("text", async () => {
    await fetch("https://www.baidu.com")
      .then(parseApiResponse)
      .then((x) => {
        console.info(x);
      })
      .catch((e) => {
        console.warn(e);
      });
  }, 100000);
});
