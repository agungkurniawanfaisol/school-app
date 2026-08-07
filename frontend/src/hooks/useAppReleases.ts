import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { AppReleaseFormValues } from '@/schemas/app-release'

export interface AppRelease {
  id: number
  uuid: string
  version: string
  title: string
  body: string
  published_at: string | null
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export const appReleaseKeys = {
  all: ['app-releases'] as const,
  lists: () => [...appReleaseKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...appReleaseKeys.lists(), buildQueryParams(filters)] as const,
  adminLists: () => [...appReleaseKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...appReleaseKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...appReleaseKeys.all, 'admin', id] as const,
}

export function usePublicAppReleasesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: appReleaseKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<AppRelease>>('/v1/app-releases', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminAppReleasesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: appReleaseKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<AppRelease>>('/admin/app-releases', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminAppReleaseDetail(id: number) {
  return useQuery({
    queryKey: appReleaseKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AppRelease>>(`/admin/app-releases/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: appReleaseKeys.lists() })
  queryClient.invalidateQueries({ queryKey: appReleaseKeys.adminLists() })
}

export function useCreateAppRelease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AppReleaseFormValues) => {
      const { data } = await api.post<ApiResponse<AppRelease>>('/admin/app-releases', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Catatan rilis berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan catatan rilis.')),
  })
}

export function useUpdateAppRelease(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<AppReleaseFormValues>) => {
      const { data } = await api.put<ApiResponse<AppRelease>>(`/admin/app-releases/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(appReleaseKeys.adminDetail(id), data)
      toast.success('Catatan rilis berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui catatan rilis.')),
  })
}

export function useDeleteAppRelease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/app-releases/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Catatan rilis berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus catatan rilis.')),
  })
}
