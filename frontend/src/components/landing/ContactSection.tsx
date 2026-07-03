import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useSchool } from '@/hooks/useSchool'

export function ContactSection() {
  const { data: school, isLoading } = useSchool()

  if (isLoading) {
    return (
      <section id="kontak" className="section-padding bg-secondary/20">
        <div className="container-page">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </section>
    )
  }

  const contactItems = [
    school?.address && {
      icon: MapPin,
      label: 'Alamat',
      content: [school.address, school.city, school.province, school.postal_code]
        .filter(Boolean)
        .join(', '),
    },
    school?.phone && {
      icon: Phone,
      label: 'Telepon',
      content: school.phone,
      href: `tel:${school.phone}`,
    },
    school?.email && {
      icon: Mail,
      label: 'Email',
      content: school.email,
      href: `mailto:${school.email}`,
    },
  ].filter(Boolean) as Array<{
    icon: typeof MapPin
    label: string
    content: string
    href?: string
  }>

  return (
    <section id="kontak" className="section-padding bg-secondary/20">
      <div className="container-page">
        <SectionHeader
          badge="Kontak"
          title="Hubungi Kami"
          description="Ada pertanyaan? Tim kami siap membantu Anda melalui berbagai saluran komunikasi."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-primary/10 shadow-lg shadow-primary/5">
            <CardContent className="space-y-6 p-6 md:p-8">
              {contactItems.map(({ icon: Icon, label, content, href }) => (
                <div key={label} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    {href ? (
                      <a href={href} className="mt-0.5 text-sm text-muted-foreground hover:text-primary">
                        {content}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{content}</p>
                    )}
                  </div>
                </div>
              ))}

              {school?.whatsapp && (
                <Button asChild size="lg" className="mt-2 w-full shadow-md shadow-primary/20 sm:w-auto">
                  <a
                    href={`https://wa.me/${school.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat via WhatsApp
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {school?.map_embed_url ? (
            <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-lg shadow-primary/5">
              <iframe
                src={school.map_embed_url}
                title="Peta Lokasi Sekolah"
                className="h-80 w-full lg:h-full lg:min-h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-card p-8 text-center">
              <MapPin className="mb-3 h-10 w-10 text-primary/40" />
              <p className="font-medium text-foreground">Peta lokasi</p>
              <p className="mt-1 text-sm text-muted-foreground">Peta embed akan ditampilkan di sini.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
