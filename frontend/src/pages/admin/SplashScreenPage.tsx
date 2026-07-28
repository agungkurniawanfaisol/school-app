import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminImageField } from '@/components/admin/AdminImageField'
import { LandingSplashScreen } from '@/components/landing/LandingSplashScreen'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminSettingsList,
  useCreateSetting,
  useUpdateSetting,
} from '@/hooks/useSettings'
import { useSchool } from '@/hooks/useSchool'
import {
  DEFAULT_SPLASH_SCREEN,
  MAX_SPLASH_DURATION_MS,
  MIN_SPLASH_DURATION_MS,
  parseSplashScreenValue,
  resolveSplashDisplay,
  splashScreenSchema,
  type SplashScreenFormValues,
} from '@/schemas/splashScreen'

export function SplashScreenPage() {
  const { t } = useTranslation('admin')
  const { data: school } = useSchool()
  const { data, isLoading } = useAdminSettingsList({ group: 'homepage', per_page: 50 })
  const setting = data?.data?.find((s) => s.key === 'splash_screen')
  const createSetting = useCreateSetting()
  const updateSetting = useUpdateSetting(setting?.id ?? 0)

  const [form, setForm] = useState<SplashScreenFormValues>(DEFAULT_SPLASH_SCREEN)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const parsed = parseSplashScreenValue(setting?.value)
    if (parsed) {
      setForm(parsed)
    }
  }, [setting?.value])

  const preview = useMemo(
    () => resolveSplashDisplay(form, school),
    [form, school],
  )

  const handleSave = () => {
    const result = splashScreenSchema.safeParse(form)
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
      key: 'splash_screen',
      type: 'json' as const,
      value: JSON.stringify({
        ...result.data,
        image: result.data.image?.trim() || '',
        subtitle: result.data.subtitle?.trim() || '',
      }),
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
      title={t('pages.splashScreen.title')}
      description={t('pages.splashScreen.description')}
      backHref="/admin"
      onSubmit={handleSave}
      onCancel={() => {
        setForm(parseSplashScreenValue(setting?.value) ?? DEFAULT_SPLASH_SCREEN)
        setErrors({})
      }}
      isSubmitting={createSetting.isPending || updateSetting.isPending}
      isDisabled={!school?.id && !setting?.school_id}
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="admin-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('pages.splashScreen.formTitle')}</CardTitle>
            <CardDescription>{t('pages.splashScreen.formDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-4 pt-0 sm:p-6 sm:pt-0">
            <AdminImageField
              label={t('pages.splashScreen.image')}
              hint={t('pages.splashScreen.imageHint')}
              value={form.image ?? ''}
              onChange={(value) => setForm((prev) => ({ ...prev, image: value }))}
              collection="general"
            />
            {errors.image ? <p className="text-sm text-destructive">{errors.image}</p> : null}

            <div className="space-y-2">
              <Label htmlFor="splash-title">{t('pages.splashScreen.titleField')}</Label>
              <Input
                id="splash-title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="h-11"
              />
              {errors.title ? <p className="text-sm text-destructive">{errors.title}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="splash-subtitle">{t('pages.splashScreen.subtitle')}</Label>
              <Textarea
                id="splash-subtitle"
                value={form.subtitle ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                rows={2}
                className="min-h-11"
              />
              <p className="text-xs text-muted-foreground">{t('pages.splashScreen.subtitleHint')}</p>
              {errors.subtitle ? <p className="text-sm text-destructive">{errors.subtitle}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="splash-duration">{t('pages.splashScreen.duration')}</Label>
              <Input
                id="splash-duration"
                type="number"
                min={MIN_SPLASH_DURATION_MS}
                max={MAX_SPLASH_DURATION_MS}
                step={100}
                value={form.duration_ms}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, duration_ms: Number(e.target.value) || prev.duration_ms }))
                }
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                {t('pages.splashScreen.durationHint', {
                  min: MIN_SPLASH_DURATION_MS,
                  max: MAX_SPLASH_DURATION_MS,
                })}
              </p>
              {errors.duration_ms ? (
                <p className="text-sm text-destructive">{errors.duration_ms}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card h-fit overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('pages.splashScreen.preview')}</CardTitle>
            <CardDescription>{t('pages.splashScreen.previewDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <LandingSplashScreen
              preview
              closing={false}
              image={preview.image}
              title={preview.title}
              subtitle={preview.subtitle}
            />
          </CardContent>
        </Card>
      </div>
    </AdminFormShell>
  )
}
