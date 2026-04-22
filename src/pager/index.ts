import type { Pager, PageResult } from './types'

export * from './types'

/**
 * 转换为分页器
 *
 * @param v
 * @returns Pager
 */
export function toPager(v?: Pager | PageResult<any>): Pager | undefined {
  if (!v) {
    return undefined
  }
  return {
    pageBase: v.pageBase ?? v.page_base,
    pageAt: v.pageAt ?? v.page_at ?? v.page,
    pageSize: v.pageSize ?? v.page_size ?? v.size ?? v.limit,
    total: v.total,
  }
}
