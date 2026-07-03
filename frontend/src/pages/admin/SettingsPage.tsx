import { useMemo, useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdminSettingsList, useUpdateSetting } from '@/hooks/useSettings'
import type { Setting } from '@/types'

function SettingRow({ setting }: { setting: Setting }) {
  const update = useUpdateSetting(setting.id)
  const [value, setValue] = useState(setting.value ?? '')

  const isBoolean = setting.type === 'boolean'
  const boolValue = value === '1' || value === 'true'

  return (
    <Card className="admin-card">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-medium">{setting.key}</p>
          <p className="text-xs text-muted-foreground">Grup: {setting.group} · Tipe: {setting.type}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[240px]">
          {isBoolean ? (
            <div className="flex items-center justify-between rounded-lg border border-primary/10 px-3 py-2">
              <Label htmlFor={`setting-${setting.id}`}>Nilai</Label>
              <Switch
                id={`setting-${setting.id}`}
                checked={boolValue}
                onCheckedChange={(checked) => setValue(checked ? 'true' : 'false')}
              />
            </div>
          ) : (
            <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-11" />
          )}
          <Button
            type="button"
            size="sm"
            disabled={update.isPending}
            onClick={() => update.mutate({ value })}
          >
            {update.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </CardContent>
    </Card>
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

  if (isLoading) return <p className="text-sm text-muted-foreground">Memuat pengaturan...</p>

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Pengaturan" description="Konfigurasi sistem dan konten situs" />
      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada pengaturan.</p>
      ) : (
        <Tabs defaultValue={groups[0]?.[0] ?? 'umum'}>
          <TabsList className="flex h-auto flex-wrap gap-1">
            {groups.map(([group]) => (
              <TabsTrigger key={group} value={group} className="capitalize">
                {group}
              </TabsTrigger>
            ))}
          </TabsList>
          {groups.map(([group, items]) => (
            <TabsContent key={group} value={group} className="mt-4 space-y-3">
              {items.map((setting) => (
                <SettingRow key={setting.id} setting={setting} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
