<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\FacilityPhoto\StoreFacilityPhotoRequest;
use App\Http\Requests\FacilityPhoto\UpdateFacilityPhotoRequest;
use App\Http\Resources\V1\FacilityPhotoResource;
use App\Repositories\BaseRepository;
use App\Repositories\FacilityPhotoRepository;
use Illuminate\Http\JsonResponse;

class FacilityPhotoController extends Controller
{
    use HandlesCrud;

    public function __construct(private FacilityPhotoRepository $facilityPhotoRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->facilityPhotoRepository;
    }

    protected function resourceClass(): string
    {
        return FacilityPhotoResource::class;
    }

    public function store(StoreFacilityPhotoRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateFacilityPhotoRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
