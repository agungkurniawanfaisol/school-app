import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getAuthToken, setAuthSession } from '@/lib/api'
import { authKeys } from '@/hooks/useAuth'
import { queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, ProfileData } from '@/types'
import type { ProfileAccountValues, ProfileTeacherValues } from '@/schemas/profile'

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
}

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ProfileData>>('/admin/profile')
      return data.data
    },
    enabled: !!getAuthToken(),
    ...queryConfig,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      user?: Partial<ProfileAccountValues>
      teacher?: Partial<ProfileTeacherValues>
    }) => {
      const body: Record<string, unknown> = {}

      if (payload.user) {
        const userPayload = { ...payload.user }
        if (!userPayload.password) {
          delete userPayload.password
          delete userPayload.password_confirmation
        }
        body.user = userPayload
      }

      if (payload.teacher) {
        body.teacher = payload.teacher
      }

      const { data } = await api.patch<ApiResponse<ProfileData>>('/admin/profile', body)
      return data
    },
    onSuccess: (response) => {
      queryClient.setQueryData(profileKeys.detail(), response.data)
      const token = getAuthToken()
      if (token) {
        setAuthSession(token, response.data.user)
      }
      queryClient.setQueryData(authKeys.me(), response.data.user)
    },
  })
}
