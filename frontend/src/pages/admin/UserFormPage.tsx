import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthMe } from '@/hooks/useAuth'
import { useAdminTeachersList } from '@/hooks/useTeachers'
import {
  useAdminUserDetail,
  useCreateUser,
  useUpdateUser,
  isAdminRole,
} from '@/hooks/useUsers'
import { getApiErrorMessage } from '@/lib/api'
import { createCreateUserSchema, createUserFormSchema, type CreateUserFormValues, type UserFormValues } from '@/schemas/user'

export function UserFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams()
  const userId = id ? Number(id) : 0
  const isEdit = userId > 0
  const navigate = useNavigate()
  const { data: authUser } = useAuthMe()
  const { data: userDetail, isLoading } = useAdminUserDetail(userId)
  const { data: teachersData } = useAdminTeachersList({ per_page: 100 })
  const createUser = useCreateUser()
  const updateUser = useUpdateUser(userId)

  const userSchema = useMemo(
    () => (isEdit ? createUserFormSchema(t) : createCreateUserSchema(t)),
    [t, isEdit],
  )

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'guru',
      is_active: true,
      teacher_id: null,
    },
  })

  const role = form.watch('role')

  useEffect(() => {
    if (userDetail && isEdit) {
      form.reset({
        name: userDetail.name,
        email: userDetail.email,
        password: '',
        password_confirmation: '',
        role: userDetail.role,
        is_active: userDetail.is_active,
        teacher_id: userDetail.teacher_id,
      })
    }
  }, [userDetail, isEdit, form])

  useEffect(() => {
    if (role !== 'guru') {
      form.setValue('teacher_id', null)
    }
  }, [role, form])

  const onSubmit = (values: UserFormValues) => {
    const payload = {
      ...values,
      teacher_id: values.role === 'guru' ? values.teacher_id : null,
    }
    const handlers = {
      onSuccess: () => {
        toast.success(isEdit ? t('toast.userUpdated') : t('toast.userCreated'))
        navigate('/admin/users')
      },
      onError: (error: unknown) => {
        toast.error(getApiErrorMessage(error, t('toast.userSaveFailed')))
      },
    }

    if (isEdit) {
      updateUser.mutate(payload, handlers)
      return
    }

    createUser.mutate(payload as CreateUserFormValues, handlers)
  }

  if (authUser && !isAdminRole(authUser.role)) {
    return <Navigate to="/admin/profile" replace />
  }

  if (isEdit && isLoading) {
    return <p className="text-sm text-muted-foreground">{t('common.loadingUser')}</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="min-h-11 -ml-2 gap-2 px-0 hover:bg-transparent">
        <Link to="/admin/users">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('pages.users.backToList')}
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? t('pages.users.editTitle') : t('pages.users.createTitle')}</CardTitle>
          <CardDescription>
            {isEdit ? t('pages.users.formEditDesc') : t('pages.users.formCreateDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEdit ? t('form.newPassword') : t('form.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="h-11" autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.passwordConfirm')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="h-11" autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.role')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t('form.selectRole')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">{t('pages.users.roleAdmin')}</SelectItem>
                        <SelectItem value="guru">{t('pages.users.roleGuru')}</SelectItem>
                        <SelectItem value="admin_pmb">{t('pages.users.roleAdminPmb')}</SelectItem>
                        <SelectItem value="pendaftar">{t('pages.users.rolePendaftar')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role === 'guru' && (
                <FormField
                  control={form.control}
                  name="teacher_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.users.teacherProfileOptional')}</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === 'none' ? null : Number(v))}
                        value={field.value ? String(field.value) : 'none'}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('pages.users.selectTeacherProfile')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('pages.users.autoCreateTeacher')}</SelectItem>
                          {teachersData?.data.map((teacher) => (
                            <SelectItem key={teacher.id} value={String(teacher.id)}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="size-4 rounded border border-input"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{t('pages.users.accountActive')}</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <Button type="submit" className="min-h-11" disabled={createUser.isPending || updateUser.isPending}>
                  {createUser.isPending || updateUser.isPending ? t('common.saving') : t('common.save')}
                </Button>
                <Button type="button" variant="outline" className="min-h-11" asChild>
                  <Link to="/admin/users">{t('common.cancel')}</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
