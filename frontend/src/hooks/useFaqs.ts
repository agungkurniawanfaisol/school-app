import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { FaqFormValues } from '@/schemas/faq'

export interface Faq {
  id: number
  school_id: number
  question: string
  answer: string
  category: 'pmb' | 'akademik' | 'biaya' | 'umum'
  is_active: boolean
  order: number
}

export const faqKeys = {
  all: ['faqs'] as const,
  lists: () => [...faqKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...faqKeys.lists(), buildQueryParams(filters)] as const,
  adminLists: () => [...faqKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...faqKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...faqKeys.all, 'admin', id] as const,
}

export function usePublicFaqsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: faqKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Faq>>('/v1/faqs', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminFaqsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: faqKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Faq>>('/admin/faqs', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminFaqDetail(id: number) {
  return useQuery({
    queryKey: faqKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Faq>>(`/admin/faqs/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: faqKeys.lists() })
  queryClient.invalidateQueries({ queryKey: faqKeys.adminLists() })
}

export function useCreateFaq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: FaqFormValues) => {
      const { data } = await api.post<ApiResponse<Faq>>('/admin/faqs', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('FAQ berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan FAQ.')),
  })
}

export function useUpdateFaq(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<FaqFormValues>) => {
      const { data } = await api.put<ApiResponse<Faq>>(`/admin/faqs/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(faqKeys.adminDetail(id), data)
      toast.success('FAQ berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui FAQ.')),
  })
}

export function useDeleteFaq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/faqs/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('FAQ berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus FAQ.')),
  })
}
