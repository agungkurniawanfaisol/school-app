import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
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
        toast.success(response.message ?? 'Pendaftaran berhasil dikirim')
        const reg = response.data
        if (reg.registration_number) {
          sessionStorage.setItem('pmb_registration_number', reg.registration_number)
        }
        navigate('/pmb/status')
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Pendaftaran gagal'))
      },
    })
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="container-page flex-1 section-padding">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Formulir Pendaftaran Siswa Baru</CardTitle>
            <CardDescription>
              Lengkapi data berikut untuk mendaftarkan putra-putri Anda di {school?.name ?? 'sekolah kami'}.
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
                      <FormLabel>Nama Siswa</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama lengkap siswa" {...field} />
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
                        <FormLabel>Tempat Lahir</FormLabel>
                        <FormControl>
                          <Input placeholder="Kota kelahiran" {...field} value={field.value ?? ''} />
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
                        <FormLabel>Tanggal Lahir</FormLabel>
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
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis kelamin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
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
                      <FormLabel>Jenjang Pendaftaran</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Kelas 1 SD" {...field} />
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
                      <FormLabel>Sekolah Sebelumnya</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama sekolah sebelumnya (opsional)" {...field} value={field.value ?? ''} />
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
                      <FormLabel>Nama Orang Tua/Wali</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama lengkap orang tua" {...field} />
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
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input placeholder="08xxxxxxxxxx" {...field} />
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
                        <FormLabel>Email (Opsional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@contoh.com" {...field} value={field.value ?? ''} />
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
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Alamat lengkap" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" disabled={register.isPending}>
                    {register.isPending ? 'Mengirim...' : 'Kirim Pendaftaran'}
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/pmb">Batal</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
