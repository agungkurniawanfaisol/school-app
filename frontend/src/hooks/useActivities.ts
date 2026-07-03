import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ActivityFormValues } from '@/schemas/activity'
import type { ApiResponse, ListFilters, PaginatedResponse, StudentActivity } from '@/types'

export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...activityKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (slug: string) => [...activityKeys.details(), slug] as const,
  detailUuid: (uuid: string) => [...activityKeys.details(), 'uuid', uuid] as const,
  adminLists: () => [...activityKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...activityKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (uuid: string) => [...activityKeys.all, 'admin', uuid] as const,
}

export function useActivitiesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<StudentActivity>>('/v1/student-activities', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useActivityDetail(slug: string) {
  return useQuery({
    queryKey: activityKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<StudentActivity>>(`/v1/student-activities/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}

export function useActivityDetailByUuid(uuid: string) {
  return useQuery({
    queryKey: activityKeys.detailUuid(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<StudentActivity>>(`/v1/student-activities/uuid/${uuid}`)
      return data.data
    },
    enabled: !!uuid,
    ...queryConfig,
  })
}

export function useAdminActivitiesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: activityKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<StudentActivity>>('/admin/student-activities', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminActivityDetail(uuid: string) {
  return useQuery({
    queryKey: activityKeys.adminDetail(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<StudentActivity>>(`/admin/student-activities/${uuid}`)
      return data.data
    },
    enabled: !!uuid && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidateActivities(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: activityKeys.lists() })
  queryClient.invalidateQueries({ queryKey: activityKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: activityKeys.details() })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ActivityFormValues) => {
      const { data } = await api.post<ApiResponse<StudentActivity>>('/admin/student-activities', payload)
      return data.data
    },
    onSuccess: () => {
      invalidateActivities(queryClient)
      toast.success('Kegiatan berhasil dibuat.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menyimpan kegiatan.')),
  })
}

export function useUpdateActivity(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<ActivityFormValues>) => {
      const { data } = await api.put<ApiResponse<StudentActivity>>(`/admin/student-activities/${uuid}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidateActivities(queryClient)
      queryClient.setQueryData(activityKeys.adminDetail(uuid), data)
      toast.success('Kegiatan berhasil diperbarui.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal memperbarui kegiatan.')),
  })
}

export function useDeleteActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      await api.delete(`/admin/student-activities/${uuid}`)
    },
    onSuccess: () => {
      invalidateActivities(queryClient)
      toast.success('Kegiatan berhasil dihapus.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menghapus kegiatan.')),
  })
}

export function usePublishActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      const { data } = await api.patch<ApiResponse<StudentActivity>>(`/admin/student-activities/${uuid}/publish`)
      return data.data
    },
    onSuccess: () => {
      invalidateActivities(queryClient)
      toast.success('Kegiatan dipublikasikan.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal mempublikasikan.')),
  })
}

export function useUnpublishActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uuid: string) => {
      const { data } = await api.patch<ApiResponse<StudentActivity>>(`/admin/student-activities/${uuid}/unpublish`)
      return data.data
    },
    onSuccess: () => {
      invalidateActivities(queryClient)
      toast.success('Kegiatan diarsipkan sebagai draf.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal mengarsipkan.')),
  })
}
