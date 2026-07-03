const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 30 * 60 * 1000

export const queryConfig = {
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
} as const

export function buildQueryParams(
  filters: Record<string, unknown> | object,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      params[key] = value as string | number | boolean
    }
  }
  return params
}
