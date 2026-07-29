<?php

namespace App\Repositories;

use App\Models\SchoolValue;
use App\Repositories\Contracts\RepositoryInterface;

class SchoolValueRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return SchoolValue::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id',
            'uuid',
            'school_id',
            'icon',
            'title',
            'description',
            'order',
            'is_active',
            'created_at',
            'updated_at',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'description'];
    }
}
