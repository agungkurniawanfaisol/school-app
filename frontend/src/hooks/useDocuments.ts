import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ListFilters, PaginatedResponse, Document } from '@/types'
import type { DocumentFormValues } from '@/schemas/document'

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...documentKeys.lists(), buildQueryParams(filters)] as const,
  adminLists: () => [...documentKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...documentKeys.adminLists(), buildQueryParams(filters)] as const,
  adminDetail: (id: number) => [...documentKeys.all, 'admin', id] as const,
}

export function useDocumentsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Document>>('/v1/documents', {
        params: buildQueryParams(filters),
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminDocumentsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: documentKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Document>>('/admin/documents', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminDocumentDetail(id: number) {
  return useQuery({
    queryKey: documentKeys.adminDetail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Document>>(`/admin/documents/${id}`)
      return data.data
    },
    enabled: !!id && !!getAuthToken(),
    ...queryConfig,
  })
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: documentKeys.lists() })
  queryClient.invalidateQueries({ queryKey: documentKeys.adminLists() })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: DocumentFormValues) => {
      const { data } = await api.post<ApiResponse<Document>>('/admin/documents', payload)
      return data.data
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Dokumen berhasil dibuat.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menyimpan dokumen.')),
  })
}

export function useUpdateDocument(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<DocumentFormValues>) => {
      const { data } = await api.put<ApiResponse<Document>>(`/admin/documents/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      invalidate(queryClient)
      queryClient.setQueryData(documentKeys.adminDetail(id), data)
      toast.success('Dokumen berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui dokumen.')),
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/documents/${id}`)
    },
    onSuccess: () => {
      invalidate(queryClient)
      toast.success('Dokumen berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus dokumen.')),
  })
}
