<?php

namespace App\Repositories;

use App\Models\PhotoAlbum;
use App\Repositories\Contracts\RepositoryInterface;

class PhotoAlbumRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return PhotoAlbum::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'uuid', 'school_id', 'title', 'slug', 'description', 'cover_image', 'event_date', 'is_active', 'order', 'created_at', 'updated_at'];
    }

    protected function defaultWith(): array
    {
        return ['photos'];
    }

    protected function searchableColumns(): array
    {
        return ['title'];
    }
}
