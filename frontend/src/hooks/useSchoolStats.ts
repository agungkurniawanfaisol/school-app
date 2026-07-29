import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, SchoolStat } from '@/types'
import type { SchoolStatFormValues } from '@/schemas/schoolStat'

export const schoolStatKeys = {
  all: ['school-stats'] as const,
  lists: () => [...schoolStatKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...schoolStatKeys.lists(), buildQueryParams(filters)] as const,
  adminLists: () => [...schoolStatKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...schoolStatKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (uuid: string) => [...schoolStatKeys.all, 'admin', uuid] as const,
}

export function useSchoolStatsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: schoolStatKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<SchoolStat>>('/v1/school-stats', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminSchoolStatsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: schoolStatKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<SchoolStat>>('/admin/school-stats', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminSchoolStatDetail(uuid: string) {
  return useQuery({
    queryKey: schoolStatKeys.adminDetail(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SchoolStat>>(`/admin/school-stats/${uuid}`)
      return data.data
    },
    enabled: !!uuid && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: schoolStatKeys.lists() })
  queryClient.invalidateQueries({ queryKey: schoolStatKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: ['landing'] })
}

export function useCreateSchoolStat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SchoolStatFormValues) => {
      const { data } = await api.post<ApiResponse<SchoolStat>>('/admin/school-stats', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Statistik berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan statistik.')),
  })
}

export function useUpdateSchoolStat(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<SchoolStatFormValues>) => {
      const { data } = await api.put<ApiResponse<SchoolStat>>(`/admin/school-stats/${uuid}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(schoolStatKeys.adminDetail(uuid), data)
      toast.success('Statistik berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui statistik.')),
  })
}

export function useDeleteSchoolStat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      await api.delete(`/admin/school-stats/${uuid}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Statistik berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus statistik.')),
  })
}
