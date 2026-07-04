import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { EventFormValues } from '@/schemas/event'

export interface Event {
  id: number
  uuid: string
  school_id: number
  title: string
  description: string | null
  location: string | null
  event_date: string
  event_end_date: string | null
  event_time: string | null
  category: 'akademik' | 'keagamaan' | 'olahraga' | 'umum'
  is_active: boolean
  order: number
}

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...eventKeys.lists(), buildQueryParams(filters)] as const,
  detail: (uuid: string) => [...eventKeys.all, 'detail', uuid] as const,
  adminLists: () => [...eventKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...eventKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...eventKeys.all, 'admin', id] as const,
}

export function useEventsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Event>>('/v1/events', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useEventDetail(uuid: string) {
  return useQuery({
    queryKey: eventKeys.detail(uuid),
    queryFn: async () => {
      const { data } = await api.get<{ data: Event }>(`/v1/events/${uuid}`)
      return data.data
    },
    enabled: !!uuid,
    ...queryConfig,
  })
}

export function useAdminEventsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: eventKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Event>>('/admin/events', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminEventDetail(id: number) {
  return useQuery({
    queryKey: eventKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Event>>(`/admin/events/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
  queryClient.invalidateQueries({ queryKey: eventKeys.adminLists() })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: EventFormValues) => {
      const { data } = await api.post<ApiResponse<Event>>('/admin/events', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Agenda berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan agenda.')),
  })
}

export function useUpdateEvent(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<EventFormValues>) => {
      const { data } = await api.put<ApiResponse<Event>>(`/admin/events/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(eventKeys.adminDetail(id), data)
      toast.success('Agenda berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui agenda.')),
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/events/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Agenda berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus agenda.')),
  })
}
