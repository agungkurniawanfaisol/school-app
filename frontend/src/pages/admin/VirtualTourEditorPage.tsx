import { toast } from 'sonner'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Plus, Save, Trash2, Upload } from 'lucide-react'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { PannellumViewer } from '@/components/virtual-tour/PannellumViewer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { useSchool } from '@/hooks/useSchool'
import {
  useAdminVirtualTourDetail,
  useCreateVirtualTour,
  useUpdateVirtualTour,
} from '@/hooks/useVirtualTours'
import { buildPannellumConfig } from '@/lib/virtualTourPannellum'
import { slugify } from '@/lib/utils'
import { createVirtualTourFormSchema, type VirtualTourFormValues } from '@/schemas/virtualTour'
import type { VirtualTourHotspot, VirtualTourScene } from '@/types/virtualTour'

function sceneTitleFromFile(file: File, fallback: string): string {
  return file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || fallback
}

function newScene(image: string, title: string, order: number): VirtualTourScene {
  return {
    uuid: crypto.randomUUID(),
    title,
    image,
    initial_pitch: 0,
    initial_yaw: 0,
    order,
    hotspots: [],
  }
}

export function VirtualTourEditorPage() {
  const { t } = useTranslation('admin')
  const { uuid } = useParams<{ uuid: string }>()
  const isCreate = !uuid
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminVirtualTourDetail(uuid ?? '')
  const createTour = useCreateVirtualTour()
  const updateTour = useUpdateVirtualTour(uuid ?? '')
  const uploadMedia = useMediaUpload('virtual-tour')

  const virtualTourFormSchema = useMemo(() => createVirtualTourFormSchema(t), [t])

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [order, setOrder] = useState(0)
  const [scenes, setScenes] = useState<VirtualTourScene[]>([])
  const [activeSceneUuid, setActiveSceneUuid] = useState<string | null>(null)
  const [startSceneUuid, setStartSceneUuid] = useState<string | null>(null)
  const [placementMode, setPlacementMode] = useState(false)
  const [hotspotDialogOpen, setHotspotDialogOpen] = useState(false)
  const [pendingCoords, setPendingCoords] = useState<{ pitch: number; yaw: number } | null>(null)
  const [hotspotLabel, setHotspotLabel] = useState('')
  const [hotspotTarget, setHotspotTarget] = useState('')

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setSlug(existing.slug)
    setDescription(existing.description ?? '')
    setIsActive(existing.is_active)
    setOrder(existing.order)
    setScenes(existing.scenes ?? [])
    setStartSceneUuid(existing.start_scene_uuid)
    const first = existing.start_scene_uuid ?? existing.scenes?.[0]?.uuid ?? null
    setActiveSceneUuid(first)
  }, [existing])

  const pannellumConfig = useMemo(
    () => buildPannellumConfig(scenes, activeSceneUuid ?? startSceneUuid),
    [scenes, activeSceneUuid, startSceneUuid],
  )

  const activeScene = scenes.find((scene) => scene.uuid === activeSceneUuid) ?? null
  const otherScenes = scenes.filter((scene) => scene.uuid !== activeSceneUuid)

  const buildPayload = (): VirtualTourFormValues => ({
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    slug: slug || slugify(title),
    description: description || null,
    is_active: isActive,
    order,
    start_scene_uuid: startSceneUuid ?? scenes[0]?.uuid ?? null,
    scenes: scenes.map((scene, index) => ({
      ...scene,
      order: index,
      hotspots: scene.hotspots.map((hotspot, hotspotIndex) => ({
        ...hotspot,
        order: hotspotIndex,
      })),
    })),
  })

  const handleSave = () => {
    const payload = buildPayload()
    const parsed = virtualTourFormSchema.safeParse(payload)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? t('validation.checkForm')
      toast.error(firstError)
      return
    }

    if (isCreate) {
      createTour.mutate(parsed.data, {
        onSuccess: (data) => navigate(`/admin/virtual-tours/${data.uuid}/edit`, { replace: true }),
      })
      return
    }

    updateTour.mutate(parsed.data)
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return

    for (const file of Array.from(files)) {
      try {
        const uploaded = await uploadMedia.mutateAsync(file)
        if (!uploaded?.url) continue
        const scene = newScene(uploaded.url, sceneTitleFromFile(file, t('pages.virtualTour.newLocation')), scenes.length)
        setScenes((prev) => [...prev, scene])
        setActiveSceneUuid(scene.uuid ?? null)
        if (!startSceneUuid) {
          setStartSceneUuid(scene.uuid ?? null)
        }
      } catch {
        // toast handled in hook
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCoordsPick = (coords: { pitch: number; yaw: number }) => {
    if (!placementMode || otherScenes.length === 0) {
      toast.error(t('pages.virtualTour.needMorePanorama'))
      return
    }
    setPendingCoords(coords)
    setHotspotLabel('')
    setHotspotTarget(otherScenes[0]?.uuid ?? '')
    setHotspotDialogOpen(true)
  }

  const addHotspot = () => {
    if (!activeSceneUuid || !pendingCoords || !hotspotTarget || !hotspotLabel.trim()) return

    const hotspot: VirtualTourHotspot = {
      uuid: crypto.randomUUID(),
      label: hotspotLabel.trim(),
      pitch: pendingCoords.pitch,
      yaw: pendingCoords.yaw,
      target_scene_uuid: hotspotTarget,
    }

    setScenes((prev) =>
      prev.map((scene) =>
        scene.uuid === activeSceneUuid
          ? { ...scene, hotspots: [...scene.hotspots, hotspot] }
          : scene,
      ),
    )
    setHotspotDialogOpen(false)
    setPendingCoords(null)
    setPlacementMode(false)
  }

  const removeHotspot = (sceneUuid: string, index: number) => {
    setScenes((prev) =>
      prev.map((scene) =>
        scene.uuid === sceneUuid
          ? { ...scene, hotspots: scene.hotspots.filter((_, i) => i !== index) }
          : scene,
      ),
    )
  }

  const removeScene = (sceneUuid: string) => {
    setScenes((prev) => {
      const next = prev
        .filter((scene) => scene.uuid !== sceneUuid)
        .map((scene, index) => ({
          ...scene,
          hotspots: scene.hotspots.filter((hotspot) => hotspot.target_scene_uuid !== sceneUuid),
          order: index,
        }))

      if (activeSceneUuid === sceneUuid) {
        setActiveSceneUuid(next[0]?.uuid ?? null)
      }
      if (startSceneUuid === sceneUuid) {
        setStartSceneUuid(next[0]?.uuid ?? null)
      }

      return next
    })
  }

  const isSaving = createTour.isPending || updateTour.isPending
  const canSave = !!title.trim() && scenes.length > 0 && !!(school?.id ?? existing?.school_id)

  return (
    <AdminFormShell
      title={isCreate ? t('pages.virtualTour.createTitle') : t('pages.virtualTour.editTitle')}
      description={t('pages.virtualTour.editorDesc')}
      backHref="/admin/virtual-tours"
      isLoading={!isCreate && isLoading}
      actions={
        <Button onClick={handleSave} disabled={!canSave || isSaving} className="min-h-11">
          <Save className="mr-2 h-4 w-4" aria-hidden />
          {isSaving ? t('common.saving') : t('common.save')}
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('pages.virtualTour.infoTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vt-title">{t('form.title')}</Label>
                <Input
                  id="vt-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('pages.virtualTour.titlePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vt-slug">{t('form.slugUrl')}</Label>
                <Input
                  id="vt-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={slugify(title) || t('pages.virtualTour.slugPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vt-desc">{t('form.description')}</Label>
                <Textarea
                  id="vt-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder={t('pages.virtualTour.descriptionPlaceholder')}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="vt-active">{t('form.active')}</Label>
                <Switch id="vt-active" checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vt-order">{t('form.order')}</Label>
                <Input
                  id="vt-order"
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">{t('pages.virtualTour.panoramaTitle')}</CardTitle>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="min-h-9"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMedia.isPending}
              >
                <Plus className="mr-1 h-4 w-4" aria-hidden />
                {t('common.add')}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                multiple
                onChange={(e) => void handleUpload(e.target.files)}
              />
            </CardHeader>
            <CardContent className="space-y-2">
              {scenes.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('pages.virtualTour.noPanorama')}</p>
              ) : (
                scenes.map((scene) => (
                  <div
                    key={scene.uuid}
                    className={`flex items-start gap-2 rounded-lg border p-2 ${
                      scene.uuid === activeSceneUuid ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => setActiveSceneUuid(scene.uuid ?? null)}
                    >
                      <p className="truncate text-sm font-medium">{scene.title}</p>
                      <p className="text-xs text-muted-foreground">{t('pages.virtualTour.pinCount', { count: scene.hotspots.length })}</p>
                    </button>
                    <div className="flex shrink-0 flex-col gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant={startSceneUuid === scene.uuid ? 'default' : 'ghost'}
                        className="h-8 w-8"
                        title={t('pages.virtualTour.setStartLocation')}
                        onClick={() => setStartSceneUuid(scene.uuid ?? null)}
                      >
                        <MapPin className="h-4 w-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => scene.uuid && removeScene(scene.uuid)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">{activeScene?.title ?? t('pages.virtualTour.previewPanorama')}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {placementMode
                    ? t('pages.virtualTour.placementModeHint')
                    : t('pages.virtualTour.viewModeHint')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={placementMode ? 'default' : 'outline'}
                  className="min-h-10"
                  disabled={!activeScene || otherScenes.length === 0}
                  onClick={() => setPlacementMode((value) => !value)}
                >
                  <MapPin className="mr-2 h-4 w-4" aria-hidden />
                  {placementMode ? t('pages.virtualTour.placementModeActive') : t('pages.virtualTour.placePin')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-10"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadMedia.isPending}
                >
                  <Upload className="mr-2 h-4 w-4" aria-hidden />
                  {uploadMedia.isPending ? t('common.uploading') : t('pages.virtualTour.upload360')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PannellumViewer
                config={pannellumConfig}
                placementMode={placementMode}
                onCoordsPick={handleCoordsPick}
                onSceneChange={setActiveSceneUuid}
                className="min-h-[50vh] lg:min-h-[60vh]"
              />
            </CardContent>
          </Card>

          {activeScene && activeScene.hotspots.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t('pages.virtualTour.pinsAtLocation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {activeScene.hotspots.map((hotspot, index) => {
                  const target = scenes.find((scene) => scene.uuid === hotspot.target_scene_uuid)
                  return (
                    <div
                      key={`${hotspot.target_scene_uuid}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{hotspot.label}</p>
                        <p className="text-xs text-muted-foreground">→ {target?.title ?? t('pages.virtualTour.locationFallback')}</p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="shrink-0 text-destructive"
                        onClick={() => activeScene.uuid && removeHotspot(activeScene.uuid, index)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={hotspotDialogOpen} onOpenChange={setHotspotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.virtualTour.addNavPin')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hotspot-label">{t('pages.virtualTour.pinLabel')}</Label>
              <Input
                id="hotspot-label"
                value={hotspotLabel}
                onChange={(e) => setHotspotLabel(e.target.value)}
                placeholder={t('pages.virtualTour.pinLabelPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('pages.virtualTour.destinationLocation')}</Label>
              <Select value={hotspotTarget} onValueChange={setHotspotTarget}>
                <SelectTrigger>
                  <SelectValue placeholder={t('pages.virtualTour.selectLocation')} />
                </SelectTrigger>
                <SelectContent>
                  {otherScenes.map((scene) => (
                    <SelectItem key={scene.uuid} value={scene.uuid ?? ''}>
                      {scene.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setHotspotDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="button" onClick={addHotspot} disabled={!hotspotLabel.trim() || !hotspotTarget}>
              {t('pages.virtualTour.addPin')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminFormShell>
  )
}
