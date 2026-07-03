import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, Media, PaginatedResponse } from '@/types'
import type { MediaFormValues } from '@/schemas/media'

export const mediaKeys = {
  all: ['media'] as const,
  adminLists: () => [...mediaKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...mediaKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (uuid: string) => [...mediaKeys.all, 'admin', uuid] as const,
}

export function useAdminMediaList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: mediaKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Media>>('/admin/media', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminMediaDetail(uuid: string) {
  return useQuery({
    queryKey: mediaKeys.adminDetail(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Media>>(`/admin/media/${uuid}`)
      return data.data
    },
    enabled: !!uuid && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: mediaKeys.adminLists() })
}

export function useCreateMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: MediaFormValues) => {
      const { data } = await api.post<ApiResponse<Media>>('/admin/media', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Media berhasil ditambahkan.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menambahkan media.')),
  })
}

export function useUpdateMedia(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<MediaFormValues>) => {
      const { data } = await api.put<ApiResponse<Media>>(`/admin/media/${uuid}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(mediaKeys.adminDetail(uuid), data)
      toast.success('Media berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui media.')),
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      await api.delete(`/admin/media/${uuid}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Media berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus media.')),
  })
}
