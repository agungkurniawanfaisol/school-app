import { MessageSquare, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSubmitContactMessage } from '@/hooks/useContactMessages'

function createSuggestionSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().max(200).optional().default(''),
    email: z.string().max(200).optional().default(''),
    subject: z.string().min(1, t('suggestion.subjectRequired')).max(300),
    message: z.string().min(1, t('suggestion.messageRequired')).max(5000),
  })
}

type SuggestionFormValues = z.infer<ReturnType<typeof createSuggestionSchema>>

export function SuggestionBoxPage() {
  const { t } = useTranslation('pages')
  const { mutate: submit, isPending } = useSubmitContactMessage()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SuggestionFormValues>({
    resolver: zodResolver(createSuggestionSchema(t)),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  function onSubmit(values: SuggestionFormValues) {
    submit(
      {
        school_id: 1,
        name: values.name || 'Anonim',
        email: values.email || 'anonim@nurulhikmah.sch.id',
        subject: values.subject,
        message: values.message,
      },
      { onSuccess: () => reset() },
    )
  }

  return (
    <PublicPageShell>
      <PageMeta
        title={t('suggestion.title')}
        description={t('suggestion.metaDesc')}
      />
      <SubpageHero
        title={t('suggestion.title')}
        subtitle={t('suggestion.subtitle')}
        backHref="/"
        backLabel={t('suggestion.backHome')}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-2xl">
          <Card className="border-primary/10">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3 text-primary">
                <MessageSquare className="h-6 w-6" aria-hidden />
                <p className="text-sm text-muted-foreground">
                  {t('suggestion.desc')}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sg-name">{t('suggestion.name')}</Label>
                    <Input
                      id="sg-name"
                      {...register('name')}
                      placeholder={t('suggestion.namePlaceholder')}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sg-email">{t('suggestion.email')}</Label>
                    <Input
                      id="sg-email"
                      type="email"
                      {...register('email')}
                      placeholder={t('suggestion.emailPlaceholder')}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sg-subject">{t('suggestion.subject')}</Label>
                  <Input
                    id="sg-subject"
                    {...register('subject')}
                    placeholder={t('suggestion.subjectPlaceholder')}
                    className="h-11"
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sg-message">{t('suggestion.message')}</Label>
                  <Textarea
                    id="sg-message"
                    {...register('message')}
                    placeholder={t('suggestion.messagePlaceholder')}
                    rows={6}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={isPending} className="min-h-11 w-full gap-2">
                  <Send className="h-4 w-4" aria-hidden />
                  {isPending ? t('suggestion.sending') : t('suggestion.send')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageShell>
  )
}
