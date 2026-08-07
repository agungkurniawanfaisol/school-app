import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { PmbFeeFormValues } from '@/schemas/pmb-fee'
import { pmbKeys } from '@/hooks/usePmb'

export interface PmbFee {
  id: number
  uuid: string
  school_id: number
  academic_year_id: number
  academic_year?: {
    id: number
    uuid: string
    label: string
    is_active: boolean
  } | null
  name: string
  jenjang: 'kb' | 'tk' | 'sd'
  pmb_program_id: number
  program: string
  program_name?: string | null
  amount: number
  amount_formatted: string
  bank_name?: string | null
  account_number?: string | null
  account_holder?: string | null
  notes?: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export const pmbFeeKeys = {
  all: ['pmb-fees'] as const,
  active: (schoolId?: number) => [...pmbFeeKeys.all, 'active', schoolId] as const,
  activeList: (schoolId?: number) => [...pmbFeeKeys.all, 'active-list', schoolId] as const,
  lists: () => [...pmbFeeKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...pmbFeeKeys.lists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...pmbFeeKeys.all, 'admin', id] as const,
}

/** @deprecated Prefer useActivePmbFees */
export function useActivePmbFee(schoolId?: number) {
  return useQuery({
    queryKey: pmbFeeKeys.active(schoolId),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PmbFee>>('/v1/pmb/fees/active', {
        params: buildQueryParams({ school_id: schoolId }),
      })
      return data.data
    },
    enabled: !!schoolId,
    ...queryConfig,
  })
}

export function useActivePmbFees(schoolId?: number) {
  return useQuery({
    queryKey: pmbFeeKeys.activeList(schoolId),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PmbFee[]>>('/v1/pmb/fees', {
        params: buildQueryParams({ school_id: schoolId }),
      })
      return data.data
    },
    enabled: !!schoolId,
    ...queryConfig,
  })
}

export function useAdminPmbFeesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: pmbFeeKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<PmbFee>>('/admin/pmb-fees', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminPmbFeeDetail(id: number) {
  return useQuery({
    queryKey: pmbFeeKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PmbFee>>(`/admin/pmb-fees/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: pmbFeeKeys.lists() })
  queryClient.invalidateQueries({ queryKey: pmbFeeKeys.all })
  queryClient.invalidateQueries({ queryKey: pmbKeys.settings() })
}

export function useCreatePmbFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PmbFeeFormValues) => {
      const { data } = await api.post<ApiResponse<PmbFee>>('/admin/pmb-fees', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Biaya pendaftaran berhasil ditambahkan.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan biaya pendaftaran.')),
  })
}

export function useUpdatePmbFee(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<PmbFeeFormValues>) => {
      const { data } = await api.put<ApiResponse<PmbFee>>(`/admin/pmb-fees/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(pmbFeeKeys.adminDetail(id), data)
      toast.success('Biaya pendaftaran berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui biaya pendaftaran.')),
  })
}

export function useActivatePmbFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (fee: PmbFee) => {
      const { data } = await api.put<ApiResponse<PmbFee>>(`/admin/pmb-fees/${fee.id}`, {
        school_id: fee.school_id,
        academic_year_id: fee.academic_year_id,
        name: fee.name,
        jenjang: fee.jenjang,
        program: fee.program,
        amount: fee.amount,
        bank_name: fee.bank_name,
        account_number: fee.account_number,
        account_holder: fee.account_holder,
        notes: fee.notes ?? null,
        is_active: true,
      })
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Biaya pendaftaran diaktifkan.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal mengaktifkan biaya pendaftaran.')),
  })
}

export function useDeletePmbFee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/pmb-fees/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Biaya pendaftaran berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus biaya pendaftaran.')),
  })
}
