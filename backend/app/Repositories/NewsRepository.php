<?php

namespace App\Repositories;

use App\Models\News;
use App\Repositories\Contracts\RepositoryInterface;

class NewsRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return News::class;
    }

    protected function defaultWith(): array
    {
        return ['author:id,name'];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'uuid', 'school_id', 'user_id', 'title', 'slug', 'excerpt', 'content', 'content_json', 'thumbnail', 'category', 'status', 'order', 'is_active', 'is_featured', 'published_at', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug'];
    }
}
