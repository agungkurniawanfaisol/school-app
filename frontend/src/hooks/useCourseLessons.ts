import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, CourseLesson, ListFilters, PaginatedResponse } from '@/types'
import type { CourseLessonFormValues } from '@/schemas/courseLesson'

export const courseLessonKeys = {
  all: ['course-lessons'] as const,
  adminLists: () => [...courseLessonKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...courseLessonKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...courseLessonKeys.all, 'admin', id] as const,
}

export function useAdminCourseLessonsList(filters: ListFilters & { course_module_id?: number } = {}) {
  return useQuery({
    queryKey: courseLessonKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<CourseLesson>>('/admin/course-lessons', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useCreateCourseLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CourseLessonFormValues) => {
      const { data } = await api.post<ApiResponse<CourseLesson>>('/admin/course-lessons', payload)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseLessonKeys.adminLists() })
      toast.success('Pelajaran berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan pelajaran.')),
  })
}

export function useUpdateCourseLesson(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CourseLessonFormValues>) => {
      const { data } = await api.put<ApiResponse<CourseLesson>>(`/admin/course-lessons/${id}`, payload)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseLessonKeys.adminLists() })
      toast.success('Pelajaran berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui pelajaran.')),
  })
}

export function useDeleteCourseLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/course-lessons/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseLessonKeys.adminLists() })
      toast.success('Pelajaran berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus pelajaran.')),
  })
}
