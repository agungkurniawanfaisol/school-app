<?php

namespace App\Repositories;

use App\Models\Teacher;
use App\Repositories\Contracts\RepositoryInterface;

class TeacherRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Teacher::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'uuid', 'school_id', 'name', 'slug', 'title', 'subject', 'bio', 'content', 'content_json', 'photo', 'email', 'social_media', 'order', 'is_active', 'is_featured', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['name', 'slug'];
    }
}
