import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuthMe } from '@/hooks/useAuth'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { isGuruRole } from '@/hooks/useUsers'
import { getApiErrorMessage } from '@/lib/api'
import { profileAccountSchema, profileTeacherSchema, type ProfileAccountValues, type ProfileTeacherValues } from '@/schemas/profile'

export function ProfilePage() {
  const { data: authUser } = useAuthMe()
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const accountForm = useForm<ProfileAccountValues>({
    resolver: zodResolver(profileAccountSchema),
    defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
  })

  const teacherForm = useForm<ProfileTeacherValues>({
    resolver: zodResolver(profileTeacherSchema),
    defaultValues: {
      name: '', title: '', subject: '', bio: '', photo: '', email: '',
      social_media: { facebook: '', instagram: '', youtube: '', tiktok: '', twitter: '' },
    },
  })

  useEffect(() => {
    if (profile) {
      accountForm.reset({
        name: profile.user.name,
        email: profile.user.email,
        password: '',
        password_confirmation: '',
      })

      if (profile.teacher) {
        teacherForm.reset({
          name: profile.teacher.name,
          title: profile.teacher.title ?? '',
          subject: profile.teacher.subject ?? '',
          bio: profile.teacher.bio ?? '',
          photo: profile.teacher.photo ?? '',
          email: profile.teacher.email ?? '',
          social_media: {
            facebook: profile.teacher.social_media?.facebook ?? '',
            instagram: profile.teacher.social_media?.instagram ?? '',
            youtube: profile.teacher.social_media?.youtube ?? '',
            tiktok: profile.teacher.social_media?.tiktok ?? '',
            twitter: profile.teacher.social_media?.twitter ?? '',
          },
        })
      }
    }
  }, [profile, accountForm, teacherForm])

  const onSubmit = async () => {
    const accountValid = await accountForm.trigger()
    const teacherValid = profile?.teacher ? await teacherForm.trigger() : true

    if (!accountValid || !teacherValid) return

    const teacherValues = profile?.teacher ? teacherForm.getValues() : undefined
    if (teacherValues?.social_media) {
      const sm = teacherValues.social_media
      const cleaned = {
        facebook: sm.facebook || null,
        instagram: sm.instagram || null,
        youtube: sm.youtube || null,
        tiktok: sm.tiktok || null,
        twitter: sm.twitter || null,
      }
      teacherValues.social_media = Object.values(cleaned).some(Boolean) ? cleaned : undefined
    }

    updateProfile.mutate(
      {
        user: accountForm.getValues(),
        teacher: teacherValues,
      },
      {
        onSuccess: () => {
          toast.success('Profil berhasil diperbarui')
          accountForm.reset({
            ...accountForm.getValues(),
            password: '',
            password_confirmation: '',
          })
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal memperbarui profil')),
      },
    )
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat profil...</p>
  }

  const showTeacherSection = isGuruRole(authUser?.role) || profile?.teacher

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">Kelola akun login dan profil guru publik</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Akun Login</CardTitle>
          <CardDescription>Nama, email, dan kata sandi untuk masuk panel</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...accountForm}>
            <form className="space-y-4">
              <FormField
                control={accountForm.control}
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
                control={accountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Login</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kata Sandi Baru (opsional)</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="h-11" autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
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
            </form>
          </Form>
        </CardContent>
      </Card>

      {showTeacherSection && (
        <Card>
          <CardHeader>
            <CardTitle>Profil Guru</CardTitle>
            <CardDescription>
              {profile?.teacher
                ? 'Informasi yang ditampilkan di halaman guru publik'
                : 'Profil guru belum ditautkan. Hubungi admin untuk menghubungkan akun Anda.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.teacher ? (
              <Form {...teacherForm}>
                <form className="space-y-4">
                  <FormField
                    control={teacherForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Tampilan</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={teacherForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jabatan</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teacherForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mata Pelajaran</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={teacherForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Publik</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teacherForm.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Foto</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11" placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teacherForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3 rounded-lg border p-4">
                    <p className="text-sm font-medium">Media Sosial</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={teacherForm.control}
                        name="social_media.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                              <Facebook className="h-4 w-4" /> Facebook
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className="h-11" placeholder="https://facebook.com/..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={teacherForm.control}
                        name="social_media.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                              <Instagram className="h-4 w-4" /> Instagram
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className="h-11" placeholder="@username atau URL" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={teacherForm.control}
                        name="social_media.youtube"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                              <Youtube className="h-4 w-4" /> YouTube
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className="h-11" placeholder="https://youtube.com/..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={teacherForm.control}
                        name="social_media.tiktok"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TikTok</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-11" placeholder="@username atau URL" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={teacherForm.control}
                        name="social_media.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>X / Twitter</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-11" placeholder="@username atau URL" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            ) : (
              <p className="text-sm text-muted-foreground">
                Akun guru Anda belum terhubung ke data guru di website.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Button className="min-h-11 w-full sm:w-auto" onClick={onSubmit} disabled={updateProfile.isPending}>
        {updateProfile.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </div>
  )
}
