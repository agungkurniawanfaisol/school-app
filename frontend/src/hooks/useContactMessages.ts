import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ListFilters, PaginatedResponse } from '@/types'
import type { ContactMessageFormValues } from '@/schemas/contactMessage'

export interface ContactMessage {
  id: number
  school_id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  is_read: boolean
  read_at: string | null
  replied_at: string | null
  created_at: string
}

export const contactMessageKeys = {
  all: ['contact-messages'] as const,
  adminLists: () => [...contactMessageKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...contactMessageKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...contactMessageKeys.all, 'admin', 'detail', id] as const,
}

export function useAdminContactMessagesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: contactMessageKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<ContactMessage>>('/admin/contact-messages', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    enabled: !!getAuthToken(),
    ...queryConfig,
  })
}

export function useAdminContactMessageDetail(id: number) {
  return useQuery({
    queryKey: contactMessageKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<{ data: ContactMessage }>(`/admin/contact-messages/${id}`)
      return data.data
    },
    enabled: !!getAuthToken() && id > 0,
    ...queryConfig,
  })
}

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: async (payload: ContactMessageFormValues) => {
      const { data } = await api.post('/v1/contact-messages', payload)
      return data
    },
    onSuccess: () => {
      toast.success('Pesan berhasil dikirim!')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Gagal mengirim pesan.'))
    },
  })
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/admin/contact-messages/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactMessageKeys.adminLists() })
      toast.success('Pesan berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Gagal menghapus pesan.'))
    },
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch<{ data: ContactMessage }>(`/admin/contact-messages/${id}/read`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactMessageKeys.adminLists() })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Gagal memperbarui status.'))
    },
  })
}
