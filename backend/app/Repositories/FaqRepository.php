<?php

namespace App\Repositories;

use App\Models\Faq;
use App\Repositories\Contracts\RepositoryInterface;

class FaqRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Faq::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'school_id', 'question', 'answer', 'category', 'is_active', 'order', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['question', 'answer'];
    }
}
