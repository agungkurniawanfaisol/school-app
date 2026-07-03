import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { useSchool } from '@/hooks/useSchool'

export function Footer() {
  const { data: school } = useSchool()
  const social = school?.social_media

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container-page section-padding">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">{school?.name ?? 'Nurul Hikmah'}</h3>
            <p className="text-sm text-muted-foreground">
              {school?.tagline ?? 'Sekolah Islam Terpadu — mendidik generasi berakhlak mulia dan berprestasi.'}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/kursus" className="hover:text-primary">Katalog Kursus</Link></li>
              <li><Link to="/pmb" className="hover:text-primary">Pendaftaran Siswa Baru</Link></li>
              <li><Link to="/pmb/status" className="hover:text-primary">Cek Status PMB</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Kontak</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {school?.address && (
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{school.address}{school.city ? `, ${school.city}` : ''}</span>
                </li>
              )}
              {school?.phone && (
                <li className="flex gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href={`tel:${school.phone}`} className="hover:text-primary">{school.phone}</a>
                </li>
              )}
              {school?.email && (
                <li className="flex gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${school.email}`} className="hover:text-primary">{school.email}</a>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Media Sosial</h4>
            <div className="flex gap-3">
              {social?.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {social?.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {social?.youtube && (
                <a href={social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {school?.name ?? 'Nurul Hikmah School'}. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  )
}
