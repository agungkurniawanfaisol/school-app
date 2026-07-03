<?php

namespace App\Repositories;

use App\Models\Curriculum;
use App\Repositories\Contracts\RepositoryInterface;

class CurriculumRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Curriculum::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'school_id', 'title', 'slug', 'excerpt', 'content', 'icon', 'thumbnail', 'category', 'order', 'is_active', 'is_featured', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug'];
    }
}
