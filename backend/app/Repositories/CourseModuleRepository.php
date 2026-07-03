<?php

namespace App\Repositories;

use App\Models\CourseModule;
use App\Repositories\Contracts\RepositoryInterface;

class CourseModuleRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return CourseModule::class;
    }

    protected function defaultWith(): array
    {
        return [
            'lessons' => fn ($q) => $q->select(['id', 'course_module_id', 'title', 'slug', 'type', 'duration_minutes', 'order', 'is_active', 'is_free_preview']),
        ];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'course_id', 'title', 'slug', 'description', 'order', 'is_active', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug'];
    }
}
