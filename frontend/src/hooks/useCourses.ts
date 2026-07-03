import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, Course, ListFilters, PaginatedResponse } from '@/types'

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...courseKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (slug: string) => [...courseKeys.details(), slug] as const,
}

export function useCoursesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Course>>('/v1/courses', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useCourseDetail(slug: string) {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Course>>(`/v1/courses/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}
