import type { DictJoinOptions } from './types'

const isNil = (v: unknown): v is null | undefined => v == null

export const DEFAULT_DICT_JOIN_OPTS: DictJoinOptions = {
  kvDelimeter: ':',
  entryDelimeter: '\n',
  excludeNil: true,
}

/**
 * 将对象拼接为字符串
 * @param obj 要转换为字典字符串的对象
 * @param opts 转换选项
 * @returns 转换后的字符串
 */
export function join(obj: object, opts: Partial<DictJoinOptions> = DEFAULT_DICT_JOIN_OPTS) {
  opts = {
    ...DEFAULT_DICT_JOIN_OPTS,
    ...opts,
  }
  return Object.entries(obj)
    .filter(([_, value]) => !isNil(value) || !opts.excludeNil)
    .map(([key, value]) => `${key}${opts.kvDelimeter}${value}`)
    .join(opts.entryDelimeter)
}

export function name() {
  return 'dict'
}
