<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
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
        return ['id', 'uuid', 'school_id', 'user_id', 'title', 'slug', 'excerpt', 'content', 'content_json', 'thumbnail', 'category', 'status', 'order', 'is_active', 'is_featured', 'published_at', 'publish_ends_at', 'created_at', 'updated_at'];
    }

    protected function applyFilters(Builder $query, array $filters = []): Builder
    {
        $query = parent::applyFilters($query, $filters);

        if (empty($filters['display_status'])) {
            return $query;
        }

        $allowed = ['draft', 'scheduled', 'live', 'ended', 'archived'];
        if (! in_array($filters['display_status'], $allowed, true)) {
            return $query;
        }

        $now = now();

        match ($filters['display_status']) {
            'draft' => $query->where('status', 'draft'),
            'scheduled' => $query
                ->where('status', 'published')
                ->where('published_at', '>', $now),
            'live' => $query
                ->where('status', 'published')
                ->where('published_at', '<=', $now)
                ->where(function ($q) use ($now) {
                    $q->whereNull('publish_ends_at')
                        ->orWhere('publish_ends_at', '>', $now);
                }),
            'ended' => $query
                ->where('status', 'published')
                ->whereNotNull('publish_ends_at')
                ->where('publish_ends_at', '<=', $now),
            'archived' => $query->where('status', 'archived'),
            default => null,
        };

        return $query;
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug', 'excerpt'];
    }
}
