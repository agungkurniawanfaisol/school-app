import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  api,
  clearAuthSession,
  getAuthToken,
  isAuthError,
  isNetworkError,
  setAuthSession,
  getStoredUser,
} from '@/lib/api'
import type { ApiResponse, LoginResponse, User } from '@/types'
import type { LoginFormValues } from '@/schemas/auth'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useAuthMe() {
  const hasToken = !!getAuthToken()
  const storedRole = getStoredUser()?.role ?? null

  return useQuery({
    queryKey: [...authKeys.me(), storedRole],
    queryFn: async () => {
      const isPendaftar = getStoredUser()?.role === 'pendaftar'
      const { data } = await api.get<ApiResponse<User>>(isPendaftar ? '/v1/pmb/portal/me' : '/admin/me')
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

export function usePmbPortalLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await api.post<ApiResponse<LoginResponse>>('/v1/pmb/portal/login', values)
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
  const isPendaftar = getStoredUser()?.role === 'pendaftar'

  return useMutation({
    mutationFn: async () => {
      await api.post(isPendaftar ? '/v1/pmb/portal/logout' : '/admin/logout')
    },
    onSettled: () => {
      clearAuthSession()
      queryClient.removeQueries({ queryKey: authKeys.all })
    },
  })
}

export function useAuthUser(): User | null {
  const { data } = useAuthMe()

  return data ?? getStoredUser()
}

export function useIsAuthenticated(): boolean {
  const token = getAuthToken()
  const storedUser = getStoredUser()
  const { data, isPending, isFetching, isError } = useAuthMe()

  if (!token) {
    return false
  }

  if (data || storedUser) {
    return true
  }

  return (isPending || isFetching) && !isError
}
