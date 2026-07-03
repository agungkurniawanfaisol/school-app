import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, clearAuthToken, getAuthToken, setAuthToken } from '@/lib/api'
import { queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, LoginResponse, User } from '@/types'
import type { LoginFormValues } from '@/schemas/auth'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useAuthMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>('/admin/me')
      return data.data
    },
    enabled: !!getAuthToken(),
    retry: false,
    ...queryConfig,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await api.post<ApiResponse<LoginResponse>>('/admin/login', values)
      return data.data
    },
    onSuccess: (data) => {
      setAuthToken(data.token)
      queryClient.setQueryData(authKeys.me(), data.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.post('/admin/logout')
    },
    onSettled: () => {
      clearAuthToken()
      queryClient.removeQueries({ queryKey: authKeys.all })
    },
  })
}

export function useIsAuthenticated(): boolean {
  const { data, isLoading } = useAuthMe()
  return !!getAuthToken() && !isLoading && !!data
}
