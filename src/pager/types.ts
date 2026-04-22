export interface Pager {
  /**
   * 0-based or 1-based
   */
  pageBase?: number
  pageAt: number
  pageSize: number
  /**
   * 总页数
   */
  pageCount?: number

  /**
   * 总元素个数
   * TODO: 是否命名为itemCount更好些
   */
  total?: number

  [key: string]: any
}

export interface TableQuery {
  database?: string
  table: string
  [key: string]: any
}

/**
 * 分页结果
 */
export interface PageResult<T> extends Pager {
  /**
   * 分页数据
   */
  items?: T[]
}
