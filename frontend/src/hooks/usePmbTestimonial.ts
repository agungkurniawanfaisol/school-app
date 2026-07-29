import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, getApiErrorMessage, hasPortalAuth } from '@/lib/api'
import { useSchool } from '@/hooks/useSchool'
import type { ApiResponse } from '@/types'
import type { PmbTestimonialFormValues, PortalTestimonial } from '@/schemas/pmb-testimonial'

export const pmbTestimonialKeys = {
  all: ['pmb', 'testimonial'] as const,
  mine: (schoolId?: number) => [...pmbTestimonialKeys.all, 'mine', schoolId] as const,
}

export function usePmbPortalTestimonial() {
  const { data: school } = useSchool()

  return useQuery({
    queryKey: pmbTestimonialKeys.mine(school?.id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PortalTestimonial | null>>('/v1/pmb/portal/testimonial', {
        params: school?.id ? { school_id: school.id } : undefined,
      })
      return data.data
    },
    enabled: hasPortalAuth() && !!school?.id,
    staleTime: 30_000,
  })
}

export function useUpsertPmbPortalTestimonial() {
  const queryClient = useQueryClient()
  const { data: school } = useSchool()

  return useMutation({
    mutationFn: async (values: PmbTestimonialFormValues) => {
      const { data } = await api.put<ApiResponse<PortalTestimonial>>('/v1/pmb/portal/testimonial', {
        ...values,
        school_id: school?.id,
      })
      return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(pmbTestimonialKeys.mine(school?.id), data)
      toast.success(
        data.status === 'published'
          ? 'Testimoni berhasil diperbarui.'
          : 'Testimoni tersimpan. Menunggu persetujuan admin.',
      )
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menyimpan testimoni.')),
  })
}
