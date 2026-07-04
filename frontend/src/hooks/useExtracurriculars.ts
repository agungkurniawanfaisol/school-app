import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { ExtracurricularFormValues } from '@/schemas/extracurricular'

export interface Extracurricular {
  id: number
  uuid: string
  school_id: number
  name: string
  description: string | null
  category: string
  schedule: string | null
  instructor: string | null
  image: string | null
  is_active: boolean
  order: number
}

export const extracurricularKeys = {
  all: ['extracurriculars'] as const,
  lists: () => [...extracurricularKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...extracurricularKeys.lists(), buildQueryParams(filters)] as const,
  detail: (uuid: string) => [...extracurricularKeys.all, 'detail', uuid] as const,
  adminLists: () => [...extracurricularKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...extracurricularKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...extracurricularKeys.all, 'admin', id] as const,
}

export function useExtracurricularsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: extracurricularKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Extracurricular>>('/v1/extracurriculars', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useExtracurricularDetail(uuid: string) {
  return useQuery({
    queryKey: extracurricularKeys.detail(uuid),
    queryFn: async () => {
      const { data } = await api.get<{ data: Extracurricular }>(`/v1/extracurriculars/${uuid}`)
      return data.data
    },
    enabled: !!uuid,
    ...queryConfig,
  })
}

export function useAdminExtracurricularsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: extracurricularKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Extracurricular>>('/admin/extracurriculars', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminExtracurricularDetail(id: number) {
  return useQuery({
    queryKey: extracurricularKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Extracurricular>>(`/admin/extracurriculars/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: extracurricularKeys.lists() })
  queryClient.invalidateQueries({ queryKey: extracurricularKeys.adminLists() })
}

export function useCreateExtracurricular() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ExtracurricularFormValues) => {
      const { data } = await api.post<ApiResponse<Extracurricular>>('/admin/extracurriculars', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Ekstrakurikuler berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan ekstrakurikuler.')),
  })
}

export function useUpdateExtracurricular(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<ExtracurricularFormValues>) => {
      const { data } = await api.put<ApiResponse<Extracurricular>>(`/admin/extracurriculars/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(extracurricularKeys.adminDetail(id), data)
      toast.success('Ekstrakurikuler berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui ekstrakurikuler.')),
  })
}

export function useDeleteExtracurricular() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/extracurriculars/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Ekstrakurikuler berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus ekstrakurikuler.')),
  })
}
