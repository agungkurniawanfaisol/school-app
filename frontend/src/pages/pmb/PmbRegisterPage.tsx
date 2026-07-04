import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getApiErrorMessage } from '@/lib/api'
import { usePmbRegister } from '@/hooks/usePmb'
import { useSchool } from '@/hooks/useSchool'
import { pmbRegisterSchema, type PmbRegisterFormValues } from '@/schemas/pmb'

export function PmbRegisterPage() {
  const { t } = useTranslation('pages')
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const register = usePmbRegister()

  const form = useForm<PmbRegisterFormValues>({
    resolver: zodResolver(pmbRegisterSchema),
    defaultValues: {
      school_id: school?.id ?? 0,
      student_name: '',
      birth_place: '',
      birth_date: '',
      gender: undefined,
      parent_name: '',
      parent_phone: '',
      parent_email: '',
      address: '',
      previous_school: '',
      grade_applied: '',
    },
  })

  if (school?.id && form.getValues('school_id') !== school.id) {
    form.setValue('school_id', school.id)
  }

  const onSubmit = (values: PmbRegisterFormValues) => {
    register.mutate(values, {
      onSuccess: (response) => {
        toast.success(response.message ?? t('pmbRegister.successMsg'))
        const reg = response.data
        if (reg.registration_number) {
          sessionStorage.setItem('pmb_registration_number', reg.registration_number)
        }
        navigate('/pmb/status')
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, t('pmbRegister.failedMsg')))
      },
    })
  }

  return (
    <PublicPageShell>
      <SubpageHero
        title={t('pmbRegister.title')}
        subtitle={t('pmbRegister.subtitle')}
        badge={t('pmbRegister.badge')}
        backHref="/pmb"
        backLabel={t('pmbRegister.backHome')}
      />
      <section className="container-page section-padding">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>{t('pmbRegister.formTitle')}</CardTitle>
            <CardDescription>
              {t('pmbRegister.formDesc', { school: school?.name ?? t('pmbRegister.defaultSchool') })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="student_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pmbRegister.childName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('pmbRegister.childNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="birth_place"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pmbRegister.birthPlace')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('pmbRegister.birthPlacePlaceholder')} {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pmbRegister.birthDate')}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pmbRegister.gender')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('pmbRegister.selectGender')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="L">{t('pmbRegister.male')}</SelectItem>
                          <SelectItem value="P">{t('pmbRegister.female')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade_applied"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pmbRegister.gradeApplied')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('pmbRegister.gradeAppliedPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previous_school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pmbRegister.prevSchool')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('pmbRegister.prevSchoolPlaceholder')} {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parent_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pmbRegister.parentName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('pmbRegister.parentNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="parent_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pmbRegister.parentPhone')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('pmbRegister.parentPhonePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parent_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pmbRegister.parentEmail')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t('pmbRegister.parentEmailPlaceholder')} {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pmbRegister.address')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('pmbRegister.addressPlaceholder')} {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" disabled={register.isPending}>
                    {register.isPending ? t('pmbRegister.submitting') : t('pmbRegister.submit')}
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/pmb">{t('pmbRegister.cancel')}</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </PublicPageShell>
  )
}
