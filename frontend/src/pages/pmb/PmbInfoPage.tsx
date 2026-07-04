import { CheckCircle, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePmbSettings } from '@/hooks/usePmb'
import { useSchool } from '@/hooks/useSchool'

const defaultSteps = [
  { title: 'Isi Formulir Online', description: 'Lengkapi data siswa dan orang tua melalui formulir pendaftaran.' },
  { title: 'Upload Dokumen', description: 'Siapkan dokumen yang diperlukan sesuai ketentuan sekolah.' },
  { title: 'Verifikasi & Seleksi', description: 'Tim PMB akan memverifikasi data dan menginformasikan jadwal seleksi.' },
  { title: 'Pengumuman Hasil', description: 'Cek status pendaftaran melalui halaman pelacakan.' },
]

export function PmbInfoPage() {
  const { data: school, isLoading: schoolLoading } = useSchool()
  const { data: settings, isLoading: settingsLoading } = usePmbSettings(school?.id)

  const isLoading = schoolLoading || settingsLoading

  const settingMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]))

  return (
    <PublicPageShell>
      <SubpageHero
        title="Penerimaan Murid Baru"
        subtitle={`Informasi lengkap mengenai pendaftaran siswa baru di ${school?.name ?? 'Nurul Hikmah School'}.`}
        badge="PMB"
        backHref="/"
        backLabel="Kembali ke beranda"
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
                  Informasi Pendaftaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{settingMap.pmb_description ?? 'Pendaftaran siswa baru telah dibuka. Segera daftarkan putra-putri Anda.'}</p>
                {settingMap.pmb_period && <p><strong>Periode:</strong> {settingMap.pmb_period}</p>}
                {settingMap.pmb_quota && <p><strong>Kuota:</strong> {settingMap.pmb_quota}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Persyaratan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {settingMap.pmb_requirements ?? '1. Fotokopi akta kelahiran\n2. Fotokopi kartu keluarga\n3. Pas foto terbaru\n4. Rapor semester terakhir'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <h2 className="mb-4 text-xl font-semibold">Alur Pendaftaran</h2>
        <Accordion type="single" collapsible className="mb-10">
          {defaultSteps.map((step, i) => (
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
            <Link to="/pmb/daftar">Daftar Sekarang</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/pmb/status">Cek Status Pendaftaran</Link>
          </Button>
        </div>
      </section>
    </PublicPageShell>
  )
}
