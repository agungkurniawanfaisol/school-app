import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { Camera, CheckCircle2, ImagePlus, Loader2, MessageSquareQuote, RefreshCw } from 'lucide-react'
import { UploadProgressBar, uploadStatusLabel } from '@/components/common/UploadProgressBar'
import { PmbFormSection } from '@/components/pmb/PmbFormSection'
import { PmbStarRating } from '@/components/pmb/PmbStarRating'
import { PageEnter } from '@/components/motion/PageEnter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useAuthMe } from '@/hooks/useAuth'
import { usePmbPortalUpload } from '@/hooks/usePmb'
import { usePmbPortalTestimonial, useUpsertPmbPortalTestimonial } from '@/hooks/usePmbTestimonial'
import { hasPortalAuth } from '@/lib/api'
import { resolveAssetUrl } from '@/lib/safe-url'
import { ALLOWED_UPLOAD_IMAGE_TYPES } from '@/lib/uploadValidation'
import { pmbTestimonialSchema, type PmbTestimonialFormValues } from '@/schemas/pmb-testimonial'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
const LOGIN_PATH = '/admin/login?redirect=/pmb/portal/testimoni'

export function PmbTestimonialPage() {
  const { data: authUser } = useAuthMe()
  const { data: testimonial, isLoading } = usePmbPortalTestimonial()
  const upload = usePmbPortalUpload()
  const save = useUpsertPmbPortalTestimonial()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const form = useForm<PmbTestimonialFormValues>({
    resolver: zodResolver(pmbTestimonialSchema),
    defaultValues: {
      content: '',
      rating: 5,
      photo_media_id: null,
      role: 'Orang Tua Pendaftar',
    },
  })

  useEffect(() => {
    if (!testimonial) return
    form.reset({
      content: testimonial.content,
      rating: testimonial.rating ?? 5,
      photo_media_id: null,
      role: testimonial.role ?? 'Orang Tua Pendaftar',
    })
    setPhotoPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return testimonial.photo ? resolveAssetUrl(testimonial.photo, '') : null
    })
  }, [form, testimonial])

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  if (!hasPortalAuth()) {
    return <Navigate to={LOGIN_PATH} replace />
  }

  const handlePhotoSelect = (file: File) => {
    if (!(ALLOWED_UPLOAD_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      toast.error('Format foto harus JPG, PNG, atau WebP.')
      return
    }

    const preview = URL.createObjectURL(file)
    setPhotoPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return preview
    })

    upload.mutate(
      { file, purpose: 'testimonial_photo' },
      {
        onSuccess: (media) => {
          form.setValue('photo_media_id', media.id, { shouldDirty: true, shouldValidate: true })
          setPhotoPreview((prev) => {
            if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
            return media.url
          })
        },
        onError: () => {
          setPhotoPreview((prev) => {
            if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
            return testimonial?.photo ? resolveAssetUrl(testimonial.photo, '') : null
          })
        },
      },
    )
  }

  const onSubmit = (values: PmbTestimonialFormValues) => {
    save.mutate(values)
  }

  const hasPhoto = Boolean(photoPreview)
  const isUploading = upload.isPending
  const statusLabel = uploadStatusLabel(upload.phase, upload.progress)

  return (
    <PageEnter tier="lite">
      <div className="mx-auto max-w-2xl space-y-4">
        <Card className="overflow-hidden border-primary/15 shadow-md shadow-primary/5">
          <CardContent className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold sm:text-xl">Tulis Testimoni</h1>
                {testimonial?.status === 'published' && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Dipublikasikan</Badge>
                )}
                {testimonial?.status === 'pending' && (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-700">
                    Menunggu persetujuan
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Bagikan pengalaman Anda sebagai orang tua pendaftar. Testimoni akan ditinjau admin sebelum ditampilkan di
                beranda.
              </p>
            </div>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Memuat testimoni…</p>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <PmbFormSection
                    icon={MessageSquareQuote}
                    title="Cerita Anda"
                    description="Tuliskan pengalaman singkat yang jujur dan sopan."
                  >
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Isi Testimoni *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={6}
                              placeholder="Ceritakan pengalaman Anda dengan sekolah…"
                              className="min-h-32 resize-y focus-visible:ring-primary/30"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating *</FormLabel>
                          <FormControl>
                            <PmbStarRating value={field.value} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </PmbFormSection>

                  <PmbFormSection
                    icon={Camera}
                    title="Foto (Opsional)"
                    description="Foto Anda atau momen bersama anak. JPG, PNG, atau WEBP. Maks. 1 MB."
                  >
                    <div
                      data-form-field="photo_media_id"
                      className="flex flex-col items-center gap-4 rounded-2xl border border-primary/15 bg-muted/20 p-4"
                    >
                      <div className="relative">
                        <label
                          className={cn(
                            'group relative flex size-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 bg-background shadow-inner',
                            hasPhoto ? 'border-primary/30' : 'border-dashed border-primary/25',
                            isUploading && 'pointer-events-none',
                          )}
                        >
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            disabled={isUploading}
                            onChange={(event) => {
                              const file = event.target.files?.[0]
                              event.target.value = ''
                              if (file) handlePhotoSelect(file)
                            }}
                          />
                          {hasPhoto ? (
                            <img src={photoPreview ?? ''} alt="Pratinjau foto testimoni" className="size-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-center">
                              <ImagePlus className="size-8 text-primary/70" aria-hidden />
                              <span className="text-xs text-muted-foreground">Unggah foto</span>
                            </div>
                          )}
                          {hasPhoto && !isUploading && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                              <RefreshCw className="size-5" aria-hidden />
                            </span>
                          )}
                          {isUploading && (
                            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/80 px-2">
                              <Loader2 className="size-7 animate-spin text-primary" aria-hidden />
                              <span className="text-center text-[10px] font-medium text-muted-foreground">{statusLabel}</span>
                            </span>
                          )}
                        </label>
                        {form.watch('photo_media_id') && !isUploading && (
                          <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-primary/20 bg-background px-2 py-0.5 text-[11px] font-semibold text-primary">
                            <CheckCircle2 className="size-3.5" aria-hidden />
                            Siap
                          </span>
                        )}
                      </div>
                      {isUploading && (
                        <UploadProgressBar
                          phase={upload.phase}
                          progress={upload.progress}
                          compact
                          className="w-full max-w-xs"
                        />
                      )}
                      <p className="text-center text-sm text-muted-foreground">
                        Ditampilkan sebagai <strong>{authUser?.name ?? 'nama Anda'}</strong>
                      </p>
                    </div>
                  </PmbFormSection>

                  <Button type="submit" className="h-11 w-full sm:w-auto" disabled={save.isPending}>
                    {save.isPending ? 'Menyimpan…' : testimonial ? 'Perbarui Testimoni' : 'Kirim Testimoni'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </PageEnter>
  )
}
