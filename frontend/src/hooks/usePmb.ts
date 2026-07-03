import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, PmbRegistration, Setting } from '@/types'
import type { PmbAdminUpdateFormValues, PmbRegisterFormValues } from '@/schemas/pmb'

export const pmbKeys = {
  all: ['pmb'] as const,
  settings: (schoolId?: number) => [...pmbKeys.all, 'settings', schoolId] as const,
  track: (token: string) => [...pmbKeys.all, 'track', token] as const,
  adminLists: () => [...pmbKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...pmbKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...pmbKeys.all, 'admin', id] as const,
}

export function usePmbSettings(schoolId?: number) {
  return useQuery({
    queryKey: pmbKeys.settings(schoolId),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Setting[]>>('/v1/settings', {
        params: buildQueryParams({ group: 'pmb', school_id: schoolId }),
      })
      return data.data
    },
    enabled: !!schoolId,
    ...queryConfig,
  })
}

export function usePmbTrack(token: string) {
  return useQuery({
    queryKey: pmbKeys.track(token),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PmbRegistration>>(`/v1/pmb/track/${token}`)
      return data.data
    },
    enabled: !!token,
    retry: false,
    ...queryConfig,
  })
}

export function usePmbRegister() {
  return useMutation({
    mutationFn: async (values: PmbRegisterFormValues) => {
      const payload = {
        ...values,
        parent_email: values.parent_email || null,
      }
      const { data } = await api.post<ApiResponse<PmbRegistration>>('/v1/pmb/registrations', payload)
      return data
    },
  })
}

export function useAdminPmbRegistrationsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: pmbKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<PmbRegistration>>('/admin/pmb-registrations', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminPmbRegistrationDetail(id: number) {
  return useQuery({
    queryKey: pmbKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PmbRegistration>>(`/admin/pmb-registrations/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

export function useUpdatePmbRegistration(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PmbAdminUpdateFormValues) => {
      const { data } = await api.put<ApiResponse<PmbRegistration>>(`/admin/pmb-registrations/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pmbKeys.adminLists() })
      queryClient.setQueryData(pmbKeys.adminDetail(id), data)
      toast.success('Status pendaftaran berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui pendaftaran.')),
  })
}

export function useDeletePmbRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/pmb-registrations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pmbKeys.adminLists() })
      toast.success('Pendaftaran berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus pendaftaran.')),
  })
}
