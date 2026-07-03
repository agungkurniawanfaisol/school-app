import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken, SCHOOL_SLUG } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, School } from '@/types'
import type { SchoolFormValues } from '@/schemas/school'

export const schoolKeys = {
  all: ['school'] as const,
  detail: (slug: string) => [...schoolKeys.all, slug] as const,
  adminLists: () => [...schoolKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...schoolKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...schoolKeys.all, 'admin', id] as const,
}

export function useSchool(slug: string = SCHOOL_SLUG) {
  return useQuery({
    queryKey: schoolKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<School>>(`/v1/schools/${slug}`)
      return data.data
    },
    ...queryConfig,
  })
}

export function useAdminSchoolsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: schoolKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<School>>('/admin/schools', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminSchoolDetail(id: number) {
  return useQuery({
    queryKey: schoolKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<School>>(`/admin/schools/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: schoolKeys.all })
}

export function useCreateSchool() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SchoolFormValues) => {
      const { data } = await api.post<ApiResponse<School>>('/admin/schools', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Data sekolah berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan data sekolah.')),
  })
}

export function useUpdateSchool(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<SchoolFormValues>) => {
      const { data } = await api.put<ApiResponse<School>>(`/admin/schools/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(schoolKeys.adminDetail(id), data)
      toast.success('Data sekolah berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui data sekolah.')),
  })
}

export function useDeleteSchool() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/schools/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Data sekolah berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus data sekolah.')),
  })
}
