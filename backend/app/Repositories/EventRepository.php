<?php

namespace App\Repositories;

use App\Models\Event;
use App\Repositories\Contracts\RepositoryInterface;

class EventRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Event::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'uuid', 'school_id', 'title', 'description', 'location', 'event_date', 'event_end_date', 'event_time', 'category', 'is_active', 'order', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'location'];
    }
}
