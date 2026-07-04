import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { VisionMissionPreview } from '@/components/admin/VisionMissionPreview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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

function parseMissionItems(mission: string | null | undefined): string[] {
  if (!mission?.trim()) return ['']
  const items = mission
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
  return items.length ? items : ['']
}

function joinMissionItems(items: string[]): string {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item, i) => `${i + 1}. ${item}`)
    .join('\n')
}

function MissionItemsList({
  items,
  onChange,
}: {
  items: string[]
  onChange: (items: string[]) => void
}) {
  function updateItem(index: number, value: string) {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  function removeItem(index: number) {
    if (items.length <= 1) return
    onChange(items.filter((_, i) => i !== index))
  }

  function addItem() {
    onChange([...items, ''])
  }

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= items.length) return
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex flex-col">
              <button
                type="button"
                className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                disabled={index === 0}
                onClick={() => moveItem(index, index - 1)}
                aria-label="Pindah ke atas"
                tabIndex={-1}
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Poin misi ke-${index + 1}`}
              className="h-10 flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addItem()
                }
              }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0 text-destructive hover:text-destructive"
                  disabled={items.length <= 1}
                  onClick={() => removeItem(index)}
                  aria-label={`Hapus poin ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Hapus poin</TooltipContent>
            </Tooltip>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1 w-full gap-1.5"
          onClick={addItem}
        >
          <Plus className="h-4 w-4" />
          Tambah poin misi
        </Button>
      </div>
    </TooltipProvider>
  )
}

export function VisionMissionPage() {
  const { data: school, isLoading, isError } = useSchool()
  const updateSchool = useUpdateSchool(school?.id ?? 0)

  const form = useForm<VisionMissionFormValues>({
    resolver: zodResolver(visionMissionSchema),
    defaultValues: { vision: '', mission: '' },
  })

  const [missionItems, setMissionItems] = useState<string[]>([''])

  useEffect(() => {
    if (!school) return
    form.reset({
      vision: school.vision ?? '',
      mission: school.mission ?? '',
    })
    setMissionItems(parseMissionItems(school.mission))
  }, [school, form])

  function handleMissionItemsChange(items: string[]) {
    setMissionItems(items)
    form.setValue('mission', joinMissionItems(items), { shouldDirty: true })
  }

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
                  render={() => (
                    <FormItem>
                      <FormLabel>Misi</FormLabel>
                      <MissionItemsList
                        items={missionItems}
                        onChange={handleMissionItemsChange}
                      />
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
