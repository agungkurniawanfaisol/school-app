import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExternalLink, Facebook, Instagram, Youtube, MapPin, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useAdminSchoolDetail, useCreateSchool, useUpdateSchool } from '@/hooks/useSchool'
import {
  MISSION_MAX_LENGTH,
  schoolSchema,
  visionMissionSchema,
  VISION_MAX_LENGTH,
} from '@/schemas/school'
import { slugify, cn } from '@/lib/utils'

export function SchoolFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: existing, isLoading } = useAdminSchoolDetail(numericId)
  const createItem = useCreateSchool()
  const updateItem = useUpdateSchool(numericId)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [vision, setVision] = useState('')
  const [mission, setMission] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [youtube, setYoutube] = useState('')
  const [mapEmbedUrl, setMapEmbedUrl] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setSlug(existing.slug)
    setTagline(existing.tagline ?? '')
    setDescription(existing.description ?? '')
    setEmail(existing.email ?? '')
    setPhone(existing.phone ?? '')
    setWhatsapp(existing.whatsapp ?? '')
    setAddress(existing.address ?? '')
    setCity(existing.city ?? '')
    setProvince(existing.province ?? '')
    setPostalCode(existing.postal_code ?? '')
    setVision(existing.vision ?? '')
    setMission(existing.mission ?? '')
    setIsActive(existing.is_active)
    setFacebook(existing.social_media?.facebook ?? '')
    setInstagram(existing.social_media?.instagram ?? '')
    setYoutube(existing.social_media?.youtube ?? '')
    setMapEmbedUrl(existing.map_embed_url ?? '')
    setLatitude(existing.latitude != null ? String(existing.latitude) : '')
    setLongitude(existing.longitude != null ? String(existing.longitude) : '')
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">Memuat data...</p>

  const socialMedia = (facebook || instagram || youtube)
    ? { facebook: facebook || null, instagram: instagram || null, youtube: youtube || null }
    : null

  const payload = {
    name,
    slug: slug || slugify(name),
    tagline: tagline || null,
    description: description || null,
    email: email || null,
    phone: phone || null,
    whatsapp: whatsapp || null,
    address: address || null,
    city: city || null,
    province: province || null,
    postal_code: postalCode || null,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    map_embed_url: mapEmbedUrl || null,
    social_media: socialMedia,
    vision: vision || null,
    mission: mission || null,
    is_active: isActive,
  }

  const handleSave = () => {
    const visionMission = visionMissionSchema.safeParse({ vision, mission })
    if (!visionMission.success) {
      const firstError = visionMission.error.errors[0]?.message
      toast.error(firstError ?? 'Visi atau misi tidak valid.')
      return
    }

    const parsed = schoolSchema.safeParse({
      ...payload,
      vision: vision.trim() || null,
      mission: mission.trim() || null,
    })
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message
      toast.error(firstError ?? 'Data sekolah tidak valid.')
      return
    }

    const finalPayload = {
      ...payload,
      vision: vision.trim() || null,
      mission: mission.trim() || null,
    }

    if (isEdit) {
      updateItem.mutate(finalPayload, { onSuccess: () => navigate('/admin/schools') })
    } else {
      createItem.mutate(finalPayload, { onSuccess: () => navigate('/admin/schools') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? 'Edit Data Sekolah' : 'Tambah Sekolah'}
      backHref="/admin/schools"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/schools')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!name}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Sekolah</Label>
              <Input id="name" value={name} onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(slugify(e.target.value)) }} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">Kota</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Input id="province" value={province} onChange={(e) => setProvince(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Kode Pos</Label>
              <Input id="postal_code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="h-11" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4" aria-hidden />
            Media Sosial
          </CardTitle>
          <CardDescription>Link profil media sosial sekolah yang tampil di footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-blue-600" aria-hidden />
              Facebook
            </Label>
            <Input id="facebook" placeholder="https://facebook.com/nurulhikmah" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-pink-500" aria-hidden />
              Instagram
            </Label>
            <Input id="instagram" placeholder="https://instagram.com/nurulhikmah atau @nurulhikmah" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-600" aria-hidden />
              YouTube
            </Label>
            <Input id="youtube" placeholder="https://youtube.com/@nurulhikmah" value={youtube} onChange={(e) => setYoutube(e.target.value)} className="h-11" />
          </div>
        </CardContent>
      </Card>

      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" aria-hidden />
            Google Maps
          </CardTitle>
          <CardDescription>Lokasi sekolah di peta yang tampil di footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="map_embed_url">URL Embed Google Maps</Label>
            <Input id="map_embed_url" placeholder="https://www.google.com/maps/embed?pb=..." value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} className="h-11" />
            <p className="text-xs text-muted-foreground">
              Buka Google Maps → cari lokasi → Bagikan → Sematkan peta → salin URL dari atribut <code>src</code>.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="number" step="any" placeholder="-6.2615025" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" type="number" step="any" placeholder="106.7816014" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="h-11" />
            </div>
          </div>
          {mapEmbedUrl && (() => {
            try {
              const u = new URL(mapEmbedUrl)
              if (u.protocol !== 'https:' || !/^(www\.)?google\.(com|co\.\w+)/i.test(u.hostname)) return null
            } catch { return null }
            return (
              <div className="overflow-hidden rounded-lg border">
                <iframe
                  src={mapEmbedUrl}
                  title="Pratinjau Google Maps"
                  className="h-[250px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-scripts allow-same-origin"
                  allowFullScreen
                />
              </div>
            )
          })()}
        </CardContent>
      </Card>

      <Card className="admin-card">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Visi & Misi</CardTitle>
            <CardDescription>Tampil di bagian Tentang Kami pada beranda.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="min-h-11 shrink-0 gap-2">
            <Link to="/admin/vision-mission">
              Buka editor Visi & Misi
              <ExternalLink className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vision">Visi</Label>
            <Textarea id="vision" value={vision} onChange={(e) => setVision(e.target.value)} rows={3} />
            <p
              className={cn(
                'text-right text-xs text-muted-foreground',
                vision.length > VISION_MAX_LENGTH && 'font-medium text-destructive',
              )}
            >
              {vision.length}/{VISION_MAX_LENGTH}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mission">Misi</Label>
            <Textarea id="mission" value={mission} onChange={(e) => setMission(e.target.value)} rows={4} />
            <p className="text-xs text-muted-foreground">
              Satu baris = satu poin misi. Gunakan Enter untuk baris baru.
            </p>
            <p
              className={cn(
                'text-right text-xs text-muted-foreground',
                mission.length > MISSION_MAX_LENGTH && 'font-medium text-destructive',
              )}
            >
              {mission.length}/{MISSION_MAX_LENGTH}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_active">Aktif</Label>
            <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
