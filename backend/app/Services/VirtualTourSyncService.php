<?php

namespace App\Services;

use App\Models\VirtualTour;
use App\Models\VirtualTourHotspot;
use App\Models\VirtualTourScene;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VirtualTourSyncService
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function sync(VirtualTour $tour, array $payload): VirtualTour
    {
        return DB::transaction(function () use ($tour, $payload) {
            $tour->update([
                'title' => $payload['title'],
                'slug' => $payload['slug'],
                'description' => $payload['description'] ?? null,
                'is_active' => $payload['is_active'] ?? true,
                'order' => $payload['order'] ?? 0,
            ]);

            $incomingSceneUuids = [];
            $sceneIdByUuid = [];

            foreach ($payload['scenes'] ?? [] as $index => $sceneData) {
                $uuid = $sceneData['uuid'] ?? null;
                $scene = null;

                if (is_string($uuid) && $uuid !== '') {
                    $scene = $tour->scenes()->where('uuid', $uuid)->first();
                }

                if ($scene === null) {
                    $scene = new VirtualTourScene;
                    $scene->virtual_tour_id = $tour->id;

                    if (is_string($uuid) && $uuid !== '') {
                        $scene->uuid = $uuid;
                    }
                }

                $scene->fill([
                    'title' => $sceneData['title'],
                    'image' => $sceneData['image'],
                    'initial_pitch' => $sceneData['initial_pitch'] ?? 0,
                    'initial_yaw' => $sceneData['initial_yaw'] ?? 0,
                    'order' => $sceneData['order'] ?? $index,
                ]);
                $scene->save();

                $incomingSceneUuids[] = $scene->uuid;
                $sceneIdByUuid[$scene->uuid] = $scene->id;
            }

            $tour->scenes()
                ->whereNotIn('uuid', $incomingSceneUuids)
                ->each(function (VirtualTourScene $orphan): void {
                    $orphan->hotspots()->delete();
                    $orphan->delete();
                });

            $savedScenes = VirtualTourScene::query()
                ->where('virtual_tour_id', $tour->id)
                ->orderBy('order')
                ->get()
                ->keyBy('uuid');

            foreach ($payload['scenes'] ?? [] as $index => $sceneData) {
                $uuid = $sceneData['uuid'] ?? null;
                $scene = is_string($uuid) && $uuid !== ''
                    ? $savedScenes->get($uuid)
                    : $savedScenes->values()->get($index);

                if ($scene === null) {
                    continue;
                }

                VirtualTourHotspot::query()
                    ->where('virtual_tour_scene_id', $scene->id)
                    ->delete();

                foreach ($sceneData['hotspots'] ?? [] as $hotspotIndex => $hotspotData) {
                    $targetUuid = $hotspotData['target_scene_uuid'] ?? null;
                    $targetSceneId = is_string($targetUuid) ? ($sceneIdByUuid[$targetUuid] ?? null) : null;

                    if ($targetSceneId === null) {
                        continue;
                    }

                    VirtualTourHotspot::query()->create([
                        'virtual_tour_scene_id' => $scene->id,
                        'target_scene_id' => $targetSceneId,
                        'label' => $hotspotData['label'],
                        'pitch' => $hotspotData['pitch'],
                        'yaw' => $hotspotData['yaw'],
                        'order' => $hotspotData['order'] ?? $hotspotIndex,
                    ]);
                }
            }

            $startUuid = $payload['start_scene_uuid'] ?? null;
            $startSceneId = is_string($startUuid) && $startUuid !== ''
                ? ($sceneIdByUuid[$startUuid] ?? null)
                : null;

            if ($startSceneId === null && $incomingSceneUuids !== []) {
                $startSceneId = $sceneIdByUuid[$incomingSceneUuids[0]] ?? null;
            }

            $tour->update(['start_scene_id' => $startSceneId]);

            return $tour->fresh(['scenes.hotspots.targetScene', 'startScene']);
        });
    }

    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug(Str::limit($title, 200, ''));
        $slug = $base;
        $counter = 1;

        while (
            VirtualTour::query()
                ->when($ignoreId !== null, fn ($q) => $q->whereKeyNot($ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
