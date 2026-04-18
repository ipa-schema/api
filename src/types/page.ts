export interface Pager {
  /**
   * 0-based or 1-based
   */
  pageBase?: number;
  pageAt: number;
  pageSize: number;
  /**
   * 总页数
   */
  pageCount?: number;

  /**
   * 总元素个数
   * TODO: 是否命名为itemCount更好些
   */
  total?: number;

  [key: string]: any;
}

export interface TableQuery {
  database?: string;
  table: string;
  [key: string]: any;
}

/**
 * 分页结果
 */
export interface PageResult<T> extends Pager {
  /**
   * 分页数据
   */
  items?: T[];
}

/**
 * 转换为分页器
 *
 * @param v
 * @returns
 */
export function toPager(v?: Pager | PageResult<any>): Pager | undefined {
  if (!v) {
    return undefined;
  }
  return {
    pageBase: v.pageBase ?? v.page_base,
    pageAt: v.pageAt ?? v.page_at ?? v.page,
    pageSize: v.pageSize ?? v.page_size ?? v.size,
    total: v.total,
  };
}
