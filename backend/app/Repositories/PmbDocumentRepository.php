<?php

namespace App\Repositories;

use App\Models\PmbDocument;
use App\Repositories\Contracts\RepositoryInterface;

class PmbDocumentRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return PmbDocument::class;
    }

    protected function defaultWith(): array
    {
        return ['registration:id,registration_number,student_name'];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'pmb_registration_id', 'document_type', 'file_path', 'original_name', 'status', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['document_type', 'original_name'];
    }
}
