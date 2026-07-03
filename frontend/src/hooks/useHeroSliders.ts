import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, HeroSlider, ListFilters, PaginatedResponse } from '@/types'
import type { HeroSliderFormValues } from '@/schemas/heroSlider'

export const heroSliderKeys = {
  all: ['hero-sliders'] as const,
  adminLists: () => [...heroSliderKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...heroSliderKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...heroSliderKeys.all, 'admin', id] as const,
}

export function useAdminHeroSlidersList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: heroSliderKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<HeroSlider>>('/admin/hero-sliders', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminHeroSliderDetail(id: number) {
  return useQuery({
    queryKey: heroSliderKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<HeroSlider>>(`/admin/hero-sliders/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: heroSliderKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: ['hero-sliders'] })
}

export function useCreateHeroSlider() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: HeroSliderFormValues) => {
      const { data } = await api.post<ApiResponse<HeroSlider>>('/admin/hero-sliders', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Hero slider berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan hero slider.')),
  })
}

export function useUpdateHeroSlider(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<HeroSliderFormValues>) => {
      const { data } = await api.put<ApiResponse<HeroSlider>>(`/admin/hero-sliders/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(heroSliderKeys.adminDetail(id), data)
      toast.success('Hero slider berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui hero slider.')),
  })
}

export function useDeleteHeroSlider() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/hero-sliders/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Hero slider berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus hero slider.')),
  })
}
