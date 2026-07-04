import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { VirtualTour, VirtualTourListItem } from '@/types/virtualTour'
import type { VirtualTourFormValues } from '@/schemas/virtualTour'

export const virtualTourKeys = {
  all: ['virtual-tours'] as const,
  publicLists: () => [...virtualTourKeys.all, 'public', 'list'] as const,
  publicList: (filters: ListFilters) => [...virtualTourKeys.publicLists(), buildQueryParams(filters)] as const,
  publicDetail: (slug: string) => [...virtualTourKeys.all, 'public', slug] as const,
  adminLists: () => [...virtualTourKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...virtualTourKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (uuid: string) => [...virtualTourKeys.all, 'admin', uuid] as const,
}

export function usePublicVirtualTours(filters: ListFilters = {}) {
  return useQuery({
    queryKey: virtualTourKeys.publicList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<VirtualTourListItem>>('/v1/virtual-tours', {
        params: buildQueryParams(filters),
      })
      return data
    },
    ...queryConfig,
  })
}

export function usePublicVirtualTour(slug: string) {
  return useQuery({
    queryKey: virtualTourKeys.publicDetail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<VirtualTour>>(`/v1/virtual-tours/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}

export function useAdminVirtualToursList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: virtualTourKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<VirtualTour>>('/admin/virtual-tours', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminVirtualTourDetail(uuid: string) {
  return useQuery({
    queryKey: virtualTourKeys.adminDetail(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<VirtualTour>>(`/admin/virtual-tours/${uuid}`)
      return data.data
    },
    enabled: !!uuid && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidateAdmin(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: virtualTourKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: virtualTourKeys.publicLists() })
}

export function useCreateVirtualTour() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: VirtualTourFormValues) => {
      const { data } = await api.post<ApiResponse<VirtualTour>>('/admin/virtual-tours', payload)
      return data.data
    },
    onSuccess: () => {
      invalidateAdmin(queryClient)
      toast.success('Virtual tour berhasil dibuat.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal membuat virtual tour.')),
  })
}

export function useUpdateVirtualTour(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: VirtualTourFormValues) => {
      const { data } = await api.put<ApiResponse<VirtualTour>>(`/admin/virtual-tours/${uuid}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidateAdmin(queryClient)
      queryClient.setQueryData(virtualTourKeys.adminDetail(uuid), data)
      toast.success('Virtual tour berhasil disimpan.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menyimpan virtual tour.')),
  })
}

export function useDeleteVirtualTour() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      await api.delete(`/admin/virtual-tours/${uuid}`)
    },
    onSuccess: () => {
      invalidateAdmin(queryClient)
      toast.success('Virtual tour berhasil dihapus.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menghapus virtual tour.')),
  })
}
