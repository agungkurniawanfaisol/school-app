import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { VisionMissionPreview } from '@/components/admin/VisionMissionPreview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useSchool, useUpdateSchool } from '@/hooks/useSchool'
import {
  MISSION_MAX_LENGTH,
  visionMissionSchema,
  VISION_MAX_LENGTH,
  type VisionMissionFormValues,
} from '@/schemas/school'
import { cn } from '@/lib/utils'

function CharCounter({ value, max }: { value: string; max: number }) {
  return (
    <p
      className={cn(
        'text-right text-xs text-muted-foreground',
        value.length > max && 'font-medium text-destructive',
      )}
      aria-live="polite"
    >
      {value.length}/{max}
    </p>
  )
}

export function VisionMissionPage() {
  const { data: school, isLoading, isError } = useSchool()
  const updateSchool = useUpdateSchool(school?.id ?? 0)

  const form = useForm<VisionMissionFormValues>({
    resolver: zodResolver(visionMissionSchema),
    defaultValues: { vision: '', mission: '' },
  })

  useEffect(() => {
    if (!school) return
    form.reset({
      vision: school.vision ?? '',
      mission: school.mission ?? '',
    })
  }, [school, form])

  const visionValue = form.watch('vision') ?? ''
  const missionValue = form.watch('mission') ?? ''

  const onSubmit = (values: VisionMissionFormValues) => {
    if (!school?.id) return
    updateSchool.mutate({
      vision: values.vision?.trim() || null,
      mission: values.mission?.trim() || null,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    )
  }

  if (isError || !school) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-muted-foreground">Data sekolah tidak ditemukan.</p>
        <Button asChild className="mt-4 min-h-11">
          <Link to="/admin/schools">Ke Data Sekolah</Link>
        </Button>
      </div>
    )
  }

  return (
    <AdminFormShell
      title="Visi & Misi"
      description="Konten ini tampil di bagian Tentang Kami pada beranda publik."
      backHref="/admin"
      backLabel="Dashboard"
      onSubmit={() => {
        void form.handleSubmit(onSubmit)()
      }}
      isSubmitting={updateSchool.isPending}
      footerExtra={
        <Button asChild variant="outline" className="min-h-11 gap-2">
          <Link to={`/admin/schools/${school.id}/edit`}>
            Data sekolah lengkap
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      }
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-base">Edit Konten</CardTitle>
            <CardDescription>Hanya administrator yang dapat mengubah visi dan misi sekolah.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="vision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="vision">Visi</FormLabel>
                      <FormControl>
                        <Textarea
                          id="vision"
                          rows={4}
                          className="min-h-[6rem] resize-y"
                          placeholder="Tuliskan visi sekolah..."
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <CharCounter value={visionValue} max={VISION_MAX_LENGTH} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="mission">Misi</FormLabel>
                      <FormControl>
                        <Textarea
                          id="mission"
                          rows={8}
                          className="min-h-[10rem] resize-y"
                          placeholder={'1. Poin misi pertama\n2. Poin misi kedua'}
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Satu baris = satu poin misi. Gunakan Enter untuk baris baru.
                      </FormDescription>
                      <CharCounter value={missionValue} max={MISSION_MAX_LENGTH} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Pratinjau Beranda</p>
          <VisionMissionPreview vision={visionValue} mission={missionValue} />
        </div>
      </div>
    </AdminFormShell>
  )
}
