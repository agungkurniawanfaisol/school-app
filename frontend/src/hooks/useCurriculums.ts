import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, Curriculum, ListFilters, PaginatedResponse } from '@/types'
import type { CurriculumFormValues } from '@/schemas/curriculum'

export const curriculumKeys = {
  all: ['curriculums'] as const,
  lists: () => [...curriculumKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...curriculumKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...curriculumKeys.all, 'detail'] as const,
  detail: (slug: string) => [...curriculumKeys.details(), slug] as const,
  adminLists: () => [...curriculumKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...curriculumKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...curriculumKeys.all, 'admin', id] as const,
}

export function useCurriculumsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: curriculumKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Curriculum>>('/v1/curriculums', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useCurriculumDetail(slug: string) {
  return useQuery({
    queryKey: curriculumKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Curriculum>>(`/v1/curriculums/${slug}`)
      return data.data
    },
    enabled: !!slug,
    ...queryConfig,
  })
}

export function useAdminCurriculumsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: curriculumKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Curriculum>>('/admin/curriculums', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminCurriculumDetail(id: number) {
  return useQuery({
    queryKey: curriculumKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Curriculum>>(`/admin/curriculums/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: curriculumKeys.lists() })
  queryClient.invalidateQueries({ queryKey: curriculumKeys.adminLists() })
}

export function useCreateCurriculum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CurriculumFormValues) => {
      const { data } = await api.post<ApiResponse<Curriculum>>('/admin/curriculums', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Kurikulum berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan kurikulum.')),
  })
}

export function useUpdateCurriculum(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<CurriculumFormValues>) => {
      const { data } = await api.put<ApiResponse<Curriculum>>(`/admin/curriculums/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(curriculumKeys.adminDetail(id), data)
      toast.success('Kurikulum berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui kurikulum.')),
  })
}

export function useDeleteCurriculum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/curriculums/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Kurikulum berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus kurikulum.')),
  })
}
