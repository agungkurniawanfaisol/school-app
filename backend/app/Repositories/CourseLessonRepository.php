<?php

namespace App\Repositories;

use App\Models\CourseLesson;
use App\Repositories\Contracts\RepositoryInterface;

class CourseLessonRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return CourseLesson::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'course_module_id', 'title', 'slug', 'type', 'content', 'video_url', 'duration_minutes', 'order', 'is_active', 'is_free_preview', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug'];
    }
}
