<?php

namespace App\Support;

use App\Models\VirtualTour;
use Illuminate\Support\Str;

class VirtualTourPannellumBuilder
{
    /**
     * @return array<string, mixed>
     */
    public static function build(VirtualTour $tour): array
    {
        $scenes = [];

        foreach ($tour->scenes as $scene) {
            $hotSpots = [];

            foreach ($scene->hotspots as $hotspot) {
                if ($hotspot->targetScene === null) {
                    continue;
                }

                $hotSpots[] = [
                    'pitch' => (float) $hotspot->pitch,
                    'yaw' => (float) $hotspot->yaw,
                    'type' => 'scene',
                    'text' => $hotspot->label,
                    'sceneId' => $hotspot->targetScene->uuid,
                    'cssClass' => 'vt-hotspot-nav',
                ];
            }

            $scenes[$scene->uuid] = [
                'title' => $scene->title,
                'type' => 'equirectangular',
                'panorama' => self::absoluteImageUrl($scene->image),
                'pitch' => (float) $scene->initial_pitch,
                'yaw' => (float) $scene->initial_yaw,
                'hotSpots' => $hotSpots,
            ];
        }

        $firstScene = $tour->startScene?->uuid
            ?? $tour->scenes->first()?->uuid
            ?? array_key_first($scenes);

        return [
            'default' => [
                'firstScene' => $firstScene,
                'sceneFadeDuration' => 1000,
                'autoLoad' => true,
            ],
            'scenes' => $scenes,
        ];
    }

    public static function absoluteImageUrl(string $image): string
    {
        if (Str::startsWith($image, ['http://', 'https://'])) {
            return $image;
        }

        return Str::startsWith($image, '/') ? $image : '/'.$image;
    }
}
