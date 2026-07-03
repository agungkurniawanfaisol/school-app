import type { PannellumTourConfig, VirtualTourScene } from '@/types/virtualTour'

/**
 * Resolve storage paths for Pannellum. Uses same-origin relative URLs so Vite/nginx
 * can proxy /storage — avoids broken Docker-internal hosts (e.g. http://backend:8000).
 */
export function resolvePanoramaUrl(image: string): string {
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  return image.startsWith('/') ? image : `/${image}`
}

export function buildPannellumConfig(
  scenes: VirtualTourScene[],
  startSceneUuid?: string | null,
): PannellumTourConfig | null {
  if (scenes.length === 0) {
    return null
  }

  const sceneMap: PannellumTourConfig['scenes'] = {}

  for (const scene of scenes) {
    if (!scene.uuid) {
      continue
    }

    sceneMap[scene.uuid] = {
      title: scene.title,
      type: 'equirectangular',
      panorama: resolvePanoramaUrl(scene.image),
      pitch: scene.initial_pitch,
      yaw: scene.initial_yaw,
      hotSpots: scene.hotspots
        .filter((hotspot) => hotspot.target_scene_uuid)
        .map((hotspot) => ({
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          type: 'scene' as const,
          text: hotspot.label,
          sceneId: hotspot.target_scene_uuid,
          cssClass: 'vt-hotspot-nav',
        })),
    }
  }

  const firstScene =
    startSceneUuid && sceneMap[startSceneUuid]
      ? startSceneUuid
      : scenes.find((scene) => scene.uuid)?.uuid ?? Object.keys(sceneMap)[0]

  return {
    default: {
      firstScene,
      sceneFadeDuration: 1000,
      autoLoad: true,
    },
    scenes: sceneMap,
  }
}
