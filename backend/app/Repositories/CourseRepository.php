<?php

namespace App\Repositories;

use App\Models\Course;
use App\Repositories\Contracts\RepositoryInterface;

class CourseRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Course::class;
    }

    protected function defaultWith(): array
    {
        return [
            'modules' => fn ($q) => $q->select(['id', 'course_id', 'title', 'slug', 'description', 'order', 'is_active'])
                ->with(['lessons' => fn ($lq) => $lq->select(['id', 'course_module_id', 'title', 'slug', 'type', 'duration_minutes', 'order', 'is_active', 'is_free_preview'])]),
        ];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'school_id', 'title', 'slug', 'excerpt', 'description', 'thumbnail', 'category', 'level', 'duration_minutes', 'price', 'status', 'order', 'is_active', 'is_featured', 'published_at', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug'];
    }
}
