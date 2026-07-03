import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, Curriculum, ListFilters, PaginatedResponse } from '@/types'

export const curriculumKeys = {
  all: ['curriculums'] as const,
  lists: () => [...curriculumKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...curriculumKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...curriculumKeys.all, 'detail'] as const,
  detail: (slug: string) => [...curriculumKeys.details(), slug] as const,
  adminLists: () => [...curriculumKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...curriculumKeys.adminLists(), buildQueryParams(filters)] as const,
}

export function useCurriculumsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: curriculumKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Curriculum>>('/v1/curriculums', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useCurriculumDetail(slug: string) {
  return useQuery({
    queryKey: curriculumKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Curriculum>>(`/v1/curriculums/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}

export function useAdminCurriculumsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: curriculumKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Curriculum>>('/admin/curriculums', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}
