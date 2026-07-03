import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getAuthToken } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { AdminUser, ApiResponse, ListFilters, PaginatedResponse } from '@/types'
import type { CreateUserFormValues, UserFormValues } from '@/schemas/user'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: ListFilters) => [...userKeys.lists(), buildQueryParams(filters)] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

export function useAdminUsersList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<AdminUser>>('/admin/users', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
  })
}

export function useAdminUserDetail(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AdminUser>>(`/admin/users/${id}`)
      return data.data
    },
    enabled: !!getAuthToken() && id > 0,
    ...queryConfig,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      const { data } = await api.post<ApiResponse<AdminUser>>('/admin/users', values)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: UserFormValues) => {
      const payload = { ...values }
      if (!payload.password) {
        delete payload.password
        delete payload.password_confirmation
      }
      const { data } = await api.put<ApiResponse<AdminUser>>(`/admin/users/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function isAdminRole(role?: string): boolean {
  return role === 'admin'
}

export function isGuruRole(role?: string): boolean {
  return role === 'guru'
}
