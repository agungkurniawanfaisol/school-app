<?php

namespace App\Repositories;

use App\Models\Achievement;
use App\Repositories\Contracts\RepositoryInterface;

class AchievementRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Achievement::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'uuid', 'school_id', 'title', 'description', 'category', 'level', 'student_name', 'year', 'image', 'is_active', 'order', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'student_name'];
    }
}
