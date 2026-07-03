import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
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
import { createUserSchema, userFormSchema, type CreateUserFormValues, type UserFormValues } from '@/schemas/user'

export function UserFormPage() {
  const { id } = useParams()
  const userId = id ? Number(id) : 0
  const isEdit = userId > 0
  const navigate = useNavigate()
  const { data: authUser } = useAuthMe()
  const { data: userDetail, isLoading } = useAdminUserDetail(userId)
  const { data: teachersData } = useAdminTeachersList({ per_page: 100 })
  const createUser = useCreateUser()
  const updateUser = useUpdateUser(userId)

  if (authUser && !isAdminRole(authUser.role)) {
    return <Navigate to="/admin/profile" replace />
  }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(isEdit ? userFormSchema : createUserSchema),
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

  const onSubmit = (values: UserFormValues) => {
    const handlers = {
      onSuccess: () => {
        toast.success(isEdit ? 'Pengguna berhasil diperbarui' : 'Pengguna berhasil ditambahkan')
        navigate('/admin/users')
      },
      onError: (error: unknown) => {
        toast.error(getApiErrorMessage(error, 'Gagal menyimpan pengguna'))
      },
    }

    if (isEdit) {
      updateUser.mutate(values, handlers)
      return
    }

    createUser.mutate(values as CreateUserFormValues, handlers)
  }

  if (isEdit && isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat data pengguna...</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</CardTitle>
          <CardDescription>
            {isEdit ? 'Perbarui data akun pengguna' : 'Buat akun admin atau guru baru'}
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
                    <FormLabel>Nama</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>{isEdit ? 'Kata Sandi Baru (opsional)' : 'Kata Sandi'}</FormLabel>
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
                    <FormLabel>Konfirmasi Kata Sandi</FormLabel>
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
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="guru">Guru</SelectItem>
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
                      <FormLabel>Profil Guru (opsional)</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === 'none' ? null : Number(v))}
                        value={field.value ? String(field.value) : 'none'}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Pilih profil guru" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Buat profil guru otomatis</SelectItem>
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
                    <FormLabel className="font-normal">Akun aktif</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <Button type="submit" className="min-h-11" disabled={createUser.isPending || updateUser.isPending}>
                  {createUser.isPending || updateUser.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" className="min-h-11" asChild>
                  <Link to="/admin/users">Batal</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
