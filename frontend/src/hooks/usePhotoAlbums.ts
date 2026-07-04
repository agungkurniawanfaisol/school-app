import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, PhotoAlbum } from '@/types'
import type { PhotoAlbumFormValues } from '@/schemas/photoAlbum'

export const photoAlbumKeys = {
  all: ['photo-albums'] as const,
  lists: () => [...photoAlbumKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...photoAlbumKeys.lists(), buildQueryParams(filters)] as const,
  detail: (uuid: string) => [...photoAlbumKeys.all, 'detail', uuid] as const,
  adminLists: () => [...photoAlbumKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...photoAlbumKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...photoAlbumKeys.all, 'admin', id] as const,
}

export function usePhotoAlbumsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: photoAlbumKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<PhotoAlbum>>('/v1/photo-albums', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function usePhotoAlbumDetail(uuid: string) {
  return useQuery({
    queryKey: photoAlbumKeys.detail(uuid),
    queryFn: async () => {
      const { data } = await api.get<{ data: PhotoAlbum }>(`/v1/photo-albums/${uuid}`)
      return data.data
    },
    enabled: !!uuid,
    ...queryConfig,
  })
}

export function useAdminPhotoAlbumsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: photoAlbumKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<PhotoAlbum>>('/admin/photo-albums', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminPhotoAlbumDetail(id: number) {
  return useQuery({
    queryKey: photoAlbumKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PhotoAlbum>>(`/admin/photo-albums/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: photoAlbumKeys.lists() })
  queryClient.invalidateQueries({ queryKey: photoAlbumKeys.adminLists() })
}

export function useCreatePhotoAlbum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PhotoAlbumFormValues) => {
      const { data } = await api.post<ApiResponse<PhotoAlbum>>('/admin/photo-albums', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Album foto berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan album foto.')),
  })
}

export function useUpdatePhotoAlbum(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<PhotoAlbumFormValues>) => {
      const { data } = await api.put<ApiResponse<PhotoAlbum>>(`/admin/photo-albums/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(photoAlbumKeys.adminDetail(id), data)
      toast.success('Album foto berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui album foto.')),
  })
}

export function useDeletePhotoAlbum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/photo-albums/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Album foto berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus album foto.')),
  })
}
