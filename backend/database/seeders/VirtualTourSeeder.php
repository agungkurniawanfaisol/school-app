<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\VirtualTour;
use App\Services\VirtualTourSyncService;
use Database\Seeders\Concerns\SeedsVirtualTourPanoramas;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VirtualTourSeeder extends Seeder
{
    use SeedsVirtualTourPanoramas;

    public function run(): void
    {
        $school = School::query()->where('slug', 'nurul-hikmah')->first();

        if ($school === null) {
            return;
        }

        $sources = $this->virtualTourPanoramaSources();

        $sceneDefs = [
            [
                'title' => 'Gerbang Utama',
                'filename' => $sources[0]['filename'],
                'url' => $sources[0]['url'],
                'scene_key' => $sources[0]['scene_key'],
                'initial_yaw' => 0,
                'hotspot_to_index' => 1,
                'hotspot_label' => 'Ke halaman sekolah',
                'hotspot_yaw' => 95,
                'hotspot_pitch' => -2,
            ],
            [
                'title' => 'Halaman Sekolah',
                'filename' => $sources[1]['filename'],
                'url' => $sources[1]['url'],
                'scene_key' => $sources[1]['scene_key'],
                'initial_yaw' => -40,
                'hotspot_to_index' => 2,
                'hotspot_label' => 'Ke ruang kelas',
                'hotspot_yaw' => 40,
                'hotspot_pitch' => 0,
            ],
            [
                'title' => 'Ruang Kelas',
                'filename' => $sources[2]['filename'],
                'url' => $sources[2]['url'],
                'scene_key' => $sources[2]['scene_key'],
                'initial_yaw' => 120,
                'hotspot_to_index' => 3,
                'hotspot_label' => 'Ke perpustakaan',
                'hotspot_yaw' => -75,
                'hotspot_pitch' => -5,
            ],
            [
                'title' => 'Perpustakaan',
                'filename' => $sources[3]['filename'],
                'url' => $sources[3]['url'],
                'scene_key' => $sources[3]['scene_key'],
                'initial_yaw' => 15,
                'hotspot_to_index' => 4,
                'hotspot_label' => 'Ke musholla',
                'hotspot_yaw' => 160,
                'hotspot_pitch' => -3,
            ],
            [
                'title' => 'Musholla',
                'filename' => $sources[4]['filename'],
                'url' => $sources[4]['url'],
                'scene_key' => $sources[4]['scene_key'],
                'initial_yaw' => -10,
                'hotspot_to_index' => null,
                'hotspot_label' => null,
                'hotspot_yaw' => null,
                'hotspot_pitch' => null,
            ],
        ];

        $sceneUuids = array_map(fn () => (string) Str::uuid(), $sceneDefs);

        $scenes = [];

        foreach ($sceneDefs as $index => $def) {
            $image = $this->ensureVirtualTourPanorama($def['filename'], $def['scene_key'], $def['url']);

            $hotspots = [];

            if ($def['hotspot_to_index'] !== null) {
                $hotspots[] = [
                    'label' => $def['hotspot_label'],
                    'pitch' => $def['hotspot_pitch'],
                    'yaw' => $def['hotspot_yaw'],
                    'order' => 0,
                    'target_scene_uuid' => $sceneUuids[$def['hotspot_to_index']],
                ];
            }

            $scenes[] = [
                'uuid' => $sceneUuids[$index],
                'title' => $def['title'],
                'image' => $image,
                'initial_pitch' => 0,
                'initial_yaw' => $def['initial_yaw'],
                'order' => $index,
                'hotspots' => $hotspots,
            ];
        }

        $tour = VirtualTour::query()->updateOrCreate(
            ['school_id' => $school->id, 'slug' => 'tur-sekolah'],
            [
                'title' => 'Tur Virtual Sekolah',
                'description' => 'Jelajahi gerbang, halaman, ruang kelas, perpustakaan, dan musholla Sekolah Islam Nurul Hikmah dalam panorama 360°.',
                'is_active' => true,
                'order' => 1,
            ],
        );

        app(VirtualTourSyncService::class)->sync($tour, [
            'title' => $tour->title,
            'slug' => $tour->slug,
            'description' => $tour->description,
            'is_active' => true,
            'order' => 1,
            'start_scene_uuid' => $sceneUuids[0],
            'scenes' => $scenes,
        ]);
    }
}
