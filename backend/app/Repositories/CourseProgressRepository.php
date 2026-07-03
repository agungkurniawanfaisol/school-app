<?php

namespace App\Repositories;

use App\Models\CourseProgress;
use App\Repositories\Contracts\RepositoryInterface;

class CourseProgressRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return CourseProgress::class;
    }

    protected function defaultWith(): array
    {
        return ['enrollment', 'lesson'];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'course_enrollment_id', 'course_lesson_id', 'is_completed', 'progress_percent', 'completed_at', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return [];
    }
}
