<?php

namespace App\Repositories;

use App\Models\VirtualTour;
use App\Repositories\Contracts\RepositoryInterface;

class VirtualTourRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return VirtualTour::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id',
            'uuid',
            'school_id',
            'title',
            'slug',
            'description',
            'start_scene_id',
            'is_active',
            'order',
            'created_at',
            'updated_at',
        ];
    }

    protected function defaultWith(): array
    {
        return [
            'scenes.hotspots.targetScene:id,uuid,title',
            'startScene:id,uuid,title',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug'];
    }
}
