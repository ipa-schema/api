import type { MybatisPageResult, Pager, PageResult, SpringPageResult } from './types'

export * from './types'

/**
 * 转换为分页器
 *
 * @param v 分页结果
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
    total: v.total ?? v.totalElements,
  }
}

/**
 * 转换为Mybatis分页器
 * @param input Mybatis分页结果
 * @returns 分页器
 */
export function toMybatisPager(input?: MybatisPageResult<any>): Pager {
  return {
    base: 1,
    pageAt: input?.current ?? 1,
    pageSize: input?.size ?? 15,
    total: input?.total ?? 0,
  }
}

/**
 * 转换为Spring分页器
 * @param input Spring分页结果
 * @returns 分页器
 */
export function toSpringPager(input?: SpringPageResult<any>): Pager {
  return {
    base: 0,
    pageAt: input?.number ?? 0,
    pageSize: input?.size ?? 15,
    total: input?.totalElements ?? 0,
  }
}

/**
 * 将分页器转换为查询参数
 *
 * @param pager 分页器
 * @returns
 */
export function pager2query(pager: Partial<Pager>) {
  return `pageAt=${pager.pageAt}&pageSize=${pager.pageSize}`
}
