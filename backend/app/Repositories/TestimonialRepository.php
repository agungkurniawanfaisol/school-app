<?php

namespace App\Repositories;

use App\Models\Testimonial;
use App\Repositories\Contracts\RepositoryInterface;

class TestimonialRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Testimonial::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'school_id', 'user_id', 'name', 'role', 'content', 'photo', 'rating', 'order', 'is_active', 'is_featured', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['name'];
    }

    public function findForUser(int $userId, int $schoolId): ?Testimonial
    {
        return $this->remember($this->cacheKey('findForUser', ['user_id' => $userId, 'school_id' => $schoolId]), fn () =>
            $this->newQuery()
                ->select($this->defaultSelect())
                ->where('user_id', $userId)
                ->where('school_id', $schoolId)
                ->first()
        );
    }
}
