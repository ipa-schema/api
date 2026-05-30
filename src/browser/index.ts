/**
 * 解析 CSS 变量
 * @param name 要解析的 CSS 变量字符串
 * @returns 解析后的值，如果没有此变量返回原始字符串
 */
export function resolveCssVar(name: string) {
  if (!name.startsWith('var('))
    return name
  name = name.slice(4, -1).trim()
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}
