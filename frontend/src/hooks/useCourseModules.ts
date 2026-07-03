import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, CourseModule, ListFilters, PaginatedResponse } from '@/types'
import type { CourseModuleFormValues } from '@/schemas/courseModule'

export const courseModuleKeys = {
  all: ['course-modules'] as const,
  adminLists: () => [...courseModuleKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...courseModuleKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...courseModuleKeys.all, 'admin', id] as const,
}

export function useAdminCourseModulesList(filters: ListFilters & { course_id?: number } = {}) {
  return useQuery({
    queryKey: courseModuleKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<CourseModule>>('/admin/course-modules', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminCourseModuleDetail(id: number) {
  return useQuery({
    queryKey: courseModuleKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CourseModule>>(`/admin/course-modules/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: courseModuleKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: ['courses'] })
}

export function useCreateCourseModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CourseModuleFormValues) => {
      const { data } = await api.post<ApiResponse<CourseModule>>('/admin/course-modules', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Modul berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan modul.')),
  })
}

export function useUpdateCourseModule(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CourseModuleFormValues>) => {
      const { data } = await api.put<ApiResponse<CourseModule>>(`/admin/course-modules/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(courseModuleKeys.adminDetail(id), data)
      toast.success('Modul berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui modul.')),
  })
}

export function useDeleteCourseModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/course-modules/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Modul berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus modul.')),
  })
}
