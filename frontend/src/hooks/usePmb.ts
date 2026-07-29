import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api, getApiErrorMessage, getAuthToken, hasPortalAuth } from '@/lib/api'
import { compressImageFile } from '@/lib/compressImage'
import { buildQueryParams, queryConfig } from '@/hooks/queryConfig'
import type {
  ApiResponse,
  ListFilters,
  Media,
  PaginatedResponse,
  PmbNotificationsPayload,
  PmbRegistration,
  PmbRegistrationStats,
  Setting,
} from '@/types'
import type { PmbAdminUpdateFormValues, PmbPortalDraftValues, PmbRegisterFormValues } from '@/schemas/pmb'
import { buildDraftPayload, syncLegacyParentFields } from '@/schemas/pmb'
import {
  ALLOWED_PMB_PROOF_TYPES,
  ALLOWED_UPLOAD_IMAGE_TYPES,
  MAX_PMB_PHOTO_BYTES,
  MAX_PMB_PROOF_BYTES,
  validatePmbUpload,
} from '@/lib/uploadValidation'
import type { UploadPhase } from '@/hooks/useMediaUpload'

export const pmbKeys = {
  all: ['pmb'] as const,
  settings: (schoolId?: number) => [...pmbKeys.all, 'settings', schoolId] as const,
  adminLists: () => [...pmbKeys.all, 'admin', 'list'] as const,
  adminList: (filters: ListFilters) => [...pmbKeys.adminLists(), buildQueryParams(filters)] as const,
  adminStats: (filters: ListFilters) => [...pmbKeys.all, 'admin', 'stats', buildQueryParams(filters)] as const,
  adminDetail: (uuid: string) => [...pmbKeys.all, 'admin', 'detail', uuid] as const,
  adminNotifications: () => [...pmbKeys.all, 'admin', 'notifications'] as const,
  portalRegistration: () => [...pmbKeys.all, 'portal', 'registration'] as const,
  portalDetail: (uuid: string) => [...pmbKeys.all, 'portal', 'detail', uuid] as const,
  portalNotifications: () => [...pmbKeys.all, 'portal', 'notifications'] as const,
}

/** Shared across hook instances so toast fires once when unread rises. */
let lastKnownUnreadCount: number | null = null
let lastKnownAdminUnreadCount: number | null = null

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

export function useAdminPmbRegistrationsList(filters: ListFilters = {}) {
  return useQuery({
    queryKey: pmbKeys.adminList(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<PmbRegistration>>('/admin/pmb-registrations', {
        params: buildQueryParams(filters),
      })
      return data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
    staleTime: 30_000,
  })
}

export function useAdminPmbStats(filters: ListFilters = {}) {
  return useQuery({
    queryKey: pmbKeys.adminStats(filters),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PmbRegistrationStats>>('/admin/pmb-registrations/stats', {
        params: buildQueryParams(filters),
      })
      return data.data
    },
    enabled: !!getAuthToken(),
    placeholderData: keepPreviousData,
    ...queryConfig,
    staleTime: 30_000,
  })
}

export async function downloadPmbRegistrationsCsv(filters: ListFilters = {}): Promise<void> {
  try {
    const { data } = await api.get<Blob>('/admin/pmb-registrations/export', {
      params: buildQueryParams(filters),
      responseType: 'blob',
    })

    const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `pmb-registrations-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  } catch (error) {
    const axiosError = error as { response?: { data?: Blob; status?: number } }
    if (axiosError.response?.data instanceof Blob) {
      const text = await axiosError.response.data.text()
      try {
        const json = JSON.parse(text) as { message?: string }
        throw Object.assign(new Error(json.message ?? 'Export failed'), {
          response: { data: json, status: axiosError.response.status },
        })
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          throw error
        }
        throw parseError
      }
    }
    throw error
  }
}

export function useAdminPmbRegistrationByUuid(uuid: string) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: pmbKeys.adminDetail(uuid),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PmbRegistration>>(`/admin/pmb-registrations/by-uuid/${uuid}`)
      // showByUuid marks admin notifications read — refresh bell + list badges
      void queryClient.invalidateQueries({ queryKey: pmbKeys.adminNotifications() })
      void queryClient.invalidateQueries({ queryKey: pmbKeys.adminLists() })
      return data.data
    },
    enabled: !!uuid && !!getAuthToken(),
    ...queryConfig,
  })
}

export function useUpdatePmbByUuid(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PmbAdminUpdateFormValues) => {
      const body: Record<string, unknown> = {
        status: payload.status,
        notes: payload.notes,
        grade_applied: payload.grade_applied,
      }

      if (payload.action === 'verify_payment') {
        body.verify_payment = true
      }
      if (payload.action === 'reject_payment') {
        body.reject_payment = true
        body.payment_rejection_reason = payload.payment_notes ?? undefined
      }
      if (payload.action === 'issue_loa') {
        body.issue_loa = true
      }

      const { data } = await api.patch<ApiResponse<PmbRegistration>>(`/admin/pmb-registrations/by-uuid/${uuid}`, body)
      return data.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pmbKeys.adminLists() })
      queryClient.invalidateQueries({ queryKey: [...pmbKeys.all, 'admin', 'stats'] })
      queryClient.setQueryData(pmbKeys.adminDetail(uuid), data)
      queryClient.invalidateQueries({ queryKey: pmbKeys.portalDetail(uuid) })
      toast.success('Status pendaftaran berhasil diperbarui.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal memperbarui pendaftaran.')),
  })
}

export const useAdminPmbRegistrationDetail = useAdminPmbRegistrationByUuid
export const useUpdatePmbRegistration = useUpdatePmbByUuid

export function usePmbPortalRegistration(schoolId?: number) {
  return useQuery({
    queryKey: [...pmbKeys.portalRegistration(), schoolId ?? null],
    queryFn: async () =>
      (
        await api.get<ApiResponse<PmbRegistration>>('/v1/pmb/portal/registration', {
          params: schoolId ? { school_id: schoolId } : undefined,
        })
      ).data.data,
    enabled: hasPortalAuth(),
    ...queryConfig,
  })
}

export function usePmbNotifications() {
  const query = useQuery({
    queryKey: pmbKeys.portalNotifications(),
    queryFn: async () =>
      (await api.get<ApiResponse<PmbNotificationsPayload>>('/v1/pmb/portal/notifications')).data.data,
    enabled: hasPortalAuth(),
    staleTime: 0,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  })

  useEffect(() => {
    const unread = query.data?.unread_count
    if (unread == null) return
    if (lastKnownUnreadCount !== null && unread > lastKnownUnreadCount) {
      toast.info('Ada update dari admin')
    }
    lastKnownUnreadCount = unread
  }, [query.data?.unread_count])

  return query
}

export function useMarkPmbNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { all?: boolean; message_ids?: number[] } = {}) => {
      const { data } = await api.post<ApiResponse<PmbNotificationsPayload>>(
        '/v1/pmb/portal/notifications/read',
        payload,
      )
      return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(pmbKeys.portalNotifications(), data)
      lastKnownUnreadCount = data.unread_count
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menandai notifikasi.')),
  })
}

export function useAdminPmbNotifications(enabled = true) {
  const query = useQuery({
    queryKey: pmbKeys.adminNotifications(),
    queryFn: async () =>
      (await api.get<ApiResponse<PmbNotificationsPayload>>('/admin/pmb-registrations/notifications'))
        .data.data,
    enabled: enabled && !!getAuthToken() && !hasPortalAuth(),
    staleTime: 0,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  })

  useEffect(() => {
    const unread = query.data?.unread_count
    if (unread == null) return
    if (lastKnownAdminUnreadCount !== null && unread > lastKnownAdminUnreadCount) {
      toast.info('Ada update PMB baru')
    }
    lastKnownAdminUnreadCount = unread
  }, [query.data?.unread_count])

  return query
}

export function useMarkAdminPmbNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      payload: { all?: boolean; message_ids?: number[]; registration_uuid?: string } = {},
    ) => {
      const { data } = await api.post<ApiResponse<PmbNotificationsPayload>>(
        '/admin/pmb-registrations/notifications/read',
        payload,
      )
      return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(pmbKeys.adminNotifications(), data)
      lastKnownAdminUnreadCount = data.unread_count
      queryClient.invalidateQueries({ queryKey: pmbKeys.adminLists() })
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menandai notifikasi.')),
  })
}

export function useSavePmbDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<PmbPortalDraftValues> & { current_step?: number }) => {
      const {
        payment_proof_media_id,
        payment_note,
        payment_transferred_at,
        transfer_confirmed,
        current_step,
        ...fields
      } = payload

      const draft_payload = buildDraftPayload(fields)
      const { parent_name, parent_phone } = syncLegacyParentFields(fields)

      const body: Record<string, unknown> = {
        school_id: payload.school_id,
        student_name: fields.student_name,
        birth_place: fields.birth_place,
        birth_date: fields.birth_date,
        address: fields.address,
        parent_email: fields.parent_email || null,
        parent_name,
        parent_phone,
        draft_payload,
        current_step,
      }

      if (payment_proof_media_id || payment_note || payment_transferred_at) {
        body.payment_info = {
          ...(payment_proof_media_id ? { proof_media_id: payment_proof_media_id } : {}),
          ...(payment_note ? { note: payment_note } : {}),
          ...(payment_transferred_at ? { transferred_at: payment_transferred_at } : {}),
        }
      }

      return (await api.patch<ApiResponse<PmbRegistration>>('/v1/pmb/portal/registration', body)).data.data
    },
    onSuccess: (data) => {
      // Match keys with schoolId suffix. Never overwrite a locked registration
      // with a late-arriving draft autosave response.
      queryClient.setQueriesData<PmbRegistration>(
        { queryKey: pmbKeys.portalRegistration() },
        (current) => {
          if (current && current.status !== 'draft' && current.status !== 'needs_revision') {
            return current
          }
          return data
        },
      )
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menyimpan draf.')),
  })
}

export function useSubmitPmbRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PmbPortalDraftValues) => {
      const draft_payload = buildDraftPayload(payload)
      const { parent_name, parent_phone } = syncLegacyParentFields(payload)

      const body = {
        student_name: payload.student_name,
        birth_place: payload.birth_place,
        birth_date: payload.birth_date,
        address: payload.address,
        parent_name,
        parent_phone,
        parent_email: payload.parent_email || null,
        draft_payload,
        payment_info: {
          proof_media_id: payload.payment_proof_media_id,
          note: payload.payment_note ?? null,
          transferred_at: payload.payment_transferred_at ?? null,
        },
      }
      return (await api.post<ApiResponse<PmbRegistration>>('/v1/pmb/portal/registration/submit', body)).data.data
    },
    onSuccess: (data) => {
      // Query key includes schoolId — update all portal registration cache entries.
      queryClient.setQueriesData({ queryKey: pmbKeys.portalRegistration() }, data)
      queryClient.setQueryData(pmbKeys.portalDetail(data.uuid), data)
      toast.success('Pendaftaran berhasil dikirim.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal mengirim pendaftaran.')),
  })
}

export function useSubmitPmbCorrection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PmbPortalDraftValues) => {
      const draft_payload = buildDraftPayload(payload)
      const { parent_name, parent_phone } = syncLegacyParentFields(payload)

      const body = {
        student_name: payload.student_name,
        birth_place: payload.birth_place,
        birth_date: payload.birth_date,
        address: payload.address,
        parent_name,
        parent_phone,
        parent_email: payload.parent_email || null,
        draft_payload,
        payment_info: {
          proof_media_id: payload.payment_proof_media_id,
          note: payload.payment_note ?? null,
          transferred_at: payload.payment_transferred_at ?? null,
        },
      }
      return (await api.post<ApiResponse<PmbRegistration>>('/v1/pmb/portal/registration/correction', body)).data.data
    },
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: pmbKeys.portalRegistration() }, data)
      queryClient.setQueryData(pmbKeys.portalDetail(data.uuid), data)
      toast.success('Perbaikan berhasil dikirim.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal mengirim perbaikan.')),
  })
}

export function usePmbPortalDetail(uuid: string) {
  return useQuery({
    queryKey: pmbKeys.portalDetail(uuid),
    queryFn: async () => (await api.get<ApiResponse<PmbRegistration>>(`/v1/pmb/portal/registrations/${uuid}`)).data.data,
    enabled: !!uuid && hasPortalAuth(),
    ...queryConfig,
  })
}

function usePmbMessage(endpoint: (uuid: string) => string, uuid: string, key: readonly unknown[]) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: string) => (await api.post(endpoint(uuid), { body })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal mengirim pesan.')),
  })
}

export function usePmbPortalMessage(uuid: string) {
  return usePmbMessage((value) => `/v1/pmb/portal/registrations/${value}/messages`, uuid, pmbKeys.portalDetail(uuid))
}

export function useAdminPmbMessage(uuid: string) {
  return usePmbMessage((value) => `/admin/pmb-registrations/by-uuid/${value}/messages`, uuid, pmbKeys.adminDetail(uuid))
}

const PMB_SOURCE_MAX_BYTES = 15 * 1024 * 1024
/** Pas foto / bukti — 1024px cukup dan jauh lebih cepat diencode di HP. */
const PMB_IMAGE_MAX_EDGE = 1024

export function usePmbPortalUpload() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<UploadPhase>('idle')

  const mutation = useMutation({
    mutationFn: async ({
      file,
      purpose,
    }: {
      file: File
      purpose: 'student_photo' | 'payment_proof' | 'testimonial_photo'
    }) => {
      const allowed =
        purpose === 'payment_proof' ? ALLOWED_PMB_PROOF_TYPES : ALLOWED_UPLOAD_IMAGE_TYPES
      if (!(allowed as readonly string[]).includes(file.type)) {
        throw new Error(
          purpose === 'payment_proof'
            ? 'Format bukti harus JPG, PNG, WebP, atau PDF.'
            : 'Format foto harus JPG, PNG, atau WebP.',
        )
      }
      if (file.size > PMB_SOURCE_MAX_BYTES) {
        throw new Error('Ukuran file sumber terlalu besar. Pilih foto yang lebih kecil.')
      }

      setProgress(0)
      let uploadFile = file

      if (file.type.startsWith('image/')) {
        setPhase('compressing')
        // Let React paint "Mengompres…" before blocking on canvas encode.
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve())
        })
        const maxBytes = purpose === 'payment_proof' ? MAX_PMB_PROOF_BYTES : MAX_PMB_PHOTO_BYTES
        uploadFile = await compressImageFile(file, {
          maxEdge: PMB_IMAGE_MAX_EDGE,
          maxBytes,
          quality: 0.72,
          mimeType: 'image/jpeg',
        })
      }

      const validationError = validatePmbUpload(uploadFile, purpose)
      if (validationError) {
        throw new Error(validationError)
      }

      setPhase('uploading')
      const form = new FormData()
      form.set('file', uploadFile)
      form.set('collection', 'pmb')
      form.set('purpose', purpose)
      const { data } = await api.post<ApiResponse<Media>>('/v1/pmb/portal/uploads', form, {
        onUploadProgress: (event) => {
          if (!event.total) return
          setProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)))
        },
      })
      setProgress(100)
      return data.data
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal mengunggah berkas.')),
    onSettled: () => {
      setPhase('idle')
      setProgress(0)
    },
  })

  return { ...mutation, progress, phase }
}

export function useDeletePmbRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/pmb-registrations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pmbKeys.adminLists() })
      queryClient.invalidateQueries({ queryKey: [...pmbKeys.all, 'admin', 'stats'] })
      toast.success('Pendaftaran berhasil dihapus.')
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Gagal menghapus pendaftaran.')),
  })
}
