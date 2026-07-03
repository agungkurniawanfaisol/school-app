import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, CourseEnrollment, ListFilters, PaginatedResponse } from '@/types'
import type { CourseEnrollmentFormValues } from '@/schemas/courseEnrollment'

export const courseEnrollmentKeys = {
  all: ['course-enrollments'] as const,
  adminLists: () => [...courseEnrollmentKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...courseEnrollmentKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...courseEnrollmentKeys.all, 'admin', id] as const,
}

export function useAdminCourseEnrollmentsList(filters: ListFilters & { course_id?: number } = {}) {
  return useQuery({
    queryKey: courseEnrollmentKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<CourseEnrollment>>('/admin/course-enrollments', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminCourseEnrollmentDetail(id: number) {
  return useQuery({
    queryKey: courseEnrollmentKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CourseEnrollment>>(`/admin/course-enrollments/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: courseEnrollmentKeys.adminLists() })
}

export function useCreateCourseEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CourseEnrollmentFormValues) => {
      const { data } = await api.post<ApiResponse<CourseEnrollment>>('/admin/course-enrollments', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Pendaftaran kursus berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan pendaftaran.')),
  })
}

export function useUpdateCourseEnrollment(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CourseEnrollmentFormValues>) => {
      const { data } = await api.put<ApiResponse<CourseEnrollment>>(`/admin/course-enrollments/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(courseEnrollmentKeys.adminDetail(id), data)
      toast.success('Pendaftaran kursus berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui pendaftaran.')),
  })
}

export function useDeleteCourseEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/course-enrollments/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Pendaftaran kursus berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus pendaftaran.')),
  })
}
