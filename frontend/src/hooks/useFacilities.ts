import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, Facility, ListFilters, PaginatedResponse } from '@/types'
import type { FacilityFormValues } from '@/schemas/facility'

export const facilityKeys = {
  all: ['facilities'] as const,
  lists: () => [...facilityKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...facilityKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...facilityKeys.all, 'detail'] as const,
  detail: (slug: string) => [...facilityKeys.details(), slug] as const,
  adminLists: () => [...facilityKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...facilityKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (uuid: string) => [...facilityKeys.all, 'admin', uuid] as const,
}

export function useFacilitiesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: facilityKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Facility>>('/v1/facilities', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useFacilityDetail(slug: string) {
  return useQuery({
    queryKey: facilityKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Facility>>(`/v1/facilities/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}

export function useAdminFacilitiesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: facilityKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Facility>>('/admin/facilities', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminFacilityDetail(uuid: string) {
  return useQuery({
    queryKey: facilityKeys.adminDetail(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Facility>>(`/admin/facilities/${uuid}`)
      return data.data
    },
    enabled: !!uuid && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidateFacilities(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: facilityKeys.lists() })
  queryClient.invalidateQueries({ queryKey: facilityKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: facilityKeys.details() })
}

export function useCreateFacility() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: FacilityFormValues) => {
      const { data } = await api.post<ApiResponse<Facility>>('/admin/facilities', payload)
      return data.data
    },
    onSuccess: () => {
      invalidateFacilities(queryClient)
      toast.success('Fasilitas berhasil dibuat.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menyimpan fasilitas.')),
  })
}

export function useUpdateFacility(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<FacilityFormValues>) => {
      const { data } = await api.put<ApiResponse<Facility>>(`/admin/facilities/${uuid}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidateFacilities(queryClient)
      queryClient.setQueryData(facilityKeys.adminDetail(uuid), data)
      toast.success('Fasilitas berhasil diperbarui.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal memperbarui fasilitas.')),
  })
}

export function useDeleteFacility() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      await api.delete(`/admin/facilities/${uuid}`)
    },
    onSuccess: () => {
      invalidateFacilities(queryClient)
      toast.success('Fasilitas berhasil dihapus.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menghapus fasilitas.')),
  })
}
