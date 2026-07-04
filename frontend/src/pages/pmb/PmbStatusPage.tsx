import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { usePmbTrack } from '@/hooks/usePmb'
import { pmbTrackSchema, type PmbTrackFormValues } from '@/schemas/pmb'
import type { PmbStatus } from '@/types'

const statusLabels: Record<PmbStatus, string> = {
  pending: 'Menunggu Verifikasi',
  review: 'Sedang Ditinjau',
  accepted: 'Diterima',
  rejected: 'Ditolak',
  paid: 'Sudah Bayar',
}

const statusVariants: Record<PmbStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  review: 'outline',
  accepted: 'default',
  rejected: 'destructive',
  paid: 'default',
}

export function PmbStatusPage() {
  const { token: urlToken } = useParams()
  const [activeToken, setActiveToken] = useState(urlToken ?? '')
  const { data: registration, isLoading, isError } = usePmbTrack(activeToken)

  const savedRegNumber = sessionStorage.getItem('pmb_registration_number')

  const form = useForm<PmbTrackFormValues>({
    resolver: zodResolver(pmbTrackSchema),
    defaultValues: { token: urlToken ?? '' },
  })

  const onSubmit = (values: PmbTrackFormValues) => {
    setActiveToken(values.token)
  }

  return (
    <PublicPageShell>
      <SubpageHero
        title="Cek Status Pendaftaran"
        subtitle="Lacak status pendaftaran siswa baru Anda."
        badge="PMB"
        backHref="/pmb"
        backLabel="Informasi PMB"
      />
      <section className="container-page section-padding">
        <div className="mx-auto max-w-lg">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Masukkan Token</CardTitle>
              <CardDescription>
                Masukkan token pelacakan yang Anda terima setelah mendaftar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedRegNumber && (
                <p className="mb-4 rounded-md bg-secondary/50 p-3 text-sm">
                  Nomor pendaftaran terakhir: <strong>{savedRegNumber}</strong>
                </p>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">Token Pelacakan</FormLabel>
                        <FormControl>
                          <Input placeholder="Token pelacakan..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="self-end">Cek</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {activeToken && isLoading && <Skeleton className="h-48 w-full" />}

          {activeToken && !isLoading && isError && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Pendaftaran tidak ditemukan. Periksa kembali token Anda.
              </CardContent>
            </Card>
          )}

          {registration && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{registration.student_name}</CardTitle>
                  <Badge variant={statusVariants[registration.status]}>
                    {statusLabels[registration.status]}
                  </Badge>
                </div>
                <CardDescription>No. Pendaftaran: {registration.registration_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Jenjang:</span> {registration.grade_applied}</p>
                <p><span className="text-muted-foreground">Orang Tua:</span> {registration.parent_name}</p>
                <p><span className="text-muted-foreground">Telepon:</span> {registration.parent_phone}</p>
                {registration.created_at && (
                  <p><span className="text-muted-foreground">Tanggal Daftar:</span> {formatDate(registration.created_at)}</p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-center">
            <Button asChild variant="link">
              <Link to="/pmb/daftar">Belum mendaftar? Daftar sekarang</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicPageShell>
  )
}
