import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { AchievementFormValues } from '@/schemas/achievement'

export interface Achievement {
  id: number
  uuid: string
  school_id: number
  title: string
  description: string | null
  category: string
  level: string
  student_name: string | null
  year: number
  image: string | null
  is_active: boolean
  order: number
}

export const achievementKeys = {
  all: ['achievements'] as const,
  lists: () => [...achievementKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...achievementKeys.lists(), buildQueryParams(filters)] as const,
  detail: (uuid: string) => [...achievementKeys.all, 'detail', uuid] as const,
  adminLists: () => [...achievementKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...achievementKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...achievementKeys.all, 'admin', id] as const,
}

export function useAchievementsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: achievementKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Achievement>>('/v1/achievements', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAchievementDetail(uuid: string) {
  return useQuery({
    queryKey: achievementKeys.detail(uuid),
    queryFn: async () => {
      const { data } = await api.get<{ data: Achievement }>(`/v1/achievements/${uuid}`)
      return data.data
    },
    enabled: !!uuid,
    ...queryConfig,
  })
}

export function useAdminAchievementsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: achievementKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Achievement>>('/admin/achievements', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminAchievementDetail(id: number) {
  return useQuery({
    queryKey: achievementKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Achievement>>(`/admin/achievements/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: achievementKeys.lists() })
  queryClient.invalidateQueries({ queryKey: achievementKeys.adminLists() })
}

export function useCreateAchievement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AchievementFormValues) => {
      const { data } = await api.post<ApiResponse<Achievement>>('/admin/achievements', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Prestasi berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan prestasi.')),
  })
}

export function useUpdateAchievement(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<AchievementFormValues>) => {
      const { data } = await api.put<ApiResponse<Achievement>>(`/admin/achievements/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(achievementKeys.adminDetail(id), data)
      toast.success('Prestasi berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui prestasi.')),
  })
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/achievements/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Prestasi berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus prestasi.')),
  })
}
