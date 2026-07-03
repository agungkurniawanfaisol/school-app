<?php

namespace App\Repositories;

use App\Models\FacilityPhoto;
use App\Repositories\Contracts\RepositoryInterface;

class FacilityPhotoRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return FacilityPhoto::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'facility_id', 'path', 'caption', 'order', 'is_active', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['caption'];
    }
}
