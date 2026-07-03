import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, News, PaginatedResponse } from '@/types'
import type { NewsFormValues } from '@/schemas/news'

export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...newsKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (slug: string) => [...newsKeys.details(), slug] as const,
  detailUuid: (uuid: string) => [...newsKeys.details(), 'uuid', uuid] as const,
  adminLists: () => [...newsKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...newsKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (uuid: string) => [...newsKeys.all, 'admin', uuid] as const,
}

export function useNewsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: newsKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<News>>('/v1/news', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: newsKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<News>>(`/v1/news/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}

export function useNewsDetailByUuid(uuid: string) {
  return useQuery({
    queryKey: newsKeys.detailUuid(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<News>>(`/v1/news/uuid/${uuid}`)
      return data.data
    },
    enabled: !!uuid,
    ...queryConfig,
  })
}

export function useAdminNewsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: newsKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<News>>('/admin/news', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminNewsDetail(uuid: string) {
  return useQuery({
    queryKey: newsKeys.adminDetail(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<News>>(`/admin/news/${uuid}`)
      return data.data
    },
    enabled: !!uuid && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidateNews(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
  queryClient.invalidateQueries({ queryKey: newsKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: newsKeys.details() })
}

export function useCreateNews() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: NewsFormValues) => {
      const { data } = await api.post<ApiResponse<News>>('/admin/news', payload)
      return data.data
    },
    onSuccess: () => {
      invalidateNews(queryClient)
      toast.success('Berita berhasil dibuat.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menyimpan berita.')),
  })
}

export function useUpdateNews(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<NewsFormValues>) => {
      const { data } = await api.put<ApiResponse<News>>(`/admin/news/${uuid}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidateNews(queryClient)
      queryClient.setQueryData(newsKeys.adminDetail(uuid), data)
      toast.success('Berita berhasil diperbarui.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal memperbarui berita.')),
  })
}

export function useDeleteNews() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      await api.delete(`/admin/news/${uuid}`)
    },
    onSuccess: () => {
      invalidateNews(queryClient)
      toast.success('Berita berhasil dihapus.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menghapus berita.')),
  })
}

export function usePublishNews() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      const { data } = await api.patch<ApiResponse<News>>(`/admin/news/${uuid}/publish`)
      return data.data
    },
    onSuccess: () => {
      invalidateNews(queryClient)
      toast.success('Berita dipublikasikan.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal mempublikasikan.')),
  })
}

export function useUnpublishNews() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      const { data } = await api.patch<ApiResponse<News>>(`/admin/news/${uuid}/unpublish`)
      return data.data
    },
    onSuccess: () => {
      invalidateNews(queryClient)
      toast.success('Berita diarsipkan sebagai draf.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal mengarsipkan.')),
  })
}
