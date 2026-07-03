<?php

namespace App\Repositories;

use App\Models\HeroSlider;
use App\Repositories\Contracts\RepositoryInterface;

class HeroSliderRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return HeroSlider::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'school_id', 'title', 'subtitle', 'image', 'cta_text', 'cta_url', 'order', 'is_active', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['title'];
    }
}
