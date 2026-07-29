import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, SchoolValue } from '@/types'
import type { SchoolValueFormValues } from '@/schemas/schoolValue'

export const schoolValueKeys = {
  all: ['school-values'] as const,
  lists: () => [...schoolValueKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...schoolValueKeys.lists(), buildQueryParams(filters)] as const,
  adminLists: () => [...schoolValueKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...schoolValueKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (uuid: string) => [...schoolValueKeys.all, 'admin', uuid] as const,
}

export function useSchoolValuesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: schoolValueKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<SchoolValue>>('/v1/school-values', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminSchoolValuesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: schoolValueKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<SchoolValue>>('/admin/school-values', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminSchoolValueDetail(uuid: string) {
  return useQuery({
    queryKey: schoolValueKeys.adminDetail(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SchoolValue>>(`/admin/school-values/${uuid}`)
      return data.data
    },
    enabled: !!uuid && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: schoolValueKeys.lists() })
  queryClient.invalidateQueries({ queryKey: schoolValueKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: ['landing'] })
}

export function useCreateSchoolValue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SchoolValueFormValues) => {
      const { data } = await api.post<ApiResponse<SchoolValue>>('/admin/school-values', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Nilai berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan nilai.')),
  })
}

export function useUpdateSchoolValue(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<SchoolValueFormValues>) => {
      const { data } = await api.put<ApiResponse<SchoolValue>>(`/admin/school-values/${uuid}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(schoolValueKeys.adminDetail(uuid), data)
      toast.success('Nilai berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui nilai.')),
  })
}

export function useDeleteSchoolValue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      await api.delete(`/admin/school-values/${uuid}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Nilai berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus nilai.')),
  })
}
