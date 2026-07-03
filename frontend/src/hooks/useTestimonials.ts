import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, Testimonial } from '@/types'
import type { TestimonialFormValues } from '@/schemas/testimonial'

export const testimonialKeys = {
  all: ['testimonials'] as const,
  lists: () => [...testimonialKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...testimonialKeys.lists(), buildQueryParams(filters)] as const,
  adminLists: () => [...testimonialKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...testimonialKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...testimonialKeys.all, 'admin', id] as const,
}

export function useTestimonialsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: testimonialKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Testimonial>>('/v1/testimonials', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminTestimonialsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: testimonialKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Testimonial>>('/admin/testimonials', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminTestimonialDetail(id: number) {
  return useQuery({
    queryKey: testimonialKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Testimonial>>(`/admin/testimonials/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() })
  queryClient.invalidateQueries({ queryKey: testimonialKeys.adminLists() })
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TestimonialFormValues) => {
      const { data } = await api.post<ApiResponse<Testimonial>>('/admin/testimonials', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Testimoni berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan testimoni.')),
  })
}

export function useUpdateTestimonial(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<TestimonialFormValues>) => {
      const { data } = await api.put<ApiResponse<Testimonial>>(`/admin/testimonials/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(testimonialKeys.adminDetail(id), data)
      toast.success('Testimoni berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui testimoni.')),
  })
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/testimonials/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Testimoni berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus testimoni.')),
  })
}
