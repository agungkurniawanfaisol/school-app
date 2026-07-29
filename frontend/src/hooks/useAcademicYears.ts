import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { AcademicYearFormValues } from '@/schemas/academic-year'

export interface AcademicYear {
  id: number
  uuid: string
  school_id: number
  label: string
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export const academicYearKeys = {
  all: ['academic-years'] as const,
  active: (schoolId?: number) => [...academicYearKeys.all, 'active', schoolId] as const,
  lists: () => [...academicYearKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...academicYearKeys.lists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...academicYearKeys.all, 'admin', id] as const,
}

export function useActiveAcademicYear(schoolId?: number) {
  return useQuery({
    queryKey: academicYearKeys.active(schoolId),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AcademicYear>>('/v1/academic-years/active', {
        params: buildQueryParams({ school_id: schoolId }),
      })
      return data.data
    },
    enabled: !!schoolId,
    ...queryConfig,
  })
}

export function useAdminAcademicYearsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: academicYearKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<AcademicYear>>('/admin/academic-years', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminAcademicYearDetail(id: number) {
  return useQuery({
    queryKey: academicYearKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AcademicYear>>(`/admin/academic-years/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() })
  queryClient.invalidateQueries({ queryKey: academicYearKeys.all })
}

export function useCreateAcademicYear() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AcademicYearFormValues) => {
      const { data } = await api.post<ApiResponse<AcademicYear>>('/admin/academic-years', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Tahun ajaran berhasil ditambahkan.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan tahun ajaran.')),
  })
}

export function useUpdateAcademicYear(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<AcademicYearFormValues>) => {
      const { data } = await api.put<ApiResponse<AcademicYear>>(`/admin/academic-years/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(academicYearKeys.adminDetail(id), data)
      toast.success('Tahun ajaran berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui tahun ajaran.')),
  })
}

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/academic-years/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Tahun ajaran berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus tahun ajaran.')),
  })
}
