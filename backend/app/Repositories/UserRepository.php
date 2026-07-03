<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class UserRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return User::class;
    }

    protected function defaultWith(): array
    {
        return ['teacher:id,name,slug,subject,title'];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'name', 'email', 'role', 'is_active', 'teacher_id', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['name', 'email'];
    }

    protected function applyFilters(Builder $query, array $filters = []): Builder
    {
        if (isset($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        return parent::applyFilters($query, $filters);
    }
}
