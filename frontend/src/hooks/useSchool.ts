import { useQuery } from '@tanstack/react-query'
import { api, SCHOOL_SLUG } from '@/lib/api'
import { queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, School } from '@/types'

export const schoolKeys = {
  all: ['school'] as const,
  detail: (slug: string) => [...schoolKeys.all, slug] as const,
}

export function useSchool(slug: string = SCHOOL_SLUG) {
  return useQuery({
    queryKey: schoolKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<School>>(`/v1/schools/${slug}`)
      return data.data
    },
    ...queryConfig,
  })
}
