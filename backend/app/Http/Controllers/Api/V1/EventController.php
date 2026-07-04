<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\EventResource;
use App\Repositories\EventRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct(private EventRepository $eventRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->eventRepository->paginate(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]), (int) $request->get('per_page', 15));

        return EventResource::collection($items)->response();
    }

    public function show(string $uuid): JsonResponse
    {
        $item = $this->eventRepository->findByUuid($uuid);

        if (!$item || !$item->is_active) {
            abort(404);
        }

        return (new EventResource($item))->response();
    }
}
