<?php

namespace App\Repositories;

use App\Models\CourseEnrollment;
use App\Repositories\Contracts\RepositoryInterface;

class CourseEnrollmentRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return CourseEnrollment::class;
    }

    protected function defaultWith(): array
    {
        return [
            'course:id,title,slug',
            'user:id,name,email',
        ];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'course_id', 'user_id', 'student_name', 'student_email', 'status', 'enrolled_at', 'completed_at', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['student_name', 'student_email'];
    }
}
