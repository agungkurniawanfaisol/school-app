import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, Announcement } from '@/types'
import type { AnnouncementFormValues } from '@/schemas/announcement'

export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...announcementKeys.lists(), buildQueryParams(filters)] as const,
  adminLists: () => [...announcementKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...announcementKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...announcementKeys.all, 'admin', id] as const,
}

export function useAnnouncementsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: announcementKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Announcement>>('/v1/announcements', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminAnnouncementsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: announcementKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Announcement>>('/admin/announcements', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminAnnouncementDetail(id: number) {
  return useQuery({
    queryKey: announcementKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Announcement>>(`/admin/announcements/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: announcementKeys.lists() })
  queryClient.invalidateQueries({ queryKey: announcementKeys.adminLists() })
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AnnouncementFormValues) => {
      const { data } = await api.post<ApiResponse<Announcement>>('/admin/announcements', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Pengumuman berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan pengumuman.')),
  })
}

export function useUpdateAnnouncement(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<AnnouncementFormValues>) => {
      const { data } = await api.put<ApiResponse<Announcement>>(`/admin/announcements/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(announcementKeys.adminDetail(id), data)
      toast.success('Pengumuman berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui pengumuman.')),
  })
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/announcements/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Pengumuman berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus pengumuman.')),
  })
}
