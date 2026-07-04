<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Http\Resources\V1\EventResource;
use App\Repositories\BaseRepository;
use App\Repositories\EventRepository;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    use HandlesCrud;

    public function __construct(private EventRepository $eventRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->eventRepository;
    }

    protected function resourceClass(): string
    {
        return EventResource::class;
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateEventRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
