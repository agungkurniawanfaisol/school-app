<?php

namespace App\Repositories;

use App\Models\ContactMessage;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class ContactMessageRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return ContactMessage::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id', 'school_id', 'name', 'email', 'phone', 'subject', 'message',
            'is_read', 'read_at', 'replied_at', 'created_at', 'updated_at',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['name', 'email', 'subject'];
    }

    protected function applyFilters(Builder $query, array $filters = []): Builder
    {
        $query = parent::applyFilters($query, $filters);

        if (isset($filters['is_read'])) {
            $query->where('is_read', filter_var($filters['is_read'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query;
    }
}
