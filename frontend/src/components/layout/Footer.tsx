import { Facebook, Heart, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { Separator } from '@/components/ui/separator'
import { useSchool } from '@/hooks/useSchool'

function FooterWave() {
  return (
    <div className="text-secondary" aria-hidden>
      <svg viewBox="0 0 1440 48" fill="currentColor" className="block w-full">
        <path d="M0,32 C360,64 720,0 1080,24 C1260,36 1380,40 1440,32 L1440,48 L0,48 Z" />
      </svg>
    </div>
  )
}

function isAllowedMapEmbedUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      /^(www\.)?google\.(com|co\.\w+)(\.maps)?$/i.test(parsed.hostname)
    )
  } catch {
    return false
  }
}

function safeSocialUrl(raw: string, platform: 'facebook' | 'instagram' | 'youtube'): string | null {
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const url = new URL(raw)
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
      return raw
    } catch {
      return null
    }
  }
  const prefixes: Record<string, string> = {
    facebook: 'https://facebook.com/',
    instagram: `https://instagram.com/${raw.replace('@', '')}`,
    youtube: `https://youtube.com/${raw}`,
  }
  return prefixes[platform] ?? null
}

export function Footer() {
  const { data: school } = useSchool()
  const social = school?.social_media

  return (
    <footer className="relative bg-footer text-primary-foreground">
      <FooterWave />

      <div className="container-page pb-10 pt-12 md:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <SchoolLogo
                logo={school?.logo}
                alt={school?.name ?? 'Nurul Hikmah'}
                variant="footer"
              />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/80">
              {school?.tagline ??
                'Sekolah Islam Terpadu — mendidik generasi berakhlak mulia dan berprestasi.'}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Tautan Cepat
            </h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/75">
              <li>
                <a href="#tentang" className="transition-colors hover:text-primary-foreground">
                  Tentang Kami
                </a>
              </li>
              <li>
                <Link to="/pmb" className="transition-colors hover:text-primary-foreground">
                  Pendaftaran Siswa Baru
                </Link>
              </li>
              <li>
                <Link to="/pmb/status" className="transition-colors hover:text-primary-foreground">
                  Cek Status PMB
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Kontak
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              {school?.address && (
                <li className="flex gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold-accent)]" />
                  <span>
                    {school.address}
                    {school.city ? `, ${school.city}` : ''}
                  </span>
                </li>
              )}
              {school?.phone && (
                <li className="flex gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[var(--gold-accent)]" />
                  <a href={`tel:${school.phone}`} className="hover:text-primary-foreground">
                    {school.phone}
                  </a>
                </li>
              )}
              {school?.email && (
                <li className="flex gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[var(--gold-accent)]" />
                  <a href={`mailto:${school.email}`} className="hover:text-primary-foreground">
                    {school.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Media Sosial
            </h4>
            <div className="flex gap-3">
              {social?.facebook && safeSocialUrl(social.facebook, 'facebook') && (
                <a
                  href={safeSocialUrl(social.facebook, 'facebook')!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {social?.instagram && safeSocialUrl(social.instagram, 'instagram') && (
                <a
                  href={safeSocialUrl(social.instagram, 'instagram')!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {social?.youtube && safeSocialUrl(social.youtube, 'youtube') && (
                <a
                  href={safeSocialUrl(social.youtube, 'youtube')!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {school?.map_embed_url && isAllowedMapEmbedUrl(school.map_embed_url) && (
          <div className="mt-10 overflow-hidden rounded-xl border border-primary-foreground/15">
            <iframe
              src={school.map_embed_url}
              title="Lokasi sekolah di Google Maps"
              className="h-[220px] w-full border-0 sm:h-[280px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin"
              allowFullScreen
            />
          </div>
        )}

        <Separator className="my-8 bg-primary-foreground/15" />

        <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-primary-foreground/70 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {school?.name ?? 'Nurul Hikmah School'}. Hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1.5">
            Dibuat dengan
            <Heart className="h-3.5 w-3.5 fill-[var(--gold-accent)] text-[var(--gold-accent)]" aria-hidden />
            untuk pendidikan Islam
          </p>
        </div>
      </div>
    </footer>
  )
}
