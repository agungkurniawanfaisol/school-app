import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, Setting } from '@/types'
import type { SettingFormValues } from '@/schemas/setting'
import { parseHeroCollageValue } from '@/schemas/heroCollage'
import { parseSplashScreenValue } from '@/schemas/splashScreen'

export const settingKeys = {
  all: ['settings'] as const,
  publicGroup: (group: string) => [...settingKeys.all, 'public', group] as const,
  adminLists: () => [...settingKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...settingKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...settingKeys.all, 'admin', id] as const,
}

export function usePublicSettings(group: string) {
  return useQuery({
    queryKey: settingKeys.publicGroup(group),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Setting[]>>('/v1/settings', {
        params: { group },
      })
      return data.data
    },
    ...queryConfig,
  })
}

export function useHeroCollage() {
  const query = usePublicSettings('homepage')

  const collage = (() => {
    const raw = query.data?.find((s) => s.key === 'hero_collage')?.value
    return parseHeroCollageValue(raw ?? null)
  })()

  return {
    ...query,
    collage,
  }
}

export function useSplashScreen() {
  const query = usePublicSettings('homepage')

  const splash = (() => {
    const raw = query.data?.find((s) => s.key === 'splash_screen')?.value
    return parseSplashScreenValue(raw ?? null)
  })()

  return {
    ...query,
    splash,
  }
}

export function useAdminSettingsList(filters: ListFilters & { group?: string } = {}) {
  return useQuery({
    queryKey: settingKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Setting>>('/admin/settings', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminSettingDetail(id: number) {
  return useQuery({
    queryKey: settingKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Setting>>(`/admin/settings/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: settingKeys.adminLists() })
  queryClient.invalidateQueries({ queryKey: settingKeys.publicGroup('homepage') })
  queryClient.invalidateQueries({ queryKey: ['pmb'] })
}

export function useCreateSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SettingFormValues) => {
      const { data } = await api.post<ApiResponse<Setting>>('/admin/settings', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Pengaturan berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan pengaturan.')),
  })
}

export function useUpdateSetting(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<SettingFormValues>) => {
      if (!id) {
        throw new Error('Pengaturan belum tersedia.')
      }
      const { data } = await api.put<ApiResponse<Setting>>(`/admin/settings/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(settingKeys.adminDetail(id), data)
      toast.success('Pengaturan berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui pengaturan.')),
  })
}

export function useDeleteSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/settings/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Pengaturan berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus pengaturan.')),
  })
}
