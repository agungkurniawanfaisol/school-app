import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, Teacher } from '@/types'
import type { TeacherFormValues } from '@/schemas/teacher'

export const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...teacherKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (slug: string) => [...teacherKeys.details(), slug] as const,
  detailUuid: (uuid: string) => [...teacherKeys.details(), 'uuid', uuid] as const,
  adminLists: () => [...teacherKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...teacherKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (uuid: string) => [...teacherKeys.all, 'admin', uuid] as const,
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

export function useTeacherDetailByUuid(uuid: string) {
  return useQuery({
    queryKey: teacherKeys.detailUuid(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Teacher>>(`/v1/teachers/uuid/${uuid}`)
      return data.data
    },
    enabled: !!uuid,
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
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminTeacherDetail(uuid: string) {
  return useQuery({
    queryKey: teacherKeys.adminDetail(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Teacher>>(`/admin/teachers/${uuid}`)
      return data.data
    },
    enabled: !!uuid && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: teacherKeys.lists() })
  queryClient.invalidateQueries({ queryKey: teacherKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: teacherKeys.details() })
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TeacherFormValues) => {
      const { data } = await api.post<ApiResponse<Teacher>>('/admin/teachers', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Data guru berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan data guru.')),
  })
}

export function useUpdateTeacher(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<TeacherFormValues>) => {
      const { data } = await api.put<ApiResponse<Teacher>>(`/admin/teachers/${uuid}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(teacherKeys.adminDetail(uuid), data)
      toast.success('Data guru berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui data guru.')),
  })
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      await api.delete(`/admin/teachers/${uuid}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Data guru berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus data guru.')),
  })
}
