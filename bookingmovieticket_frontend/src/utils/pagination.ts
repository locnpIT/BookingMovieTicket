export function buildPageList(total: number, current: number): (number | string)[] {
  const result: (number | string)[] = []
  if (total <= 0) return result
  if (total <= 7) {
    for (let i = 0; i < total; i++) result.push(i)
    return result
  }
  result.push(0)
  const start = Math.max(1, current - 1)
  const end = Math.min(total - 2, current + 1)
  if (start > 1) result.push('...')
  for (let i = start; i <= end; i++) result.push(i)
  if (end < total - 2) result.push('...')
  result.push(total - 1)
  return result
}

