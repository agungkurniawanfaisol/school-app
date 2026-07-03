import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  api,
  clearAuthSession,
  getAuthToken,
  isAuthError,
  isNetworkError,
  setAuthSession,
} from '@/lib/api'
import type { ApiResponse, LoginResponse, User } from '@/types'
import type { LoginFormValues } from '@/schemas/auth'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useAuthMe() {
  const hasToken = !!getAuthToken()

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>('/admin/me')
      const user = data.data
      const token = getAuthToken()
      if (token) {
        setAuthSession(token, user)
      }
      return user
    },
    enabled: hasToken,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (isAuthError(error)) {
        return false
      }
      if (isNetworkError(error)) {
        return failureCount < 3
      }
      return failureCount < 1
    },
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
      setAuthSession(data.token, data.user)
      queryClient.setQueryData(authKeys.me(), data.user)
    },
  })
}

export function useGoogleExchange() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ticket: string) => {
      const { data } = await api.post<ApiResponse<LoginResponse>>('/admin/auth/google/exchange', {
        ticket,
      })
      return data.data
    },
    onSuccess: (data) => {
      setAuthSession(data.token, data.user)
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
      clearAuthSession()
      queryClient.removeQueries({ queryKey: authKeys.all })
    },
  })
}

export function useIsAuthenticated(): boolean {
  const token = getAuthToken()
  const { data, isPending, isError } = useAuthMe()

  if (!token) {
    return false
  }

  if (data) {
    return true
  }

  return isPending && !isError
}
