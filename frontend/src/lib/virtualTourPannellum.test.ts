import { describe, expect, it } from 'vitest'
import { buildPannellumConfig, resolvePanoramaUrl } from '@/lib/virtualTourPannellum'
import type { VirtualTourScene } from '@/types/virtualTour'

const scenes: VirtualTourScene[] = [
  {
    uuid: '11111111-1111-4111-8111-111111111111',
    title: 'Halaman Depan',
    image: '/storage/panorama-a.jpg',
    initial_pitch: 0,
    initial_yaw: 0,
    order: 0,
    hotspots: [
      {
        label: 'Ke Kelas',
        pitch: 2,
        yaw: 90,
        target_scene_uuid: '22222222-2222-4222-8222-222222222222',
      },
    ],
  },
  {
    uuid: '22222222-2222-4222-8222-222222222222',
    title: 'Ruang Kelas',
    image: '/storage/panorama-b.jpg',
    initial_pitch: 0,
    initial_yaw: 0,
    order: 1,
    hotspots: [],
  },
]

describe('resolvePanoramaUrl', () => {
  it('keeps absolute URLs unchanged', () => {
    expect(resolvePanoramaUrl('https://cdn.example/pano.jpg')).toBe('https://cdn.example/pano.jpg')
  })

  it('uses same-origin relative path for storage (no Docker-internal host)', () => {
    expect(resolvePanoramaUrl('/storage/uploads/virtual-tour/a.jpg')).toBe('/storage/uploads/virtual-tour/a.jpg')
    expect(resolvePanoramaUrl('storage/uploads/virtual-tour/a.jpg')).toBe('/storage/uploads/virtual-tour/a.jpg')
  })
})

describe('buildPannellumConfig', () => {
  it('returns null when no scenes', () => {
    expect(buildPannellumConfig([])).toBeNull()
  })

  it('builds multi-scene config with navigation hotspots', () => {
    const config = buildPannellumConfig(scenes, scenes[0].uuid)

    expect(config?.default.firstScene).toBe(scenes[0].uuid)
    expect(config?.scenes[scenes[0].uuid!].hotSpots).toHaveLength(1)
    expect(config?.scenes[scenes[0].uuid!].hotSpots?.[0]).toMatchObject({
      type: 'scene',
      text: 'Ke Kelas',
      sceneId: scenes[1].uuid,
      cssClass: 'vt-hotspot-nav',
    })
    expect(config?.scenes[scenes[0].uuid!].panorama).toBe('/storage/panorama-a.jpg')
  })
})
