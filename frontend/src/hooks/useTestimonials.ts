import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ListFilters, PaginatedResponse, Testimonial } from '@/types'

export const testimonialKeys = {
  all: ['testimonials'] as const,
  lists: () => [...testimonialKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...testimonialKeys.lists(), buildQueryParams(filters)] as const,
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
