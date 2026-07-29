<?php

namespace App\Repositories;

use App\Models\SchoolStat;
use App\Repositories\Contracts\RepositoryInterface;

class SchoolStatRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return SchoolStat::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id',
            'uuid',
            'school_id',
            'icon',
            'label',
            'value',
            'order',
            'is_active',
            'created_at',
            'updated_at',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['label', 'value'];
    }
}
