import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminImageField } from '@/components/admin/AdminImageField'
import { FeaturedProgramPreview } from '@/components/admin/FeaturedProgramPreview'
import { RichPageEditor } from '@/components/editor/RichPageEditor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminCurriculumDetail,
  useCreateCurriculum,
  useUpdateCurriculum,
} from '@/hooks/useCurriculums'
import { useSchool } from '@/hooks/useSchool'
import { PROGRAM_ICON_OPTIONS } from '@/lib/lucide-icon-map'
import { slugify } from '@/lib/utils'
import { EMPTY_EDITOR_DOC, type EditorDocument } from '@/schemas/editor'
import { featuredProgramSchema, type FeaturedProgramFormValues } from '@/schemas/curriculum'

export function FeaturedProgramFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminCurriculumDetail(numericId)
  const createItem = useCreateCurriculum()
  const updateItem = useUpdateCurriculum(numericId)

  const [contentJson, setContentJson] = useState<EditorDocument>(EMPTY_EDITOR_DOC)
  const [contentHtml, setContentHtml] = useState('')

  const form = useForm<FeaturedProgramFormValues>({
    resolver: zodResolver(featuredProgramSchema),
    defaultValues: {
      school_id: 0,
      title: '',
      slug: '',
      excerpt: '',
      icon: 'book-open',
      thumbnail: '',
      category: '',
      order: 0,
      is_active: true,
      is_featured: true,
      content: '',
      content_json: EMPTY_EDITOR_DOC,
    },
  })

  useEffect(() => {
    if (!existing) return
    form.reset({
      school_id: existing.school_id,
      title: existing.title,
      slug: existing.slug,
      excerpt: existing.excerpt ?? '',
      icon: existing.icon ?? 'book-open',
      thumbnail: existing.thumbnail ?? '',
      category: existing.category ?? '',
      order: existing.order,
      is_active: existing.is_active,
      is_featured: existing.is_featured,
      content: existing.content ?? '',
      content_json: (existing.content_json as EditorDocument) ?? EMPTY_EDITOR_DOC,
    })
    setContentJson((existing.content_json as EditorDocument) ?? EMPTY_EDITOR_DOC)
    setContentHtml(existing.content ?? '')
  }, [existing, form])

  useEffect(() => {
    if (school?.id && !isEdit) {
      form.setValue('school_id', school.id)
    }
  }, [school?.id, isEdit, form])

  const watched = form.watch()

  const onSubmit = (values: FeaturedProgramFormValues) => {
    const schoolId = school?.id ?? existing?.school_id ?? values.school_id
    if (!schoolId) return

    const payload: FeaturedProgramFormValues = {
      ...values,
      school_id: schoolId,
      slug: values.slug || slugify(values.title),
      excerpt: values.excerpt?.trim() || null,
      icon: values.icon || null,
      thumbnail: values.thumbnail || null,
      category: values.category?.trim() || null,
      content: contentHtml || null,
      content_json: contentJson,
    }

    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/program-unggulan') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/program-unggulan') })
    }
  }

  if (isEdit && isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat data...</p>
  }

  return (
    <AdminFormShell
      title={isEdit ? 'Edit Program Unggulan' : 'Tambah Program Unggulan'}
      description="Program ini tampil di bagian Program Unggulan pada beranda publik."
      backHref="/admin/program-unggulan"
      onSubmit={() => {
        void form.handleSubmit(onSubmit, () => {
          toast.error('Periksa kembali isian formulir.')
        })()
      }}
      onCancel={() => navigate('/admin/program-unggulan')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!watched.title || !(school?.id ?? existing?.school_id)}
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-base">Informasi Program</CardTitle>
            <CardDescription>Judul, ikon, dan ringkasan untuk kartu di beranda.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="title">Judul</FormLabel>
                      <FormControl>
                        <Input
                          id="title"
                          className="h-11"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            if (!isEdit) {
                              form.setValue('slug', slugify(e.target.value))
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="slug">Slug URL</FormLabel>
                      <FormControl>
                        <Input id="slug" className="h-11" {...field} />
                      </FormControl>
                      <FormDescription>Contoh: program-tahfidz</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="excerpt">Ringkasan</FormLabel>
                      <FormControl>
                        <Textarea id="excerpt" rows={2} {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="icon">Ikon</FormLabel>
                      <Select value={field.value ?? 'book-open'} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger id="icon" className="h-11">
                            <SelectValue placeholder="Pilih ikon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROGRAM_ICON_OPTIONS.map((option) => {
                            const Icon = option.icon
                            return (
                              <SelectItem key={option.value} value={option.value}>
                                <span className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" aria-hidden />
                                  {option.label}
                                </span>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AdminImageField
                          label="Thumbnail"
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="category">Kategori</FormLabel>
                      <FormControl>
                        <Input id="category" className="h-11" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="order">Urutan</FormLabel>
                      <FormControl>
                        <Input
                          id="order"
                          type="number"
                          min={0}
                          className="h-11"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 rounded-lg border border-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <FormLabel htmlFor="is_active" className="mb-0">
                        Aktif
                      </FormLabel>
                      <FormControl>
                        <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-4 rounded-lg border border-primary/10 p-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-1">
                        <FormLabel htmlFor="is_featured" className="mb-0">
                          Tampil di Beranda
                        </FormLabel>
                        <FormDescription className="mt-0">
                          Hanya program unggulan yang muncul di landing page.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch id="is_featured" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-6">
          <FeaturedProgramPreview
            title={watched.title}
            excerpt={watched.excerpt}
            thumbnail={watched.thumbnail}
            icon={watched.icon}
            category={watched.category}
            isFeatured={watched.is_featured}
          />
        </div>
      </div>

      <Card className="admin-card mt-6">
        <CardHeader>
          <CardTitle className="text-base">Konten Detail</CardTitle>
          <CardDescription>Deskripsi lengkap program untuk halaman detail publik.</CardDescription>
        </CardHeader>
        <CardContent>
          <RichPageEditor
            value={contentJson}
            onChange={(json, html) => {
              setContentJson(json)
              setContentHtml(html)
            }}
            collection="general"
          />
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
