import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { PmbProgramFormValues } from '@/schemas/pmb-program'

export interface PmbProgram {
  id: number
  uuid: string
  school_id: number
  code: string
  name: string
  sort_order: number
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export const pmbProgramKeys = {
  all: ['pmb-programs'] as const,
  lists: () => [...pmbProgramKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...pmbProgramKeys.lists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...pmbProgramKeys.all, 'admin', id] as const,
}

export function useAdminPmbProgramsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: pmbProgramKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<PmbProgram>>('/admin/pmb-programs', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminPmbProgramDetail(id: number) {
  return useQuery({
    queryKey: pmbProgramKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PmbProgram>>(`/admin/pmb-programs/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: pmbProgramKeys.lists() })
  queryClient.invalidateQueries({ queryKey: pmbProgramKeys.all })
}

export function useCreatePmbProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PmbProgramFormValues) => {
      const { data } = await api.post<ApiResponse<PmbProgram>>('/admin/pmb-programs', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Program PMB berhasil ditambahkan.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan program.')),
  })
}

export function useUpdatePmbProgram(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<PmbProgramFormValues>) => {
      const { data } = await api.put<ApiResponse<PmbProgram>>(`/admin/pmb-programs/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(pmbProgramKeys.adminDetail(id), data)
      toast.success('Program PMB berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui program.')),
  })
}

export function useDeletePmbProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/pmb-programs/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Program PMB berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus program.')),
  })
}
