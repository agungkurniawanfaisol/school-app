<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Models\Facility;

trait SyncsFacilityPhotos
{
    /**
     * @param  array<int, array<string, mixed>>  $photos
     */
    protected function syncFacilityPhotos(Facility $facility, array $photos): void
    {
        $keptIds = [];

        foreach ($photos as $index => $photoData) {
            $attributes = [
                'path' => $photoData['path'],
                'caption' => $photoData['caption'] ?? null,
                'order' => $photoData['order'] ?? $index,
                'is_active' => $photoData['is_active'] ?? true,
            ];

            if (! empty($photoData['id'])) {
                $existing = $facility->photos()->find($photoData['id']);
                if ($existing) {
                    $existing->update($attributes);
                    $keptIds[] = $existing->id;

                    continue;
                }
            }

            $created = $facility->photos()->create($attributes);
            $keptIds[] = $created->id;
        }

        if ($keptIds === []) {
            $facility->photos()->delete();

            return;
        }

        $facility->photos()->whereNotIn('id', $keptIds)->delete();
    }
}
