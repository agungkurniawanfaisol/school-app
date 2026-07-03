import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, Course, ListFilters, PaginatedResponse } from '@/types'
import type { CourseFormValues } from '@/schemas/course'

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...courseKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (slug: string) => [...courseKeys.details(), slug] as const,
  adminLists: () => [...courseKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...courseKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...courseKeys.all, 'admin', id] as const,
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

export function useAdminCoursesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: courseKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Course>>('/admin/courses', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminCourseDetail(id: number) {
  return useQuery({
    queryKey: courseKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Course>>(`/admin/courses/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
  queryClient.invalidateQueries({ queryKey: courseKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: courseKeys.details() })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CourseFormValues) => {
      const { data } = await api.post<ApiResponse<Course>>('/admin/courses', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Kursus berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan kursus.')),
  })
}

export function useUpdateCourse(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CourseFormValues>) => {
      const { data } = await api.put<ApiResponse<Course>>(`/admin/courses/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(courseKeys.adminDetail(id), data)
      toast.success('Kursus berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui kursus.')),
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/courses/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Kursus berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus kursus.')),
  })
}
