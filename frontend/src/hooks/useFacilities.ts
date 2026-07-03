import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, Facility, ListFilters, PaginatedResponse } from '@/types'

export const facilityKeys = {
  all: ['facilities'] as const,
  lists: () => [...facilityKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...facilityKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...facilityKeys.all, 'detail'] as const,
  detail: (slug: string) => [...facilityKeys.details(), slug] as const,
}

export function useFacilitiesList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: facilityKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Facility>>('/v1/facilities', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useFacilityDetail(slug: string) {
  return useQuery({
    queryKey: facilityKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Facility>>(`/v1/facilities/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}
