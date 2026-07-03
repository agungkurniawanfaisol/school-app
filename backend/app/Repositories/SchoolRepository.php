<?php

namespace App\Repositories;

use App\Models\School;
use App\Repositories\Contracts\RepositoryInterface;

class SchoolRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return School::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'slug'];
    }
}
