<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Models\StudentActivity;

trait SyncsStudentActivityPhotos
{
    /**
     * @param  array<int, array<string, mixed>>  $photos
     */
    protected function syncStudentActivityPhotos(StudentActivity $activity, array $photos): void
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
                // Scoped to parent — prevents cross-activity IDOR on photo ids.
                $existing = $activity->photos()->find($photoData['id']);
                if ($existing) {
                    $existing->update($attributes);
                    $keptIds[] = $existing->id;

                    continue;
                }
            }

            $created = $activity->photos()->create($attributes);
            $keptIds[] = $created->id;
        }

        if ($keptIds === []) {
            $activity->photos()->delete();

            return;
        }

        $activity->photos()->whereNotIn('id', $keptIds)->delete();
    }
}
