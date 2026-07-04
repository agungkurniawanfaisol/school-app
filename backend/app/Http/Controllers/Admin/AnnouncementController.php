<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Announcement\StoreAnnouncementRequest;
use App\Http\Requests\Announcement\UpdateAnnouncementRequest;
use App\Http\Resources\V1\AnnouncementResource;
use App\Repositories\BaseRepository;
use App\Repositories\AnnouncementRepository;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    use HandlesCrud;

    public function __construct(private AnnouncementRepository $announcementRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->announcementRepository;
    }

    protected function resourceClass(): string
    {
        return AnnouncementResource::class;
    }

    public function store(StoreAnnouncementRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateAnnouncementRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
