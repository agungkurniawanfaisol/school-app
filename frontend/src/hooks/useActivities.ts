import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, StudentActivity } from '@/types'

export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...activityKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (slug: string) => [...activityKeys.details(), slug] as const,
}

export function useActivitiesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<StudentActivity>>('/v1/student-activities', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useActivityDetail(slug: string) {
  return useQuery({
    queryKey: activityKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<StudentActivity>>(`/v1/student-activities/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}
