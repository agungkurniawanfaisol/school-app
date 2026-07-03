import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse, PmbRegistration, Setting } from '@/types'
import type { PmbRegisterFormValues } from '@/schemas/pmb'

export const pmbKeys = {
  all: ['pmb'] as const,
  settings: (schoolId?: number) => [...pmbKeys.all, 'settings', schoolId] as const,
  track: (token: string) => [...pmbKeys.all, 'track', token] as const,
}

export function usePmbSettings(schoolId?: number) {
  return useQuery({
    queryKey: pmbKeys.settings(schoolId),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Setting[]>>('/v1/settings', {
        params: buildQueryParams({ group: 'pmb', school_id: schoolId }),
      })
      return data.data
    },
    enabled: !!schoolId,
    ...queryConfig,
  })
}

export function usePmbTrack(token: string) {
  return useQuery({
    queryKey: pmbKeys.track(token),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PmbRegistration>>(`/v1/pmb/track/${token}`)
      return data.data
    },
    enabled: !!token,
    retry: false,
    ...queryConfig,
  })
}

export function usePmbRegister() {
  return useMutation({
    mutationFn: async (values: PmbRegisterFormValues) => {
      const payload = {
        ...values,
        parent_email: values.parent_email || null,
      }
      const { data } = await api.post<ApiResponse<PmbRegistration>>('/v1/pmb/registrations', payload)
      return data
    },
  })
}
