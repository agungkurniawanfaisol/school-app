import { MessageSquare, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FadeInView } from '@/components/motion/FadeInView'
import { SectionHeader } from '@/components/landing/SectionHeader'
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

export function SuggestionBoxSection() {
  const { t } = useTranslation('landing')
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
    <section id="kotak-saran" className="section-padding bg-secondary/30">
      <div className="container-page">
        <SectionHeader
          badge={t('suggestion.badge')}
          title={t('suggestion.title')}
          description={t('suggestion.desc')}
        />

        <FadeInView direction="up" tier="full">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold">{t('suggestion.callTitle')}</h3>
              <p className="text-muted-foreground">{t('suggestion.callDesc')}</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {t('suggestion.point1')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {t('suggestion.point2')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {t('suggestion.point3')}
                </li>
              </ul>
            </div>

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="suggestion-name">{t('suggestion.name')}</Label>
                      <Input
                        id="suggestion-name"
                        placeholder={t('suggestion.namePlaceholder')}
                        {...register('name')}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="suggestion-email">{t('suggestion.email')}</Label>
                      <Input
                        id="suggestion-email"
                        type="email"
                        placeholder={t('suggestion.emailPlaceholder')}
                        {...register('email')}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="suggestion-subject">{t('suggestion.subject')}</Label>
                    <Input
                      id="suggestion-subject"
                      placeholder={t('suggestion.subjectPlaceholder')}
                      {...register('subject')}
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="suggestion-message">{t('suggestion.message')}</Label>
                    <Textarea
                      id="suggestion-message"
                      rows={4}
                      placeholder={t('suggestion.messagePlaceholder')}
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isPending}>
                    <Send className="mr-2 h-4 w-4" aria-hidden />
                    {isPending ? t('suggestion.sending') : t('suggestion.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
