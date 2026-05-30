/*
 * @Author: leoking
 * @Date: 2025-06-10 21:54:25
 * @LastEditTime: 2025-06-12 20:35:54
 * @LastEditors: leoking
 * @Description:
 */

import packageJson from '../package.json'

import * as browser from './browser/index'
import * as dict from './dict/index'
import * as number from './number/index'

export function version() {
  return packageJson.version
}

export {
  browser,
  dict,
  number,
}

export * from './api/index'
export * from './pager/index'
export * from './types/index'
