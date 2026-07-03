<?php

namespace App\Repositories;

use App\Models\StudentActivity;
use App\Repositories\Contracts\RepositoryInterface;

class StudentActivityRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return StudentActivity::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'school_id', 'title', 'slug', 'excerpt', 'content', 'thumbnail', 'category', 'activity_date', 'order', 'is_active', 'is_featured', 'published_at', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug'];
    }
}
