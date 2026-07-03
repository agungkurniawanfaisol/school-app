import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, Teacher } from '@/types'

export const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...teacherKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (slug: string) => [...teacherKeys.details(), slug] as const,
  adminLists: () => [...teacherKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...teacherKeys.adminLists(), buildQueryParams(filters)] as const,
}

export function useTeachersList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: teacherKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Teacher>>('/v1/teachers', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useTeacherDetail(slug: string) {
  return useQuery({
    queryKey: teacherKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Teacher>>(`/v1/teachers/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}

export function useAdminTeachersList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: teacherKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Teacher>>('/admin/teachers', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}
