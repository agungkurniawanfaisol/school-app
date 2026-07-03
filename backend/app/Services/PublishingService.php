<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;

class PublishingService
{
    /**
     * @param  array<string, mixed>  $extra
     */
    public function publish(Model $model, array $extra = []): Model
    {
        $model->fill(array_merge([
            'status' => 'published',
            'is_active' => true,
            'published_at' => $model->published_at ?? now(),
        ], $extra));

        $model->save();

        return $model->fresh();
    }

    /**
     * @param  array<string, mixed>  $extra
     */
    public function unpublish(Model $model, array $extra = []): Model
    {
        $model->fill(array_merge([
            'status' => 'draft',
            'published_at' => null,
            'publish_ends_at' => null,
        ], $extra));

        $model->save();

        return $model->fresh();
    }
}
