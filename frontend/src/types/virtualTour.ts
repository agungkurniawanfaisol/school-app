export type VirtualTourHotspot = {
  uuid?: string
  label: string
  pitch: number
  yaw: number
  order?: number
  target_scene_uuid: string
  target_scene_title?: string
}

export type VirtualTourScene = {
  uuid?: string
  title: string
  image: string
  initial_pitch: number
  initial_yaw: number
  order: number
  hotspots: VirtualTourHotspot[]
}

export type PannellumTourConfig = {
  default: {
    firstScene: string
    sceneFadeDuration?: number
    autoLoad?: boolean
  }
  scenes: Record<
    string,
    {
      title: string
      type: 'equirectangular'
      panorama: string
      pitch?: number
      yaw?: number
      hotSpots?: Array<{
        pitch: number
        yaw: number
        type: 'scene'
        text: string
        sceneId: string
        cssClass?: string
      }>
    }
  >
}

export type VirtualTour = {
  id: number
  uuid: string
  school_id: number
  title: string
  slug: string
  description: string | null
  is_active: boolean
  order: number
  start_scene_uuid: string | null
  scenes: VirtualTourScene[]
  pannellum?: PannellumTourConfig
}

export type VirtualTourListItem = {
  uuid: string
  title: string
  slug: string
  description: string | null
  is_active: boolean
  order: number
  scene_count?: number
}
