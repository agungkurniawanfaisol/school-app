<?php

namespace App\Repositories;

use App\Models\Media;
use App\Repositories\Contracts\RepositoryInterface;

class MediaRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Media::class;
    }

    protected function defaultWith(): array
    {
        return ['user:id,name'];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'uuid', 'user_id', 'filename', 'original_name', 'path', 'disk', 'mime_type', 'size', 'collection', 'meta', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['filename', 'original_name'];
    }
}
