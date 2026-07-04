import { CheckCircle, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePmbSettings } from '@/hooks/usePmb'
import { useSchool } from '@/hooks/useSchool'

export function PmbInfoPage() {
  const { t } = useTranslation('pages')
  const { data: school, isLoading: schoolLoading } = useSchool()
  const { data: settings, isLoading: settingsLoading } = usePmbSettings(school?.id)

  const isLoading = schoolLoading || settingsLoading

  const settingMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]))

  const steps = [
    { title: t('pmbInfo.step1Title'), description: t('pmbInfo.step1Desc') },
    { title: t('pmbInfo.step2Title'), description: t('pmbInfo.step2Desc') },
    { title: t('pmbInfo.step3Title'), description: t('pmbInfo.step3Desc') },
    { title: t('pmbInfo.step4Title'), description: t('pmbInfo.step4Desc') },
  ]

  return (
    <PublicPageShell>
      <SubpageHero
        title={t('pmbInfo.title')}
        subtitle={t('pmbInfo.subtitle')}
        badge={t('pmbInfo.badge')}
        backHref="/"
        backLabel={t('pmbInfo.backHome')}
      />
      <section className="container-page section-padding">

        {isLoading ? (
          <Skeleton className="mb-8 h-48 w-full" />
        ) : (
          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('pmbInfo.subtitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{settingMap.pmb_description ?? t('pmbInfo.fallbackDesc')}</p>
                {settingMap.pmb_period && <p><strong>{t('pmbInfo.period')}</strong> {settingMap.pmb_period}</p>}
                {settingMap.pmb_quota && <p><strong>{t('pmbInfo.quota')}</strong> {settingMap.pmb_quota}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {t('pmbInfo.requirements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {settingMap.pmb_requirements ?? t('pmbInfo.fallbackReqList')}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <h2 className="mb-4 text-xl font-semibold">{t('pmbInfo.flow')}</h2>
        <Accordion type="single" collapsible className="mb-10">
          {steps.map((step, i) => (
            <AccordionItem key={step.title} value={`step-${i}`}>
              <AccordionTrigger>
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    {i + 1}
                  </span>
                  {step.title}
                </span>
              </AccordionTrigger>
              <AccordionContent>{step.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/pmb/daftar">{t('pmbInfo.registerNow')}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/pmb/status">{t('pmbInfo.checkStatus')}</Link>
          </Button>
        </div>
      </section>
    </PublicPageShell>
  )
}
