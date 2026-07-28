import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminSettingsList,
  useCreateSetting,
  useUpdateSetting,
} from '@/hooks/useSettings'
import { useSchool } from '@/hooks/useSchool'
import {
  DEFAULT_HERO_COLLAGE,
  HERO_COLLAGE_COLORS,
  displayCollageLetter,
  heroCollageSchema,
  parseHeroCollageValue,
  type HeroCollageFormValues,
} from '@/schemas/heroCollage'
import { cn } from '@/lib/utils'

const COLOR_LABELS: Record<(typeof HERO_COLLAGE_COLORS)[number], string> = {
  'from-primary/30 to-primary/10': 'Hijau lembut',
  'from-primary/40 to-primary/10': 'Hijau sedang',
  'from-[var(--gold-accent)]/30 to-primary/10': 'Emas',
  'from-primary/25 to-accent/40': 'Hijau–aksen',
  'from-accent/40 to-primary/15': 'Aksen',
  'from-primary/50 to-primary/20': 'Hijau tegas',
}

export function HeroCollagePage() {
  const { t } = useTranslation('admin')
  const { data: school } = useSchool()
  const { data, isLoading } = useAdminSettingsList({ group: 'homepage', per_page: 50 })
  const setting = data?.data?.find((s) => s.key === 'hero_collage')
  const createSetting = useCreateSetting()
  const updateSetting = useUpdateSetting(setting?.id ?? 0)

  const [form, setForm] = useState<HeroCollageFormValues>(DEFAULT_HERO_COLLAGE)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const parsed = parseHeroCollageValue(setting?.value)
    if (parsed) {
      setForm(parsed)
    }
  }, [setting?.value])

  const previewItems = useMemo(() => form.items, [form.items])

  const setItem = (index: number, patch: Partial<HeroCollageFormValues['items'][number]>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  const handleSave = () => {
    const result = heroCollageSchema.safeParse(form)
    if (!result.success) {
      const next: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path.join('.')
        if (!next[path]) {
          next[path] = issue.message
        }
      }
      setErrors(next)
      return
    }
    setErrors({})

    const payload = {
      school_id: school?.id ?? setting?.school_id ?? 0,
      group: 'homepage',
      key: 'hero_collage',
      type: 'json' as const,
      value: JSON.stringify(result.data),
    }

    if (setting) {
      updateSetting.mutate({ value: payload.value, type: 'json' })
    } else {
      createSetting.mutate(payload)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>
  }

  return (
    <AdminFormShell
      title={t('pages.heroCollage.title')}
      description={t('pages.heroCollage.description')}
      backHref="/admin"
      onSubmit={handleSave}
      onCancel={() => {
        const parsed = parseHeroCollageValue(setting?.value)
        setForm(parsed ?? DEFAULT_HERO_COLLAGE)
        setErrors({})
      }}
      isSubmitting={createSetting.isPending || updateSetting.isPending}
      isDisabled={!school?.id && !setting?.school_id}
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="admin-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('pages.heroCollage.formTitle')}</CardTitle>
            <CardDescription>{t('pages.heroCollage.formDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-2">
              <Label htmlFor="collage-subtitle">{t('pages.heroCollage.subtitle')}</Label>
              <Textarea
                id="collage-subtitle"
                value={form.subtitle}
                onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                rows={2}
                className="min-h-11"
              />
              {errors.subtitle ? (
                <p className="text-sm text-destructive">{errors.subtitle}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {t('pages.heroCollage.item', { n: index + 1 })}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor={`label-${index}`}>{t('pages.heroCollage.label')}</Label>
                    <Input
                      id={`label-${index}`}
                      value={item.label}
                      onChange={(e) => setItem(index, { label: e.target.value })}
                      className="h-11"
                    />
                    {errors[`items.${index}.label`] ? (
                      <p className="text-sm text-destructive">{errors[`items.${index}.label`]}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`letter-${index}`}>{t('pages.heroCollage.letter')}</Label>
                    <Input
                      id={`letter-${index}`}
                      value={item.letter ?? ''}
                      onChange={(e) => setItem(index, { letter: e.target.value })}
                      maxLength={2}
                      className="h-11"
                      placeholder={item.label.charAt(0) || 'A'}
                    />
                    <p className="text-xs text-muted-foreground">{t('pages.heroCollage.letterHint')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('pages.heroCollage.color')}</Label>
                    <Select
                      value={item.color}
                      onValueChange={(value) =>
                        setItem(index, { color: value as (typeof HERO_COLLAGE_COLORS)[number] })
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HERO_COLLAGE_COLORS.map((color) => (
                          <SelectItem key={color} value={color}>
                            {COLOR_LABELS[color]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('pages.heroCollage.preview')}</CardTitle>
            <CardDescription>{t('pages.heroCollage.previewDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="rounded-2xl bg-primary/90 p-4 text-primary-foreground shadow-inner">
              <div className="grid grid-cols-2 gap-3">
                {previewItems.map((item, i) => (
                  <div
                    key={`${item.label}-${i}`}
                    className={cn(
                      'flex aspect-square flex-col items-center justify-center rounded-2xl bg-gradient-to-br p-3',
                      item.color,
                    )}
                  >
                    <span className="text-2xl font-bold text-white/90">{displayCollageLetter(item)}</span>
                    <span className="mt-1 text-xs font-semibold text-white/75">{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm font-medium text-white/85">{form.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminFormShell>
  )
}
