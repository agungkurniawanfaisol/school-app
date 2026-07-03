<?php

namespace App\Repositories;

use App\Models\Facility;
use App\Repositories\Contracts\RepositoryInterface;

class FacilityRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Facility::class;
    }

    protected function defaultWith(): array
    {
        return [
            'photos' => fn ($q) => $q->select(['id', 'facility_id', 'path', 'caption', 'order', 'is_active']),
        ];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'uuid', 'school_id', 'name', 'slug', 'description', 'content', 'content_json', 'thumbnail', 'category', 'order', 'is_active', 'is_featured', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['name', 'slug'];
    }
}
