import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchool } from '@/hooks/useSchool'

export function ContactSection() {
  const { data: school, isLoading } = useSchool()

  if (isLoading) {
    return (
      <section id="kontak" className="section-padding">
        <div className="container-page">
          <Skeleton className="h-64 w-full" />
        </div>
      </section>
    )
  }

  return (
    <section id="kontak" className="section-padding">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">Hubungi Kami</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Ada pertanyaan? Tim kami siap membantu Anda.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {school?.address && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Alamat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {school.address}
                    {school.city && `, ${school.city}`}
                    {school.province && `, ${school.province}`}
                    {school.postal_code && ` ${school.postal_code}`}
                  </p>
                </CardContent>
              </Card>
            )}
            {school?.phone && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Telepon</CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={`tel:${school.phone}`} className="text-sm text-primary hover:underline">
                    {school.phone}
                  </a>
                </CardContent>
              </Card>
            )}
            {school?.email && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={`mailto:${school.email}`} className="text-sm text-primary hover:underline">
                    {school.email}
                  </a>
                </CardContent>
              </Card>
            )}
            {school?.whatsapp && (
              <Button asChild className="w-full sm:w-auto">
                <a
                  href={`https://wa.me/${school.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat via WhatsApp
                </a>
              </Button>
            )}
          </div>

          {school?.map_embed_url ? (
            <div className="overflow-hidden rounded-lg border">
              <iframe
                src={school.map_embed_url}
                title="Peta Lokasi Sekolah"
                className="h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-lg border bg-muted">
              <p className="text-sm text-muted-foreground">Peta lokasi belum tersedia</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
