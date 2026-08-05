import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken } from '@/lib/api'
import { queryConfig } from '@/hooks/queryConfig'
import type { ApiResponse } from '@/types'

export interface GmailOAuthStatus {
  client_configured: boolean
  connected: boolean
  ready_to_send: boolean
  from_address: string | null
  redirect_uri: string | null
}

export const gmailOAuthKeys = {
  status: ['gmail-oauth', 'status'] as const,
}

export function useGmailOAuthStatus() {
  return useQuery({
    queryKey: gmailOAuthKeys.status,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<GmailOAuthStatus>>('/admin/gmail/oauth/status')
      return data.data
    },
    enabled: !!getAuthToken(),
    ...queryConfig,
  })
}

export function useConnectGmailOAuth() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get<ApiResponse<{ url: string }>>('/admin/gmail/oauth/redirect')
      return data.data.url
    },
    onSuccess: (url) => {
      window.location.assign(url)
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal memulai koneksi Gmail.')),
  })
}

export function useDisconnectGmailOAuth() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<ApiResponse<GmailOAuthStatus>>('/admin/gmail/oauth')
      return data.data
    },
    onSuccess: (status) => {
      queryClient.setQueryData(gmailOAuthKeys.status, status)
      toast.success('Koneksi Gmail diputus.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal memutus koneksi Gmail.')),
  })
}

export function useSendGmailTest() {
  return useMutation({
    mutationFn: async (payload: { to: string; subject: string; body: string }) => {
      const { data } = await api.post<{ message: string }>('/admin/gmail/send-test', payload)
      return data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Email uji berhasil dikirim.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal mengirim email uji.')),
  })
}
