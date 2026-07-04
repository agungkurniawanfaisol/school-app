<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Repositories\Contracts\RepositoryInterface;

class AnnouncementRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Announcement::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id', 'uuid', 'school_id', 'title', 'slug', 'content', 'priority',
            'is_pinned', 'published_at', 'expires_at', 'is_active', 'order',
            'cta_text', 'cta_url', 'created_at', 'updated_at',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'content'];
    }
}
