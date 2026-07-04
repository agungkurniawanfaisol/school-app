<?php

namespace App\Repositories;

use App\Models\Extracurricular;
use App\Repositories\Contracts\RepositoryInterface;

class ExtracurricularRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Extracurricular::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'uuid', 'school_id', 'name', 'description', 'category', 'schedule', 'instructor', 'image', 'is_active', 'order', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['name', 'instructor'];
    }
}
