import { useMemo, useState } from 'react'
import {
  Globe,
  GraduationCap,
  Phone,
  Settings2,
  Save,
  Check,
  type LucideIcon,
} from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdminSettingsList, useUpdateSetting } from '@/hooks/useSettings'
import type { Setting } from '@/types'
import { cn } from '@/lib/utils'

interface SettingMeta {
  label: string
  description: string
  multiline?: boolean
}

const SETTING_LABELS: Record<string, SettingMeta> = {
  site_name: {
    label: 'Nama Situs',
    description: 'Nama sekolah yang ditampilkan di seluruh situs',
  },
  site_tagline: {
    label: 'Tagline',
    description: 'Slogan atau motto yang muncul di bawah nama situs',
  },
  is_open: {
    label: 'Pendaftaran Dibuka',
    description: 'Aktifkan untuk membuka pendaftaran peserta didik baru',
  },
  pmb_description: {
    label: 'Deskripsi PMB',
    description: 'Keterangan singkat tentang penerimaan murid baru',
    multiline: true,
  },
  pmb_period: {
    label: 'Periode Pendaftaran',
    description: 'Rentang waktu pendaftaran dibuka (contoh: 1 Jan – 30 Jun 2026)',
  },
  pmb_quota: {
    label: 'Kuota Penerimaan',
    description: 'Jumlah kuota tiap jenjang pendidikan',
  },
  pmb_requirements: {
    label: 'Persyaratan Dokumen',
    description: 'Daftar berkas yang harus dilengkapi calon siswa',
    multiline: true,
  },
  pmb_fee: {
    label: 'Biaya Pendaftaran',
    description: 'Nominal biaya pendaftaran yang harus dibayarkan',
  },
  office_hours: {
    label: 'Jam Operasional',
    description: 'Waktu layanan administrasi sekolah',
  },
}

interface GroupConfig {
  label: string
  description: string
  icon: LucideIcon
}

const GROUP_CONFIG: Record<string, GroupConfig> = {
  general: {
    label: 'Umum',
    description: 'Identitas dan informasi dasar situs',
    icon: Globe,
  },
  pmb: {
    label: 'Penerimaan Murid Baru',
    description: 'Pengaturan pendaftaran dan persyaratan PMB',
    icon: GraduationCap,
  },
  contact: {
    label: 'Kontak & Jadwal',
    description: 'Informasi kontak dan jam operasional',
    icon: Phone,
  },
}

function getGroupConfig(group: string): GroupConfig {
  return GROUP_CONFIG[group] ?? {
    label: group.charAt(0).toUpperCase() + group.slice(1),
    description: `Pengaturan ${group}`,
    icon: Settings2,
  }
}

function getSettingMeta(key: string): SettingMeta {
  return SETTING_LABELS[key] ?? {
    label: key
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    description: '',
  }
}

function SettingField({ setting }: { setting: Setting }) {
  const update = useUpdateSetting(setting.id)
  const [value, setValue] = useState(setting.value ?? '')
  const [saved, setSaved] = useState(false)

  const meta = getSettingMeta(setting.key)
  const isBoolean = setting.type === 'boolean'
  const boolValue = value === '1' || value === 'true'
  const hasChanged = value !== (setting.value ?? '')

  function handleSave() {
    update.mutate(
      { value },
      {
        onSuccess: () => {
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        },
      },
    )
  }

  if (isBoolean) {
    return (
      <div className="flex items-start justify-between gap-4 py-4">
        <div className="min-w-0 space-y-0.5">
          <Label htmlFor={`setting-${setting.id}`} className="text-sm font-medium">
            {meta.label}
          </Label>
          {meta.description && (
            <p className="text-xs leading-relaxed text-muted-foreground">{meta.description}</p>
          )}
        </div>
        <Switch
          id={`setting-${setting.id}`}
          checked={boolValue}
          onCheckedChange={(checked) => {
            const newVal = checked ? 'true' : 'false'
            setValue(newVal)
            update.mutate({ value: newVal })
          }}
          disabled={update.isPending}
        />
      </div>
    )
  }

  const isMultiline = meta.multiline || (value && value.includes('\n'))

  return (
    <div className="space-y-2 py-4">
      <div className="space-y-0.5">
        <Label htmlFor={`setting-${setting.id}`} className="text-sm font-medium">
          {meta.label}
        </Label>
        {meta.description && (
          <p className="text-xs leading-relaxed text-muted-foreground">{meta.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        {isMultiline ? (
          <Textarea
            id={`setting-${setting.id}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            className="flex-1"
          />
        ) : (
          <Input
            id={`setting-${setting.id}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-10 flex-1"
          />
        )}
        <Button
          type="button"
          size="sm"
          variant={saved ? 'outline' : 'default'}
          disabled={update.isPending || !hasChanged}
          onClick={handleSave}
          className={cn(
            'h-10 shrink-0 gap-1.5 transition-all',
            isMultiline && 'self-end',
            saved && 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
          )}
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden />
              Tersimpan
            </>
          ) : update.isPending ? (
            'Menyimpan...'
          ) : (
            <>
              <Save className="h-3.5 w-3.5" aria-hidden />
              Simpan
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function SettingsGroupCard({ group, items }: { group: string; items: Setting[] }) {
  const config = getGroupConfig(group)
  const Icon = config.icon

  return (
    <Card className="admin-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" aria-hidden />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold">{config.label}</CardTitle>
            <CardDescription className="text-xs">{config.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y divide-border">
          {items.map((setting) => (
            <SettingField key={setting.id} setting={setting} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="admin-card p-4 sm:p-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-64" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="admin-card space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Separator />
          {[1, 2].map((j) => (
            <div key={j} className="space-y-2 py-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-52" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const { data, isLoading } = useAdminSettingsList({ per_page: 100 })
  const groups = useMemo(() => {
    const map = new Map<string, Setting[]>()
    for (const item of data?.data ?? []) {
      const list = map.get(item.group) ?? []
      list.push(item)
      map.set(item.group, list)
    }
    return Array.from(map.entries())
  }, [data])

  if (isLoading) return <SettingsSkeleton />

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pengaturan"
        description="Kelola konfigurasi sistem, pendaftaran murid baru, dan informasi kontak sekolah"
      />

      {groups.length === 0 ? (
        <Card className="admin-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Settings2 className="mb-3 h-10 w-10 text-muted-foreground/40" aria-hidden />
            <p className="font-medium text-muted-foreground">Belum ada pengaturan</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Pengaturan akan muncul setelah data sekolah dikonfigurasi.
            </p>
          </CardContent>
        </Card>
      ) : groups.length <= 3 ? (
        <div className="space-y-5">
          {groups.map(([group, items]) => (
            <SettingsGroupCard key={group} group={group} items={items} />
          ))}
        </div>
      ) : (
        <Tabs defaultValue={groups[0]?.[0] ?? 'general'}>
          <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
            {groups.map(([group]) => {
              const config = getGroupConfig(group)
              const Icon = config.icon
              return (
                <TabsTrigger
                  key={group}
                  value={group}
                  className="gap-1.5 rounded-lg border border-transparent px-3 py-2 data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {config.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {groups.map(([group, items]) => (
            <TabsContent key={group} value={group} className="mt-5">
              <SettingsGroupCard group={group} items={items} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
