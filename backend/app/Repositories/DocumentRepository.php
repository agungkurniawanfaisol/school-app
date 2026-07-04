<?php

namespace App\Repositories;

use App\Models\Document;
use App\Repositories\Contracts\RepositoryInterface;

class DocumentRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Document::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id', 'school_id', 'title', 'description', 'category',
            'file_url', 'file_size', 'file_type', 'download_count',
            'is_active', 'order', 'created_at', 'updated_at',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'description'];
    }
}
