import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, News, PaginatedResponse } from '@/types'

export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...newsKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (slug: string) => [...newsKeys.details(), slug] as const,
  adminLists: () => [...newsKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...newsKeys.adminLists(), buildQueryParams(filters)] as const,
}

export function useNewsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: newsKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<News>>('/v1/news', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: newsKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<News>>(`/v1/news/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}

export function useAdminNewsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: newsKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<News>>('/admin/news', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}
